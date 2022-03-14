function loadSettings(){
  $('main div.sidebar ul li a').removeClass('active').tooltip('hide');
  $('main div.sidebar ul li a[href="#settings"]').addClass('active').tooltip('hide');
  var settings = $(document.createElement('div')).addClass("d-flex flex-column align-items-stretch noselect flex-shrink-0 bg-white").attr('data-field','uid');
  settings.header = $(document.createElement('div')).addClass("d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom");
  settings.header.title = $(document.createElement('h1')).addClass("text-dark").html(Engine.Storage.get('language',['fields','Settings'])).appendTo(settings.header);
  settings.list = $(document.createElement('div')).addClass("list-group list-group-flush border-bottom scroll-y settings-viewport");
  settings.append([settings.header,settings.list]);
  settings.item = $(document.createElement('a')).addClass("d-flex align-items-stretch noselect flex-shrink-0 list-group-item list-group-item-action py-3 lh-tight msg-item").attr('data-bs-toggle','tooltip').attr('data-bs-placement','top');
  settings.item.header = $(document.createElement('a')).addClass("d-flex w-100 align-items-center justify-content-between link-dark msg-sender");
  settings.item.header.name = $(document.createElement('strong')).addClass("mb-1 noselect").attr('data-field','name');
  settings.item.form = $(document.createElement('div')).addClass("col-10 mb-1 small noselect msg-subject").attr('data-field','form');
  settings.item.header.append(settings.item.header.name);
  settings.item.append([settings.item.header,settings.item.form]);
  settings.list.administrator = settings.item.clone().appendTo(settings.list);
  settings.list.administrator.name = settings.list.administrator.find('[data-field="name"]').html(Engine.Storage.get('language',['fields','Administrator']));
  settings.list.administrator.form = settings.list.administrator.find('[data-field="form"]');
  settings.list.administrator.form.username = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.administrator.form);
  settings.list.administrator.form.username.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-user me-2"></i>'+Engine.Storage.get('language',['fields','Username'])).appendTo(settings.list.administrator.form.username);
  settings.list.administrator.form.username.field = $(document.createElement('input')).addClass("form-control").attr('type','text').attr('placeholder',Engine.Storage.get('language',['fields','Username'])).appendTo(settings.list.administrator.form.username);
  settings.list.administrator.form.password = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.administrator.form);
  settings.list.administrator.form.password.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-lock me-2"></i>'+Engine.Storage.get('language',['fields','Password'])).appendTo(settings.list.administrator.form.password);
  settings.list.administrator.form.password.field = $(document.createElement('input')).addClass("form-control").attr('type','password').attr('placeholder',Engine.Storage.get('language',['fields','Password'])).appendTo(settings.list.administrator.form.password);
  settings.list.language = settings.item.clone().appendTo(settings.list);
  settings.list.language.name = settings.list.language.find('[data-field="name"]').html(Engine.Storage.get('language',['fields','Language']));
  settings.list.language.form = settings.list.language.find('[data-field="form"]');
  settings.list.language.form.language = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.language.form);
  settings.list.language.form.language.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-atlas me-2"></i>'+Engine.Storage.get('language',['fields','Language'])).appendTo(settings.list.language.form.language);
  settings.list.language.form.language.field = $(document.createElement('select')).addClass("form-control").appendTo(settings.list.language.form.language);
  for(var [id, language] of Object.entries(Engine.Storage.get('language',['list']))){
    $(document.createElement('option')).attr('value',language).html(Engine.Helper.ucfirst(language)).appendTo(settings.list.language.form.language.field);
  }
  settings.list.timezone = settings.item.clone().appendTo(settings.list);
  settings.list.timezone.name = settings.list.timezone.find('[data-field="name"]').html(Engine.Storage.get('language',['fields','Timezone']));
  settings.list.timezone.form = settings.list.timezone.find('[data-field="form"]');
  settings.list.timezone.form.timezone = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.timezone.form);
  settings.list.timezone.form.timezone.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-globe-americas me-2"></i>'+Engine.Storage.get('language',['fields','Timezone'])).appendTo(settings.list.timezone.form.timezone);
  settings.list.timezone.form.timezone.field = $(document.createElement('select')).addClass("form-control").appendTo(settings.list.timezone.form.timezone);
  for(var [id, timezone] of Object.entries(Engine.Storage.get('timezone',['list']))){
    $(document.createElement('option')).attr('value',timezone).html(Engine.Helper.ucfirst(timezone)).appendTo(settings.list.timezone.form.timezone.field);
  }
  settings.list.imap = settings.item.clone().appendTo(settings.list);
  settings.list.imap.name = settings.list.imap.find('[data-field="name"]').html(Engine.Storage.get('language',['fields','IMAP']));
  settings.list.imap.form = settings.list.imap.find('[data-field="form"]');
  settings.list.imap.form.host = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.imap.form);
  settings.list.imap.form.host.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-server me-2"></i>'+Engine.Storage.get('language',['fields','Host'])).appendTo(settings.list.imap.form.host);
  settings.list.imap.form.host.field = $(document.createElement('input')).addClass("form-control").attr('type','text').attr('placeholder',Engine.Storage.get('language',['fields','Host'])).appendTo(settings.list.imap.form.host);
  settings.list.imap.form.encryption = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.imap.form);
  settings.list.imap.form.encryption.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-lock me-2"></i>'+Engine.Storage.get('language',['fields','Encryption'])).appendTo(settings.list.imap.form.encryption);
  settings.list.imap.form.encryption.field = $(document.createElement('select')).addClass("form-control").appendTo(settings.list.imap.form.encryption);
  for(var [key, value] of Object.entries({none:"None",ssl:"SSL",starttls:"STARTTLS"})){
    $(document.createElement('option')).attr('value',key).html(Engine.Storage.get('language',['fields',value])).appendTo(settings.list.imap.form.encryption.field);
  }
  settings.list.imap.form.port = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.imap.form);
  settings.list.imap.form.port.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-plug me-2"></i>'+Engine.Storage.get('language',['fields','Port'])).appendTo(settings.list.imap.form.port);
  settings.list.imap.form.port.field = $(document.createElement('input')).addClass("form-control").attr('type','text').attr('placeholder',Engine.Storage.get('language',['fields','Port'])).appendTo(settings.list.imap.form.port);
  settings.list.imap.form.username = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.imap.form);
  settings.list.imap.form.username.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-user me-2"></i>'+Engine.Storage.get('language',['fields','Username'])).appendTo(settings.list.imap.form.username);
  settings.list.imap.form.username.field = $(document.createElement('input')).addClass("form-control").attr('type','text').attr('placeholder',Engine.Storage.get('language',['fields','Username'])).appendTo(settings.list.imap.form.username);
  settings.list.imap.form.password = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.imap.form);
  settings.list.imap.form.password.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-lock me-2"></i>'+Engine.Storage.get('language',['fields','Password'])).appendTo(settings.list.imap.form.password);
  settings.list.imap.form.password.field = $(document.createElement('input')).addClass("form-control").attr('type','password').attr('placeholder',Engine.Storage.get('language',['fields','Password'])).appendTo(settings.list.imap.form.password);
  settings.list.smtp = settings.item.clone().appendTo(settings.list);
  settings.list.smtp.name = settings.list.smtp.find('[data-field="name"]').html(Engine.Storage.get('language',['fields','SMTP']));
  settings.list.smtp.form = settings.list.smtp.find('[data-field="form"]');
  settings.list.smtp.form.host = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.smtp.form);
  settings.list.smtp.form.host.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-server me-2"></i>'+Engine.Storage.get('language',['fields','Host'])).appendTo(settings.list.smtp.form.host);
  settings.list.smtp.form.host.field = $(document.createElement('input')).addClass("form-control").attr('type','text').attr('placeholder',Engine.Storage.get('language',['fields','Host'])).appendTo(settings.list.smtp.form.host);
  settings.list.smtp.form.encryption = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.smtp.form);
  settings.list.smtp.form.encryption.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-lock me-2"></i>'+Engine.Storage.get('language',['fields','Encryption'])).appendTo(settings.list.smtp.form.encryption);
  settings.list.smtp.form.encryption.field = $(document.createElement('select')).addClass("form-control").appendTo(settings.list.smtp.form.encryption);
  for(var [key, value] of Object.entries({none:"None",ssl:"SSL",starttls:"STARTTLS"})){
    $(document.createElement('option')).attr('value',key).html(Engine.Storage.get('language',['fields',value])).appendTo(settings.list.smtp.form.encryption.field);
  }
  settings.list.smtp.form.port = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.smtp.form);
  settings.list.smtp.form.port.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-plug me-2"></i>'+Engine.Storage.get('language',['fields','Port'])).appendTo(settings.list.smtp.form.port);
  settings.list.smtp.form.port.field = $(document.createElement('input')).addClass("form-control").attr('type','text').attr('placeholder',Engine.Storage.get('language',['fields','Port'])).appendTo(settings.list.smtp.form.port);
  settings.list.smtp.form.username = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.smtp.form);
  settings.list.smtp.form.username.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-user me-2"></i>'+Engine.Storage.get('language',['fields','Username'])).appendTo(settings.list.smtp.form.username);
  settings.list.smtp.form.username.field = $(document.createElement('input')).addClass("form-control").attr('type','text').attr('placeholder',Engine.Storage.get('language',['fields','Username'])).appendTo(settings.list.smtp.form.username);
  settings.list.smtp.form.password = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.smtp.form);
  settings.list.smtp.form.password.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-lock me-2"></i>'+Engine.Storage.get('language',['fields','Password'])).appendTo(settings.list.smtp.form.password);
  settings.list.smtp.form.password.field = $(document.createElement('input')).addClass("form-control").attr('type','password').attr('placeholder',Engine.Storage.get('language',['fields','Password'])).appendTo(settings.list.smtp.form.password);
  settings.list.method = settings.item.clone().appendTo(settings.list);
  settings.list.method.name = settings.list.method.find('[data-field="name"]').html(Engine.Storage.get('language',['fields','Restoration Method']));
  settings.list.method.form = settings.list.method.find('[data-field="form"]');
  settings.list.method.form.method = $(document.createElement('div')).addClass("input-group my-2").appendTo(settings.list.method.form);
  settings.list.method.form.method.label = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-exchange-alt me-2"></i>'+Engine.Storage.get('language',['fields','Method'])).appendTo(settings.list.method.form.method);
  settings.list.method.form.method.field = $(document.createElement('select')).addClass("form-control").appendTo(settings.list.method.form.method);
  for(var [key, value] of Object.entries({resend:"Resend",copy:"Copy"})){
    $(document.createElement('option')).attr('value',key).html(Engine.Storage.get('language',['fields',value])).appendTo(settings.list.method.form.method.field);
  }
  settings.list.aliases = settings.item.clone().appendTo(settings.list);
  settings.list.aliases.name = settings.list.aliases.find('[data-field="name"]').html(Engine.Storage.get('language',['fields','Aliases']));
  settings.list.aliases.form = settings.list.aliases.find('[data-field="form"]');
  settings.list.aliases.item = $(document.createElement('div')).addClass("input-group my-2");
  settings.list.aliases.item.from = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-user me-2"></i>'+Engine.Storage.get('language',['fields','From'])).appendTo(settings.list.aliases.item);
  settings.list.aliases.item.from.field = $(document.createElement('input')).addClass("form-control").attr('type','email').attr('data-field','from').attr('placeholder',Engine.Storage.get('language',['fields','From'])).appendTo(settings.list.aliases.item);
  settings.list.aliases.item.seperator = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-long-arrow-alt-right"></i>').appendTo(settings.list.aliases.item);
  settings.list.aliases.item.to = $(document.createElement('span')).addClass("input-group-text noselect").html('<i class="fas fa-user me-2"></i>'+Engine.Storage.get('language',['fields','To'])).appendTo(settings.list.aliases.item);
  settings.list.aliases.item.to.field = $(document.createElement('input')).addClass("form-control").attr('type','email').attr('data-field','to').attr('placeholder',Engine.Storage.get('language',['fields','To'])).appendTo(settings.list.aliases.item);
  settings.list.aliases.form.add = settings.list.aliases.item.clone().appendTo(settings.list.aliases.form);
  settings.list.aliases.form.add.button = $(document.createElement('button')).addClass("btn btn-success").html('<i class="fas fa-plus"></i>').appendTo(settings.list.aliases.form.add);
  settings.save = $(document.createElement('div')).addClass("d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom").appendTo(settings);
  settings.save.button = $(document.createElement('button')).addClass("btn btn-success").html('<i class="fas fa-save me-2"></i>'+Engine.Storage.get('language',['fields','Save'])).appendTo(settings.save);
  $('main div.content').html(settings);
  settings.request = {};
  settings.list.aliases.form.add.button.off().click(function(){
    var form = $(this).parent();
    var from = form.find('input[data-field="from"]').val();
    var to = form.find('input[data-field="to"]').val();
    form.find('input[data-field="from"]').val('');
    form.find('input[data-field="to"]').val('');
    var entry = settings.list.aliases.item.clone().attr('data-entry','new').attr('data-from',from).attr('data-to',to).appendTo(settings.list.aliases.form);
    entry.find('input[data-field="from"]').val(from).attr('disabled', 'disabled');
    entry.find('input[data-field="to"]').val(to).attr('disabled', 'disabled');
    entry.delete = $(document.createElement('button')).addClass("btn btn-danger").html('<i class="fas fa-trash-alt"></i>').appendTo(entry);
    entry.delete.off().click(function(){
      var container = $(this).parent();
      Swal.fire({
        title: Engine.Storage.get('language',['fields','Are you sure?']),
        text: Engine.Storage.get('language',['fields',"You won't be able to revert this!"]),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#dc3545',
        confirmButtonText: Engine.Storage.get('language',['fields','Yes, delete this!'])
      }).then((result) => { if(result.value){ container.remove(); } });
    });
  });
  settings.save.button.off().click(function(){
    var values = {
      language: settings.list.language.form.language.field.val(),
      timezone: settings.list.timezone.form.timezone.field.val(),
      imap:{
        host: settings.list.imap.form.host.field.val(),
        encryption: settings.list.imap.form.encryption.field.val(),
        port: settings.list.imap.form.port.field.val(),
        username: settings.list.imap.form.username.field.val(),
        password: settings.list.imap.form.password.field.val(),
      },
      smtp:{
        host: settings.list.smtp.form.host.field.val(),
        encryption: settings.list.smtp.form.encryption.field.val(),
        port: settings.list.smtp.form.port.field.val(),
        username: settings.list.smtp.form.username.field.val(),
        password: settings.list.smtp.form.password.field.val(),
      },
      method: settings.list.method.form.method.field.val(),
      alias: {},
    };
    if(settings.list.administrator.form.password.field.val()){
      values.administrator = {
        username: settings.list.administrator.form.username.field.val(),
        password: settings.list.administrator.form.password.field.val(),
      };
    }
    settings.list.aliases.form.find('[data-entry]').each(function(){
      var from = $(this).find('[data-field="from"]').val();
      var to = $(this).find('[data-field="to"]').val();
      if(!Engine.Helper.isSet(values,['alias',to])){ values.alias[to] = []; }
      values.alias[to].push(from);
    });
    settings.request.save = Engine.request('api','save',{data:values}).then(function(dataset){
      settings.list.administrator.form.username.field.val(dataset.settings.administrator);
      settings.list.language.form.language.field.val(dataset.settings.language).select2({theme: "bootstrap-5"});
      settings.list.timezone.form.timezone.field.val(dataset.settings.timezone).select2({theme: "bootstrap-5"});
      settings.list.imap.form.host.field.val(dataset.settings.imap.host);
      settings.list.imap.form.encryption.field.val(dataset.settings.imap.encryption).select2({theme: "bootstrap-5"});
      settings.list.imap.form.port.field.val(dataset.settings.imap.port);
      settings.list.imap.form.username.field.val(dataset.settings.imap.username);
      settings.list.imap.form.password.field.val(dataset.settings.imap.password);
      settings.list.smtp.form.host.field.val(dataset.settings.smtp.host);
      settings.list.smtp.form.encryption.field.val(dataset.settings.smtp.encryption).select2({theme: "bootstrap-5"});
      settings.list.smtp.form.port.field.val(dataset.settings.smtp.port);
      settings.list.smtp.form.username.field.val(dataset.settings.smtp.username);
      settings.list.smtp.form.password.field.val(dataset.settings.smtp.password);
      settings.list.method.form.method.field.val(dataset.settings.method).select2({theme: "bootstrap-5"});
      settings.list.aliases.form.find('[data-entry]').remove();
      for(var [to, froms] of Object.entries(dataset.settings.alias)){
        for(var [key, from] of Object.entries(froms)){
          var entry = settings.list.aliases.item.clone().attr('data-entry','existing').attr('data-from',from).attr('data-to',to).appendTo(settings.list.aliases.form);
          entry.find('input[data-field="from"]').val(from).attr('disabled', 'disabled');
          entry.find('input[data-field="to"]').val(to).attr('disabled', 'disabled');
          entry.delete = $(document.createElement('button')).addClass("btn btn-danger").html('<i class="fas fa-trash-alt"></i>').appendTo(entry);
          entry.delete.off().click(function(){
            var container = $(this).parent();
            Swal.fire({
              title: Engine.Storage.get('language',['fields','Are you sure?']),
              text: Engine.Storage.get('language',['fields',"You won't be able to revert this!"]),
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#0d6efd',
              cancelButtonColor: '#dc3545',
              confirmButtonText: Engine.Storage.get('language',['fields','Yes, delete this!'])
            }).then((result) => { if(result.value){ container.remove(); } });
          });
        }
      }
      settings.list.find('.bg-danger').removeClass('bg-danger').tooltip('disable');
      settings.list.find('.link-light').removeClass('link-light').addClass('link-dark');
      if(Engine.Helper.isSet(dataset,['errors'])){
        for(var [form, error] of Object.entries(dataset.errors)){
          settings.list[form].addClass('bg-danger').attr('title',error).tooltip();
          settings.list[form].find('.link-dark').removeClass('link-dark').addClass('link-light');
        }
      }
    });
  });
  settings.request.list = Engine.request('api','list').then(function(dataset){
    settings.list.administrator.form.username.field.val(dataset.settings.administrator);
    settings.list.language.form.language.field.val(dataset.settings.language).select2({theme: "bootstrap-5"});
    settings.list.timezone.form.timezone.field.val(dataset.settings.timezone).select2({theme: "bootstrap-5"});
    settings.list.imap.form.host.field.val(dataset.settings.imap.host);
    settings.list.imap.form.encryption.field.val(dataset.settings.imap.encryption).select2({theme: "bootstrap-5"});
    settings.list.imap.form.port.field.val(dataset.settings.imap.port);
    settings.list.imap.form.username.field.val(dataset.settings.imap.username);
    settings.list.imap.form.password.field.val(dataset.settings.imap.password);
    settings.list.smtp.form.host.field.val(dataset.settings.smtp.host);
    settings.list.smtp.form.encryption.field.val(dataset.settings.smtp.encryption).select2({theme: "bootstrap-5"});
    settings.list.smtp.form.port.field.val(dataset.settings.smtp.port);
    settings.list.smtp.form.username.field.val(dataset.settings.smtp.username);
    settings.list.smtp.form.password.field.val(dataset.settings.smtp.password);
    settings.list.method.form.method.field.val(dataset.settings.method).select2({theme: "bootstrap-5"});
    for(var [to, froms] of Object.entries(dataset.settings.alias)){
      for(var [key, from] of Object.entries(froms)){
        var entry = settings.list.aliases.item.clone().attr('data-entry','existing').attr('data-from',from).attr('data-to',to).appendTo(settings.list.aliases.form);
        entry.find('input[data-field="from"]').val(from).attr('disabled', 'disabled');
        entry.find('input[data-field="to"]').val(to).attr('disabled', 'disabled');
        entry.delete = $(document.createElement('button')).addClass("btn btn-danger").html('<i class="fas fa-trash-alt"></i>').appendTo(entry);
        entry.delete.off().click(function(){
          var container = $(this).parent();
          Swal.fire({
            title: Engine.Storage.get('language',['fields','Are you sure?']),
            text: Engine.Storage.get('language',['fields',"You won't be able to revert this!"]),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#dc3545',
            confirmButtonText: Engine.Storage.get('language',['fields','Yes, delete this!'])
          }).then((result) => { if(result.value){ container.remove(); } });
        });
      }
    }
  });
  return settings;
}
$('a[href="#settings"]').off().click(function(){ settings = loadSettings(); });
