(function (C, B) {
    var page = function () {}
    C.extend(page.prototype, B, {
		/// <summary>
        /// 菜单窗口是否在显示
        /// </summary>
		isShowingMenu: false,
		/// <summary>
        /// 当前窗口是否处于动画之中
        /// </summary>
		isAnimating: false,
        OnReady: function () {
        	
			var that = this,
				doc = document,
				webview = plus.webview;
			try{
				if (that.is2G()) {
					that.noImage = true;
					that.setItem(that.cacheKey.noImage,that.noImage);
				}else{
					that.noImage = that.getItem(that.cacheKey.noImage)
				}
				if(that.noImage){
            		imgflag.children[0].className = "icon A0";
				}
				var list = that.list = plus.webview.create("list-android.html","listWin",{top:"50px",bottom:"0px"});
				webview.currentWebview().append(list);
				list.addEventListener("loaded",function(){
					webview.currentWebview().show();
				},false);
				list.setBounce({position:{top:"50%"},changeoffset:{top:"48px"}});
				list.addEventListener("dragBounce",function(e){
//					console.log(e.status)
					switch(e.status){
						case "beforeChangeOffset"://下拉可刷新状态
							pullDownLabel.innerHTML="下拉可以刷新...";
							pullimg.className = 'touch';
						break;
						case "afterChangeOffset"://松开可刷新状态
							pullimg.className = 'pull';
							pullDownLabel.innerHTML="松开即可刷新...";
						break;
						case "dragEndAfterChangeOffset"://正在刷新状态
							pullDownLabel.innerHTML="正在加载资讯...";
							pullimg.className = 'refresh';
							pullimg.src = 'app/img/pull-refresh.png'
							that.list.evalJS("page.loadData(page.categoryId, 1, 1)");
						break;
					}
				},false);

				that.androidMenu(function(){
					if(that.installing) return;
					that.showMenu();
				});
				that.on('touchstart', document);
				that.androidBack(function(e){
					try{
						if(that.installing) return;
						if(that.isShowingMenu) {
							that.showMenu();
							return;
						}
						var startTime = that.clickTime,
							endTime = new Date().getTime();
						if(that.resumeTime && endTime - that.resumeTime < 200) return;
						if(that.showingConfirm) {
							plus.runtime.quit();
							that.showingConfirm = false;
							return;
						}
						//退出策略，500ms内，连续按返回键，直接退出，否则提示退出
						
						if(startTime && endTime - startTime < 500) {
							plus.runtime.quit();
							that.clickTime = null;
							return;
						}
						that.setItem(that.cacheKey.noImage, that.noImage);
						that.showingConfirm = true;
						that.list.evalJS('page.alert("再按一次退出应用")');
						setTimeout(function(){
							that.showingConfirm = false;
						}, 2000);
					}
					catch(ex){
						C.showErr(ex);
					}
				});
			}
			catch(ex){
				C.showErr(ex);
			}
        },
        pullReset: function(){
        	pullimg.className = '';
			pullDownLabel.innerHTML="下拉可以刷新...";
			pullimg.src = 'app/img/pull_arrow.png'
        },
		handleEvent: function(e){
			try{
				var that = this,
					t = e.target;
				var id = t.id || t.parentNode.id;
                if(id == 'menu') {
					that.showMenu();
				}
				else if(id == 'imgflag'){
					that.changeImgFlag();
				}
			}
			catch(ex){
				C.showErr(ex);
			}
		},
		changeImgFlag: function(){
            var that = this,
                className;
            if(that.noImage){
                that.noImage = false;
                className = "icon img0";
				that.alert("已切换到有图模式");
            }else{
                that.noImage = true;
                className = "icon A0";
				that.alert("已切换到无图模式");
            }
            imgflag.children[0].className = className;
            setTimeout(function(){
            	that.list.evalJS("page.changeImageFlag(" + that.noImage + ")");
                that.setItem(that.cacheKey.noImage,that.noImage);
            },10)

        },
		/**
		 * @作者：
		 * @时间：2013/04/15 10:42:39
		 * @param pageIndex:如果是菜单栏页面调用该方法，指示是显示列表页面第几个栏目
		 * @param  categoryid:
		 * @描述： 显示菜单页面
		 */
		showMenu: function(num, categoryid){
			try{
				if(categoryid){
					if(categoryid == this.categoryId) return;
					else{
						var text = ['','最新资讯','业界', '云计算','移动开发', '软件研发']
						title.innerHTML = text[num];
						this.list.evalJS("page.isLoading = false;page.categoryId='" + categoryid + "';page.loadData(page.categoryId, 1, 2)");
					}
				}
				plus.statistic.eventTrig(categoryid);
				
				if(this.isAnimating) return;
				var webview = plus.webview,
					that = this,
					isShowMenu = that.isShowingMenu,
					doc = document;
				if(that.installing) return;
				webview.currentWebview().setStyle({left: isShowMenu ? '0' : '70%', transition:{duration:that.getTransferTime()}});
				that.isAnimating = true;
				setTimeout(function(){
					that.isAnimating = false;
				}, that.getTransferTime());
				that.isShowingMenu = !isShowMenu;
				this.list.evalJS("page.isShowingMenu = " + that.isShowingMenu);
			}
			catch(ex){
				C.showErr(ex);
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
