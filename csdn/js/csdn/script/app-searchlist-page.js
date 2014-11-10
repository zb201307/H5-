(function (C, B) {
    var page = function () { }
    C.extend(page.prototype, B, {
		pageNum: 1,
        OnReady: function () {
			var that = this,
				doc = document;
			try{
				that.on("click", doc.getElementById('container'));
				that.on('plusscrollbottom', doc);
//				that.getSearchData('csn', 1)
			}
			catch(e){
				C.showErr(e, 'OnReady');
			}
        },
		handleEvent: function(e){
			try{
				var that = this,
					t = e.target;
				if(e.type == 'plusscrollbottom' && that.canpull){
					if(that.loadingTimer) clearTimeout(that.loadingTimer);
					that.loadingTimer = setTimeout(function(){
						that.getSearchData(that.txt, that.pageNum + 1);
					}, 200);
					
					return;
				};
				if(!t.getAttribute("articleid")) return;
				var articleid = t.getAttribute("articleid"),
                    remark = t.getAttribute("remark");
               if(!articleid && t.parentNode){
               		var parent = t.parentNode;
               		articleid = parent.getAttribute("articleid");
               		remark = parent.getAttribute("remark");
               }
                   
				if(articleid){
					that.setItem(that.cacheKey.articleId, articleid);
					var win = plus.webview.getWebviewById("ShowWin");
					win.evalJS("page.loadFile('"+ articleid +"', '"+ remark + "', true);");
					win.show();
					win.setStyle({left:"0", transition:{duration:that.getTransferTime()}});
				}
			}
			catch(ex){
				C.showErr(ex, 'handleEvent');
			}
		},
		getSearchData: function(txt, pageNum){
			var that = this;
			if(pageNum == 1){
				that.canpull = true;
				that.searchEnd = false;
				that.isLoading = false;
				that.txt = txt;
				that.waiting = plus.nativeUI.showWaiting('正在搜索，请稍候...');
			}
			if(that.isLoading || that.searchEnd) return;
			that.isLoading = true;
			if(that.xhr) that.xhr.abort()
			var xhr = that.xhr = new plus.net.XMLHttpRequest();
			var url = 'http://m.csdn.net/search_list.html?search_name=' + that.txt + '&page_size=20&page_start=' + 20 * (pageNum-1);
//			alert(url)
			xhr.onreadystatechange=function(){
				try{
				if(xhr.readyState == 4){
					that.waiting.close();
					that.isLoading = false;
					if ( xhr.status == 200 ) {
						var data = eval(xhr.responseText);
						if(data.length>0){
							document.getElementById('no-search').style.display = 'none';
							that.showSearch(data, pageNum);
						}else if(pageNum == 1){
							document.getElementById('no-search').style.display = 'block';
							pullUp.style.display = 'none';
							document.getElementById("container").innerHTML = ''
							that.alert("没有搜到任何东西哦！");
						}
						if(data.length < 20){
							that.searchEnd = true;
							pullUp.innerHTML = '没有更多的资讯了';
						}
					} else {
						that.alert("网络不给力");
					}
				}
				}
				catch(ex){
					C.showErr(ex, 'onreadystatechange')
				}
			};
			xhr.open( "GET", url);
			xhr.send();
		},
		showSearch: function(data, pageNum){
			try{
					var index = 0,
					len = data.length,
					doc = document,
					frage = doc.createDocumentFragment(),
					container = document.getElementById("container"),
					that = this;
                that.pageNum = pageNum;
				
				for(; index < len; index++){
					var d = data[index].object,
						div = doc.createElement("div"),
						h2 = doc.createElement("h2"),
						p = doc.createElement("p");
						//time = d.ptime.toDate("yyyy-MM-dd HH:mm").toString("MM-dd HH:mm");
					div.setAttribute("articleid", d.id);
					p.setAttribute("articleid", d.id);
					h2.setAttribute("articleid", d.id);
					
                    div.setAttribute("remark", d.comment_count);
					h2.innerHTML = d.short_title || d.title;
					p.setAttribute("class", "info");
					p.innerHTML = '<span class="icon clock"></span><span class="ptime">' + d.created_at + '</span><span>&nbsp;&nbsp;</span>';
					div.appendChild(h2);
					div.appendChild(p);
					frage.appendChild(div);
				}
				if(len < 20) that.canpull = false;
				if(pageNum == 1) {
					window.scrollTo(0,0)
					container.innerHTML = "";
//					topcontainer.style.margin = '-5px 0 0 -5px';
					container.appendChild(frage)
					pullUp.style.display = 'block';
					pullUp.innerHTML = '数据加载中，请稍候...';
				}else{
					container.appendChild(frage)
				}
				
			}
			catch(ex){
				C.showErr(ex, 'showSearch');
			}
		}
    });

    window.page = new page();
    if(window.plus){
    	window.page.OnReady();
    	return;
    }
    //页面注册
	document.addEventListener("plusready", function(){
		window.page.OnReady();
	});
    //$(function () { fpPage.OnReady(); });
})(csdn, csdn.basepage);
