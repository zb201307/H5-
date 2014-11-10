(function (C, B) {
	var page = function () {}
    C.extend(page.prototype, B, {
        OnReady: function () {
			var that = this,
				doc = document,
				cacheKey = that.cacheKey;
//				plus.statistic.eventTrig("remark");
			try{
				that.init(function(){
					that.loadFavorite();
				});
                that.androidMenu(function(){});
				that.androidBack(function(e){
					var startTime = that.clickTime,
						endTime = new Date().getTime();
					if(startTime && endTime - startTime < 600) {
						that.clickTime = endTime;
						return;
					}

					that.clickTime = endTime;
					that.back();
				});

				//绑定事件
				that.on("click", doc.getElementById("left_back"));
//				that.showFavorite([{id:'sd', title: '士大夫士大夫'}])
				//alert(JSON.stringify(plus.ui.getSelfWindow().getOption()));
				
			}
			catch(e){
				C.showErr(e);
			}
        },
		handleEvent: function(e){
			try{
				var that = this,
					t = e.target,
					tag = t.tagName,
					parent = t.parentNode,
					id = t.id;
				if((id || parent.id) == "left_back"){
					that.back();
					return true;
				}
			}
			catch(ex){
				this.showErr(ex);
			}
		},
		/**
		 * @作者：
		 * @时间：2013/04/10 10:55:21
		 * @描述： 获取所有收藏
		 */
		loadFavorite : function() {
			var that = this;
			that.db.transaction(function(tx) {
				tx.executeSql('select id, title, ptime, [count], remark from article_list where fav=1 order by ptime desc', [], function(tx, rs) {
					var list = [],
						len = rs.rows.length;
					for (var i=0; i < len; i++) {
						list.push(rs.rows.item(i));
					}
					tx.executeSql('select id, title, ptime, [count], remark from first_news where fav=1 order by ptime desc', [], function(tx, rs) {
						len = rs.rows.length;
						for (var i=0; i < len; i++) {
							list.push(rs.rows.item(i));
						}
						that.showFavorite(list);
					});
				});
			});
		},
		showFavorite: function(data){
			var index = 0,
				len = data.length,
				that = this,
				doc = document
				container = doc.getElementById("container"),
				scroll = that.scroll;
			if(len == 0){
				container.innerHTML = '<span class="nofavorite"><img width="127px" height="80px" src="../app/img/no-favorite.png"></span>';
				if(scroll){
					scroll.destroy();
					scroll = null;
				}
				return;
			}
			container.innerHTML = "";
			for(; index < len; index++){
				var d = data[index],
					div = doc.createElement("div"),
					h2 = doc.createElement("h2"),
					p = doc.createElement("p");
					//time = d.ptime.toDate("yyyy-MM-dd HH:mm").toString("MM-dd HH:mm");
				div.setAttribute("articleid", d.id);
                div.setAttribute("remark", d.remark);
				div.id = d.id;
				h2.innerHTML = d.title;
				p.setAttribute("class", "info");
				p.innerHTML = '<span class="icon clock"></span><span class="ptime">' + d.ptime + '</span><span>&nbsp;&nbsp;</span>';
				//p.innerHTML = '<span class="icon clock"></span><span class="ptime">' + d.ptime + '</span><span>&nbsp;&nbsp;</span><span class="icon eye"></span><span class="ptime">' + d.count + '</span>';
				div.appendChild(h2);
				div.appendChild(p);
				container.appendChild(div);
				div = null;
				d = null;
				h2 = null;
				p = null;
			}

			//that.on("click", container);
			if(scroll){
				scroll.refresh();
				scroll = null;
				return;
			}
			that.scroll = new iScroll("wrapper", {
				hScroll: false,
				hScrollbar: false,
				checkDOMChanges: false,
				onScrollMove: function(e){
					this.scrollMoved = true;
				},
				onTouchEnd: function(e){
					var _this = this;
					if(!_this.scrollMoved){
						var t = e.target,
							articleid = t.getAttribute("articleid") ||
							t.parentNode.getAttribute("articleid") ||
							t.parentNode.parentNode.getAttribute("articleid"),
                            remark = t.getAttribute("remark") ||
                            t.parentNode.getAttribute("remark") ||
                            t.parentNode.parentNode.getAttribute("remark");
						if(articleid){
							var time = that.getTransferTime();
							that.setItem(that.cacheKey.articleId, articleid);
							var win = plus.webview.getWebviewById("ShowWin");
							win.show('none', time);
							win.setStyle({left:"0", transition:{duration:time}});
							win.evalJS("page.loadFile('"+ articleid +"', '"+ remark + "');");
						}
						t = null;
					}
					
					_this.scrollMoved = false;
				}
			});
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
