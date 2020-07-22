define(function(require,exports,module){
	
	var tools = require("../tools/tool");
	var Observer =tools.Observe;
	var strategary = tools.strategary;
	
	// 模态框
	require("../common/tips");
	
	var username = $("#username")
	
	username.blur(function(){
		
		var result = strategary.use("username",username.val());
		if(result){
			Observer.trigger("msg",result);
			// 清空内容
			username.val("");
			return;
		}
		
	})
	
	
	$("#login").click(function(){
		
		// 表单序列化
		var data = $("#forms").serialize();
		// 发送ajax
		$.ajax({
			url:"/login",
			data:data,
			type:"post",
			dataType:"json",
			success(data){
				if(data.error){
					// error为非0，登录失败
					Observer.trigger('msg',data.data);
					return;
				}
				// error为0
				Observer.trigger('msg',data.data);
				// 将token 存入仓库
				localStorage.setItem("token",data.token);
				// 两分钟后,跳转页面
				setTimeout(function(){
					location.href = "/web/html/index.html";
				},2000)
			}
		})
	})
	
})