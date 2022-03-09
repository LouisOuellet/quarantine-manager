$(function(){
  //Initialize Select2 Elements
  $('select').select2({theme:'bootstrap-5'});
  $.validator.addMethod("pwcheck", function(value) {
    if(!/[a-z]/.test(value)){
      $.validator.messages.pwcheck = 'You need a lowercase letter!';
      return false;
    }
    if(!/[A-Z]/.test(value)){
      $.validator.messages.pwcheck = 'You need an uppercase letter!';
      return false;
    }
    if(!/[0-9]/.test(value)){
      $.validator.messages.pwcheck = 'You need a number';
      return false;
    }
    if(!/[!@#$%^&*()-+_=;:'"<>,/?|`~]/.test(value)){
      $.validator.messages.pwcheck = 'You need a symbol';
      return false;
    }
    return true;
  });
  var rules = {
    language: {
      required: true,
    },
    timezone: {
      required: true,
    },
  };
  function checkProgress(){
    var checkInstall = setInterval(function(){
      $.ajax({
        url : "/tmp/resume.install",
        dataType:"text",
        success:function(data){
          clearInterval(checkInstall);
          $('button[data-action="back"][data-target="#welcome"]').hide();
          $('a[data-action="login"]').hide();
          $('#log-container').html("");
          $('#log').collapse('show');
          var max = parseInt(data);
          var now = 0;
          var error = 0;
          function setProgress(value){
            var progress = Math.round(((value / max) * 100));
            console.log($('#log-progress'));
            console.log('error: ', error,'progress: ', progress,'attr: ', parseInt($('#log-progress').attr('aria-valuenow')),parseInt(progress) == parseInt($('#log-progress').attr('aria-valuenow')));
            if(parseInt(progress) == parseInt($('#log-progress').attr('aria-valuenow'))){ error++; } else { error = 0; }
            $('#log-progress').attr('aria-valuenow',progress).width(progress+'%').html(progress+'%');
            switch(true){
              case (0 <= error &&  error < 15): $('#log-progress').attr("class", "progress-bar progress-bar-striped progress-bar-animated");break;
              case (15 <= error &&  error < 30): $('#log-progress').attr("class", "progress-bar progress-bar-striped progress-bar-animated bg-info");break;
              case (30 <= error &&  error < 60): $('#log-progress').attr("class", "progress-bar progress-bar-striped progress-bar-animated bg-lightblue");break;
              case (60 <= error &&  error < 120): $('#log-progress').attr("class", "progress-bar progress-bar-striped progress-bar-animated bg-navy");break;
              case (120 <= error &&  error < 180): $('#log-progress').attr("class", "progress-bar progress-bar-striped progress-bar-animated bg-warning");break;
              case (180 <= error &&  error < 240): $('#log-progress').attr("class", "progress-bar progress-bar-striped progress-bar-animated bg-orange");break;
              case (240 <= error): $('#log-progress').attr("class", "progress-bar progress-bar-striped progress-bar-animated bg-danger").html(progress+"% - It's been a while");break;
            }
          }
          setProgress(now);
          var checkLog = setInterval(function(){
            $.ajax({
              url : "/tmp/install.log",
              dataType:"text",
              success:function(data){
                $('#log-container').html(data.replace(/\n/g, "<br>"));
                now = 0;
                if(data.includes("IMAP Set!")){ now++; }
                if(data.includes("IMAP Authenticated")){ now++; }
                if(data.includes("SMTP Set")){ now++; }
                if(data.includes("SMTP Authenticated")){ now++; }
                if(data.includes("Language Set")){ now++; }
                if(data.includes("Timezone Set")){ now++; }
                if(data.includes("Installation has completed successfully")){ now++; }
                if(now >= max){
                  setProgress(max);
                  clearInterval(checkLog);
                  $('#log-progress').attr("class", "progress-bar progress-bar-striped progress-bar-animated");
                  $('#log-progress').addClass('bg-success').html('Completed');
                  $('a[data-action="login"]').show();
                } else { setProgress(now); }
                if(data.includes("Application is already installed")||data.includes("No IMAP settings provided")||data.includes("Unable to authenticate on IMAP server")||data.includes("No SMTP settings provided")||data.includes("Unable to authenticate on SMTP server")||data.includes("No language provided")||data.includes("No timezone provided")||data.includes("Unable to complete the installation")){
                  clearInterval(checkLog);
                  setProgress(max);
                  $('#log-progress').attr("class", "progress-bar progress-bar-striped progress-bar-animated").addClass('bg-danger').html('Error');
                  $('button[data-action="back"][data-target="#welcome"]').show();
                }
              }
            });
          }, 1000);
        }
      });
    }, 1000);
  }
  $("#reviewBTN").click(function(){
  	$('#review_imap_host').html($(document.getElementById("imap_host")).val());
  	$('#review_imap_encryption').html($(document.getElementById("imap_encryption")).find('option:selected').text());
    $('#review_imap_port').html($(document.getElementById("imap_port")).val());
    $('#review_imap_username').html($(document.getElementById("imap_username")).val());
    $('#review_imap_password').html($(document.getElementById("imap_password")).val());
    $('#review_smtp_host').html($(document.getElementById("smtp_host")).val());
  	$('#review_smtp_encryption').html($(document.getElementById("smtp_encryption")).find('option:selected').text());
    $('#review_smtp_port').html($(document.getElementById("smtp_port")).val());
    $('#review_smtp_username').html($(document.getElementById("smtp_username")).val());
    $('#review_smtp_password').html($(document.getElementById("smtp_password")).val());
  	$('#review_language').html($(document.getElementById("language")).find('option:selected').text());
  	$('#review_timezone').html($(document.getElementById("timezone")).find('option:selected').text());
  });
  $('#SetupWizard').validate({
    ignore: [],
    rules: rules,
    errorElement: 'span',
    errorPlacement: function (error, element) {
      error.addClass('invalid-feedback');
      element.closest('.form-group').append(error);
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass('is-invalid');
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass('is-invalid');
    },
    submitHandler: function() {
      $('a[data-action="login"]').hide();
      $('#log-container').html("");
      $('#log').collapse('show');
      // AJAX code to submit form.
      $.ajax({
        type: "POST",
        url: "/src/lib/install.php",
        data: {
          language: document.getElementById("language").value,
          timezone: document.getElementById("timezone").value,
          imap: {
            host: document.getElementById("imap_host").value,
            encryption: document.getElementById("imap_encryption").value,
            port: document.getElementById("imap_port").value,
            username: document.getElementById("imap_username").value,
            password: document.getElementById("imap_password").value,
          },
          smtp: {
            host: document.getElementById("smtp_host").value,
            encryption: document.getElementById("smtp_encryption").value,
            port: document.getElementById("smtp_port").value,
            username: document.getElementById("smtp_username").value,
            password: document.getElementById("smtp_password").value,
          },
        },
        cache: false,
      });
    },
  });
  checkProgress();
});
