$('[aria-labelledby="UserMenu"] a').off().click(function(){
  Engine.request('api','logout',{toast: false,pace: false}).then(function(){
    localStorage.clear();
    sessionStorage.clear();
    window.location = window.location.href;
  });
});
var checkInit = setInterval(function(){
  if(Engine.initiated){
    clearInterval(checkInit);
    dashboard = loadDashboard();
  }
}, 100);
