API.wedding = {
	init:function(){
		console.log('Init Wedding');
		// API.request('init',function(result){
		// 	console.log(result);
		// 	var dataset = JSON.parse(result);
		// 	console.log(dataset);
		// });
	},
	load:{
		page:function(){
			$('div.wrapper').hide();
			var url = new URL(window.location.href);
			var id = url.searchParams.get("id");
			API.request(url.searchParams.get("p"),'get',{data:{id:id,key:'id'}},function(result){
				var dataset = JSON.parse(result);
				if(dataset.success != undefined){
					var data = dataset.output;
					var hosts = {};
					for(var [key, host] of Object.entries(API.Helper.trim(data.this.raw.setHosts,';').split(';'))){
						if(API.Helper.isSet(data,['relations',data.this.raw.setHostType,host])){
							API.Helper.set(hosts,[host],data.relations[data.this.raw.setHostType][host]);
						}
					}
					var planners = {};
					for(var [key, planner] of Object.entries(API.Helper.trim(data.this.raw.setPlanners,';').split(';'))){
						if(API.Helper.isSet(data,['relations','users',planner])){
							API.Helper.set(planners,[planner],data.relations.users[planner]);
						}
					}
					var staffs = {};
					for(var [key, staff] of Object.entries(API.Helper.trim(data.this.raw.setStaffs,';').split(';'))){
						if(API.Helper.isSet(data,['relations','users',staff])){
							API.Helper.set(staffs,[staff],data.relations.users[staff]);
						}
					}
					var items = {};
					if(API.Helper.isSet(data,['relations','event_items'])){
						for(var [key, item] of Object.entries(data.relations.event_items)){
							items[item.date+'T'+item.time] = item;
						}
						items = Object.keys(items).sort().reduce(
						  (obj, key) => { obj[key] = items[key];return obj; },{}
						);
					}
					var html = '';
					var count = 0;
					$('div.events-content-wrapper').remove();
					html += '<div class="events-content-wrapper events-background row m-0 align-items-center text-center justify-content-center">';
						if(API.Helper.isSet(hosts,[API.Contents.Auth.User.id])||API.Helper.isSet(planners,[API.Contents.Auth.User.id])){
							html += '<button class="btn btn-warning btn-flat btn-ControlPanel" data-action="ControlPanel"><i class="fas fa-bars"></i></button>';
						}
					  html += '<div class="w-auto events-box bg-black noselect" id="events-1">';
					    html += '<p><h2>'+API.Contents.Language["Welcome to the wedding of"]+'</h2></p>';
							for(var [id, host] of Object.entries(hosts)){
								if(count > 0){ html += '<p><h1>&</h1></p>'; }
								html += '<p><h1 class="mt-3">'+host.name+'</h1></p>';
								count++;
							}
					    html += '<p class="mt-4"><button class="btn btn-warning btn-lg mt-4">'+API.Contents.Language["Enter"]+'</button></p>';
					  html += '</div>';
					  html += '<div class="events-box pt-0 bg-black noselect hide" id="events-2">';
							html += '<nav class="navbar navbar-expand-lg navbar-dark bg-transparent">';
							  html += '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarevents" aria-controls="navbarevents" aria-expanded="false" aria-label="Toggle navigation">';
							    html += '<i class="fas fa-bars"></i>';
							  html += '</button>';
							  html += '<div class="collapse navbar-collapse justify-content-center" id="navbarevents">';
							    html += '<div class="navbar-nav">';
							      html += '<a class="nav-item nav-link active" data-page="about">'+API.Contents.Language["About"]+'</a>';
							      html += '<a class="nav-item nav-link" data-page="gallery">'+API.Contents.Language["Gallery"]+'</a>';
							      html += '<a class="nav-item nav-link" data-page="attendance">'+API.Contents.Language["Attendances"]+'</a>';
							      html += '<a class="nav-item nav-link" data-page="vows">'+API.Contents.Language["Vows"]+'</a>';
							      html += '<a class="nav-item nav-link" data-page="planning">'+API.Contents.Language["Planning"]+'</a>';
							      html += '<a class="nav-item nav-link" data-page="menu">'+API.Contents.Language["Menu"]+'</a>';
							      html += '<a class="nav-item nav-link" data-page="seating_plan">'+API.Contents.Language["Seating Plan"]+'</a>';
							    html += '</div>';
							  html += '</div>';
							html += '</nav>';
							html += '<div class="events-pages">';
								html += '<div class="events-page active" data-page="about">';
									html += '<p><h2>'+API.Contents.Language["About"]+'</h2></p>';
									html += data.this.raw.about;
								html += '</div>';
								html += '<div class="events-page hide" data-page="gallery">';
									html += '<p><h2>'+API.Contents.Language["Gallery"]+'</h2></p>';
									html += '<div class="row justify-content-center">';
										if(API.Helper.isSet(data,['relations','galleries']) && Object.keys(data.relations.galleries).length > 0){
											for(var [key, picture] of Object.entries(data.relations.galleries[Object.keys(data.relations.galleries)[0]].pictures)){
												html += '<div class="col-lg-4 col-sm-6 mb-4">';
													html += '<div class="portfolio-item">';
														html += '<a class="portfolio-link" data-toggle="modal" href="#portfolioModal'+key+'">';
															html += '<div class="portfolio-hover">';
																html += '<div class="portfolio-hover-content"><i class="fas fa-expand fa-3x"></i></div>';
															html += '</div>';
															html += '<img class="img-fluid" src="'+picture.dirname+'/'+picture.basename+'" alt="'+picture.basename+'" />';
														html += '</a>';
													html += '</div>';
												html += '</div>';
												html += '<div class="portfolio-modal modal fade" id="portfolioModal'+key+'" tabindex="-1" role="dialog" aria-hidden="true">';
							            html += '<div class="modal-dialog">';
						                html += '<div class="modal-content">';
				                      html += '<div class="row justify-content-center">';
				                        html += '<div class="col-12">';
				                          html += '<div class="modal-body">';
																		html += '<div class="button-modal download-modal" data-file="'+picture.dirname+'/'+picture.basename+'" data-basename="'+picture.basename+'"><i class="fas fa-angle-down fa-2x mt-2"></i></div>';
																		html += '<div class="button-modal close-modal" data-dismiss="modal"><i class="fas fa-times fa-2x mt-2"></i></div>';
				                            html += '<img class="img-fluid d-block mx-auto" src="'+picture.dirname+'/'+picture.basename+'" alt="'+picture.basename+'" />';
				                          html += '</div>';
				                        html += '</div>';
				                      html += '</div>';
						                html += '</div>';
							            html += '</div>';
								        html += '</div>';
											}
										}
										html += '<div class="col-12">';
											html += '<button class="btn btn-warning btn-lg btn-block" data-action="Download"><i class="fas fa-angle-down mr-1"></i>'+API.Contents.Language["Download All"]+'</button>';
										html += '</div>';
									html += '</div>';
								html += '</div>';
								html += '<div class="events-page hide" data-page="attendance">';
									html += '<p><h2>'+API.Contents.Language["Attendances"]+'</h2></p>';
									html += '<p class="text-justify">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>';
									html += '<p class="text-justify">The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>';
								html += '</div>';
								html += '<div class="events-page hide" data-page="vows">';
									html += '<p><h2>'+API.Contents.Language["Vows"]+'</h2></p>';
									html += '<p class="text-justify">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>';
									html += '<p class="text-justify">The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>';
								html += '</div>';
								html += '<div class="events-page hide" data-page="planning">';
									html += '<p><h2>'+API.Contents.Language["Planning"]+'</h2></p>';
		              html += '<ul class="timeline">';
										var inverted = ' class="timeline-inverted"';
										for(var [stamp, item] of Object.entries(items)){
											if(inverted == ''){ inverted = ' class="timeline-inverted"'; } else { inverted = ''; }
											html += '<li'+inverted+'>';
			                  html += '<div class="timeline-image"><h4>'+item.time.substring(0,5)+'</h4></div>';
			                  html += '<div class="timeline-panel">';
			                    html += '<div class="timeline-heading">';
			                      html += '<h4>'+item.title+'</h4>';
			                    html += '</div>';
			                    html += '<div class="timeline-body">'+item.description+'</div>';
			                  html += '</div>';
			                html += '</li>';
										}
		              html += '</ul>';
								html += '</div>';
								html += '<div class="events-page hide" data-page="menu">';
									html += '<p><h2>'+API.Contents.Language["Menu"]+'</h2></p>';
									if(data.this.raw.menuKid != '' && data.this.raw.menuKid != null){
										html += '<div class="btn-group btn-block">';
											html += '<button class="btn btn-outline-warning btn-lg active" data-menu="adult">Adulte</button>';
											html += '<button class="btn btn-outline-warning btn-lg" data-menu="kid">Enfant</button>';
										html += '</div>';
									}
									html += '<div class="events-menus mt-4">';
										html += '<div class="events-menu active" data-menu="adult">';
											html += data.this.raw.menuAdult;
										html += '</div>';
										html += '<div class="events-menu hide" data-menu="kid">';
											html += data.this.raw.menuKid;
										html += '</div>';
									html += '</div>';
								html += '</div>';
								html += '<div class="events-page hide" data-page="seating_plan">';
									html += '<p><h2>'+API.Contents.Language["Seating Plan"]+'</h2></p>';
									html += '<p class="text-justify">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>';
									html += '<p class="text-justify">The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>';
								html += '</div>';
							html += '</div>';
					  html += '</div>';
					html += '</div>';
					$('body').prepend(html);
					var events = $('body').find('div.events-content-wrapper').first();
					var nav = events.find('nav.navbar').first();
					var pages = events.find('div.events-pages').first();
					var menus = events.find('div.events-menus').first();
					var pictures = events.find('div.events-page[data-page="gallery"]').first();
					$('#events-1 button').off().click(function(){
						$('#events-1').fadeOut('slow','swing',function(){
							$('#events-2').fadeIn('slow','swing');
						});
					});
					$('div.events-content-wrapper button[data-action="ControlPanel"]').off().click(function(){
						$('div.wrapper').show();
						$('div.events-content-wrapper').fadeOut('slow','swing');
					});
					nav.find('a[data-page]').off().click(function(){
						var page = $(this).attr('data-page');
						nav.find('a[data-page]').removeClass('active');
						$(this).addClass('active');
						pages.find('div[data-page].active').removeClass('active').fadeOut('slow','swing',function(){
							pages.find('div[data-page="'+page+'"]').addClass('active').fadeIn('slow','swing');
						});
					});
					pages.find('div[data-page="menu"]').find('div.btn-group button').off().click(function(){
						var menu = $(this).attr('data-menu');
						pages.find('div[data-page="menu"]').find('div.btn-group button.active').removeClass('active');
						$(this).addClass('active');
						menus.find('div[data-menu].active').removeClass('active').fadeOut('slow','swing',function(){
							menus.find('div[data-menu="'+menu+'"]').addClass('active').fadeIn('slow','swing');
						});
					});
					pictures.find('div.download-modal[data-file][data-basename]').off().click(function(){
						var file = $(this).attr('data-file');
						var basename = $(this).attr('data-basename');
						API.Helper.download(file,basename);
					});
				} else { $('div.wrapper').show(); }
			});
		},
	},
	GUI:{
		picture:function(dataset,layout){
			var html = '';
			html += '<div class="col-sm-12 col-md-6 col-lg-4 picture" data-picture="'+dataset.id+'">';
				html += '<div class="card pointer addContact">';
					html += '<div class="card-body p-0">';
						html += '<div class="text-center">';
							html += '<img class="img-fluid" data-picture="'+dataset.id+'" style="border-radius:4px;" src="'+dataset.dirname+'/'+dataset.basename+'" alt="'+dataset.basename+'" />';
							html += '<button class="btn btn-danger collapse align-middle" data-picture="'+dataset.id+'"><i class="fas fa-trash-alt my-4"></i></button>';
						html += '</div>';
					html += '</div>';
				html += '</div>';
			html += '</div>';
			layout.content.galleries.area.prepend(html);
			var picture = layout.content.galleries.area.find('div[data-picture="'+dataset.id+'"]').first();
			picture.find('div.card').off().on({
		    mouseenter:function(){ picture.find('button').collapse('show'); },
		    mouseleave:function(){ picture.find('button').collapse('hide'); }
			});
		},
		contact:function(dataset,layout,plugin = 'contacts'){
			var area = layout.content[plugin].find('div.row').eq(1);
			area.prepend(API.Plugins.events.GUI.card(dataset));
			var card = area.find('div.col-sm-12.col-md-6').first();
			if(API.Helper.isSet(dataset,['users'])){
				if(API.Auth.validate('custom', 'events_'+plugin+'_btn_details', 1)){
					card.find('div.btn-group').append(API.Plugins.events.GUI.button(dataset,{id:'id',color:'primary',icon:'fas fa-user',action:'details',content:API.Contents.Language['Details']}));
				}
			} else {
				if(API.Auth.validate('custom', 'events_'+plugin+'_btn_link', 1)){
					card.find('div.btn-group').append(API.Plugins.events.GUI.button(dataset,{id:'id',color:'teal',icon:'fas fa-link',action:'link',content:API.Contents.Language['Add User']}));
				}
			}
			if(API.Helper.isSet(dataset,['event_attendances'])){
				if(API.Auth.validate('custom', 'events_'+plugin+'_btn_attendance', 1)){
					card.find('div.btn-group').append(API.Plugins.events.GUI.button(dataset,{id:'id',color:'navy',icon:'fas fa-calendar-check',action:'attendance',content:API.Contents.Language['Attendance']}));
				}
			} else {
				if(API.Auth.validate('custom', 'events_'+plugin+'_btn_add_attendance', 1)){
					card.find('div.btn-group').append(API.Plugins.events.GUI.button(dataset,{id:'id',color:'olive',icon:'fas fa-calendar-plus',action:'add',content:API.Contents.Language['Add Attendance']}));
				}
			}
			if(API.Auth.validate('custom', 'events_'+plugin+'_btn_edit', 1)){
				card.find('div.btn-group').append(API.Plugins.events.GUI.button(dataset,{id:'id',color:'warning',icon:'fas fa-edit',action:'edit',content:API.Contents.Language['Edit']}));
			}
			if(API.Auth.validate('custom', 'events_'+plugin+'_btn_delete', 1)){
				card.find('div.btn-group').append(API.Plugins.events.GUI.button(dataset,{id:'id',color:'danger',icon:'fas fa-trash-alt',action:'delete',content:''}));
			}
		},
		button:function(dataset,options = {}){
			var defaults = {
				icon:"fas fa-building",
				action:"details",
				color:"primary",
				key:"name",
				id:"id",
				content:"",
			};
			if(API.Helper.isSet(options,['icon'])){ defaults.icon = options.icon; }
			if(API.Helper.isSet(options,['action'])){ defaults.action = options.action; }
			if(API.Helper.isSet(options,['color'])){ defaults.color = options.color; }
			if(API.Helper.isSet(options,['key'])){ defaults.key = options.key; }
			if(API.Helper.isSet(options,['id'])){ defaults.id = options.id; }
			if(API.Helper.isSet(options,['content'])){ defaults.content = options.content; }
			else { defaults.content = dataset[defaults.key]; }
			if(defaults.content != ''){ defaults.icon += ' mr-1'; }
			return '<button type="button" class="btn btn-sm bg-'+defaults.color+'" data-id="'+dataset[defaults.id]+'" data-action="'+defaults.action+'"><i class="'+defaults.icon+'"></i>'+defaults.content+'</button>';
		},
		items:function(dataset,layout,item,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var csv = '';
			for(var [key, value] of Object.entries(item)){
				if(value == null){ value = '';item[key] = value; };
				if(jQuery.inArray(key,['date','time','title','description']) != -1){
					if(csv != ''){ csv += '|'; }
					csv += API.Helper.html2text(value.toLowerCase());
				}
			}
			var body = layout.content.event_items.find('tbody');
			var html = '';
			html += '<tr data-csv="'+csv+'" data-id="'+item.id+'">';
				html += '<td>'+item.date+'</td>';
				html += '<td>'+item.time+'</td>';
				html += '<td>'+item.title+'</td>';
				html += '<td>'+item.description+'</td>';
				html += '<td>';
					html += '<div class="btn-group btn-block m-0">';
						html += '<button class="btn btn-sm btn-warning" data-action="edit"><i class="fas fa-edit mr-1"></i>'+API.Contents.Language['Edit']+'</button>';
						html += '<button class="btn btn-sm btn-danger" data-action="delete"><i class="fas fa-trash-alt"></i></button>';
					html += '</div>';
				html += '</td>';
			html += '</tr>';
			body.append(html);
			var tr = body.find('tr').last();
			if(callback != null){ callback(dataset,layout,item,tr); }
		},
		buttons:{
			details:function(dataset,options = {}){
				var defaults = {
					icon:{details:"fas fa-building",remove:"fas fa-unlink"},
					action:{details:"details",remove:"unlink"},
					color:{details:"primary",remove:"danger"},
					key:"name",
					id:"id",
					content:"",
					remove:false,
				};
				if(API.Helper.isSet(options,['icon','details'])){ defaults.icon.details = options.icon.details; }
				if(API.Helper.isSet(options,['icon','remove'])){ defaults.icon.remove = options.icon.remove; }
				if(API.Helper.isSet(options,['color','details'])){ defaults.color.details = options.color.details; }
				if(API.Helper.isSet(options,['color','remove'])){ defaults.color.remove = options.color.remove; }
				if(API.Helper.isSet(options,['action','details'])){ defaults.action.details = options.action.details; }
				if(API.Helper.isSet(options,['action','remove'])){ defaults.action.remove = options.action.remove; }
				if(API.Helper.isSet(options,['key'])){ defaults.key = options.key; }
				if(API.Helper.isSet(options,['id'])){ defaults.id = options.id; }
				if(API.Helper.isSet(options,['remove'])){ defaults.remove = options.remove; }
				if(API.Helper.isSet(options,['content'])){ defaults.content = options.content; }
				else { defaults.content = dataset[defaults.key]; }
				var html = '';
				html += '<div class="btn-group m-1" data-id="'+dataset[defaults.id]+'">';
					html += '<button type="button" class="btn btn-xs bg-'+defaults.color.details+'" data-id="'+dataset[defaults.id]+'" data-action="'+defaults.action.details+'"><i class="'+defaults.icon.details+' mr-1"></i>'+defaults.content+'</button>';
					if(defaults.remove){
						html += '<button type="button" class="btn btn-xs bg-'+defaults.color.remove+'" data-id="'+dataset[[defaults.id]]+'" data-action="'+defaults.action.remove+'"><i class="'+defaults.icon.remove+'"></i></button>';
					}
				html += '</div>';
				return html;
			},
		},
		card:function(dataset,options = {}){
			var csv = '';
			for(var [key, value] of Object.entries(dataset)){
				if(value == null){ value = '';dataset[key] = value; };
				if(jQuery.inArray(key,['first_name','middle_name','last_name','name','email','phone','mobile','office_num','other_num','about','job_title']) != -1){
					if(csv != ''){ csv += '|'; }
					if(typeof value == 'string'){ csv += value.replace(',','').toLowerCase(); }
					else { csv += value; }
				}
			}
			var html = '';
			html += '<div class="col-sm-12 col-md-6 contactCard" data-csv="'+csv+'" data-id="'+dataset.id+'">';
			  html += '<div class="card">';
					if(!dataset.isActive){ html += '<div class="ribbon-wrapper ribbon-xl"><div class="ribbon bg-danger text-xl">'+API.Contents.Language['Inactive']+'</div></div>'; }
			    html += '<div class="card-header border-bottom-0">';
			      html += '<b class="mr-1">Title:</b>'+dataset.job_title;
			    html += '</div>';
			    html += '<div class="card-body pt-0">';
			      html += '<div class="row">';
			        html += '<div class="col-7">';
			          html += '<h2 class="lead"><b>'+dataset.name+'</b></h2>';
			          html += '<p class="text-sm"><b>About: </b> '+dataset.about+' </p>';
			          html += '<ul class="ml-4 mb-0 fa-ul">';
			            html += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span><b class="mr-1">Email:</b><a href="mailto:'+dataset.email+'">'+dataset.email+'</a></li>';
			            html += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span><b class="mr-1">Phone #:</b><a href="tel:'+dataset.phone+'">'+dataset.phone+'</a></li>';
			            html += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span><b class="mr-1">Office #:</b><a href="tel:'+dataset.office_num+'">'+dataset.office_num+'</a></li>';
			            html += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-mobile"></i></span><b class="mr-1">Mobile #:</b><a href="tel:'+dataset.mobile+'">'+dataset.mobile+'</a></li>';
			            html += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span><b class="mr-1">Other #:</b><a href="tel:'+dataset.other_num+'">'+dataset.other_num+'</a></li>';
			          html += '</ul>';
			        html += '</div>';
			        html += '<div class="col-5 text-center">';
			          html += '<img src="/dist/img/default.png" alt="user-avatar" class="img-circle img-fluid">';
			        html += '</div>';
			      html += '</div>';
			    html += '</div>';
			    html += '<div class="card-footer">';
			      html += '<div class="text-right">';
			        html += '<div class="btn-group"></div>';
			      html += '</div>';
			    html += '</div>';
			  html += '</div>';
			html += '</div>';
			return html;
		},
	},
	Events:{
		users:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {key: "setHosts",remove:false};
			if(API.Helper.isSet(options,['remove'])){ defaults.remove = options.remove; }
			if(API.Helper.isSet(options,['key'])){ defaults.key = options.key; }
			var td = layout.details.find('td[data-plugin="events"][data-key="'+defaults.key+'"]');
			td.find('button').off().click(function(){
				var button = $(this);
				if(button.attr('data-action') != "add"){
					if(API.Helper.isSet(API.Contents,['data','raw','users',button.attr('data-id')])){
						var user = {raw:API.Contents.data.raw.users[button.attr('data-id')],dom:{}};
						user.dom = API.Contents.data.dom.users[user.raw.username];
					} else {
						var user = {
							dom:dataset.details.users.dom[button.attr('data-id')],
							raw:dataset.details.users.raw[button.attr('data-id')],
						};
					}
				}
				switch(button.attr('data-action')){
					case"details":
						API.CRUD.read.show({ key:'username',keys:user.dom, href:"?p=users&v=details&id="+user.raw.username, modal:true });
						break;
					case"remove":
						API.request('events','unlink',{data:{id:dataset.this.raw.id,relationship:{relationship:defaults.key,link_to:button.attr('data-id')}}},function(result){
							var sub_dataset = JSON.parse(result);
							if(sub_dataset.success != undefined){
								td.find('.btn-group[data-id="'+sub_dataset.output.id+'"]').remove();
							}
						});
						break;
					case"add":
						API.Builder.modal($('body'), {
							title:'Add a user',
							icon:'user',
							zindex:'top',
							css:{ header: "bg-gray", body: "p-3"},
						}, function(modal){
							modal.on('hide.bs.modal',function(){ modal.remove(); });
							var dialog = modal.find('.modal-dialog');
							var header = modal.find('.modal-header');
							var body = modal.find('.modal-body');
							var footer = modal.find('.modal-footer');
							header.find('button[data-control="hide"]').remove();
							header.find('button[data-control="update"]').remove();
							API.Builder.input(body, 'user', null, function(input){});
							footer.append('<button class="btn btn-secondary" data-action="add"><i class="fas fa-user-plus mr-1"></i>'+API.Contents.Language['Add']+'</button>');
							footer.find('button[data-action="add"]').off().click(function(){
								if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
									API.request('events','link',{data:{id:dataset.this.dom.id,relationship:{relationship:defaults.key,link_to:body.find('select').select2('val')}}},function(result){
										var sub_dataset = JSON.parse(result);
										if(sub_dataset.success != undefined){
											API.Helper.set(API.Contents,['data','dom','users',sub_dataset.output.dom.id],sub_dataset.output.dom);
											API.Helper.set(API.Contents,['data','raw','users',sub_dataset.output.raw.id],sub_dataset.output.raw);
											API.Helper.set(dataset.details,['users','dom',sub_dataset.output.dom.id],sub_dataset.output.dom);
											API.Helper.set(dataset.details,['users','raw',sub_dataset.output.raw.id],sub_dataset.output.raw);
											API.Helper.set(dataset,['relations','users',sub_dataset.output.dom.id],sub_dataset.output.dom);
											var html = API.Plugins.events.GUI.buttons.details(sub_dataset.output.dom,{
												remove:defaults.remove,
												key: "username",
												icon:{details:"fas fa-user",remove:"fas fa-user-minus"},
												action:{remove:"remove"},
											})
											if(td.find('button[data-action="add"]').length > 0){
												td.find('button[data-action="add"]').before(html);
											} else { td.append(html); }
											sub_dataset.output.dom.owner = sub_dataset.output.timeline.owner;
											sub_dataset.output.dom.created = sub_dataset.output.timeline.created;
											API.Plugins.events.Events.users(dataset,layout,defaults);
										}
									});
									modal.modal('hide');
								} else {
									body.find('.input-group').addClass('is-invalid');
									alert('No organization were selected!');
								}
							});
							modal.modal('show');
						});
						break;
				}
			});
			if(callback != null){ callback(dataset,layout); }
		},
		notes:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			if(API.Auth.validate('custom', 'events_notes', 2)){
				layout.content.notes.find('button').off().click(function(){
				  if(!layout.content.notes.find('textarea').summernote('isEmpty')){
				    var note = {
				      by:API.Contents.Auth.User.id,
				      content:layout.content.notes.find('textarea').summernote('code'),
				      relationship:'events',
				      link_to:dataset.this.dom.id,
				      status:dataset.this.raw.status,
				    };
				    layout.content.notes.find('textarea').val('');
				    layout.content.notes.find('textarea').summernote('code','');
				    layout.content.notes.find('textarea').summernote('destroy');
				    layout.content.notes.find('textarea').summernote({
				      toolbar: [
				        ['font', ['fontname', 'fontsize']],
				        ['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
				        ['color', ['color']],
				        ['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
				      ],
				      height: 250,
				    });
				    API.request('events','note',{data:note},function(result){
				      var data = JSON.parse(result);
				      if(data.success != undefined){
				        API.Builder.Timeline.add.card(layout.timeline,data.output.note.dom,'sticky-note','warning',function(item){
				          item.find('.timeline-footer').remove();
				          if(API.Auth.validate('custom', 'events_notes', 4)){
				            $('<a class="time bg-warning pointer"><i class="fas fa-trash-alt"></i></a>').insertAfter(item.find('span.time.bg-warning'));
										item.find('a.pointer').off().click(function(){
											API.CRUD.delete.show({ keys:data.output.note.dom,key:'id', modal:true, plugin:'notes' },function(note){
												item.remove();
											});
										});
				          }
				        });
				      }
				    });
				    layout.tabs.find('a').first().tab('show');
				  } else {
				    layout.content.notes.find('textarea').summernote('destroy');
				    layout.content.notes.find('textarea').summernote({
				      toolbar: [
				        ['font', ['fontname', 'fontsize']],
				        ['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
				        ['color', ['color']],
				        ['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
				      ],
				      height: 250,
				    });
				    alert(API.Contents.Language['Note is empty']);
				  }
				});
			}
		},
		about:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			if(API.Auth.validate('custom', 'events_about', 3)){
				layout.content.about.find('button').off().click(function(){
					dataset.this.raw.about = layout.content.about.find('textarea').summernote('code');
					layout.content.about.find('textarea').summernote('destroy');
					layout.content.about.find('textarea').summernote({
						toolbar: [
							['font', ['fontname', 'fontsize']],
							['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
							['color', ['color']],
							['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
						],
						height: 500,
						code: dataset.this.raw.about,
					});
					API.request('events','update',{data:dataset.this.raw});
				});
			}
		},
		menus:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			layout.content.menus.find('button[data-field]').off().click(function(){
				layout.content.menus.find('button[data-field].btn-info').removeClass('btn-info').addClass('btn-secondary');
				$(this).removeClass('btn-secondary').addClass('btn-info');
				layout.content.menus.find('div[data-field]').hide();
				layout.content.menus.find('div[data-field="'+$(this).attr('data-field')+'"]').show();
			});
			if(API.Auth.validate('custom', 'events_menus', 3)){
				layout.content.menus.find('button[data-action]').off().click(function(){
					dataset.this.raw.menuAdult = layout.content.menus.find('textarea[name="menuAdult"]').summernote('code');
					dataset.this.raw.menuKid = layout.content.menus.find('textarea[name="menuKid"]').summernote('code');
					layout.content.menus.find('textarea').summernote('destroy');
					layout.content.menus.find('textarea').summernote({
						toolbar: [
							['font', ['fontname', 'fontsize']],
							['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
							['color', ['color']],
							['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
						],
						height: 500,
						code: dataset.this.raw.menuAdult,
					});
					API.request('events','update',{data:dataset.this.raw});
				});
			}
		},
		contacts:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var skeleton = {};
			for(var [field, settings] of Object.entries(API.Contents.Settings.Structure.contacts)){ skeleton[field] = ''; }
			var contacts = layout.content.contacts.find('div.row').eq(1);
			var search = layout.content.contacts.find('div.row').eq(0);
			search.find('div[data-action="clear"]').off().click(function(){
				$(this).parent().find('input').val('');
				contacts.find('[data-csv]').show();
			});
			search.find('input').off().on('input',function(){
				if($(this).val() != ''){
					contacts.find('[data-csv]').hide();
					contacts.find('[data-csv*="'+$(this).val().toLowerCase()+'"]').each(function(){ $(this).show(); });
				} else { contacts.find('[data-csv]').show(); }
			});
			if(API.Auth.validate('custom', 'events_contacts', 2)){
				contacts.find('.addContact').off().click(function(){
					API.CRUD.create.show({ plugin:'contacts', keys:skeleton, set:{isActive:'true',relationship:'events',link_to:dataset.this.raw.id} },function(created,user){
						if(created){
							user.dom.name = '';
							if((user.dom.first_name != '')&&(user.dom.first_name != null)){ if(user.dom.name != ''){user.dom.name += ' ';} user.dom.name += user.dom.first_name; }
							if((user.dom.middle_name != '')&&(user.dom.middle_name != null)){ if(user.dom.name != ''){user.dom.name += ' ';} user.dom.name += user.dom.middle_name; }
							if((user.dom.last_name != '')&&(user.dom.last_name != null)){ if(user.dom.name != ''){user.dom.name += ' ';} user.dom.name += user.dom.last_name; }
							API.Helper.set(dataset,['details','contacts','dom',user.dom.id],user.dom);
							API.Helper.set(dataset,['details','contacts','raw',user.raw.id],user.raw);
							API.Helper.set(dataset,['relations','contacts',user.dom.id],user.dom);
							API.Plugins.events.GUI.contact(user.dom,layout);
							API.Plugins.events.Events.contacts(dataset,layout);
							API.Builder.Timeline.add.contact(layout.timeline,user.dom,'address-card','secondary',function(item){
								item.find('i').first().addClass('pointer');
								item.find('i').first().off().click(function(){
									value = item.attr('data-name').toLowerCase();
									layout.content.contacts.find('input').val(value);
									layout.tabs.contacts.find('a').tab('show');
									layout.content.contacts.find('[data-csv]').hide();
									layout.content.contacts.find('[data-csv*="'+value+'"]').each(function(){ $(this).show(); });
								});
							});
						}
					});
				});
			}
			contacts.find('button').off().click(function(){
				var contact = dataset.relations.contacts[$(this).attr('data-id')];
				switch($(this).attr('data-action')){
					case"details":
						API.CRUD.read.show({ key:'username',keys:contact.users[Object.keys(contact.users)[0]], href:"?p=users&v=details&id="+contact.users[Object.keys(contact.users)[0]].username, modal:true });
						break;
					case"link":
						API.Builder.modal($('body'), {
							title:'Create or link a user',
							icon:'event',
							zindex:'top',
							css:{ dialog: "modal-lg", header: "bg-success", body: "p-3"},
						}, function(modal){
							modal.on('hide.bs.modal',function(){ modal.remove(); });
							var dialog = modal.find('.modal-dialog');
							var header = modal.find('.modal-header');
							var body = modal.find('.modal-body');
							var footer = modal.find('.modal-footer');
							header.find('button[data-control="hide"]').remove();
							header.find('button[data-control="update"]').remove();
							body.html('<div class="row"></div>');
							footer.append('<button class="btn btn-success" data-action="create"><i class="fas fa-calendar-day mr-1"></i>'+API.Contents.Language['Create']+'</button>');
							footer.find('button[data-action="create"]').off().click(function(){ modal.modal('hide'); });
							modal.modal('show');
						});
						break;
					case"attendance":
						API.Builder.modal($('body'), {
							title:'View the attendance',
							icon:'event',
							zindex:'top',
							css:{ dialog: "modal-lg", header: "bg-success", body: "p-3"},
						}, function(modal){
							modal.on('hide.bs.modal',function(){ modal.remove(); });
							var dialog = modal.find('.modal-dialog');
							var header = modal.find('.modal-header');
							var body = modal.find('.modal-body');
							var footer = modal.find('.modal-footer');
							header.find('button[data-control="hide"]').remove();
							header.find('button[data-control="update"]').remove();
							body.html('<div class="row"></div>');
							footer.append('<button class="btn btn-success" data-action="create"><i class="fas fa-calendar-day mr-1"></i>'+API.Contents.Language['Create']+'</button>');
							footer.find('button[data-action="create"]').off().click(function(){ modal.modal('hide'); });
							modal.modal('show');
						});
						break;
					case"add":
						API.Builder.modal($('body'), {
							title:'Add attendance to event',
							icon:'event',
							zindex:'top',
							css:{ dialog: "modal-lg", header: "bg-success", body: "p-3"},
						}, function(modal){
							modal.on('hide.bs.modal',function(){ modal.remove(); });
							var dialog = modal.find('.modal-dialog');
							var header = modal.find('.modal-header');
							var body = modal.find('.modal-body');
							var footer = modal.find('.modal-footer');
							header.find('button[data-control="hide"]').remove();
							header.find('button[data-control="update"]').remove();
							body.html('<div class="row"></div>');
							API.Builder.input(body.find('div.row'), 'setVows', item.setVows,{plugin:'events',type:'switch'}, function(input){
								input.wrap('<div class="col-md-6 py-3"></div>');
								modal.on('shown.bs.modal',function(e){
								  input.find('input').last().bootstrapSwitch('state', item.setVows);
								});
							});
							footer.append('<button class="btn btn-success" data-action="create"><i class="fas fa-calendar-day mr-1"></i>'+API.Contents.Language['Create']+'</button>');
							footer.find('button[data-action="create"]').off().click(function(){ modal.modal('hide'); });
							modal.modal('show');
						});
						break;
					case"edit":
						API.CRUD.update.show({ keys:contact, modal:true, plugin:'contacts' },function(user){
							user.dom.name = '';
							if((user.dom.first_name != '')&&(user.dom.first_name != null)){ if(user.dom.name != ''){user.dom.name += ' ';} user.dom.name += user.dom.first_name; }
							if((user.dom.middle_name != '')&&(user.dom.middle_name != null)){ if(user.dom.name != ''){user.dom.name += ' ';} user.dom.name += user.dom.middle_name; }
							if((user.dom.last_name != '')&&(user.dom.last_name != null)){ if(user.dom.name != ''){user.dom.name += ' ';} user.dom.name += user.dom.last_name; }
							API.Helper.set(dataset,['relations','contacts',user.dom.id],user.dom);
							contacts.find('[data-id="'+user.raw.id+'"]').remove();
							API.Plugins.events.GUI.contact(user.dom,layout);
							API.Plugins.events.Events.contacts(dataset,layout);
						});
						break;
					case"delete":
						contact.link_to = dataset.this.raw.id;
						API.CRUD.delete.show({ keys:contact,key:'name', modal:true, plugin:'contacts' },function(user){
							if(contacts.find('[data-id="'+contact.id+'"]').find('.ribbon-wrapper').length > 0 || !API.Auth.validate('custom', 'events_contacts_isActive', 1)){
								contacts.find('[data-id="'+contact.id+'"]').remove();
								layout.timeline.find('[data-type="address-card"][data-id="'+contact.id+'"]').remove();
							}
							if(contact.isActive && API.Auth.validate('custom', 'events_contacts_isActive', 1)){
								contact.isActive = user.isActive;
								API.Helper.set(dataset,['relations','contacts',contact.id,'isActive'],contact.isActive);
								contacts.find('[data-id="'+contact.id+'"] .card').prepend('<div class="ribbon-wrapper ribbon-xl"><div class="ribbon bg-danger text-xl">'+API.Contents.Language['Inactive']+'</div></div>');
							}
						});
						break;
				}
			});
			if(callback != null){ callback(dataset,layout); }
		},
		planning:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {key: "setHosts",remove:false};
			if(API.Helper.isSet(options,['remove'])){ defaults.remove = options.remove; }
			if(API.Helper.isSet(options,['key'])){ defaults.key = options.key; }
			var search = layout.content.event_items.find('div.row').eq(0);
			var table = layout.content.event_items.find('table');
			search.find('div[data-action="clear"]').off().click(function(){
				$(this).parent().find('input').val('');
				table.find('[data-csv]').show();
			});
			search.find('input').off().on('input',function(){
				if($(this).val() != ''){
					table.find('[data-csv]').hide();
					table.find('[data-csv*="'+$(this).val().toLowerCase()+'"]').show();
				} else { table.find('[data-csv]').show(); }
			});
			search.find('button[data-action="create"]').off().click(function(){
				API.Builder.modal($('body'), {
				  title:'Create a new event',
				  icon:'event',
				  zindex:'top',
				  css:{ dialog: "modal-lg", header: "bg-success", body: "p-3"},
				}, function(modal){
					modal.on('hide.bs.modal',function(){ modal.remove(); });
					var dialog = modal.find('.modal-dialog');
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('button[data-control="hide"]').remove();
					header.find('button[data-control="update"]').remove();
					body.html('<div class="row"></div>');
					API.Builder.input(body.find('div.row'), 'date', null,{plugin:'events'}, function(input){
						input.wrap('<div class="col-md-6"></div>');
					});
					API.Builder.input(body.find('div.row'), 'time', null,{plugin:'events'}, function(input){
						input.wrap('<div class="col-md-6"></div>');
					});
					API.Builder.input(body.find('div.row'), 'title', null,{plugin:'events',type:'input'}, function(input){
						input.wrap('<div class="col-md-12 py-3"></div>');
					});
					API.Builder.input(body.find('div.row'), 'description', null,{plugin:'events',type:'textarea'}, function(input){
						input.wrap('<div class="col-md-12"></div>');
					});
					API.Builder.input(body.find('div.row'), 'setVows', null,{plugin:'events',type:'switch'}, function(input){
						input.wrap('<div class="col-md-6 py-3"></div>');
					});
					API.Builder.input(body.find('div.row'), 'setGallery', null,{plugin:'events',type:'switch'}, function(input){
						input.wrap('<div class="col-md-6 py-3"></div>');
					});
					footer.append('<button class="btn btn-success" data-action="create"><i class="fas fa-calendar-day mr-1"></i>'+API.Contents.Language['Create']+'</button>');
					footer.find('button[data-action="create"]').off().click(function(){
						var form = {
							date:body.find('input[data-key="date"]').val(),
							time:body.find('input[data-key="time"]').val(),
							title:body.find('input[data-key="title"]').val(),
							description:body.find('textarea[data-key="description"]').summernote('code'),
							setEvent:dataset.this.raw.id,
							setVows:body.find('input[data-key="setVows"]').bootstrapSwitch('state'),
							setGallery:body.find('input[data-key="setGallery"]').bootstrapSwitch('state'),
						};
						body.find('textarea').summernote('destroy');
						body.find('textarea').summernote({
							toolbar: [
								['font', ['fontname', 'fontsize']],
								['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
								['color', ['color']],
								['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
							],
							height: 500,
							code: form.description,
						});
						API.request('events','createItem',{data:form},function(result){
							var response = JSON.parse(result);
							if(response.success != undefined){
								API.Plugins.events.GUI.items(dataset,layout,response.output.item);
								API.Plugins.events.Events.planning(data,layout);
							}
						});
						modal.modal('hide');
					});
					modal.modal('show');
				});
			});
			table.find('button').off().click(function(){
				var button = $(this);
				var action = $(this).attr('data-action');
				var row = $(this).parents().eq(2);
				var item = dataset.relations.event_items[row.attr('data-id')];
				switch(action){
					case"delete":
						API.Builder.modal($('body'), {
							title:'Are you sure?',
							icon:'delete',
							zindex:'top',
							css:{ header: "bg-danger", body: "p-3"},
						}, function(modal){
							modal.on('hide.bs.modal',function(){ modal.remove(); });
							var dialog = modal.find('.modal-dialog');
							var header = modal.find('.modal-header');
							var body = modal.find('.modal-body');
							var footer = modal.find('.modal-footer');
							header.find('button[data-control="hide"]').remove();
							header.find('button[data-control="update"]').remove();
							body.html(API.Contents.Language['Are you sure you want to delete this envent item?']);
							footer.append('<button class="btn btn-danger" data-action="delete"><i class="fas fa-trash-alt mr-1"></i>'+API.Contents.Language['Delete']+'</button>');
							footer.find('button[data-action="delete"]').off().click(function(){
								API.request('events','deleteItem',{data:item},function(result){
									var response = JSON.parse(result);
									if(response.success != undefined){
										table.find('tr[data-id="'+response.output.item.id+'"]').remove();
									}
								});
								modal.modal('hide');
							});
							modal.modal('show');
						});
						break;
					case"edit":
						API.Builder.modal($('body'), {
						  title:'Edit event',
						  icon:'event',
						  zindex:'top',
						  css:{ dialog: "modal-lg", header: "bg-warning", body: "p-3"},
						}, function(modal){
							modal.on('hide.bs.modal',function(){ modal.remove(); });
							var dialog = modal.find('.modal-dialog');
							var header = modal.find('.modal-header');
							var body = modal.find('.modal-body');
							var footer = modal.find('.modal-footer');
							header.find('button[data-control="hide"]').remove();
							header.find('button[data-control="update"]').remove();
							body.html('<div class="row"></div>');
							API.Builder.input(body.find('div.row'), 'date', item.date,{plugin:'events'}, function(input){
								input.wrap('<div class="col-md-6"></div>');
							});
							API.Builder.input(body.find('div.row'), 'time', item.time,{plugin:'events'}, function(input){
								input.wrap('<div class="col-md-6"></div>');
							});
							API.Builder.input(body.find('div.row'), 'title', item.title,{plugin:'events',type:'input'}, function(input){
								input.wrap('<div class="col-md-12 py-3"></div>');
							});
							API.Builder.input(body.find('div.row'), 'description', item.description,{plugin:'events',type:'textarea'}, function(input){
								input.wrap('<div class="col-md-12"></div>');
							});
							API.Builder.input(body.find('div.row'), 'setVows', item.setVows,{plugin:'events',type:'switch'}, function(input){
								input.wrap('<div class="col-md-6 py-3"></div>');
								modal.on('shown.bs.modal',function(e){
								  input.find('input').last().bootstrapSwitch('state', item.setVows);
								});
							});
							API.Builder.input(body.find('div.row'), 'setGallery', item.setGallery,{plugin:'events',type:'switch'}, function(input){
								input.wrap('<div class="col-md-6 py-3"></div>');
								modal.on('shown.bs.modal',function(e){
								  input.find('input').last().bootstrapSwitch('state', item.setGallery);
								});
							});
							footer.append('<button class="btn btn-success" data-action="save"><i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save']+'</button>');
							footer.find('button[data-action="save"]').off().click(function(){
								item.date = body.find('input[data-key="date"]').val();
								item.time = body.find('input[data-key="time"]').val();
								item.title = body.find('input[data-key="title"]').val();
								item.description = body.find('textarea[data-key="description"]').summernote('code');
								item.setVows = body.find('input[data-key="setVows"]').bootstrapSwitch('state');
								item.setGallery = body.find('input[data-key="setGallery"]').bootstrapSwitch('state');
								body.find('textarea').summernote('destroy');
								body.find('textarea').summernote({
									toolbar: [
										['font', ['fontname', 'fontsize']],
										['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
										['color', ['color']],
										['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
									],
									height: 500,
									code: item.description,
								});
								API.request('events','saveItem',{data:item},function(result){
									var response = JSON.parse(result);
									if(response.success != undefined){
										table.find('tr[data-id="'+response.output.item.id+'"]').remove();
										API.Plugins.events.GUI.items(dataset,layout,response.output.item);
										API.Plugins.events.Events.planning(data,layout);
									}
								});
								modal.modal('hide');
							});
							modal.modal('show');
						});
						break;
				}
			});
			// Code here
			if(callback != null){ callback(dataset,layout); }
		},
		galleries:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			layout.content.galleries.area.find('div.addContact div.card-body.py-4').parent().off().click(function(){
				API.Builder.modal($('body'), {
				  title:'Upload',
				  icon:'picture',
				  zindex:'top',
				  css:{ dialog: "modal-lg", header: "bg-purple", body: "p-3"},
				}, function(modal){
					modal.on('hide.bs.modal',function(){ modal.remove(); });
					var dialog = modal.find('.modal-dialog');
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('button[data-control="hide"]').remove();
					header.find('button[data-control="update"]').remove();
					API.Builder.dropzone(body,{acceptedFiles:"image/*"},function(action,zone,data){
						switch(action){
							case"sending":
								var checkStatus = setInterval(function(){
									if(data.status != "success" && data.status != "uploading"){
										console.log(data.status);
										clearInterval(checkStatus);
									}
									if(data.status == "success"){
										clearInterval(checkStatus);
										var picture = {
											basename:data.name,
											dataURL:data.dataURL,
											event:dataset.this.raw.id,
										};
										API.request('events','upload',{data:picture},function(result){
											var response = JSON.parse(result);
											if(response.success != undefined){
												API.Plugins.events.GUI.picture(response.output.picture,layout);
											}
										});
									}
								}, 100);
								break;
							default:
								console.log(action,zone,data);
								break;
						}
					});
					modal.modal('show');
				});
			});
			layout.content.galleries.area.find('div[data-picture] img').off().click(function(){
				var pictureID = $(this).attr('data-picture');
				API.Builder.modal($('body'), {
				  title:'View',
				  icon:'picture',
				  zindex:'top',
				  css:{ dialog: "modal-full", header: "bg-info", body: "p-3"},
				}, function(modal){
					modal.on('hide.bs.modal',function(){ modal.remove(); });
					var dialog = modal.find('.modal-dialog');
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('button[data-control="hide"]').remove();
					header.find('button[data-control="update"]').remove();
					footer.remove();
					body.removeClass('p-3').addClass('p-0').addClass('text-center');
					body.html('<img style="max-width:100%;max-width:100%;" src="'+dataset.relations.galleries[Object.keys(dataset.relations.galleries)[0]].pictures[pictureID].dirname+'/'+dataset.relations.galleries[Object.keys(dataset.relations.galleries)[0]].pictures[pictureID].basename+'" alt="'+dataset.relations.galleries[Object.keys(dataset.relations.galleries)[0]].pictures[pictureID].basename+'" />');
					modal.modal('show');
				});
			});
			layout.content.galleries.area.find('div[data-picture] button').off().click(function(){
				var pictureID = $(this).attr('data-picture');
				var picture = dataset.relations.galleries[Object.keys(dataset.relations.galleries)[0]].pictures[pictureID];
				API.Builder.modal($('body'), {
				  title:'Are you sure?',
				  icon:'delete',
				  zindex:'top',
				  css:{ header: "bg-danger", body: "p-3"},
				}, function(modal){
					modal.on('hide.bs.modal',function(){ modal.remove(); });
					var dialog = modal.find('.modal-dialog');
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('button[data-control="hide"]').remove();
					header.find('button[data-control="update"]').remove();
					body.html(API.Contents.Language['Are you sure you want to delete this picture?']);
					footer.append('<button class="btn btn-danger" data-action="delete"><i class="fas fa-trash-alt mr-1"></i>'+API.Contents.Language['Delete']+'</button>');
					footer.find('button[data-action="delete"]').off().click(function(){
						API.request('events','deletePicture',{data:picture},function(result){
							var response = JSON.parse(result);
							if(response.success != undefined){
								layout.content.galleries.area.find('div[data-picture="'+response.output.picture.id+'"]').remove();
							}
						});
						modal.modal('hide');
					});
					modal.modal('show');
				});
			});
		},
	},
}

API.wedding.init();
