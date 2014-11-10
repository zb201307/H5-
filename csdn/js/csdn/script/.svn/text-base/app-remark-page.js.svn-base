(function (C, B) {
    var page = function () { }
    C.extend(page.prototype, B, {
        pagenum: 1,
        isShowingLogin: false,
        isShowComment: false,
        OnReady: function () {
            var that = this,
				doc = document,
				cacheKey = that.cacheKey;
            try {
//                that.href = "http://www.csdn.net/article/2013-04-10/2814837-interview-with-nimblebits-david-marsh";
                that.href = that.getItem(cacheKey.articleUrl);
                that.title = that.getItem(cacheKey.articleTitle);
                that.getComment(1);
                that.on("click", left_back);
                that.on('plusscrollbottom', doc);
				that.androidMenu(function(){});
                that.androidBack(function (e) {
                    try {
                        var startTime = that.clickTime,
							endTime = new Date().getTime();
                        if (startTime && endTime - startTime < 600) {
                            that.clickTime = endTime;
                            return;
                        }

                        that.clickTime = endTime;
                        that.back();
                    }
                    catch (ex) {
                        C.showErr(ex);
                    }
                });
                
                that.slider = new C.slider(document, {
  					onLeft: function(e){
  						if (that.isShowComment) {
							return;							 
  						}
  						that.back();
  					}
  				});
                that.slider.enable();
            }
            catch (e) {
                C.showErr(e, 'OnReady');
            }
        },
        scroll: function(e){
			var that = this,
				w = window;
			if(!that.isLoading && !that.isEnd){
				that.isLoading = true;
				if(that.loadDataTimer) clearTimeout(that.loadDataTimer);
				that.loadDataTimer = setTimeout(function(){
					that.getComment(that.pagenum);
				}, 200);
			}
		},
        handleEvent: function (e) {
        	this.back();
        },
        showComment: function (data, pagenum) {
            try {
                var index = 0,
					len = data.length,
					doc = document,
					container = doc.getElementById("container"),
					body_height = doc.body.clientHeight,
					that = this,
					fragment = doc.createDocumentFragment();
				that.isLoading = false;
                if (!data || data.length == 0) {
					if(pagenum == 1 && data.length == 0){
						document.getElementById("pullUpLabel").innerHTML = "";
						container.innerHTML = '<div class="nocomment"><img src="img/sofa.png" height="96" width="84"></img></div>';
	                    doc.getElementById("loadingcontent").style.opacity = "0";	                    
	                    doc.getElementById("main").style.opacity = "1";
	                    window.scrollTo(0, 0);
	                    doc.body.style.overflow = "hidden";
	                    doc.getElementsByTagName('html')[0].style.overflow = 'hidden';
						return;
					}
  					if(pagenum != 0){
  						that.isEnd = true;
  						document.getElementById("pullUpLabel").innerHTML = "没有更多的评论了";
  						return;
  					}
                }
                if (pagenum == 1) {
                    container.innerHTML = "";
                    for (; index < len; index++) {
                    	fragment.appendChild(that.getCommentObj(data[index]));
                    }
                    if (data.length < 20) {
                    	that.isEnd = true;
                    	document.getElementById("pullUpLabel").style.display = 'none';
					};
                }
                else {
                    for (; index < len; index++) {
                    	fragment.appendChild(that.getCommentObj(data[index]));
                    }
                }

				container.appendChild(fragment);

                var wrapper_height = doc.getElementById("wrapper").scrollHeight;
                
                if((wrapper_height + 46) >= body_height){
                	doc.body.style.overflow = "scroll";
                }else{
                	doc.body.style.overflow = "hidden";
                }
                
                if(pagenum==1){
                	doc.getElementById("loadingcontent").style.opacity = "0";
	                doc.getElementById("main").style.opacity = "1";
	                setTimeout(function(){
                    	doc.getElementById("loadingcontent").style.display = "none";
                    },100);
                }
				that.pagenum = pagenum + 1;
            }
            catch (ex) {
                C.showErr(ex);
            }
        },
       	getCommentObj: function(d){
       		try{
	       		var doc = document,
	       			comment = doc.createElement("div"),
	       			logo = doc.createElement("div"),
	       			content = doc.createElement("div"),
	       			username = d.username,
	       			that = this;

                that.noImage = that.getItem(this.cacheKey.noImage);
                //this.noImage = false;
                if(!this.noImage){
                    logo.innerHTML = '<img src="' + d.img + '"/>';
                    logo.setAttribute("class", "logo");
                    logo.setAttribute("username", username);
                    comment.appendChild(logo);
                }else{
                    content.setAttribute("style", "margin-left:0px");
                }

	            content.setAttribute("class", "content");
	            content.innerHTML = '<span username="' + username + '">' + username + '</span>&#160;&#160;&#160;' + d.ptime + '<p username="' + username + '">' + d.body + '</p>';
	            content.setAttribute("username", d.username);
	            comment.setAttribute("username", username);
	            comment.setAttribute("class", "comment");
	            comment.appendChild(content);
            	return comment;
            }
       		catch(ex){
       			C.showErr(ex, 'getCommentObj');
       		}
       		finally{
       			comment = null;
       			logo = null;
       			content = null;
       		}
       	},
        getComment: function (pagenum) {
            var that = this,
				url = "http://ptcms.csdn.net/comment/comment/newest?url=" + that.href + "&pageno=" + pagenum + "&pagesize=50&jsonpcallback=jsonp1358762124086", 
				req = "action=bs-transfer@mdp&_MSC_CMD_=QRY&nologin=true&phonemodel=Windows||||Microsoft&appid=FE3XK6&cellid=&screensize=640*920&vt=4&truescreensize=640*920&mscver=V3.2.0.BUILD.01.120625.122330&relogin=false&encrypt=false&carrier=PC&MSCID=&loginmode=foreground&appver=1.0&lac=&partnerid=user&url=" + encodeURIComponent(url);
            
			C.ajax({
				type : 'GET',
				url : that.mk_Server + "http.do",
				timeout : that.timeout,
				data: req,
				dataType : 'jsonp',
				success : function(data) {
					if(pagenum == 1 && data.remark != 0) {
						document.getElementById("title").innerHTML = data.remark + '条评论';
//						document.getElementById("comment_count").innerHTML = data.remark + '条评论';
					}
					that.showComment(data.list, pagenum);
				},
				error : function(xhr, type) {
					that.alert("网络不给力");
				}
			});
        }
    });

    window.page = new page();
    if(window.plus){
    	window.page.OnReady();
    	return;
    }
    //页面注册
	//page.OnReady();
	document.addEventListener("plusready", function(){
		window.page.OnReady();
	});
})(csdn, csdn.basepage);
