define(function(require,exports,module){
	
	// 引入工具类，相对自身的路径
	var tools = require("../tools/tool");
	var strategary = tools.strategary;
	var Observer = tools.Observe;
	
	// 引入模态框
	require("../common/tips");
	
	
	// 先获取各种的id
	var $username = $("#register_username");
	var $password = $("#register_password");
	var $repassword = $("#repassword");
	var $register_btn = $("#register");
	
	// 定义锁
	var username_lock = null;
	var password_lock = null;
	
	// 验证用户名
	$username.blur(function(){
		
		// 获得文本框的内容
		var value = $username.val();
		var result = strategary.use("username",value);
		// 输入格式有错
		if(result){
			Observer.trigger('msg',result);
			// 关锁
			username_lock = false;
			return;
		}
		// 输入格式没错,发送ajax验证数据库是否存在
		// 为了防止异步语句的发生,先关锁
		username_lock = false;
		var index=0;
		$.ajax({
			url:"/checkName",
			data:{
				username:value
			},
			type:"get",
			dataType:"json",
			success(data){
				if(data.error){
					// 不能使用,已经被注册了
					Observer.trigger('msg',data.message);
					// username清空，也可以定义锁
					$username.val("");
					return; 
				}
				username_lock = true;
			}
		})
		
	})
		
	// 按照上面的验证Password的格式
	$password.blur(function(){
		
		// 获得文本框的内容
		var value = $(this).val();
		var result = strategary.use("password",value);
		// 输入格式有错
		if(result){
			if(!username_lock){
				return;
			}
			Observer.trigger('msg',result);
			// 密码出错
			password_lock = false;
			return;
		}
		// 密码没错
		password_lock = true;
	})
	// 验证两次输入的密码是否一样
	$repassword.blur(function(){
		
		// 防止模态框
		if(!password_lock){
			return;
		}
		
		// 获取文本内容
		var value = $(this).val();
		// 获取上一次输入的密码
		var password = $password.val();
		
		if(value == password){
			password_lock = true;
			return;
		}
		Observer.trigger('msg',"两次输入的密码不一样");
		password_lock = false;
	})
	
	$register_btn.click(function(){
		console.log(username_lock);
		console.log(password_lock);
		// 添加后面一条是为了防止没错的时候再去修改password
		if(!(password_lock && username_lock) || $password.val()!= $repassword.val()){
			
			// 为了防止if语句里面有很多代码,显得臃肿
			// 有错误
			Observer.trigger('msg',"请重新检查你的用户名和密码");
			return ;
		}
		// 下面发送ajax请求数据库添加数据
		// 表单序列化
		var value = $(document.forms[0]).serialize();
		$.ajax({
			url:"/register",
			type:'post',
			dataType:'json',
			data:value,
			success(data){
				Observer.trigger("msg",data.data);
				if(data.error === 6)
				setTimeout(function(){
					
					location.href = "/web/html/login.html";
				},2000);
			}
		})
	})
})