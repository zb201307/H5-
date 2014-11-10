(function (C, B) {

    var page = function () { }

    C.extend(page.prototype, B, {
		/// <summary>
        /// 当前选中的菜单栏目
        /// </summary>
		selected: null,
        OnReady: function () {
			var that = this,
				doc = document;
			try{
				that._isIOS = that.isIOS();
				setTimeout(function(){
					var url = 'titleandlist-ios.html';
					if(that.isAndroid()) {
						url= 'title-android.html';
					}
					plus.webview.create( url, 'IndexWIN').show();
				}, 0);
				that.selected = doc.getElementById("news");

				that.on("click", doc);
			}
			catch(e){
				C.showErr(e);
			}
        },
		handleEvent: function(e){
			try{
				var t = e.target,
					id = t.id || t.parentNode.id,
					that = this,
					clickTime = that.clickTime,
					time = new Date().getTime();
				//600ms内不让连续点击
				if(clickTime && time - clickTime < 600) return;
				that.clickTime = time;
				var transfertime = that.getTransferTime();
				switch(id){
					case "dosearch":
					case "searcharticle":
						plus.webview.create("app/search.html", 'SearchWIN', {zindex:2}).show('slide-in-right',transfertime);
						break;
					case "news":
					case "industry":
					case "cloud":
					case "mobile":
					case "sd":
						if(that.changeMenu(id)) that.showIndexPage(id);
						break;
					case "favorite":
						plus.webview.create("app/favorite.html", 'FAVORITEWIN', {zindex:2}).show('slide-in-right',transfertime);
						break;
					case "settings":
						plus.webview.create("app/setting.html", 'SETWIN', {zindex:2}).show('slide-in-right',transfertime);
						break;
				}
			}
			catch(ex){
				C.showErr(ex);
			}
		},
		/// <summary>
        /// 显示列表页面
        /// </summary>
		showIndexPage: function(categoryid){
			plus.statistic.eventTrig(categoryid); 
			plus.webview.getWebviewById('IndexWIN').evalJS("page.showMenu(" + this.selected.getAttribute("num") + ",'" + categoryid + "');");
		},
		/// <summary>
        /// 切换菜单栏目,改变当前选择中的颜色
        /// </summary>
		/// <param name="id">category id</param>
		changeMenu: function(id){
			var that = this,
				selected = that.selected;
//			console.log(id)
			if(selected.id == id) return false;
			selected.parentNode.setAttribute("class", "");
			that.selected = document.getElementById(id);
			that.selected.parentNode.setAttribute("class", "clicked");
			return true;
		}
    });

    window.page = new page();
    //页面注册
    if(window.plus){
    	window.page.OnReady();
    	return;
    }
	document.addEventListener("plusready", function(){
		window.page.OnReady();
	});
})(csdn, csdn.basepage);
