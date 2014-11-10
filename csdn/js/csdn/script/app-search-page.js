(function (C, B) {
    var page = function () { }
    C.extend(page.prototype, B, {
        OnReady: function () {
			var that = this,
				doc = document,
				webview = plus.webview;
			try{
				that.on("click", doc.getElementById("left_back"));
				that.on("keydown", doc.getElementById("key"));
				that.on("touchstart", doc.getElementById("speech"));
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
					that.list.close();
				});
				var list = that.list = webview.create("searchlist.html","searchlist",{top:"98px",bottom:"0px"});
				webview.currentWebview().append(list);
				list.addEventListener("loaded",function(){
					webview.currentWebview().show();
				},false);
			}
			catch(e){
				C.showErr(e, 'OnReady');
			}
			// auto focus for editor
			doc.getElementById('key').focus();
        },
		handleEvent: function(e){
			try{
				var that = this,
					t = e.target,
					id = t.id || t.parentNode.id;
				switch(id){
					case "left_back":
						that.back();
						return;
					case "key":
						if(e.keyCode==13){
							var txt = t.value.replace(' ', '');
							if (!txt || txt.length<2) {
                            	document.getElementById('hide').focus();
								that.alert("关键字不能少于两位！", 2, that.isAndroid()?'center':'top');
								return;
							};
                            document.getElementById('hide').focus();
//							that.alert("正在搜索，请稍候...",2, 'center');
							that.getSearchData(txt);
						}
						return;
					case 'speech':
						plus.speech.startRecognize({engine:'ifly'}, function(results){
							results = results.toString().replace('。', '');
							var key = document.getElementById('key');
							key.value = results;
							document.getElementById('hide').focus();
							that.getSearchData(results);
							
//							that.alert("正在搜索，请稍候...",2, 'center');
						}, function(e){
							that.alert('未识别的语言', 2, 'center');
						});
						return;
				}
			}
			catch(ex){
				C.showErr(ex, 'handleEvent');
			}
		},
		getSearchData: function(txt){
			this.list.evalJS('page.getSearchData("' + txt + '", 1)');
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
