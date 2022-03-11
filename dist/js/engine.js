// Enable Tooltip
(function () {
  'use strict'
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })
})()

var Engine = {
	initiated:false,
	loggedin:false,
	debug:false,
	database:sessionStorage,
	cache:localStorage,
	init:function(){
		Engine.request('api','init',{toast: false,pace: false}).then(function(dataset){
			Engine.debug = dataset.debug;
      Engine.Storage.set('language','current',dataset.language);
      Engine.Storage.set('language','list',dataset.languages);
      Engine.Storage.set('language','fields',dataset.fields);
      Engine.Storage.set('timezone','current',dataset.timezone);
      Engine.Storage.set('timezone','list',dataset.timezones);
			Engine.Storage.set('username',dataset.username);
			Engine.initiated = true;
		});
	},
	Storage:{
		get:function(object,keyPath = null){
			if(keyPath == null){
				if(Engine.Helper.isSet(Engine.database,[object])){ return Engine.Helper.decode(Engine.database[object]); } else { return {}; }
			} else {
				if(typeof keyPath === 'string'){ keyPath = [keyPath]; }
				if(Engine.Helper.isSet(Engine.database,[object])){
					var obj = Engine.Helper.decode(Engine.database[object]);
					lastKeyIndex = keyPath.length-1;
					for(var i = 0; i < lastKeyIndex; ++ i){
						key = keyPath[i];
						if(!(key in obj)){obj[key] = {};}
						obj = obj[key];
					}
					return obj[keyPath[lastKeyIndex]];
				} else { return {}; }
			}
		},
		set:function(object,keyPath,value = null){
			if(value == null){
				if(Engine.Helper.isJson(keyPath)){ keyPath = JSON.parse(keyPath); }
				Engine.Helper.set(Engine.database,[object],Engine.Helper.encode(keyPath));
			} else {
				if(typeof keyPath === 'string'){ keyPath = [keyPath]; }
				if(Engine.Helper.isJson(value)){ value = JSON.parse(value); }
				if(Engine.Helper.isSet(Engine.database,[object])){ var obj = Engine.Helper.decode(Engine.database[object]); } else { var obj = {}; }
				lastKeyIndex = keyPath.length-1;
				for(var i = 0; i < lastKeyIndex; ++ i){
					key = keyPath[i];
					if(!(key in obj)){obj[key] = {};}
					obj = obj[key];
				}
				obj[keyPath[lastKeyIndex]] = value;
				Engine.Helper.set(Engine.database,[object],Engine.Helper.encode(obj));
			}
		},
	},
	request:function(api, method, options = {},callback = null){
		if(options instanceof Function){ callback = options; options = {}; }
		var defaults = {
			toast: true,
			pace: true,
			report: false,
			data: null,
		};
		for(var [key, option] of Object.entries(options)){ if(Engine.Helper.isSet(defaults,[key])){ defaults[key] = option; } }
		if(Engine.debug){ defaults.toast = true;defaults.pace = true;defaults.report = true; }
    if(defaults.pace){ track='track'; } else { track='ignore'; }
		return new Promise(function(resolve, reject) {
      Pace[track](function(){
  			var params = {
  				method:'session',
  				request:api,
  				type:method,
  			};
  			if(defaults.data != null){ params.data = defaults.data; }
  			params = Engine.Helper.formatOBJ(params);
  			if(Engine.debug){ console.log(api,method,params,defaults); }
        $.post('./api.php',params,function(data,status,xhr){
          if(defaults.toast){
            Engine.Toast.error(data);
            Engine.Toast.warning(data);
            Engine.Toast.success(data);
          }
          if(Engine.Helper.isSet(data,['output'])){ resolve(data.output); }
          if(callback != null){
            delete data.output;
            callback(data);
          }
        }, "json" ).fail( function(xhr,status,data){
          if(defaults.report && defaults.toast){ Engine.Toast.report({status:status,xhr:xhr,data:data}); }
        });
      });
		});
	},
	Toast:{
		set:{
			toast: true,
			position: 'bottom',
			showConfirmButton: false,
			timer: 2000,
		},
		show:Swal.mixin({
			toast: true,
			position: 'bottom',
			showConfirmButton: false,
			timer: 2000,
		}),
		success:function(dataset){
			if(Engine.Helper.isSet(dataset,['success'])){
				Engine.Toast.show.fire({
					type: 'success',
					text: dataset.success
				});
				if(Engine.debug){ console.log(dataset); }
			}
		},
		warning:function(dataset){
			if(Engine.Helper.isSet(dataset,['warning'])){
				Engine.Toast.show.fire({
					type: 'warning',
					text: dataset.warning
				});
				if(Engine.debug){ console.log(dataset); }
			}
		},
		error:function(dataset){
			if(Engine.Helper.isSet(dataset,['error'])){
				Engine.Toast.show.fire({
					type: 'error',
					text: dataset.error
				});
				if(Engine.debug){ console.log(dataset); }
			}
		},
		report:function(dataset){
			if(Engine.debug){
				var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
				if(typeof Engine.Storage.get('fields','An error occured in the execution of this API request. See the console(F12) for more details.') !== 'undefined' && ! jQuery.isEmptyObject(Engine.Storage.get('fields','An error occured in the execution of this API request. See the console(F12) for more details.'))){
					text = Engine.Storage.get('fields','An error occured in the execution of this API request. See the console(F12) for more details.');
				} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
				Engine.Toast.show.fire({
					type: 'error',
					text: text,
					showConfirmButton: true,
					timer: 0
				});
				console.log(dataset);
			}
		},
	},
	Helper:{
		isJson:function(json) {
			if(typeof json === 'string'){
				try { JSON.parse(json); } catch (e) { return false; }
		    return true;
			} else { return false; }
		},
		parse:function(json){
			if(typeof json === 'string'){
				try { JSON.parse(json); } catch (e) { return json; }
		    return JSON.parse(json);
			} else { return json; }
		},
		encode:function(decoded){
			try { encodeURIComponent(btoa(JSON.stringify(Engine.Helper.parse(decoded)))); } catch (error) { console.log(decoded);return false; }
			return encodeURIComponent(btoa(JSON.stringify(Engine.Helper.parse(decoded))));
		},
		decode:function(encoded){
			try { Engine.Helper.parse(atob(decodeURIComponent(encoded))); } catch (error) { console.log(encoded);return false; }
			return Engine.Helper.parse(atob(decodeURIComponent(encoded)));
		},
		formatURL:function(params){
			return Object.keys(params).map(function(key){ return key+"="+Engine.Helper.encode(params[key]) }).join("&");
		},
		formatOBJ:function(params){
      for(var [key, value] of Object.entries(params)){
        params[key] = Engine.Helper.encode(value);
      }
      return params;
		},
		copyToClipboard:function(text){
		  var aux = document.createElement("input");
		  aux.setAttribute("value", text);
		  document.body.appendChild(aux);
		  aux.select();
		  document.execCommand("copy");
		  document.body.removeChild(aux);
			Engine.Toast.show.fire({
				type: 'success',
        text: Engine.Storage.get('fields','Copied to clipboard!')
			});
		},
		toCSV:function(array,options = {}){
			var url = new URL(window.location.href);
			var defaults = {plugin:url.searchParams.get("p")};
			for(var [key, option] of Object.entries(options)){ if(Engine.Helper.isSet(defaults,[key])){ defaults[key] = option; } }
			var csv = '';
			for(var [key, value] of Object.entries(array)){
				if(value == null){ value = '';};
				if(key == 'status'){ value = Engine.Contents.Statuses[defaults.plugin][value].name; }
				value = String(value).toLowerCase();
				if(value != ''){
					if(csv != ''){ csv += ','; }
					csv += value;
				}
			}
			return csv;
		},
		toString:function(date){
			var day = String(date.getDate()).padStart(2, '0');
			var month = String(date.getMonth() + 1).padStart(2, '0');
			var year = date.getFullYear();
			var hours = String(date.getHours()).padStart(2, '0');
			var minutes = String(date.getMinutes()).padStart(2, '0');
			var secondes = String(date.getSeconds()).padStart(2, '0');
			return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+secondes;
		},
		html2text:function(html){
			var text = $('<div>').html(html);
			return text.text();
		},
		htmlentities:function(obj){
			for(var key in obj){
	      if(typeof obj[key] == "object" && obj[key] !== null){ Engine.Helper.htmlentities(obj[key]); }
	      else { if(typeof obj[key] == "string" && obj[key] !== null){ obj[key] = he.encode(obj[key],{ 'useNamedReferences': true }); } }
	    }
			return obj;
		},
		ucfirst:function(s){ if (typeof s !== 'string') return s; return s.charAt(0).toUpperCase() + s.slice(1); },
		clean:function(s){ if (typeof s !== 'string') return s; return s.replace(/_/g, " ").replace(/\./g, " "); },
		isOdd:function(num) { return num % 2;},
		trim:function(string,character){
			while(string.charAt(0) == character){
			  string = string.substring(1);
			}
			while(string.slice(-1) == character){
			  string = string.slice(0,-1);
			}
			return string;
		},
		isInt:function(num){
			if((num+"").match(/^\d+$/)){ return true; } else { return false; }
		},
		padNumber:function(num, targetLength){
		  return num.toString().length < targetLength ? num.toString().padStart(targetLength, 0) : num;
		},
		padString:function(string, targetLength, character){
		  return string.toString().length < targetLength ? string.toString().padStart(targetLength, character) : string;
		},
		set:function(obj, keyPath, value) {
			lastKeyIndex = keyPath.length-1;
			for(var i = 0; i < lastKeyIndex; ++ i){
				key = keyPath[i];
				if(!(key in obj)){obj[key] = {};}
				obj = obj[key];
			}
			obj[keyPath[lastKeyIndex]] = value;
		},
		isSet:function(obj, keyPath) {
			var v = true;
			lastKeyIndex = keyPath.length;
			for(var i = 0; i < lastKeyIndex; ++ i){
				key = keyPath[i];
				if(typeof obj[key] === 'undefined'){ v = false; break; }
				obj = obj[key];
			}
			return v;
		},
		addZero:function(i){
		  if (i < 10) { i = "0" + i; }
		  return i;
		},
		now:function(type = 'UTF8'){
			var currentDate = new Date();
			switch(type){
				case'ISO_8601':
					var datetime = currentDate.getFullYear() + "-"
		        + (currentDate.getMonth()+1)  + "-"
		        + currentDate.getDate() + "T"
		        + Engine.Helper.addZero(currentDate.getHours()) + ":"
		        + Engine.Helper.addZero(currentDate.getMinutes()) + ":"
		        + Engine.Helper.addZero(currentDate.getSeconds());
					break;
				default:
					var datetime = currentDate.getFullYear() + "-"
		        + (currentDate.getMonth()+1)  + "-"
		        + currentDate.getDate() + " "
		        + Engine.Helper.addZero(currentDate.getHours()) + ":"
		        + Engine.Helper.addZero(currentDate.getMinutes()) + ":"
		        + Engine.Helper.addZero(currentDate.getSeconds());
					break;
			}
			return datetime;
		},
		getUrlVars:function() {
	    var vars = {};
	    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	        vars[key] = value;
	    });
	    return vars;
		},
		getFileSize:function(bytes, si=false, dp=1) {
		  const thresh = si ? 1000 : 1024;
		  if (Math.abs(bytes) < thresh) { return bytes + ' B'; }
		  const units = si
		    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
		  let u = -1;
		  const r = 10**dp;
		  do { bytes /= thresh; ++u; }
			while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
		  return bytes.toFixed(dp) + ' ' + units[u];
		},
		isFuture:function(date){
			var futureDate = new Date(date);
			var currentDate = new Date();
			if(futureDate > currentDate){ return true; } else { return false; }
		},
		download:function(url, filename = null){
			if(Engine.debug){ console.log('Downloading '+url); }
		  fetch(url).then(resp => resp.blob()).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
				if(filename != null){ a.download = filename; }
				else { a.download = url.substring(url.lastIndexOf('/')+1); }
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
	    }).catch(() => Engine.Toast.report('Unable to download the file at '+url));
		},
	},
}

// Init API
Engine.init();
