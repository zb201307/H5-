(function(C, B) {
	var page = function() {}
	C.extend(page.prototype, B, {
		isFavorite : false,
		articleId : null,
		articelHref : null,
		articleTitle : null,
		isShowingBar : false,
		/**
		在android系统下，关闭详情页的瞬间。避免右滑动可以打开写评论页面
		*/
		openpage : true ,
		hasDownloadFile : false,
		canShowFile: false,//解决在上一篇资讯加载的过程中返回到列表界面，然后再进入一篇新的资讯详情界面时，会先看到上一篇的详情
		OnReady : function() {
			var that = this , doc = document ;
			that.time_tj = new Date().getTime();
			try {
				if(that.hasReady) return;
				that.zIndex = plus.webview.currentWebview().getStyle()['zindex'] + 1;
				that.init();
				that.on("resume", doc);
				that.on("pause", doc);
				that.on("netchange", doc);
//				that.on('plusscrollbottom', doc);
//				that.on('resize', doc);

                that.androidMenu(function(){
					if (that.isShowingBar) {
						that.hideBar();
					}
					else{
						that.showBar();
					}
				});
				that.androidBack(function(e) {
					try {
						var startTime = that.clickTime, endTime = new Date().getTime();

						if (that.resumeTime && endTime - that.resumeTime < 200)
							return;

						if (that.isAnimating)
							return;
						if (that.isShowingBar) {
							that.hideBar();
							//return;
						}
						if (startTime && endTime - startTime < 300) {
							that.clickTime = endTime;
							return;
						}

						that.clickTime = endTime;
						that.goBack();
					} catch(ex) {
						C.showErr(ex);
					}
				});
				
				that.toolbar = document.getElementById("toolbar");
				that.sharetb = document.getElementById("sharetb");

				that.slider = new C.slider(window, {
					onMove:function(){
						that.hideBar(true);
						//that.toolbar.style.display = "none";
						//that.sharetb.style.display = "none";
					},
					onLeft: function(){
						that.goBack();
					},
					onRight: function(){
						if (!that.openpage) {
							return;
						};
						that.showRemark();
					},
					onEnd: function(){
						that.checkLazyLoad(window.pageYOffset);
						//that.toolbar.style.display = "block";
						//that.sharetb.style.display = "block";
						//that.hideBar(true);
					},
					onScroll: function(e){
						if(that.checkTimer) clearTimeout(that.checkTimer);
						that.checkTimer = setTimeout(function(){
							that.checkLazyLoad(window.pageYOffset);
							/*if(window.pageYOffset + window.innerHeight > that.scrollheight){
								that.scrollheight = document.body.scrollHeight;
							}*/
//							if(window.pageYOffset + that.winHeight + 10 >= that.scrollheight){
//								setTimeout(function(){
//									that.showBar();
//								},20)
//								
//							}
						}, 100);
						
					},
					onStatic: function(e){
						that.onstatic(e);
						return;
//						if(e.target.tagName.toLowerCase() == 'html'){
//							that.onstatic2(e);//三星手机特殊处理
////							that.staticTimer = setTimeout(function(){
////								that.onstatic();
////							},500)
//						}
//						else that.onstatic();
					},
					canStart: function(e){
//						return true;
						var t = e.target,
							id = t.id || t.parentNode.id;
						if(id == 'back' || id == 'remark' || id == 'star' || id == 'share') return false;
						else return true;
					}
				});
				that.hasReady = true;
				//document.getElementById("toolbar").style.bottom = "-6000px";
				//that.fromSearch = true;
				//that.canShowFile = true;
				//that.showFile("");
				//that.showNoFile();
			} catch(ex) {
				C.showErr(ex, 'showpage.onready');
			}
		},
		onstatic2: function(e){
//			console.log('onstatic2 touches:' +JSON.stringify(e.touches))
//			console.log('onstatic2 targetTouches:' +JSON.stringify(e.targetTouches))
//			for(var i in e){
//				console.log('onstatic2:' + i + ':' + e[i])
//			}
		},
		onstatic: function(e){
			try{
			var that = this;
			if (that.isShowingBar) {
				that.hideBar();
				//return;
			}
			else{
				that.showBar();
			}
			}
			catch(ex){
				C.showErr(ex, 'onstatic')
			}
		},
		handleEvent : function(e) {
			try {
				var that = this,
                    doc = document;
				switch(e.type) {
//					case 'plusscrollbottom':
//						console.log('plusscrollbottom')
//						that.showBar();
//						return;
					case "resume":
						that.onResume();
						return;
					case "pause":
						that.onPause();
						return;
					case "netchange":
						that.onNetChange();
						return;
					case 'resize':
						var height = document.body.scrollHeight;
						if(height != that.scrollheight){
							that.scrollheight = height;
						}
						//window.scrollTo(0, window.pageYOffset + 10);
						//that.hideBar();
						break;
				}
				var t = e.target, 
					tag = t.tagName,
					id = t.id || t.parentNode.id, 
					doc = document;
//					console.log('show: ' + id);
				switch(id) {
					case "back":
						that.goBack();
						return true;
					case "remark":
						if(that.noFile) return;
						that.showRemark();
						return true;
					case "share":
						if(that.staticTimer) {
							clearTimeout(that.staticTimer);
							that.staticTimer = null;
						}
						if(that.noFile) return;
						var shareweb = plus.webview.create("/app/share.html", 'share', {zindex: that.zIndex});
						shareweb.addEventListener("loaded",function(){
							shareweb.show('slide-in-right',that.getTransferTime());
						},false);
						return true;
					case "star":
						if(that.staticTimer) {
							clearTimeout(that.staticTimer);
							that.staticTimer = null;
						}
						if(that.noFile) return;
						if (that.isFavorite) {
							doc.querySelector("#star span").style.color = "#f1f1f1";
							that.setFavorite(that.articleId, 0, function(tx, rs) {
								//that.alert("取消收藏", "error0");
								that.isFavorite = false;
								//需要赋值
								that.reloadFavorite();
							});
						} else {
							doc.querySelector("#star span").style.color = "#FFC926";
							if(that.data){
								that.insertArticle(that.data, function() {
                                    that.data = null;
									that.setFavorite(that.articleId, 1, function(tx, rs) {
										//that.alert("收藏成功", "ok");
										plus.statistic.eventTrig("favorites");
										that.isFavorite = true;
										//需要赋值
										that.reloadFavorite();
									});
								});
							}
							else{
								that.setFavorite(that.articleId, 1, function(tx, rs) {
										//that.alert("收藏成功", "ok");
										plus.statistic.eventTrig("favorites");
										that.isFavorite = true;
										//需要赋值
										that.reloadFavorite();
								});
							}
						}
						//that.hideBar();
						return true;
					case "check_feedback":
						that.alert("您的意见我们已保存，感谢您参与CSDN互动");
						document.getElementById("feedback").style.display = "none";
						return true;
					case "left_feedback":
						document.getElementById("feedback").style.display = "none";
						return true;
					case "loadingcontent":
						var loadingcontent = doc.getElementById("loadingcontent");
						that.off("click", loadingcontent);
						loadingcontent.innerHTML = "<div></div>";
						that.getFile();
						return true;
				}

				return false;
			} catch(ex) {
				C.showErr(ex, 'handleEvent.' + e.type + '.' + e.target.id);
			}
		},
		
		reloadFavorite : function() {
			var win = plus.webview.getWebviewById("FAVORITEWIN");
			if(win) win.evalJS("page.loadFavorite();");
		},
		/// <summary>
		/// 程序从后台恢复到前台事件
		/// </summary>
		onResume : function() {
			var that = this;
			that.resumeTime = new Date().getTime();
			that.isPause = false;
			if (that.isLoading && that.hasError)
				that.loadFile();
		},
		/// <summary>
		/// 程序从前台恢复到后台事件
		/// </summary>
		onPause : function() {
			var that = this;
			that.isPause = true;
			//plus.console.log("onPause");
		},
		/// <summary>
		/// 网络状态改变
		/// </summary>
		onNetChange : function() {
			//var that = this;
			//that.isNetChange = true;
			var that = this;
			if (!that.isLoading || !that.hasError)
				return;
			if (that.hasNetwork())
				that.loadFile();
			else
				that.alert("网络不给力");
		},
		showRemark : function() {
			plus.webview.create("/app/remark.html", 'RemarkWIN', {zindex: this.zIndex}).show('slide-in-right',this.getTransferTime());
		},
		
		showFile : function(data) {
			try {
				//var data = {"count":"0","remark":"0","tag":"","next":"","img":"","url":"http://www.csdn.net/article/2013-05-13/2815251","prev":"","id":"2815251","author":"叶子","category":"sd","title":"优秀HTML5网站学习范例：饥饿游戏浏览器/从饥饿游戏2谈用户体验","source":"社区供稿","notfind":false,"ptime":"2013-05-13 15:00","notModified":false,"body":"<div class=\"con news_content\"> <p>继影片《饥饿游戏》获得票房成功后</p> </div>"};
                var that = this,
                    doc = document,
                    content = doc.getElementById("content"),
                    p = doc.querySelector("#container>p"),
                    cacheKey = that.cacheKey,
                    articleId = that.articleId,
                    modified = false;
                that.showBar();
//              console.log('test:' + JSON.stringify(data))
				if(data.notfind) {//文件未找到
					that.showNoFile();
					//that.showBar();
					return;
				}
  				if(!that.canShowFile || data.id != that.articleId) return;
                that.noImage = that.getItem(that.cacheKey.noImage);
				that.isFavorite = false;
				
				that.noFile = false;
				//doc.getElementById("wrapper").style.height = window.innerHeight + "px";
				that.isLoading = false;
				that.hasError = false;
				
				content.style.fontSize = that.getFontSize().value;
				//分享页面用到title和href
				//that.setItem(cacheKey.articleUrl, data.url);
				//that.setItem(cacheKey.articleTitle, data.title);
				that.setItem(cacheKey.articleUrl, data.url);
				that.setItem(cacheKey.articleTitle, data.title);
				that.articelHref = data.url;
				that.articleTitle = data.title;
				doc.getElementById("title").innerHTML = data.title;
				doc.getElementById("ptime").innerHTML = data.ptime;
//				doc.getElementById("remark0").innerHTML = that.remark; //data.remark;
			
				
				content.innerHTML = data.body;
				doc.getElementById("author").innerHTML = data.author;
				doc.getElementById("loadingcontent").style.opacity= "0";
				doc.getElementById("wrapper").style.opacity = "1";


				if (that.fromSearch) {
					that.data = {
						id : data.id,
						title : data.title,
						img : data.img,
						ptime : data.ptime,
						category : data.category,
						href : data.url,
						count : data.count,
						remark : data.remark,
						Androidimg : data.Androidimg || ""
					};
				}else{
                    that.data = null;
                }
				that.readArticle(articleId);
				that.checkisfav(articleId, function(fav) {
					that.isFavorite = fav;
					doc.querySelector("#star span").style.color = fav ? "#FFC926" : "#f1f1f1";
				});
				if (!data.notModified) {
					var imgs = doc.querySelectorAll("#container img"), len = imgs.length, index = 0;
					for (; index < len; index++) {
						var img = imgs[index], src = img.src;
                        if(that.noImage){
                            img.style.display = "none";
                            continue;
                        }
						if (src == "" || src.indexOf("localhost") > 0 || src.indexOf('base64') >= 0) {
							if (!src)
								img.style.display = "none";
							img = null;
							continue;
						}
						if (img.parentNode.tagName != "P" && img.parentNode.parentNode.tagName != "P") {
							img.style.display = "none";
							that.hasDownloadFile = true;
							img = null;
							continue;
						}
                        var parent = img.parentNode;
                        parent.style.cssText = "text-align: center;display:block";
                        var next = img.nextSibling;
                        if(next && next.nodeType == 3){//下一个节点是text文本
                            var span = doc.createElement("div");
                            span.innerHTML = next.nodeValue;
                            parent.removeChild(next);
                            parent.appendChild(span);
                            span = null;
                            next = null;
                        }
                        parent = null;
						//图片居中
						img.src = "../app/img/ios-default.png";
						img.setAttribute("lazyload", src);
						img.setAttribute("imgname", src.substring(src.lastIndexOf('/') + 1));
                        modified = true;
						img = null;
					}
					imgs = null;
				}
				var _data = {};
				for (i in data) {
					if (i != 'body')
						_data[i] = data[i];
				}
				_data.notModified = !modified;
				that.setItem(cacheKey.articleContent, _data);
				_data = null;
				that.checkLazyLoad(0);
				that.slider.enable();
				that.winHeight = window.innerHeight;
//				that.scrollheight = document.body.scrollHeight;
				//doc.getElementById("sharetb").style.bottom = -that.scrollheight+"px";
				
			} catch(ex) {
				C.showErr(ex, 'showfile');
			}
		},
		/**
		 * @作者：
		 * @时间：2013/04/10 11:01:55
		 * @param articileid2:
		 * @param status:0，移除收藏；1，添加收藏
		 * @param  onSuccess:成功回调
		 * @描述：移除收藏
		 */
		setFavorite : function(articileid, status, onSuccess) {
			this.db.transaction(function(tx) {
				tx.executeSql('UPDATE article_list SET fav = ? WHERE id = ?', [status, articileid], function(tr, rs){
					if(rs.rowsAffected == 0) tx.executeSql('UPDATE first_news SET fav = ? WHERE id = ?', [status, articileid]);
					onSuccess(tr, rs)
				});
			});
		},
		readArticle : function(articleid) {
			this.db.transaction(function(tx) {
				tx.executeSql('update article_list set readflag=1 where id = ?', [articleid]);
			});
		},
		/**
		 * @作者：
		 * @时间：2013/04/10 11:17:08
		 * @param articileid2:
		 * @param  onSuccess:
		 * @描述：检查指定文章是否已经收藏
		 */
		checkisfav : function(articileid, onSuccess) {
			this.db.transaction(function(tx) {
				tx.executeSql('select id from article_list where id = ? and fav=1', [articileid], function(tx, rs) {
					if (rs.rows.length == 1) {
						onSuccess(true);
						return;
					};
					tx.executeSql('select id from first_news where id = ? and fav=1', [articileid], function(tx, rs) {
						onSuccess(rs.rows.length == 1);
					});
				});
			});
		},
		checkLazyLoad : function(top) {
			//alert("checkLazyLoad");
			var that = this;
			if (that.lazyTimeout)
				clearTimeout(that.lazyTimeout);
			that.lazyTimeout = setTimeout(function() {
				try {
					var doc = document, 
						lazyObjs = doc.querySelectorAll("#container img[lazyload]"), 
						len = lazyObjs.length, 
						index = 0, 
						winheight = that.winHeight;
					if (len <= 0)
						return;
					for (; index < len; index++) {
						var obj = lazyObjs[index], _top = obj.offsetTop - top;
						//alert(_top + ":" + winheight + ":" + top);
						if (_top > 0 && _top < winheight) {
							var srcImg = obj.getAttribute("lazyload");
							obj.removeAttribute("lazyload");
							obj.src = srcImg;
							//plus.console.log("srcImg:" + srcImg);
//							that.downLoadFile({
//								srcFile : srcImg,
//								dstFile : srcImg.substring(srcImg.lastIndexOf('/') + 1),
//								folderPath : "img/",
//								downloadFolerPath : "_doc/img/",
//								success : function(op, isExist) {
//									that.hasDownloadFile = true;
//									var _img = doc.querySelector("#container img[imgname='" + op.dstFile + "']");
//									if (_img) {
//										_img.src = "http://localhost:13131/_doc/img/" + op.dstFile;
//										//that.pageHeight = doc.getElementById('wrapper').offsetHeight;
//										_img = null;
//									}
//								},
//								error1 : function(type) {
//									//alert("downLoadFile fail :" + type + "," + srcImg);
//								}
//							});
						}
						obj = null;
					}
					lazyObjs = null;
				} catch(ex) {
					C.showErr(ex, 'checkLazyLoad');
				}
			}, 600);
		},
		showNoFile: function(){
			try{
//				console.log('showNoFile')
				var _container = document.getElementById("loadingcontent");
				_container.innerHTML = '<span class="fileerror"></span>';
				this.on("click", _container);
				this.noFile = true;
	            this.showBar();
				_container = null;
				this.slider.disable();
			}catch(e){
				C.showErr(e, 'showNoFile')
			}
			
		},
		getFile : function() {
			try {
				var that = this;
				that.downLoadFile({
					folderPath : "all_list/",
					dstFile : that.articleId + ".json",
					onNotFund : function(op) {
//						console.log(that.jsonp_Server + 'all_list/Detail/' + that.articleId + ".json")
						C.ajax({
							type : 'GET',
							url : that.jsonp_Server + 'all_list/Detail/' + that.articleId + ".json",
							timeout : that.timeout,
							dataType : 'jsonp',
							success : function(data) {
//								console.log(JSON.stringify(data))
								that.showFile(data);
								that.saveArticle(data, that.articleId);
							},
							error : function(xhr, type) {
//								console.log(JSON.stringify(type));
								that.showNoFile();
							}
						});
					},
					success : function(op, isExist, fileEntry) {
//						alert("success:" + isExist);
						fileEntry.file(function(file) {
							var fileReader = new plus.io.FileReader();
							fileReader.readAsText(file, 'utf-8');
							fileReader.onloadend = function(evt) {
								that.showFile(JSON.parse(evt.target.result));
							};
							fileReader = null;
						});
					}
				});
			} catch(ex) {
				C.showErr(ex, 'getFile');
			}
		},
		/**
		 * @作者：
		 * @时间：2013/04/10 16:57:46
		 * @param articleId:文章id
		 * @param  isFromSearch:是否来自搜索页面，如果来自搜索页面需要将该篇文章添加到缓存数据库
		 * @描述： 获取详情内容
		 */
		loadFile : function(articleId, remark,isFromSearch) {
			try {
			//alert(articleId);
				var that = this;
				if(!that.hasReady) that.OnReady()
				that.canShowFile = true;
				window.scroll(0, 0);
				that.fromSearch = isFromSearch;
				that.articleId = articleId;
                that.remark = remark,
				that.openpage = true;
				if (that.fileSystemAPI) {
					that.getFile();
				} else {
					plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
						that.fileSystemAPI = fs;
						that.getFile();
					});
				}
			} catch (ex) {
				C.showErr(ex, 'loadfile');
			}

		},
		
		showBar : function() {
			var that = this, doc = document;
			try{
			if (that.isShowingBar)
				return;
			that.isShowingBar = true;
			that.toolbar.style.display = 'block';
			setTimeout(function(){
				that.toolbar.style.bottom = '0';
				that.toolbar.style.display = 'block';
			}, 15);
			
			that.on("click", doc.getElementById("back"));
			that.on("click", doc.getElementById("remark"));
			that.on("click", doc.getElementById("share"));
			that.on("click", doc.getElementById("star"));
			}
			catch(e){
				C.showErr(e, 'showbar.' + that.toolbar)
			}
		},
		hideBar : function(notUseTimer) {
			var that = this, doc = document;
			if (!that.isShowingBar)
				return;
			that.isShowingBar = false;
			
			if(notUseTimer){
				that.toolbar.style.display = 'none';
				that.toolbar.style.bottom = '-60px';
			}
			else{
				that.toolbar.style.bottom = '-60px';
				setTimeout(function(){
					that.toolbar.style.display = 'none';
				}, 180);
			}
			doc.getElementById("toolbar").style.bottom = '-60px';//-that.scrollheight+"px";
			that.off("click", doc.getElementById("back"));
			that.off("click", doc.getElementById("remark"));
			that.off("click", doc.getElementById("share"));
			that.off("click", doc.getElementById("star"));
		},
		saveModifyFile : function() {
			var that = this;
			try {
				if (!that.hasDownloadFile)
					return;
				var data = that.getItem(that.cacheKey.articleContent);
				data.body = document.getElementById("content").innerHTML;
				that.saveArticle(data);
				that.hasDownloadFile = false;
			} catch(ex) {
				C.showErr(ex);
			}
		},
		goBack : function() {
			try{
//				plus.statistic.eventDuration("show", new Date().getTime()-this.time_tj);
				var webview = plus.webview, currentPage = webview.currentWebview(), doc = document, that = this;
				that.openpage = false;
				currentPage.setStyle({left : '100%', transition:{duration:that.getTransferTime()}});
//				setTimeout(function(){currentPage.setVisible(false);},300);
				that.saveModifyFile();
				that.canShowFile = false;
				that.slider.disable();
				setTimeout(function(){
				try{
					currentPage.hide();
					doc.getElementById("loadingcontent").style.opacity = "1";
					doc.getElementById("wrapper").style.opacity = "0";
					//以下解决进详情页显示上一次文章内容的问题
					doc.getElementById("title").innerHTML = "";
					doc.getElementById("ptime").innerHTML = "";
//						doc.getElementById("remark0").innerHTML = "";
					doc.getElementById("content").innerHTML = "";
					doc.getElementById("author").innerHTML = "";
					//currentPage.setVisible(false);
					
					if (that.isShowingBar)
						that.hideBar();
					//document.getElementById("toolbar").style.bottom = "-6000px";
					if(that.noFile) doc.getElementById("loadingcontent").innerHTML = "<div></div>";
				}
				catch(ex){
					C.showErr(ex)
				}
				}, that.getTransferTime());
			}
			catch(ex){
				C.showErr(ex, 'goBack');
			}
		}
	});

	window.page = new page();
    if(window.plus){
    	window.page.OnReady();
    	return;
    }
//	document.addEventListener("plusready", function(){
//		window.page.OnReady();
//	});
})(csdn, csdn.basepage);
