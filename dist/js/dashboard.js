function loadDashboard(){
  var dashboard = {
    header: $(document.createElement('div')).addClass("row header"),
    search: $(document.createElement('div')).addClass("row search"),
    line: $(document.createElement('div')).addClass("row line"),
    action: $(document.createElement('div')).addClass("btn-group"),
    table: $(document.createElement('div')).addClass("dashboard"),
  };
  dashboard.table.append([dashboard.search,dashboard.header]);
  dashboard.action.append($(document.createElement('button')).addClass("btn btn-primary").attr('data-action','restore').html('<i class="fas fa-undo-alt me-2"></i>Restore'));
  dashboard.action.append($(document.createElement('button')).addClass("btn btn-danger").attr('data-action','delete').html('<i class="fas fa-trash-alt"></i>'));
  dashboard.search.input = $(document.createElement('input')).addClass("form-control").attr('type','text').attr('placeholder','Search');
  dashboard.search.group = $(document.createElement('div')).addClass("input-group");
  dashboard.search.group.append(dashboard.search.input);
  dashboard.search.group.append($(document.createElement('span')).addClass("input-group-text").attr('data-action','clear').html('<i class="fas fa-times"></i>'));
  dashboard.search.group.append($(document.createElement('span')).addClass("input-group-text").attr('data-action','search').html('<i class="fas fa-search me-2"></i>Search'));
  dashboard.search.append($(document.createElement('div')).addClass("col-12 m-0 p-0").html(dashboard.search.group));
  dashboard.header.append($(document.createElement('div')).addClass("col-2 bg-dark text-light").html('Sender'));
  dashboard.header.append($(document.createElement('div')).addClass("col-5 bg-dark text-light").html('Subject'));
  dashboard.header.append($(document.createElement('div')).addClass("col-1 bg-dark text-light").html('<i class="fas fa-paperclip"></i>'));
  dashboard.header.append($(document.createElement('div')).addClass("col-2 bg-dark text-light").html('Date'));
  dashboard.header.append($(document.createElement('div')).addClass("col-2 bg-dark text-light").html('Action'));
  dashboard.line.append($(document.createElement('div')).addClass("col-2").attr('data-field','sender'));
  dashboard.line.append($(document.createElement('div')).addClass("col-5").attr('data-field','subject'));
  dashboard.line.append($(document.createElement('div')).addClass("col-1").attr('data-field','attachments'));
  dashboard.line.append($(document.createElement('div')).addClass("col-2").attr('data-field','date'));
  dashboard.line.append($(document.createElement('div')).addClass("col-2").attr('data-field','action').append(dashboard.action.clone()));
  $('main div.content').html(dashboard.table);
  Engine.request('api','retrieve',{data:Engine.Storage.get('username')}).then(function(dataset){
    for(var [uid, message] of Object.entries(dataset.messages)){
      var row = dashboard.line.clone().attr('data-uid',uid).appendTo(dashboard.table);
      row.find('[data-field="sender"]').html(message.sender);
      row.find('[data-field="subject"]').html(message.subject);
      if(message.attachments.length > 0){
        row.find('[data-field="attachments"]').html('<i class="fas fa-paperclip"></i>');
      }
      row.find('[data-field="date"]').html(message.date);
    }
  });
}
function loadSettings(){
  $('main div.content').html('');
}
$('[aria-labelledby="UserMenu"] a').off().click(function(){
  Engine.request('api','logout',{toast: false,pace: false}).then(function(){
    localStorage.clear();
    sessionStorage.clear();
    setTimeout(function(){ location.reload(); }, 2000);
  });
});
$('a[href="#dashboard"]').off().click(function(){ loadDashboard(); });
$('a[href="#settings"]').off().click(function(){ loadSettings(); });
var checkInit = setInterval(function(){
  if(Engine.initiated){
    clearInterval(checkInit);
    loadDashboard();
  }
}, 100);
