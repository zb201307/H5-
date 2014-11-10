(function(csdn) {
	csdn.basepage = {
		DB_Name: 'csdn_local_db',
		DB_VERSION: '',
		jsonp_Server: 'http://csdnnewsappcomm.csdn.net/',
		mk_Server: 'http://csdnnewsapp.csdn.net/',
		timeout : 15000, //ajax请求的超时时间
		cacheKey : {
			WeixinType: 'CSDN_WeixinType',
			fontSize : "CSDN_FontSize",
			push : "CSDN_Push",
			noImage : "CSDN_NoImage",
			userName : "CSDN_USERNAME",
			password : "CSDN_password",
			articleId : "CSDN_articleId",
			articleUrl : "CSDN_articleUrl",
			articleTitle : "CSDN_articleTitle",
			shareType : "CSDN_sharetype", //qq或sina
			updateTime : "CSDN_updatetime", //列表第一页的更新时间
			tiro : "CSDN_tiro", //新手指导标志
			articleContent : "CSDN_articleContent",
			widgtPath:'CSDN_widgtPath',
			releaseNotes: 'CSDN_releasenotes'
		},
		getTransferTime: function(){
			var that = this;
			if(that._getTransferTime) return that._getTransferTime;
			if(that.isAndroid()) that._getTransferTime = 100
			else that._getTransferTime = 300;
			return that._getTransferTime
		},
		is2GOr3G : function() {
			if (!plus.networkinfo) {
				//alert("基座版本不对");
				return true;
			}
			var netinfo = plus.networkinfo,
				type = netinfo.getCurrentType();
			return type == netinfo.CONNECTION_CELL2G || type == netinfo.CONNECTION_CELL3G || type == netinfo.CONNECTION_CELL4G;
		},
		is2G : function() {
			if (!plus.networkinfo) {
				//alert("基座版本不对");
				return true;
			}
			var type = plus.networkinfo.getCurrentType();
			return type == plus.networkinfo.CONNECTION_CELL2G;
		},
		hasNetwork : function() {
			if (!plus.networkinfo) {
				//alert("基座版本不对");
				return true;
			};
			
			var netinfo = plus.networkinfo,
				type = netinfo.getCurrentType();
			return type == netinfo.CONNECTION_ETHERNET || type == netinfo.CONNECTION_WIFI || type == netinfo.CONNECTION_CELL2G || type == netinfo.CONNECTION_CELL3G || type == netinfo.CONNECTION_CELL4G;
		},
		customerFontSize : {
			"大" : "1.5em",
			"中" : "1.3em",
			"小" : "1.15em"
		},
		getFontSize : function() {
			var fontsize = this.getItem(this.cacheKey.fontSize)|| {text : "中",	value : "1.3em"};
			return fontsize;
		},
		setFontSize : function(value) {
			this.setItem(this.cacheKey.fontSize, value);
		},
		loadCategoryByPageNetwork : function(category, pagenum, onSuccess, onError, checkFunc) {
			//var _pageNum = category == "news" ? (pagenum - 1) % 4 + 1 : pagenum;
			//最新资讯一次回来40条数据
			var time = new Date().getTime(),
				that = this;
				
			return csdn.ajax({
				type : 'GET',
				timeout : that.timeout,
				url : that.jsonp_Server + 'all_list/' + category + 'list_' +  (category == 'news' ? 1: 2) +  '0_' + pagenum + '.json',
				// type of data we are expecting in return:
				dataType : 'jsonp',
				success : function(data) {
					window.time1 = new Date().getTime()
					if(!data.list) onError(null, 'timeout');
					var isAndroid = that.isAndroid(), list = data.list, len = list.length, counter = 0;
					that.db.transaction(function(tx) {
						var firstnews = data.firstnews;
						if(firstnews){
							tx.executeSql('INSERT OR REPLACE into first_news values(?,?,?,?,?,?,?,?,?,?,?)', [firstnews.id,firstnews.title,firstnews.img,firstnews.ptime,firstnews.category,firstnews.href,firstnews.count,firstnews.remark,firstnews.fav,firstnews.readflag,firstnews.androidimg]);
						}
						for (var index = 0; index < len; index++) {
							that._saveNewToDb(tx, list[index], isAndroid, function(result) {
								counter++;
								if (counter == len) that.loadCategoryByPageDB(category, pagenum, onSuccess, onError);
							});
						}
					});
				},
				error : function(xhr, type, s2) {
					if(type == 'abort') return;
					if (onError)
						onError(xhr, type);
					else
						that.alert("发生网络错误，请稍后重试");
				}
			});
		},
		_saveNewToDb: function(transition, data, isAndroid, onSuccess) {
			transition.executeSql('select count(id) as num from article_list where id = ?', [data.id], function(tr, result) {
				if (result.rows.item(0).num != 0) {//已存在记录，更新count和remark
					transition.executeSql('update article_list set remark=?,[count]=? where id = ?', [data.remark, parseInt(data.count, 10), data.id], function(tr, result) {
						onSuccess(result);
					});
				} else {
					//data.ptime = datenow_from_csdn_network(data.ptime);
					//if(isAndroid) data.img = data.Androidimg;
					transition.executeSql('INSERT into article_list values(?,?,?,?,?,?,?,?,0,0,?)', [data.id, data.title, data.Androidimg, data.ptime, data.category, data.href, parseInt(data.count, 10), data.remark, data.Androidimg], function(tx, result) {
						onSuccess(result);
					});
				}
			});
		},
		/**
		从本地数据库加载数据
		*/
		loadCategoryByPageDB : function(category, pagenum, onSuccess, onError) {
			var that = this,
				db = that.db;
			db.readTransaction(function(tr){
				var pagestart = 20 * (pagenum - 1), 
					pageEnd = pagestart + 20,
					latssql = "",
					sql;
				if (category == "news") {
					sql = "SELECT * FROM article_list  ORDER BY ptime DESC LIMIT " + pagestart + ", 20";
				}
				else {
					sql = "select * from article_list where category = '" + category + "' " + latssql + " order by ptime desc limit " + pagestart + ", 20"
				}
				tr.executeSql(sql, [], function(tx,rs){
					var list = [],
						rows = rs.rows,
						len = rows.length;
					if(len == 0){
						onSuccess();
						return;
					}
					for (var i = 0; i < len; i++){
						var item = rows.item(i);
						list.push({
							id: item.id,
							title: item.title,
							img: item.img,
							ptime: item.ptime,
							category: item.category,
							href: item.href,
							count: item.count,
							remark: item.remark,
							fav: item.fav,
							readflag: item.readflag,
							Androidimg: item.androidimg
						});
					}
					if (category == "news" && pagenum == 1) {
						tx.executeSql('Select * From first_news order by ptime desc Limit 1', [], function(tx, rs){
                            if (rs.rows.length > 0) {
                                var item = rs.rows.item(0),
									firstnews = {
										id:item.id,
										title:item.title,
										img:item.img,
										ptime:item.ptime,
										count:item.count,
										remark:item.remark,
										author:item.author,
										href:item.href
									}
							}
							onSuccess({list:list, firstnews: firstnews});
                        })
					}
					else{
//						console.log(new Date().getTime() - window.time1) 
						onSuccess({list:list});
						
					}
					window.time1 = null
				});
			});
		},
		init : function(callback) {
			var that = this;
			that.db = openDatabase(that.DB_Name + '_' + that.DB_VERSION, '', 'csdn offline database', 5 * 1024 * 1024);
			that.db.transaction(function(tx) {
				tx.executeSql('create table if not exists article_list (id num PRIMARY KEY,title text, img text, ptime datetime, category text, href text, count num, remark num, fav num, readflag bit, androidimg text)', []);
				tx.executeSql('create table if not exists first_news (id num PRIMARY KEY,title text, img text, ptime datetime , category text, href text, count num, remark num, fav num, readflag bit, androidimg text)', []);
			});
			if(callback) callback();
		},
		insertArticle : function(data, onSuccess) {
			this.db.transaction(function(tx) {
				tx.executeSql('select count(id) as num from article_list where id = ?', [data.id], function(tr, result) {
					if (result.rows.item(0).num == 0) {
						tx.executeSql('INSERT into article_list values(?,?,?,?,?,?,?,?,0,1,?)', [data.id, data.title, data.img, data.ptime, data.category, data.href, parseInt(data.count, 10), data.remark, data.Androidimg], function(tx, result) {
							if (onSuccess) onSuccess(result)
						});
					}
					else onSuccess(result)
				});
			});
		},

		on : function(type, el, bubble) {
			try{
			el.addEventListener(type, this, !!bubble);
			}
			catch(e){
				csdn.showErr(e, 'on')
			}
		},
		off : function(type, el, bubble) {
			try{
			el.removeEventListener(type, this, !!bubble);
			}
			catch(e){
				csdn.showErr(e, 'off')
			}
		},
		isIOS : function() {
			return navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i);
		},
		isAndroid : function(t) {
			return navigator.userAgent.match(/Android/i);
		},
		androidBack : function(callback) {
			if (this.isAndroid()) {
				plus.key.addEventListener('backbutton', callback);
			}
		},
		androidMenu : function(callback) {
			if (this.isAndroid()) {
				plus.key.addEventListener('menubutton', callback);
			}
		},
		/// <summary>
		///保存文件
		/// {path:文件路径, data:要保存的文件内容, success:成功回调, error：失败回调}
		/// </summary>
		saveFile : function(options) {
			var that = this;
			that.fileSystemAPI.root.getFile(options.path, { 	
				create : true
			}, function(fileEntry) {
				//保存到临时目录
				fileEntry.createWriter(function(fileWirte) {
					fileWirte.write(JSON.stringify(options.data));
					//这个时候不存文件
					if (options.success)
						options.success();
				}, null);
			}, function(err) {
				//alert("err:" + err.code)
				if (options.error)
					options.error(err);
			});
		},
		saveArticle : function(data, articleid) {
			var that = this, path = "all_list/" + (articleid || data.id) + ".json";
			if (that.fileSystemAPI)
				that.saveFile({
					path : path,
					data : data
				});
			else
				plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
					that.fileSystemAPI = fs;
					that.saveFile({
						path : path,
						data : data
					});
				});
		},
		/// <summary>
		///保存文件
		/// {srcImg:源文件路径, dstImg:要保存的文件路径, success:成功回调, error：失败回调}
		/// </summary>
		downLoadFile : function(options) {
			var that = this;
			if (!that.fileSystemAPI)
				plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
					that.fileSystemAPI = fs;
					that._downLoadFile(options);
				});
			else
				that._downLoadFile(options);
		},
		_downLoadFile : function(options) {
			var that = this, path = options.folderPath + options.dstFile, index = path.indexOf('?');
			if (index > 0)
				path = path.substring(0, index);
			that.fileSystemAPI.root.getFile(path, {
				create : false
			}, function(fileEntry) {
				if (options.success)
					options.success(options, true, fileEntry);
			}, function(err) {
				if (options.onNotFund) {
					options.onNotFund(options);
					return;
				}
				plus.downloader.createDownload(options.srcFile, {
					filename : options.downloadFolerPath,
					timeout : 120
				}, function(d, status) {
					if (status == 200) {
						d.abort();
						if (options.success)
							options.success(options, false, d);
					} else {
						if (options.error)
							options.error(options, status, d);
					}
				}).start();
			});
		},
		back: function() {
	        var currentPage = plus.webview.currentWebview();
	        currentPage.close('slide-out-right',this.getTransferTime());
		},
		updateDB: function(){
			db.transaction(function(tx) {
				tx.executeSql('update article_list set Androidimg = img, readflag = 0', []);
			});
		},
		setItem:function (key, value) {
	        plus.storage.setItem(key, JSON.stringify(value));
	   	},
	    getItem :function (key, noConverted) {
			try{
				var d = plus.storage.getItem(key);
				if (!d ||noConverted ) return d;
				return JSON.parse(d);
			}
			catch(ex){
				alert(key+':'+ex.message);
				
			}
	        //return JSON.parse(that.getItem(key))
	    },
	    remove:function(key){
	    	plus.storage.removeItem(key);
	    },
	    alert: function(message, delay, position){
	    	position = position||'bottom';
	    	delay = delay || 2;
	    	if(this.isAndroid()) {
	    		plus.nativeUI.toast(message, {duration:delay, verticalAlign: position});
	    		return;
	    	}
	    	var that = this,
				doc = document
				dalert = doc.getElementById('_dialog_alert');
			if(!dalert){
				dalert = doc.createElement('div');
				dalert.className = 'notification';
				dalert.id = '_dialog_alert';
				dalert.innerHTML = "<div class='window confirm growl show'><strong class='text bold' id='_dialog_message'></strong><small></small></div>";
				doc.body.appendChild(dalert);
			}
	    	delay = delay * 1000;
			if(that._csdn_timer){
				clearTimeout(that._csdn_timer);
				//$('#_dialog_alert').remove();
			}
			doc.getElementById("_dialog_message").innerHTML = message;
			if(position == 'bottom'){
				dalert.style.top = 'auto'
			}else if(position == 'top'){
				dalert.style.top = '10px'
			}else{//center
				dalert.style.top = '50%'
			}
			dalert.style.display = "block";
			dalert = null;
	        that._csdn_timer = setTimeout(function () {
	            //$('#_dialog_alert').hide();
	            doc.getElementById('_dialog_alert').style.display = 'none';
	        }, delay);
	    },
	    closeSplash: function(){
	    	if(this.hasClosesplash) return;
			this.hasClosesplash = true;
			plus.navigator.closeSplashscreen();
		}
	}
})(window.csdn); 