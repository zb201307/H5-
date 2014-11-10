(function (C, B) {
    var page = function () { }
    C.extend(page.prototype, B, {
        OnReady: function () {
        	var that = this,
				cacheKey = that.cacheKey, 
				doc = document;
			commentcontent.value = "我在CSDN上看到一篇文章，不错，分享给大家 " + that.getItem(cacheKey.articleTitle) + '。' + that.getItem(cacheKey.articleUrl);
			that.on('click', left);
			that.on('click', doc.getElementById('share'));
			that.androidMenu(function(){});
			that.androidBack(function(e){
				that.goback();
			});
        },
        sharefail: function(){
        	var that = this;
//      	that.waiting.setTitle('获取分享失败，稍后重试...');
        	that.waiting.close();
        	that.alert('获取分享失败，稍后重试...');
//      	setTimeout(function(){
//      		that.goback();
//      	},1500)
        },
        handleEvent: function(e){
        	var that = this,
        		id = e.target.id || e.target.parentNode.id;
        	if(id == 'left') {
        		that.goback();
        		return;
        	}else{
        		var value = commentcontent.value.replace(' ', '')
        		if(value == ''){
        			that.alert('分享内容不能为空', 2, 'middle');
        			return;
        		}
        		var t = e.target;
        		that.type = t.getAttribute('type');
        		that.scene = t.getAttribute('scene')||''
        		that.waiting = plus.nativeUI.showWaiting( "正在分享..." );
				plus.share.getServices( function(services){
					var hasshare = false;
					for(var i =0, len = services.length; i< len; i++){
						var service = services[i];
						if(service.id == that.type){
							that.commitComment(service);
							hasshare = true;
							break;
						}
					}
					if(!hasshare){
						that.sharefail();
						return;
					}
				}, function(e){
					that.sharefail();
				} );
        	}
//      	else{//选择分享类型
//      		that.oldtarget = document.querySelector('#share .active');
//      		if(that.oldtarget) that.oldtarget.classList.remove('active')
//      		that.type = e.target.getAttribute('value');
//      		e.target.className += ' active';
//      		if(that.type == 'weixin'){
//      			plus.ui.confirm( "微信分享", function(i){
//      				if(i == 0) that.weixintype = 'WXSceneSession';
//      				else if(i == 1) that.weixintype = 'WXSceneTimeline';
//      				else{
//      					e.target.className = '';
//      					if(that.oldtarget){
//      						that.oldtarget.classList.add('active');
//      						that.type = that.oldtarget.getAttribute('value')
//      					}else that.type = ''
//      				}
//					},"",["分享到好友","分享到朋友圈","取消"]);
//      		}
//      		else{
//      			that.weixintype = ''
//      		}
//      	}
        },
        commitComment: function(share){
        	var that = this;
        	that.share = share;
    		if(!share.authenticated){
    			share.authorize(function(service){
    				that.commit();
        		}, function(e){
        			that.waiting.close();
        			that.alert('认证失败，请重试。')
        		});
    		}
    		else{
    			that.commit();
    		}
        },
        commit: function(){
        	var that = this;
			that.share.send({content: commentcontent.value, extra:{scene:that.scene}}, function(){
				that.alert('分享成功');
				that.waiting.close();
//				setTimeout(function(){
//					that.goback();
//				}, 1000)
			}, function(){
				that.waiting.close();
				that.alert('分享失败，请重新尝试');
			})
        },
        goback: function(){
        	plus.webview.currentWebview().close()
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
	}, false);
})(csdn, csdn.basepage);
