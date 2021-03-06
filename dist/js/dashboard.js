function loadDashboard(){
  $('main div.sidebar ul li a').removeClass('active').tooltip('hide');
  $('main div.sidebar ul li a[href="#dashboard"]').addClass('active').tooltip('hide');
  var dashboard = $(document.createElement('div')).addClass("d-flex flex-column align-items-stretch noselect flex-shrink-0 bg-white").attr('data-field','uid');
  dashboard.controls = $(document.createElement('div')).addClass("d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom");
  dashboard.controls.input = $(document.createElement('div')).addClass("input-group");
  dashboard.controls.input.select = $(document.createElement('span')).addClass("input-group-text msg-pointer").attr('data-action','selectAll').html(Engine.Storage.get('language',['fields','All']));
  dashboard.controls.input.action = $(document.createElement('span')).addClass("input-group-text msg-pointer dropdown-toggle").attr('data-bs-toggle','dropdown').attr('id','dashboardControls').attr('data-action','selectNone').html('Action');
  dashboard.controls.input.actions = $(document.createElement('ul')).addClass("dropdown-menu").attr('aria-labelledby','dashboardControls');
  dashboard.controls.input.actions.restore = $(document.createElement('li')).append($(document.createElement('a')).addClass('dropdown-item msg-pointer').attr('data-action','restore').html(Engine.Storage.get('language',['fields','Restore'])));
  dashboard.controls.input.actions.delete = $(document.createElement('li')).append($(document.createElement('a')).addClass('dropdown-item msg-pointer').attr('data-action','delete').html(Engine.Storage.get('language',['fields','Delete'])));
  dashboard.controls.input.field = $(document.createElement('input')).addClass("form-control").attr('type','text').attr('placeholder',Engine.Storage.get('language',['fields','Search']));
  dashboard.controls.input.clear = $(document.createElement('span')).addClass("input-group-text msg-pointer").html('<i class="fas fa-times"></i>');
  dashboard.controls.input.search = $(document.createElement('span')).addClass("input-group-text").html('<i class="fas fa-search me-2"></i>'+Engine.Storage.get('language',['fields','Search']));
  dashboard.controls.input.actions.append([dashboard.controls.input.actions.restore,dashboard.controls.input.actions.delete]);
  dashboard.controls.input.append([dashboard.controls.input.select,dashboard.controls.input.action,dashboard.controls.input.actions,dashboard.controls.input.field,dashboard.controls.input.clear,dashboard.controls.input.search]);
  dashboard.controls.append(dashboard.controls.input);
  dashboard.list = $(document.createElement('div')).addClass("d-flex list-group flex-shrink-0 list-group-flush border-bottom scroll-y dashboard-viewport");
  dashboard.list.row = {};
  dashboard.list.data = {};
  dashboard.count = $(document.createElement('div')).addClass("p-3 text-center text-muted");
  dashboard.count.append(Engine.Storage.get('language',['fields','Selected']));
  dashboard.count.selected = $(document.createElement('span')).addClass("dashboard-count mx-1").appendTo(dashboard.count);
  dashboard.count.append(Engine.Storage.get('language',['fields','of']));
  dashboard.count.total = $(document.createElement('span')).addClass("dashboard-count mx-1").appendTo(dashboard.count);
  dashboard.count.append(Engine.Storage.get('language',['fields','messages']));
  dashboard.item = $(document.createElement('a')).addClass("list-group-item list-group-item-action py-3 lh-tight msg-item");
  dashboard.item.header = $(document.createElement('a')).addClass("d-flex w-100 align-items-center justify-content-between link-dark msg-sender");
  dashboard.item.header.sender = $(document.createElement('strong')).addClass("mb-1 noselect").attr('data-field','sender');
  dashboard.item.header.date = $(document.createElement('time')).addClass("text-muted noselect msg-date").attr('data-bs-toggle','tooltip').attr('data-bs-placement','left').attr('data-field','date');
  dashboard.item.subject = $(document.createElement('div')).addClass("col-10 mb-1 small noselect msg-subject").attr('data-field','subject');
  dashboard.item.attachments = $(document.createElement('div')).addClass("col-10 mb-1 small noselect msg-attachments").attr('data-field','attachments');
  dashboard.item.attachments.list = $(document.createElement('ul')).addClass("list-group list-group-horizontal small");
  dashboard.item.attachments.item = $(document.createElement('li')).addClass("list-group-item small text-muted msg-item-attachment");
  dashboard.item.attachments.append(dashboard.item.attachments.list);
  dashboard.append([dashboard.controls,dashboard.list,dashboard.count]);
  dashboard.item.header.append([dashboard.item.header.sender,dashboard.item.header.date]);
  dashboard.item.append([dashboard.item.header,dashboard.item.subject]);
  dashboard.controls.input.actions.restore.off().click(function(){
    dashboard.list.children('a.active').each(function(){
      Engine.request('api','restore',{data:$(this).attr('data-uid')}).then(function(dataset){
        dashboard.list.row[dataset.uid].remove();
      });
    });
  });
  dashboard.controls.input.actions.delete.off().click(function(){
    Swal.fire({
      title: Engine.Storage.get('language',['fields','Are you sure?']),
      text: Engine.Storage.get('language',['fields',"You won't be able to revert this!"]),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#dc3545',
      confirmButtonText: Engine.Storage.get('language',['fields','Yes, delete them!'])
    }).then((result) => {
      if(result.value){
        dashboard.list.children('a.active').each(function(){
          Engine.request('api','delete',{data:$(this).attr('data-uid'),toast:false}).then(function(dataset){
            dashboard.list.row[dataset.uid].remove();
          });
        });
        var checkRemoved = setInterval(function(){
          if(dashboard.list.children('a.active').length <= 0){
            clearInterval(checkRemoved);
            Swal.fire({
              title: Engine.Storage.get('language',['fields','Deleted!']),
              text: Engine.Storage.get('language',['fields','Your emails have been deleted.']),
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }, 100);
      }
    });
  });
  dashboard.controls.input.select.off().click(function(){
    if(dashboard.list.children('a.active').length != dashboard.list.children().length){
      dashboard.list.children().removeClass('active').addClass('active');
      dashboard.count.selected.html(dashboard.list.children('a.active').length);
    } else {
      dashboard.list.children().removeClass('active');
      dashboard.count.selected.html(dashboard.list.children('a.active').length);
    }
  });
  dashboard.controls.input.clear.off().click(function(){
		dashboard.controls.input.field.val('');
		dashboard.list.find('[data-search]').show();
	});
  dashboard.controls.input.field.off().on('input',function(){
  	if($(this).val() != ''){
  		dashboard.list.find('[data-search]').hide();
  		dashboard.list.find('[data-search*="'+$(this).val().toLowerCase()+'"]').each(function(){ $(this).show(); });
  	} else { dashboard.list.find('[data-search]').show(); }
  });
  $('main div.content').html(dashboard);
  dashboard.count.selected.html(dashboard.list.children('a.active').length);
  dashboard.count.total.html(dashboard.list.children('a').length);
  dashboard.request = Engine.request('api','retrieve',{data:Engine.Storage.get('username')}).then(function(dataset){
    for(var [uid, message] of Object.entries(dataset.messages)){
      var csv = message.uid.toLowerCase()+', '+message.sender.toLowerCase()+', '+message.subject.toLowerCase()+', '+message.date.toLowerCase();
      dashboard.list.data[message.uid] = message;
      dashboard.list.row[message.uid] = dashboard.item.clone().attr('data-uid',message.uid).attr('datetime',message.date).appendTo(dashboard.list);
      dashboard.list.row[message.uid].find('[data-field="sender"]').html(message.sender);
      dashboard.list.row[message.uid].find('[data-field="subject"]').html(message.subject);
      dashboard.list.row[message.uid].find('[data-field="date"]').attr('title',message.date).tooltip().attr('datetime',message.date).timeago();
      if(message.attachments.length > 0){
        dashboard.list.row[message.uid].attachments = dashboard.item.attachments.clone().appendTo(dashboard.list.row[message.uid]);
        for(var [key, file] of Object.entries(message.attachments)){
          csv += ', '+file.name.toLowerCase()+', '+file.type.toLowerCase();
          dashboard.item.attachments.item.clone().html('<i class="fas fa-paperclip me-2"></i>'+file.name+'.'+file.type+' ('+Engine.Helper.getFileSize(file.size)+')').appendTo(dashboard.list.row[message.uid]);
        }
      }
      dashboard.list.row[message.uid].attr('data-search',csv);
      dashboard.list.row[message.uid].off().click(function(){
        if($(this).hasClass("active")){
          $(this).removeClass('active');
          dashboard.count.selected.html(dashboard.list.children('a.active').length);
        } else {
          $(this).addClass('active');
          dashboard.count.selected.html(dashboard.list.children('a.active').length);
        }
      });
      // Engine.Helper.sortElements(dashboard.list,'data-datetime');
    }
    dashboard.count.total.html(dashboard.list.children('a').length);
  });
  return dashboard;
}
$('a[href="#dashboard"]').off().click(function(){ dashboard = loadDashboard(); });
