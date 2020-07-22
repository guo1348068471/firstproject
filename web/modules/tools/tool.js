define(function(require,exports,module){
	
	// 格式化模板函数
	function format(tpl,arr){
		
		return tpl.replace(/<%(\w+(\.+\w+)*)%>/g,function(match,$1){
			
			var result = arr;
			
			var path_arr = $1.split(".");
			
			for(var i=0; i<path_arr.length-1;i++){
				
				result = result[path_arr[i]];
			}
			
			return result[path_arr[i]];
		})
	};
	
	// 观察者模式,暂时存储函数的函数
	var Observe = (function(){
		
		var data = {};
		
		var result = data;
		
		return {
			
			// 添加函数
			on(name,fn){
				
				// 将函数作为数组填充
				if(typeof result[name] == "undefined"){
					
					// 没有就自己创建
					result[name] = [fn];
				}
				else{
					
					result[name].push(fn);
				}
			},
			// 触发(执行)函数
			trigger(name){
				
				// 先接收除了name之后的参数
				var arr = Array.prototype.slice.call(arguments,1);
				// 然后循环接收执行对应name数组里面的函数
				for(var i=0; i < result[name].length; i++){
					
					// 触发的时候参数借改变this执行,顺便传递参数,需要的自己会调用
					result[name][i].apply(result,arr);
				}
			}
		}
	})();
	
	// 书写策略模式,用于字符串格式匹配
	var strategary = (function(){
		var data={
			// 设置用户名格式
			username:function(value){
			
				var reg = /^[a-z]{1,8}$/;
				return reg.test(value) ? "" : "请输入1-8个字母";
			},
			password:function(value){
				var reg = /^[0-9]{4,8}$/;
				return reg.test(value) ? "" : "请输入4-8个数字";
			}
		};
		
		
		return{
			
			use:function(name,content){
				
				return data[name](content);
			}
			
		}
	})()
	
	
	module.exports.format = format;
	
	module.exports.Observe = Observe;

	module.exports.strategary = strategary;
})