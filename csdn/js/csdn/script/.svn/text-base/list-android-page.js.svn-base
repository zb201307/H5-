(function (C, B) {
    var page = function () { }

    C.extend(page.prototype, B, {
		/// <summary>
        /// 是否是无图模式
        /// </summary>
		noImage: false,
        noImageStatus: false,
		/// <summary>
        /// 当前显示的category id
        /// </summary>
		categoryId:"news",
		/// <summary>
        /// 菜单窗口是否在显示
        /// </summary>
		isShowingMenu: false,
		loadednews:{},
		firstnewsid:null,
		/// <summary>
        /// 当前窗口是否处于动画之中
        /// </summary>
		isAnimating: false,
		firstLoad: true,
        OnReady: function () {
			var that = this,
				doc = document,
				webview = plus.webview,
				cacheKey = that.cacheKey,
				tiro = cacheKey.tiro,
				selfWin = webview.currentWebview();
			that.width = plus.screen.resolutionWidth;
			doc.onselectstart=function(){return false;}
			try{
				that.on("resume", doc);
				that.on("netchange", doc);
				that.on('scroll', window);
				that.on('touchstart', doc);
				that.on('click', container);
				that.on('plusscrollbottom', doc);
				that.networkStatus = that.hasNetwork();
//				if (that.is2G()) {
//					that.noImage = true;
//					that.setItem(that.cacheKey.noImage,that.noImage);
//				}else{
//					that.noImage = that.getItem(that.cacheKey.noImage);
//				};
				that.noImage = that.getItem(that.cacheKey.noImage);
				webview.create('app/show.html','ShowWin', {left:"100%",zindex:3});
				that.init(function(){
					that.loadFirstPageData("news");
				});
				
				that._scrollY = 0;
				
			}
			catch(ex){
				C.showErr(ex, 'onready list');
			}
        },
		checkInstall: function(){
			var that = this,
				widgitPath = that.getItem(that.cacheKey.widgtPath),
				doc = document;
			if(widgitPath){
				that.installing = true;
				plus.webview.currentWebview().setPullToRefresh({support: false});
				var div = doc.createElement('div');
				div.id = 'installing';
				div.innerHTML = '<div><div class="installloading iosinstalling"></div><div class="installcontent">正在解压新资源，请稍后...</div></div>';
				doc.body.appendChild(div);
				plus.runtime.install(widgitPath,{force:true}, function(widgetInfo){
					that.remove(that.cacheKey.widgtPath);
					that.installing = false;
					plus.io.requestFileSystem( plus.io.PRIVATE_DOC, function( fs ) {
						fs.root.getDirectory( "widgt", {create: false}, function ( entry ) {
							entry.removeRecursively(function(){
								plus.runtime.restart();
							});
						});
					});
					//alert('plus.runtime.restart();');
				}, function(error){
					//alert('faile:' + error);
					//that.setItem(that.cacheKey.widgtPath, '');
					that.remove(that.cacheKey.widgtPath);
					that.installing = false;
					plus.webview.currentWebview().setPullToRefresh({support: true});
					doc.getElementById('installing').style.display = 'none';
					plus.io.requestFileSystem( plus.io.PRIVATE_DOC, function( fs ) {
						fs.root.getDirectory( "widgt", {create: false}, function ( entry ) {
							entry.removeRecursively(function(){
								//doc.getElementById('installing').style.display = 'none';
								plus.runtime.restart();
							});

						});
					});
				});
			}
			else{
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo){
					C.ajax({
						type: 'GET',
						timeout: that.timeout,
						url: that.jsonp_Server + 'sus/?appversion=' + widgetInfo.version + '&version=' + plus.runtime.version + '&innerversion=1.0&type=android',
						dataType : 'jsonp',
						success : function(data) {
							if(data.download_url_base){
								that.installing = true;
								plus.nativeUI.confirm(data.releasenotes, function(index, text){
									if(index == 1) plus.runtime.openURL(data.download_url_base);
									that.installing = false;
								}, '', ['不更新', '更新']);

								//alert('data.download_url_base:' + data.download_url_base);
								//plus.runtime.openURL(data.download_url_base);
								return;
							}
							if(data.download_url_app){
								var source = data.download_url_app,
									dstFile = source.substring(source.lastIndexOf('/') + 1);
								that.downLoadFile({
									srcFile:source,
									downloadFolerPath: '_doc/widgt/',
									folderPath : "widgt/",
									dstFile : dstFile,
									success : function(op, isExist, d) {
										if(isExist){
											 plus.downloader.enumerate(function(downloads){
												 var len = downloads.length, index = 0;
												 for(; index < len; index++){
													 var download = downloads[index];
													 // alert('download:'+JSON.stringify(download));
													 if(download.filename == '_doc/widgt/' + dstFile){
														 //alert('download:'+JSON.stringify(download));
														 download.addEventListener('statechanged', function(_d, status){
															 if (download.state == 4 && status == 200){
																 //alert('statechanged:' + status);
																 that.setItem(that.cacheKey.widgtPath, _d.filename);
															 }
														 });
														 download.start();
														 return;
													 }
												 }
												 //删除非正常下载的安装包文件
												 plus.io.requestFileSystem( plus.io.PRIVATE_DOC, function( fs ) {
													fs.root.getDirectory( "widgt", {create: false}, function ( entry ) {
														entry.removeRecursively(function(){
														});
													});
												}); 
											 });
										}
										else{
											that.setItem(that.cacheKey.widgtPath, d.filename);
										}
									}
								});
							}
							//alert('getProperty:' + JSON.stringify(data));
							//that.downLoadWgidt();
						},
						error : function(xhr, type) {
							//alert('checkUpdate:' + type);
						}
					});
				});
			}
		},

		hidePullToRefresh: function(){
			var that = this;
			if(that.isrefresh){
				that.isrefresh = false;
//				console.log('plus.webview.currentWebview().endPullToRefresh();')
				plus.webview.currentWebview().endPullToRefresh();
				plus.webview.getWebviewById('IndexWIN').evalJS('page.pullReset()')
			}
		},
		/// <summary>
        ///
        /// </summary>
        /// <param name="url">url地址</param>
		/// <param name="pageName">窗口id</param>
		goNextpage: function(url, pageName){
			plus.webview.create(url, pageName, {left:'0%',top:'0',width:'100%',height:'100%', transition:'slide-in-left'} );
		},
		handleEvent: function(e){
			try{
				var that = this,
					t = e.target;
				switch(e.type){
					case 'plusscrollbottom':
//					console.log('plusscrollbottom:'+ that.pageNum + ',' + that.isLoading);
						if(that.pageNum < 4 && !that.isLoading){
							that.loadData(that.categoryId, that.pageNum + 1);
						}
						return;
					case "scroll":
						if(that.scrollTimer) clearTimeout(that.scrollTimer);
						that.scrollTimer = setTimeout(function(){
							var w = window,
								pageYOffset = w.pageYOffset;
							var diffY = that._scrollY - pageYOffset;
							that._scrollY = pageYOffset;
//							console.log(that.pageNum +'< 4&&' + diffY +'< 0 &&' +w.pageYOffset +'+' +w.innerHeight +'>='+ that.scrollHeight +'&&'+ !that.isLoading)
//							if(that.pageNum < 4 && diffY < 0 && w.pageYOffset + w.innerHeight + 2 >= that.scrollHeight && !that.isLoading){
//								that.loadData(that.categoryId, that.pageNum + 1);
//							}
							that.checkLazyLoad("#container img[lazyload]", window.pageYOffset);
						},600)
						
						break;
					case "resume":
						that.onResume();
						break;
					case "netchange":
						//that.onNetChange();
						that.networkStatus = that.hasNetwork();
						that.onResume();
						break;
					case "touchstart":
						if(that.installing){
							e.preventDefault();
							return false;
						}
						if(that.isShowingMenu) {
							e.stopPropagation();
							that.closeMenu();
							return false;
						}
						if(that.isShowingNoImg){
							if(!that.networkStatus){
								that.alert("网络不给力");
								return false;
							}
							that.isShowingNoImg = false;
							that.loadData(that.categoryId, 1);
						}
//						that.touchmoved = false;
						
//						that.on('touchend', document);
//						that.on('touchcancel', document);
//						that.on('touchmove', document);
						return false;
						break;
					case "touchmove":
//						that.touchmoved = true;
						//that.on('scroll', window);
						break;
//					case "touchcancel":
					case "touchend":

						//that.on('scroll', window);
						//that.scroll(e);
//						that.off('touchend', document);
////						that.off('touchcancel', document);
//						that.off('touchmove', document);
//						if(!that.touchmoved && t && !that.isShowingMenu){//到详情页面
//							;
//						}
//						else that.touchmoved = false;

						break;
					case 'click':
						if(t && !that.isShowingMenu){
							that.goShowPage(t.getAttribute('articleid') ||
								t.parentNode.getAttribute('articleid') ||
								t.parentNode.parentNode.getAttribute('articleid'))
						}
						
						break;
				}
				t = null;
			}
			catch(ex){
				C.showErr(ex, 'handelevent');
			}
		},
		/// <summary>
        /// 程序从后台恢复到前台事件
        /// </summary>
		onResume: function(){
//			console.log('onResume');
			var that = this;
			that.resumeTime = new Date().getTime();
			if(that.hasError){
				that.hasError = false;
				if(!that.networkStatus){
					that.hasError = true;
					//alert("没有网络");
					that.alert("请连接网络后重试");
					return;
				}
				
				if(that.ajax) that.ajax.abort();
				that.ajax = that.loadCategoryByPageNetwork(that.categoryId, that.loaddingPageNum, 0, 
						function(networkData){
							if(networkData){
								that.showData(networkData, that.categoryId, that.loaddingPageNum);
							}
							else that.alert("未能从网络请求到数据。");
						}, 
						function(xhr, type){
							if(type == 'abort') return;
							that.hasError = true;
							that.alert("网络不给力");
						});
			}
			//that.isPause = false;
		},
		/// <summary>
        /// 程序从前台恢复到后台事件
        /// </summary>
		onPause: function(){
			//var that = this;
			this.isPause = true;
			//plus.console.log("onPause");
		},
		/// <summary>
        /// 网络状态改变
        /// </summary>
		onNetChange: function(){
			this.isNetChange = true;
		},

		/// <summary>
        /// 最新资讯的第一天新闻特殊显示
        /// </summary>
		getAndroidFirstNews: function(d){
			//if(this.noImage) return this.getDivForNoImg(d);
			var doc = document,
				div = doc.createElement("div"),
				img = doc.createElement("img"),
				div2 = doc.createElement("div"),
				width = this.width - 20,
				height = width*0.6;
				//height = 360/600.0 * (window.innerWidth - 20);
			try{
				div.setAttribute("articleid", d.id);
                div.setAttribute("remark", d.remark);
				if(d.readflag) div.setAttribute("class", "androidfirstnew readed");
				else div.setAttribute("class", "androidfirstnew");

				var imgPath = d.img,
                    index = imgPath.indexOf('localhost');
                    if(imgPath && index < 0){
                        img.setAttribute("lazyload", imgPath);
                        img.setAttribute("articleid", d.id);
                        img.src = "app/img/ios-default1.png";
                    }
                    else if(this.noImage && imgPath && index >= 0){
                        img.setAttribute("local", '1');
                        img.setAttribute("lazyload", imgPath);
                        img.setAttribute("articleid", d.id);
                        img.src = "app/img/ios-default1.png";
                    }else{
                        img.src = imgPath || "app/img/ios-default1.png";
                    }
				img.style.cssText = "width:" + width + "px; height:" + height + "px";
				div.appendChild(img);
				div2.innerHTML = "<h2>" + d.title + "</h2>";
				div.appendChild(div2);
				return div;
			}
			catch(ex){
				C.showErr(ex);
			}
		},
		getDivForAndriod: function(d){
			var that = this;
			//if(that.noImage) return that.getDivForNoImg(d);
			var doc = document,
				div = doc.createElement("div"),
				img = doc.createElement("img"),
				span = doc.createElement("span"),
				h2 = doc.createElement("h2"),
				p = doc.createElement("p"),
				img = doc.createElement("img"),
				className = "andrid",
				time = d.ptime.toDate("yyyy-MM-dd HH:mm").toString("MM-dd HH:mm");
			try{
				div.setAttribute("articleid", d.id);
                div.setAttribute("remark", d.remark);
				if(d.readflag) className += " readed";
				div.setAttribute("class", className);

				h2.innerHTML = d.title;
				p.setAttribute("class", "info");
				//p.innerHTML = '<span class="icon clock"></span><span class="ptime">' + time + '</span><span>&nbsp;&nbsp;</span><span class="icon eye"></span><span class="ptime">' + parseInt(d.count, 10) + '</span>';
				p.innerHTML = '<span class="icon clock"></span><span class="ptime">' + time + '</span><span>&nbsp;&nbsp;</span>';

                var androidimg = d.Androidimg,
                    index = androidimg.indexOf('?');
                if(androidimg && androidimg.indexOf('localhost') < 0){
                    if(index > 0) androidimg = androidimg.substring(0, index);
                    img.setAttribute("lazyload", androidimg + '?width=180&height=120');
                    img.src = "app/img/logo.png";
                    img.setAttribute("articleid", d.id);
                } else if(this.noImage && androidimg && androidimg.indexOf('localhost') >= 0){
                    img.setAttribute("local", '1');
                    img.setAttribute("lazyload", androidimg);
                    img.setAttribute("articleid", d.id);
                    img.src = "app/img/logo.png";
                }else{
                    img.src = androidimg || "app/img/logo.png";
                }
                //img.setAttribute("class", "androidimg");
                div.appendChild(img);

				span.appendChild(h2);
				span.appendChild(p);
				span.setAttribute("articleid", d.id);
				span.style.width = this.width - 125 + "px";
				div.appendChild(img);
				div.appendChild(span);
				
				return div;
			}
			catch(ex){
				C.showErr(ex);
			}
		},
		changeImageFlag: function(status){
			var that = this;
			if(status){
				that.noImage = true;
			}else{
				that.noImage = false;
				that.checkLazyLoad("#container img[lazyload]", window.pageYOffset);
			}
		},
		/**
		 * @作者：
		 * @时间：2013/04/15 10:40:45
		 * @param lazyPath:css path
		 * @param  top:
		 * @描述：延迟加载图片 
		 */
		checkLazyLoad: function(lazyPath, top){
			var that = this;
			if(that.noImage || !that.networkStatus) return;
			if(that.lazyTimeout) clearTimeout(that.lazyTimeout);
			that.lazyTimeout = setTimeout(function(){
				try{
					var doc = document,
						lazyObjs = doc.querySelectorAll(lazyPath),
						len = lazyObjs.length,
						index = 0,
						winheight = window.innerHeight * 1.1;
					if(len <= 0) return;
					for(; index < len; index++){
						var obj = lazyObjs[index],
							_top = obj.offsetTop - top;
						if(_top >= 0 && _top < winheight){
							var srcImg = obj.getAttribute("lazyload"),
                                local = obj.getAttribute('local');
							obj.removeAttribute("lazyload");
							obj.src = srcImg;
//                          if(local == '1'){
//                              obj.src = srcImg;
//                          }else{
//                              that.downLoadImg(srcImg, obj.getAttribute("articleid"));
//                          }
						}
						obj = null;
					}
					lazyObjs = null;
				}
				catch(ex){
					C.showErr(ex);
				}
			}, 600);
		},
		/**
		 * @作者：
		 * @时间：2013/04/15 10:42:15
		 * @param articleid:
		 * @描述： 显示详情页面
		 */
		goShowPage: function(articleid){
			try{
				if(!articleid) return;
				var that = this,
					divs = document.querySelectorAll("div[articleid='" + articleid + "']"),
					div0 = divs[0],
					div1 = divs[1],
                    remark = div0.getAttribute("remark");
				div0.className = div0.className + ' readed';//设置已读标志
				div0 = null;
				if(div1) {
					div1.className = div1.className + ' readed';
					div1 = null;
				}
				divs = null;

				that.setItem(that.cacheKey.articleId, articleid);
				that.setItem(that.cacheKey.noImage, that.noImage);
				var win = plus.webview.getWebviewById("ShowWin");
				win.evalJS("page.loadFile('"+ articleid +"', '"+ remark + "');");
				win.show();
				win.setStyle({left:"0", transition:{duration:100}});
			}
			catch(ex){
				C.showErr(ex, 'goShowPage:' + ex.message);
			}
		},
		/**
		 * @作者：
		 * @时间：2013/04/15 10:42:39
		 * @param pageIndex:如果是菜单栏页面调用该方法，指示是显示列表页面第几个栏目
		 * @param  categoryid:
		 * @描述： 显示菜单页面
		 */
		closeMenu: function(){
			plus.webview.getWebviewById("IndexWIN").evalJS('page.showMenu()');
		},
		/**
		 * data:数据
		 * categoryid：类别
		 * pageNum:page num
		 * source:1代表下拉刷新,2代表从菜单页刷新
		 */
		showData: function(data, categoryid, pageNum, source){
			try{
				var that = this,
					doc = document,
					container = doc.getElementById("container"),
					list = data.list,
					fragment = doc.createDocumentFragment(),
                    index = 0,
					firstnews = data.firstnews,
					pullUp = doc.getElementById('pullUp'),
					loadednews = that.loadednews;
//				if(source == 1){//测试代码
//					if(!that.testnum) that.testnum = 1
//					if(firstnews){
//						firstnews.id = that.testnum;
//						firstnews.title = that.testnum
//					}
//					list[0].title = that.testnum;
//					list[0].id = that.testnum + '.'
//					console.log(list[0].id + ':' + list[0].title)
//					that.testnum ++;
//				}
//				console.log('source:' + source)
				if(source == 2){
					loadednews = that.loadednews = {}
					that.firstnewsid = null;
					that.firstLoad = true;
				};
				if(!that.firstLoad && firstnews){//局部更新
					var id = firstnews.id;
//					console.log('id:' + id + ':' + that.firstnewsid)
					if(that.firstnewsid && that.firstnewsid != id){
						var div = container.children[0];
						div.className = 'androidfirstnew';
						div.setAttribute("articleid", id);
                		div.setAttribute("remark", firstnews.remark);
                		var img = div.children[0];
                		
                        img.setAttribute("articleid", id);
                        if(that.noImage){
                        	img.src = "app/img/ios-default1.png";
                        	img.setAttribute("lazyload", firstnews.img);
                        }
                        else{
                        	img.src = firstnews.img;
                        }
                        
                		var div2 = div.children[1];
//              		console.log("div2.innerHTML:" + div2.innerHTML)
                		div2.innerHTML = "<h2>" + firstnews.title + "</h2>";
                		that.firstnewsid = id;
					}
					loadednews[id] = true;
				}
                else if(firstnews){
                	loadednews[firstnews.id] = true;
                	that.firstnewsid = firstnews.id;
                    fragment.appendChild(that.getAndroidFirstNews(firstnews));
                }
                var haschild = false;
//              console.log(JSON.stringify(loadednews))
				for(i in list){
					var d = list[i];
					if(!loadednews[d.id]) {
						haschild = true;
						fragment.appendChild(that.getDivForAndriod(d));
						loadednews[d.id] = true;
//						console.log(d.id + ':' + d.title)
					}
				}
				
				if(source ==1) that.hidePullToRefresh();
				if(!haschild) {
					return;
				}
//				console.log('that.firstLoad:' + that.firstLoad + ':' + pageNum)
				if(that.firstLoad){
					that._scrollY = 0;
                    container.innerHTML = "";
                    container.setAttribute("class", "container");
					pullUp.style.display = 'block';
					pullUp.innerHTML = '数据加载中，请稍候...';
					that.closeSplash();
					that.hidePullToRefresh();
					container.appendChild(fragment);
					 that.pageNum = pageNum;
				}else if(pageNum > 1){
					container.appendChild(fragment);
					 that.pageNum = pageNum;
				}
				else{
//					console.log('categoryid:' + categoryid + ':' + pageNum)
//					console.log(JSON.stringify(testd))
                	container.insertBefore(fragment, container.children[firstnews?1:0]);
				}
				if(pageNum == 4){
					pullUp.innerHTML = '没有更早的资讯了';
				}
//				if(!that.hasCheckInstall){
//					setTimeout(function(){
//						that.checkInstall();
//					}, 10)
//					that.hasCheckInstall = true;
//				}
                
				that.scrollHeight = doc.body.scrollHeight;
				that.firstLoad = false;
                fragment = null;

               
//              console.log('window.pageYOffset:' + window.pageYOffset)
                that.checkLazyLoad("#container img[lazyload]", window.pageYOffset);

				container = null;
				list = null;
			}
			catch(ex){
				C.showErr(ex);
			}
		},
		downLoadImg: function(srcImg, articleid){
			var that = this,
				dstImg = srcImg.substring(srcImg.lastIndexOf('/') + 1);
            //if(articleid == 2814859) alert("2814859>>>"+srcImg);
			that.downLoadFile({
				srcFile: srcImg,
				dstFile: dstImg,
				folderPath: "img/",
				downloadFolerPath: "_doc/img/",
				articleId: articleid,
				success: function(op, isExist, file){
					try{
						var _articleid = op.articleId,
							imgs = document.querySelectorAll("img[articleid='" + _articleid + "']"),
							img0 = imgs[0],
                            img1 = imgs[1],
							_dstImg = "http://localhost:13131/" + (file.filename || "_doc/img/" + file.name);
                        //if(_articleid == 2814859)alert("json:" + JSON.stringify(op)+ ";;" + isExist + ",dst:" + _dstImg);
						if(!isExist){
							that.db.transaction(function(tx) {
								tx.executeSql('update article_list set androidimg=? where id=?', [_dstImg, _articleid], null);
							});
						}
						if(img0){
							img0.src = _dstImg;
							if(img1){
								img1.src = _dstImg;
								img1 = null;
							}
						}
						else if(document.querySelector(".androidfirstnew img")){
							document.querySelector(".androidfirstnew img").src = _dstImg;
						}
						
						img0 = null;
						imgs = null;
					}
					catch(ee){
						C.showErr(ee);
					}
				},
				error: function(op, status,d){
					//if(status != 404) 
//					plus.console.log("index: downLoadImg fail:" + status + "," + op.srcImg)
				}
			});
		},
		/**
		 * @作者：
		 * @时间：2013/04/13 16:42:36
		 * @param catetory:
		 * @描述：加载第一页的数据 
		 */
		loadFirstPageData: function(catetory){
			try{
				var that = this,
					cacheKey = that.cacheKey,
					updateTime = that.getItem(cacheKey.updateTime + catetory),
					time = new Date().getTime();
				if(!updateTime || time - updateTime >= 1000*60*30){//30分钟更新
					that.loadData(catetory, 1);
					return;
				}
				that.loadCategoryByPageDB(catetory, 1, 
					function(data){
						if(data)
							that.showData(data, catetory, 1);
						else 
							that.loadData(catetory, 1);
					},
					function (){
					});
			}
			catch(ex){
				C.showErr(ex);
			}
		},
		/*
		 * source:1代表下拉刷新，2：从菜单页面刷新
		 */
		loadData: function(categoryid, pageNum, source){
			try{
				var that = this,
					doc = document;
				if(that.isLoading) return;
				that.isrefresh = source == 1? true: false;
//				console.log('that.isrefresh:' + that.isrefresh + ':' + source)
				if(source == 2){
					pullUp.style.display = 'none'
					container.className = '';
					container.innerHTML = '<div class="index-loadding"><div></div><div></div></div>';
				}
				that.isLoading = true;
				if(!that.networkStatus){
					if(source == 1){//下拉刷新
						that.isLoading = false;
						that.hidePullToRefresh();
						that.alert('网络不给力')
						return;
					}
					that.loadCategoryByPageDB(categoryid, pageNum, 
						function(data){
							that.isLoading = false;
							if(data)
								that.showData(data, categoryid, pageNum, source);
							else{
								if(pageNum == 1){
									that.isShowingNoImg = true;
									doc.getElementById("container").innerHTML = '<div class="nonetworkimg"><img width="50%" src="app/img/refresh.png"/></div>';
								}
								else that.alert("网络不给力");
								that.closeSplash();
								return;
							}
						},
						function (){
							that.isLoading = false;
						});
						return;
				}
				var startTime = new Date().getTime();
				
				if(that.ajax) that.ajax.abort();
				that.ajax = that.loadCategoryByPageNetwork(categoryid, pageNum, function (data) {  //loadCategoryByPageDB,loadCategoryByPageNetwork
						try{
							that.hasError = false;
							var endTime = new Date().getTime();
							that.setItem(that.cacheKey.updateTime + categoryid, endTime);
							that.isLoading = false;
							if (data) {
								that.showData(data, categoryid, pageNum, source);
							}else{
								//that.alert("网络不给力2" + categoryid,'help',2000);
								that.closeSplash();
							}
						}
						catch(ex){
							C.showErr(ex);
						}
					}, 
					function(xhr, type){
						try{
							that.closeSplash();
							that.isLoading = false;
							if(type == "abort"){
								return;
							}
							else{
								that.alert("发生网络错误，请稍后重试:")
								if(pageNum == 1){
									that.isShowingNoImg = true;
									doc.getElementById("container").innerHTML = '<div class="nonetworkimg"><img width="50%" src="app/img/refresh.png"/></div>';
									return;
								}
								if(type == "timeout"){
									that.alert("网络不给力");
								}
							}
							that.hasError = true;
							that.loaddingPageNum = pageNum;
						}
						catch(ee){
							C.showErr(ee);
						}
					});
			}
			catch(ex){
				C.showErr(ex, 'loaddata');
			}
		}
    });

    window.page = new page();
    if(window.plus){
    	window.page.OnReady();
    	return;
    }
    document.addEventListener("plusready", function(){
		window.page.OnReady();
	});
})(csdn, csdn.basepage);
