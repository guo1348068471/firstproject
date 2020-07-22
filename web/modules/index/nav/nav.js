define(function(require,exports,module){
	
	// 获取模板的父类user
	var $user = $("#user");
	
	// nav里面有用户的头像,还有用户名,所以需要注意
	// 需要发送token到询问用户名还有头像
	$.ajax({
		url:"/get_nav",
		type:"get",
		dataType:"json",
		data:{
			token:localStorage.token,
		},
		success(data){
			// console.log(data)
			if(data.error){
				console.log("获取nav信息失败");
				return;
			}
			// 获取成功
			// 将或得到的数据放入模板中
			$user.append('<img src='+data.data.img_path+' alt="" class="avatar"><span id="name">'+data.data.username+'</span><a href="#" id="exit">退出</a>');
			// $("#exit").click(function(){
			// 	console.log(123)
			// })
		}
	})
	
	// 下面的事件可以放在上面执行,但是要是同样的方式就不行,因为ajax是异步行为
	// 接下来使用委托模式,将事件给他老爸
	$user.on("click","#exit",function(){
		// 删除token,并将页面跳转到登录界面
		localStorage.removeItem("token");
		location.href = "/web/html/login.html";
	})
	
})