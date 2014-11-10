(function (C, B) {
	var page = function () { }
    C.extend(page.prototype, B, {
        OnReady: function () {
			var that = this;
			try{
                document.getElementById("left").onclick = function(){
                    that.back();
                }
                that.androidMenu(function(){});
				that.androidBack(function(e){
                    that.back();
				});
			}
			catch(e){
				C.showErr(e);
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
    //$(function () { fpPage.OnReady(); });
})(csdn, csdn.basepage);
