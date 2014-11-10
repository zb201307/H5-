(function () {
    window.csdn =  {
		/**
		合并属性值,如果第一个参数为true，将合并的属性值放到一个新对象中
		**/
		extend: function(target){
			var len = arguments.length,
				index = 1,
				first = arguments[0];
			if(typeof target == 'boolean'){
				if(target) first = {};
				else{
					first = arguments[1];
					index = 2;
				}
			}
			for(; index < len; index++){
				var o = arguments[index];
				for(i in o) if(o[i] !== undefined) first[i] = o[i];
			}
			return first;
		},
		/**
		显示覆盖层
		**/
		showMask: function(){
			var doc = document,
				div = doc.getElementById('dh_mask');
			if(!div){
				div = doc.createElement('div');
				div.id = 'dh_mask';
				div.className = 'dh_mask';
				doc.body.appendChild(div);
			}
			div.style.display = 'block';
		},
		/**
		获取浏览器厂商的标记
		**/
		getVendor: function(){
			if(typeof csdn._vendor !== 'undefined') return csdn._vendor;
			var vendors = 't,webkitT,MozT,msT,OT'.split(','),
				t,
				i = 0,
				l = vendors.length,
				docStyle = document.documentElement.style;

			for ( ; i < l; i++ ) {
				t = vendors[i] + 'ransform';
				if ( t in docStyle) {
					csdn._vendor = vendors[i].substr(0, vendors[i].length - 1).toLowerCase();
				}
			}
			return csdn._vendor;
		},
		/**
		隐藏覆盖层
		**/
		hideMask: function(){
			var div = document.getElementById('dh_mask');
			if(div) div.style.display = 'none';
		},
		each: function(elements, callback){
			var i, key
			if (typeof elements.length == 'number') {
			  for (i = 0; i < elements.length; i++)
				if (callback.call(elements[i], i, elements[i]) === false) return elements
			} else {
			  for (key in elements)
				if (callback.call(elements[key], key, elements[key]) === false) return elements
			}

			return elements
		},
		showErr : function(ex, title) {
			try {
				var message = [];
				for (i in ex) {
					//if (typeof ex[i] == 'function' || typeof ex[i] == 'object') continue;
					message.push("\n" + i + ":" + ex[i]);
				}
//				plus.statistic.eventTrig("error",message.join(';'));
				//console.trace();
				alert(title + ":" + message.join(';') + ':' + ex.message);
				//plus.console.log(message.join(';'));
				throw ex;
			} catch (err) {
//				alert(ex.type + ':' + ex.message);
//				plus.statistic.eventTrig("error",err.message);
			}
		}
    };
})();