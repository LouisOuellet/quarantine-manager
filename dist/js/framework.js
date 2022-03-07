// DatePicker in modal fix
var enforceModalFocusFn = $.fn.modal.Constructor.prototype._enforceFocus;
$.fn.modal.Constructor.prototype._enforceFocus = function() {};

Dropzone.autoDiscover = false;

var API = {
	initiated:false,
	debug:true,
	init:function(){
		console.log('Init API');
		API.request('init',function(dataset){
			console.log('Set API');
			API.Contents.Language = dataset.language;
			API.Contents.Languages = dataset.languages;
			API.Contents.Fields = dataset.fields;
			API.Contents.Countries = dataset.countries;
			API.Contents.States = dataset.states;
			API.Contents.Timezones = dataset.timezones;
			API.debug = dataset.debug;
			API.initiated = true;
		});
	},
	request:function(method,data = null, options = {}, callback = null){
		if(data instanceof Function){ callback = data; data = null; }
		if(options instanceof Function){ callback = options; options = {}; }
		var defaults = {
			toast:false,
			pace:true,
			report:false,
		};
		for(var [key, value] of Object.entries(options)){ if(API.Helper.isSet(defaults,[key])){ defaults[key] = value; } }
		if(API.debug){ defaults.toast = true;defaults.report = true; }
		if(API.debug){ console.log(method,data,defaults); }
		var xhr = new XMLHttpRequest();
		var params = API.Helper.formatURL({
			method:method,
			data:encodeURIComponent(btoa(JSON.stringify(data))),
		});
		xhr.open('POST', 'api.php', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onerror = function(){ API.Helper.report('error',params); }
		xhr.onload = function(){
			if(API.debug){ console.log('onLoad'); }
			if(API.debug){ console.log(this); }
			if(this.status == 200 && this.responseText !== ''){
				var decoded = API.Helper.decode(this.responseText);
				if(decoded){
					if(decoded.charAt(0) == '{'){
						var parsed = API.Helper.parse(decoded);
						if(parsed){
							if(API.debug){ console.log(parsed); }
							if((typeof parsed.error !== 'undefined')&&(defaults.toast)){
								API.Toast.show.fire({
									type: 'error',
									text: parsed.error
								});
							}
							if(typeof parsed.success !== 'undefined'){
								if(defaults.toast){
									API.Toast.show.fire({
										type: 'success',
										text: parsed.success
									});
								}
								if(callback != null){ callback(parsed); }
							}
						} else {
							if(defaults.report && defaults.toast){ API.Helper.report(this.status,parsed); }
						}
					} else {
						if(defaults.report && defaults.toast){ API.Helper.report(this.status,decoded); }
					}
				} else {
					if(defaults.report && defaults.toast){ API.Helper.report(this.status,decoded); }
				}
			} else {
				if(this.status != 200 && defaults.report){ API.Helper.report(this.status,decoded); }
			}
		}
		if(defaults.pace){ Pace.restart(); }
		xhr.send(params);
	},
	Toast:{
		set:{
			toast: true,
			position: 'top',
			showConfirmButton: false,
			timer: 2000,
		},
		show:Swal.mixin({
			toast: true,
			position: 'top',
			showConfirmButton: false,
			timer: 2000,
		}),
	},
	Contents:{},
	GUI:{
		init:function(){
			var checkExist = setInterval(function() {
				if((API.initiated)&&($('.breadcrumb-item').length)){
					clearInterval(checkExist);
					$('a[href^="?p="]').off().click(function(action){
						action.preventDefault();
						API.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value);
						API.GUI.Breadcrumbs.add(action.currentTarget.textContent, action.currentTarget.attributes.href.value);
					});
				}
			}, 100);
			API.GUI.Navbar.init();
		},
		load:function(element, href, options = null, callback = null){
			var windowLocation = new URL(window.location.href);
			var url = new URL(windowLocation.origin+href);
			if((options != null)&&(options instanceof Function)){ callback = options; options = {}; }
			title = API.Helper.ucfirst(API.Helper.clean(url.searchParams.get("p")));
			document.title = title;
			window.history.pushState({page: 1},title, url.origin+href);
			$('a[href^="?p"]').removeClass('active');
			$('a[href^="'+href+'"]').addClass('active');
			if(element.prop("tagName") == "SECTION"){ $('#page-title h1').html(title); }
			if(url.searchParams.get("v") == undefined){
				var view = './plugins/'+url.searchParams.get("p")+'/src/views/index.php';
				var fview = 'index';
			} else {
				var view = './plugins/'+url.searchParams.get("p")+'/src/views/'+url.searchParams.get("v")+'.php';
				var fview = url.searchParams.get("v");
			}
			if((API.Auth.validate('plugin', url.searchParams.get("p"), 1))&&(API.Auth.validate('view', fview, 1, url.searchParams.get("p")))){
				$.ajax({
			    url: view,
			    type: 'HEAD',
			    error: function(){ element.load('./src/views/404.php'); },
			    success: function(){
						element.first().html('');
		        element.first().load(view,null,function(response,status){
							if(status == 'success'){
								// if((options != null)&&(typeof options.keys !== 'undefined')){ API.GUI.insert(options.keys); }
								API.Plugins.init();
								if(callback != null){ callback(element); }
							} else { element.load('./src/views/500.php'); }
						});
			    }
				});
			} else { element.load('./src/views/403.php'); }
		},
		insert:function(data, options = null, callback = null){
			var url = new URL(window.location.href);
			if((options != null)&&(options instanceof Function)){ callback = options; options = {}; }
			if(options == null){ options = {}; }
			if(typeof options.plugin !== 'undefined'){ plugin = options.plugin; } else { plugin = url.searchParams.get("p"); }
			for (var [key, value] of Object.entries(data)) {
				switch(key){
					case'tags':
						if(value != null){
							var tags = value.replace(/; /g, ";").split(';');
							$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html('');
							for(var [index, tag] of Object.entries(tags)){
								var html = '';
								if(index > 0){ $('[data-plugin="'+plugin+'"][data-key="'+key+'"]').append('<span style="display:none;">;</span>'); }
								if(tag != ''){
									html += '<div class="btn-group m-1 text-light">';
										html += '<a class="btn btn-xs btn-primary"><i class="icon icon-tag mr-1"></i>'+tag+'</a>'
										html += '<a class="btn btn-xs btn-danger"><i class="icon icon-untag"></i></a>'
									html += '</div>';
									$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').append(html);
								}
							}
						}
						break;
					case'assigned_to':
						if(value != null){
							var users = value.replace(/; /g, ";").split(';');
							$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html('');
							for (var [index, user] of Object.entries(users)) {
								var html = '';
								if(index > 0){ $('[data-plugin="'+plugin+'"][data-key="'+key+'"]').append('<span style="display:none;">;</span>'); }
								if(user != ''){
									html += '<div class="btn-group m-1 text-light">';
										html += '<a class="btn btn-xs btn-primary"><i class="icon icon-user mr-1"></i>'+user+'</a>'
										html += '<a class="btn btn-xs btn-danger"><i class="icon icon-unassign"></i></a>'
									html += '</div>';
									$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').append(html);
								}
							}
						}
						break;
					case'website':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href',value);
						break;
					case'email':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href','mailto:'+value);
						break;
					case'phone':
					case'mobile':
					case'toll_free':
					case'office_num':
					case'other_num':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href','tel:'+value);
						break;
					case'client':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href','?p=organizations&v=details&id='+value);
						break;
					case'user':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href','?p=users&v=details&id='+value);
						break;
					case'project':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href','?p=projects&v=details&id='+value);
						break;
					case'link_to':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href','?p='+data.relationship+'&v=details&id='+value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').click(function(action){
							action.preventDefault();
							if(API.Helper.isSet(API,['Contents',data.relationship,value])){
								API.GUI.Breadcrumbs.add(value, '?p='+data.relationship+'&v=details&id='+value, { keys:API.Contents.data[data.relationship][value] });
								API.CRUD.read.show({ keys:API.Contents.data[data.relationship][value], title:value, href:'?p='+data.relationship+'&v=details&id='+value, modal:true });
							} else {
								API.GUI.Breadcrumbs.add(value, '?p='+data.relationship+'&v=details&id='+value);
								API.CRUD.read.show({ href:'?p='+data.relationship+'&v=details&id='+value, title:value, modal:true });
							}
						});
						break;
					default:
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						break;
				}
			}
			if(callback != null){ callback(data); }
		},
	},
	Helper:{
		report:function(status,response){
			var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
			if(typeof API.Contents.Language !== 'undefined' && typeof API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'] !== 'undefined'){
				text = API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'];
			} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
			API.Toast.show.fire({
				type: 'error',
				text: text,
				showConfirmButton: true,
				timer: 0
			});
			if(API.debug){ console.log(status+' : '+response); }
		},
		parse:function(json){
			try { return JSON.parse(json); } catch (error) { console.log(error);return false; }
		},
		decode:function(encoded){
			try { return decodeURIComponent(atob(encoded).replace(/\+/g, ' ')); } catch (error) { console.log(error);return false; }
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
	      if(typeof obj[key] == "object" && obj[key] !== null){ API.Helper.htmlentities(obj[key]); }
	      else { if(typeof obj[key] == "string" && obj[key] !== null){ obj[key] = he.encode(obj[key],{ 'useNamedReferences': true }); } }
	    }
			return obj;
		},
		ucfirst:function(s){ if (typeof s !== 'string') return s; return s.charAt(0).toUpperCase() + s.slice(1); },
		formatURL:function(params){
			return Object.keys(params).map(function(key){ return key+"="+encodeURIComponent(params[key]) }).join("&");
		},
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
		pad:function(str, max){
		  str = str.toString();
		  return str.length < max ? pad("0" + str, max) : str;
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
		now:function(type = 'text'){
			var currentDate = new Date();
			switch(type){
				case'ISO_8601':
					var datetime = currentDate.getFullYear() + "-"
		        + (currentDate.getMonth()+1)  + "-"
		        + currentDate.getDate() + "T"
		        + API.Helper.addZero(currentDate.getHours()) + ":"
		        + API.Helper.addZero(currentDate.getMinutes()) + ":"
		        + API.Helper.addZero(currentDate.getSeconds());
					break;
				default:
					var datetime = currentDate.getFullYear() + "-"
		        + (currentDate.getMonth()+1)  + "-"
		        + currentDate.getDate() + " "
		        + API.Helper.addZero(currentDate.getHours()) + ":"
		        + API.Helper.addZero(currentDate.getMinutes()) + ":"
		        + API.Helper.addZero(currentDate.getSeconds());
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
		download:function(url, name){
		  fetch(url).then(resp => resp.blob()).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
	    }).catch(() => alert('An error sorry'));
		},
	},
	Builder:{
		counts: {
			card: 0,
			modal: 0,
			input: 0,
		},
		dropzone: function(element,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var previewTemplate = '';
      previewTemplate += '<div class="row mt-2">';
        previewTemplate += '<div class="col-auto">';
            previewTemplate += '<span class="preview"><img src="data:," alt="" data-dz-thumbnail /></span>';
        previewTemplate += '</div>';
				previewTemplate += '<div class="col">';
					previewTemplate += '<div class="row">';
		        previewTemplate += '<div class="col-12">';
		            previewTemplate += '<p class="mb-0">';
		              previewTemplate += '<span class="lead mr-2" data-dz-name></span>(<span data-dz-size></span>)';
		            previewTemplate += '</p>';
		            previewTemplate += '<strong class="error text-danger" data-dz-errormessage></strong>';
		        previewTemplate += '</div>';
		        previewTemplate += '<div class="col-12">';
		            previewTemplate += '<div class="progress progress-striped active w-100" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">';
		              previewTemplate += '<div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>';
		            previewTemplate += '</div>';
		        previewTemplate += '</div>';
		        previewTemplate += '<div class="col-12 d-flex align-items-right">';
		          previewTemplate += '<div class="btn-group ml-auto mt-1">';
		            previewTemplate += '<button class="btn btn-sm btn-primary start">';
		              previewTemplate += '<i class="fas fa-upload mr-1"></i>'+API.Contents.Language['Upload'];
		            previewTemplate += '</button>';
		            previewTemplate += '<button data-dz-remove class="btn btn-sm btn-warning cancel">';
		              previewTemplate += '<i class="fas fa-times-circle mr-1"></i>'+API.Contents.Language['Cancel'];
		            previewTemplate += '</button>';
		            previewTemplate += '<button data-dz-remove class="btn btn-sm btn-danger delete">';
									previewTemplate += '<i class="fas fa-trash mr-1"></i>'+API.Contents.Language['Delete'];
		            previewTemplate += '</button>';
		          previewTemplate += '</div>';
		        previewTemplate += '</div>';
					previewTemplate += '</div>';
				previewTemplate += '</div>';
      previewTemplate += '</div>';
			var defaults = {
				url: "api.php",
		    thumbnailWidth: 80,
		    thumbnailHeight: 80,
		    parallelUploads: 20,
				maxFilesize: 0,
		    previewTemplate: previewTemplate,
				acceptedFiles: null,
		    autoQueue: false,
		    previewsContainer: ".dropzone-previews",
		    clickable: ".fileinput-button"
			};
			for(var [key, value] of Object.entries(options)){ if(API.Helper.isSet(defaults,[key])){ defaults[key] = value; } }
			var html = '';
			html += '<div class="aDropZone">';
				html += '<div class="row">';
	        html += '<div class="col-lg-6">';
	          html += '<div class="btn-group w-100">';
							html += '<button class="btn btn-app btn-success col fileinput-button"><i class="fas fa-plus mr-1"></i>'+API.Contents.Language['Add']+'</button>';
	            html += '<button type="submit" class="btn btn-app btn-primary col start"><i class="fas fa-upload mr-1"></i>'+API.Contents.Language['Upload']+'</button>';
	            html += '<button type="reset" class="btn btn-app btn-warning col cancel"><i class="fas fa-times-circle mr-1"></i>'+API.Contents.Language['Cancel']+'</button>';
	          html += '</div>';
	        html += '</div>';
	        html += '<div class="col-lg-6 d-flex align-items-center">';
	          html += '<div class="fileupload-process w-100">';
	            html += '<div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">';
	              html += '<div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>';
	            html += '</div>';
	          html += '</div>';
	        html += '</div>';
	      html += '</div>';
	      html += '<div class="table table-striped files dropzone-previews"></div>';
			html += '</div>';
			element.append(html);
			var zone = element.find('div.aDropZone').first();
			var actions = element.find('div.row').first();
			var fileinput = actions.find('span.fileinput-button').first();
			var previews = element.find('div.table.files.dropzone-previews').first();
			var progressTotal = actions.find('div.progress.progress-striped').first();
			var progressTotalBar = progressTotal.find('div.progress-bar').first();

			// Create Dropzone
			zone.dropzone(defaults);

		  zone[0].dropzone.on("addedfile", function(file) {
		    // Hookup the start button
		    file.previewElement.querySelector(".start").onclick = function() { zone[0].dropzone.enqueueFile(file) }
				// Callback
				if(callback != null){ callback('addedfile',zone,file); }
		  })

		  // Update the total progress bar
		  zone[0].dropzone.on("totaluploadprogress", function(progress) {
		    progressTotalBar.css('width',progress + "%")
				// Callback
				if(callback != null){ callback('totaluploadprogress',zone,progress); }
		  })

		  zone[0].dropzone.on("sending", function(file) {
		    // Reset the total progress bar when upload starts
				progressTotalBar.css('width',0 + "%")
		    // And disable the start button
		    file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
				// Callback
				if(callback != null){ callback('sending',zone,file); }
		  })

		  // Hide the total progress bar when nothing's uploading anymore
		  zone[0].dropzone.on("queuecomplete", function(progress) {
				// Callback
				if(callback != null){ callback('queuecomplete',zone,progress); }
		  })

		  // Setup the buttons for all transfers
			actions.find('.start').off().click(function(){
				zone[0].dropzone.enqueueFiles(zone[0].dropzone.getFilesWithStatus(Dropzone.ADDED));
				// Callback
				if(callback != null){ callback('start',zone,null); }
			});
			actions.find('.cancel').off().click(function(){
				// Remove Files
				zone[0].dropzone.removeAllFiles(true);
				// Callback
				if(callback != null){ callback('cancel',zone,null); }
			});
		},
		modal: function(element, options = null, callback = null){
			if(options != null){
				if(options instanceof Function){
					callback = options;
					options = { title:'', icon:'unknown', css:{ modal: '', dialog: '', header: '', body: '' } }
				} else {
					if(typeof options.title === 'undefined'){ options.title = ''; }
					if(typeof options.icon === 'undefined'){ options.icon = options.title.toLowerCase().replace(/ /g, ""); }
					if(typeof options.css === 'undefined'){ options.css = { modal: '', dialog: '', header: '' }; }
					if(typeof options.css.modal === 'undefined'){ options.css.modal = ''; }
					if(typeof options.css.dialog === 'undefined'){ options.css.modal = ''; }
					if(typeof options.css.header === 'undefined'){ options.css.modal = ''; }
					if(typeof options.css.body === 'undefined'){ options.css.body = ''; }
				}
			} else {
				options = { title:'', icon:'unknown', css:{ modal: '', dialog: '', header: '', body: '' } }
			}
			var maxit = 25, start = 0;
			var checkExist = setInterval(function() {
				++start;
				if((API.Helper.isSet(API,['Contents','Auth','User']))&&(typeof API.Contents.Language !== 'undefined')){
					clearInterval(checkExist);
					// Insert modal in DOM
					var html = '';
					++API.Builder.counts.modal;
					html += '<div id="modal_'+API.Builder.counts.modal+'" class="modal fade '+options.css.modal+'" tabindex="-1" aria-modal="true" role="dialog" aria-hidden="true"	>';
						html += '<div class="modal-dialog '+options.css.dialog+'">';
			        html += '<div class="modal-content">';
								html += '<div class="modal-header '+options.css.header+'">';
			            html += '<h4 class="modal-title"><i class="icon icon-'+options.icon+' mr-1"></i>'+API.Contents.Language[options.title]+'</h4>';
									if(typeof API.Contents.Language[options.title] === 'undefined'){ console.log(options.title); }
									html += '<div class="btn-group" style="font-size:16px;">';
										html += '<button type="button" data-control="hide" class="close">';
											html += '<i class="fas fa-eye mt-1"></i>';
										html += '</button>';
										html += '<button type="button" data-control="update" class="close">';
											html += '<i class="icon icon-edit"></i>';
										html += '</button>';
				            html += '<button type="button" class="close" data-dismiss="modal">';
				              html += '<i class="far fa-window-close mt-1"></i>';
				            html += '</button>';
				          html += '</div>';
								html += '</div>';
			          html += '<div class="modal-body '+options.css.body+'"></div>';
			          html += '<div class="modal-footer justify-content-between">';
			            html += '<button type="button" class="btn btn-default" data-dismiss="modal"><i class="icon icon-cancel mr-1"></i>'+API.Contents.Language['Cancel']+'</button>';
			          html += '</div>';
			        html += '</div>';
			      html += '</div>';
			    html += '</div>';
					if((typeof options.zindex !== 'undefined')&&(options.zindex == "top")){
						element.append(html);
						var modal = element.find('#modal_'+API.Builder.counts.modal);
					} else if((typeof options.after !== 'undefined')&&(typeof options.after.after !== 'undefined')) {
						console.log(options.after);
						options.after.after(html);
						var modal = options.after.parent().find('#modal_'+API.Builder.counts.modal);
					} else if((typeof options.before !== 'undefined')&&(typeof options.before.before !== 'undefined')) {
						console.log(options.before);
						options.before.before(html);
						var modal = options.after.parent().find('#modal_'+API.Builder.counts.modal);
					} else {
						element.prepend(html);
						var modal = element.find('#modal_'+API.Builder.counts.modal);
					}
					modal.find('.modal-header').find('button[data-control]').each(function(){
						$(this).click(function(){
							switch($(this).attr('data-control')){
								case"hide":
									var form = modal.parent();
									var formid = form.attr('id');
									var keys = {}, key = '';
									form.find('[data-form]').each(function(){
										key = $(this).attr('data-key');
										keys[key] = "";
									});
									API.CRUD.hide.show(form, { keys:keys, id:formid });
									break;
								case"update":
									var keys = {}, key = '', plugin = null;
									modal.find('[data-plugin][data-key]').each(function(){
										if(plugin == null){ plugin = $(this).attr('data-plugin'); }
										if($(this).attr('data-plugin') == plugin){ key = $(this).attr('data-key'); keys[key] = $(this).text(); }
									});
									API.CRUD.update.show({ container:element, keys:keys });
									break;
							}
						});
					});
					modal.on('hidden', function() { $.fn.modal.Constructor.prototype._enforceFocus = enforceModalFocusFn; });
					if(callback != null){ callback(modal); }
				}
				if(start == maxit){ clearInterval(checkExist); }
			}, 100);
		},
		input: function(element, index, value = '', options = null, callback = null){
			if(value == null){ value = ''; }
			var url = new URL(window.location.href);
			if((options != null)&&(options instanceof Function)){ callback = options; options = {}; }
			if(options == null){ options = {}; }
			if(typeof options.plugin !== 'undefined'){ plugin = options.plugin; } else { plugin = url.searchParams.get("p"); }
			if(typeof options.view !== 'undefined'){ view = options.view; } else { view = url.searchParams.get("v"); }
			if(typeof options.icon !== 'undefined'){ icon = options.icon; } else { icon = 'icon icon-'+index; }
			if((view == '')||(view == null)){ view = 'index'; }
			++API.Builder.counts.input;
			var title = API.Helper.ucfirst(API.Helper.clean(index));
			if(typeof API.Contents.Language[title] === 'undefined'){ console.log(title); }
			title = API.Contents.Language[title];
			var inputForm = '', inputReady = false, cancelReady = true, input = {};
			switch(options.type){
				case "textarea":
					inputForm += '<div class="input-group" data-key="'+index+'">';
						inputForm += '<div style="width:100%">';
		        	inputForm += '<textarea data-key="'+index+'" title="'+title+'" name="'+index+'" class="form-control" placeholder="'+title+'">'+value+'</textarea>';
		      	inputForm += '</div>';
					inputForm += '</div>';
					inputReady = true;
					break;
				case "select":
					if(API.Helper.isSet(options,['list',index])){
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							for(var [key, val] of Object.entries(options.list[index])){
								if(val == value){ inputForm += '<option value="'+val+'" selected="selected">'+API.Helper.ucfirst(API.Helper.clean(val))+'</option>'; } else { inputForm += '<option value="'+val+'">'+API.Helper.ucfirst(API.Helper.clean(val))+'</option>'; }
							};
							inputForm += '</select>';
						inputForm += '</div>';
						inputReady = true;
					} else { cancelReady = false;inputReady = true; }
					break;
				case "select-multiple":
					if(API.Helper.isSet(options,['list',index])){
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							inputForm += '<select data-key="'+index+'" multiple="" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							for(var [key, val] of Object.entries(options.list[index])){
								if(val == value){ inputForm += '<option value="'+val+'" selected="selected">'+API.Helper.ucfirst(API.Helper.clean(val))+'</option>'; } else { inputForm += '<option value="'+val+'">'+API.Helper.ucfirst(API.Helper.clean(val))+'</option>'; }
							};
							inputForm += '</select>';
						inputForm += '</div>';
						inputReady = true;
					} else { cancelReady = false;inputReady = true; }
					break;
				case "number":
					inputForm += '<div class="input-group" data-key="'+index+'">';
						inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
		      	inputForm += '<input type="number" class="form-control" data-key="'+index+'" name="'+index+'" value="'+parseInt(value)+'" placeholder="'+title+'" title="'+title+'">';
					inputForm += '</div>';
					inputReady = true;
					break;
				case "password":
					inputForm += '<div class="input-group" data-key="'+index+'">';
						inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
		      	inputForm += '<input type="password" class="form-control" data-key="'+index+'" name="'+index+'" value="'+value+'" placeholder="'+title+'" title="'+title+'">';
					inputForm += '</div>';
					inputReady = true;
					break;
				case "switch":
					inputForm += '<div class="input-group" data-key="'+index+'">';
						inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
						inputForm += '<input type="text" class="form-control switch-spacer" disabled>';
						inputForm += '<div class="input-group-append">';
							inputForm += '<div class="input-group-text p-1">';
								if((value == "true")||(value == true)){
									inputForm += '<input type="checkbox" data-key="'+index+'" name="'+index+'" title="'+title+'" checked>';
								} else {
									inputForm += '<input type="checkbox" data-key="'+index+'" name="'+index+'" title="'+title+'">';
								}
							inputForm += '</div>';
						inputForm += '</div>';
					inputForm += '</div>';
					inputReady = true;
					break;
				default:
					inputForm += '<div class="input-group" data-key="'+index+'">';
						inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
		      	inputForm += '<input type="text" class="form-control" data-key="'+index+'" name="'+index+'" value="'+value+'" placeholder="'+title+'" title="'+title+'">';
					inputForm += '</div>';
					inputReady = true;
					break;
			}
			var checkLoaded = setInterval(function() {
				if(inputReady){
					clearInterval(checkLoaded);
					if(cancelReady){
						element.append(inputForm);
						var input = element.find('.input-group').last();
						switch(options.type){
							case "textarea":
								input.find('.form-control').summernote({
			            toolbar: [
		                ['font', ['fontname', 'fontsize']],
		                ['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
		                ['color', ['color']],
		                ['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
			            ],
			            height: 250,
				        });
								break;
							case "select":
								input.find('select').select2({ theme: 'bootstrap4' });
								break;
							case "switch":
								input.find('input').last().bootstrapSwitch();
								break;
						}
						if(callback != null){ callback(input); }
					}
				}
			}, 100);
		},
	},
}

// Init API
API.init();
