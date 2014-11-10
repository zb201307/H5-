(function(C, win){
var slider = function (el, options) {
	var that = this;
	// Default options
	that.options = {
		width: win.innerWidth/3,
		height: 30,
		onStart:null,
		onMove: null,
		onEnd: null,
		onLeft: null,
		onRight: null,
		onStatic: null,
		onScroll: null,
		canStart: null
	};
	// User defined options
	for (i in options) that.options[i] = options[i];
	//if(el) that.target = document.getElementById(el);
	//else that.target = win;
	that.target = el;
	//that.on('touchstart', el);
};

// Prototype
slider.prototype = {
	handleEvent: function (e) {
		switch(e.type) {
			case 'touchstart':
				this._start(e);
				break;
			case 'touchmove': 
				this._move(e); 
				break;
			case 'touchcancel':
			case 'touchend': 
				this._end(e); 
				break;
			case 'scroll':
				this._scroll(e);
				break;
		}
	},
	enable: function(){
		var that = this;
		if(that.enabled) return;
		that.enabled = true;
		that.on('touchstart', that.target);
	},
	disable: function(){
		var that = this;
		if(!that.enabled) return;
		that.enabled = false;
		that.off('touchstart', that.target);
		that.off("scroll", document);
		that.off("touchmove", document);
		that.off("touchend", document);
		that.off("touchcancel", document);
	},
	_start: function(e){
		var that = this,
			point = e.touches[0];
		that.point1 = point;
//		that.test('_start point&&' + window.pageYOffset, that.point1);
		
		that.startPointX = point.clientX;
		that.startPointY = point.clientY;
//		plus.console.log("that.startPointX:" + that.startPointX + ",that.startPointY:" + that.startPointY);
		
		that.touchmoved = false;
//		console.log('_start:' + that.startPointX + ',' + that.startPointY);
		if(that.options.onStart) that.options.onStart.call(that, e);
		if(!that.options.canStart || that.options.canStart && that.options.canStart.call(that, e)){
			that.off("scroll", document);
			that.on("touchmove", document);
			that.on("touchend", document);
			that.on("touchcancel", document);
		}
	},
	_move: function(e){
		var that = this;
		that.touchmoved = true;
		if(that.options.onMove) that.options.onMove.call(that, e);
	},
	_end: function(e){
		var that = this;
		that.on("scroll", document);
		that.off("touchmove", document);
		that.off("touchend", document);
		that.off("touchcancel", document);
		if(that.options.onEnd) that.options.onEnd.call(that, e);
		if(that.touchmoved){
//			for(var index=0; index< e.changedTouches.length; index++){
//				var p = e.changedTouches[index];
//				that.test('_end point&&' + window.pageYOffset , p);
//			}
			var point = e.changedTouches[0],
//				endPointX = point.pageX,
//				endPointY = point.pageY,
				
				endPointX = point.clientX,
				endPointY = point.clientY,
				width = that.options.width,
				height = that.options.height;
		if (Math.abs(endPointY - that.startPointY) < height) {//上下滑动距离限制
//			plus.console.log("endPointY:" + endPointY + ",that.startPointY:" + that.startPointY + ",end>>:" + Math.abs(endPointY - that.startPointY));
				var _x = endPointX - that.startPointX;
//				console.log('_end>>:' + _x + ',' + width);
				if (_x > width && that.options.onLeft)
					that.options.onLeft.call(that, e);
				else if (_x < -width && that.options.onRight)
					that.options.onRight.call(that, e);
			}
		}else if(that.options.onStatic){
			that.options.onStatic.call(that, e);
		}
	},
	_scroll: function(e){
		var that = this;
		if(that.options.onScroll) that.options.onScroll.call(that, e);
	},
	on: function (type, el, bubble) {
//		if(window.navigator.msPointerEnabled){
//			if(type == 'touchstart'){
//				(el || win).addEventListener('MSPointerDown', this, !!bubble);
//			}
//			else if(type == 'touchmove'){
//				(el || win).addEventListener('MSPointerMove', this, !!bubble);
//			}
//			else if(type == 'touchend'){
//				(el || win).addEventListener('MSPointerUp', this, !!bubble);
//			}
//		}
		el.addEventListener(type, this, !!bubble);
	},

	off: function (type, el, bubble) {
		el.removeEventListener(type, this, !!bubble);
	},
};

csdn.slider = slider;

})(csdn, window);
