var express = require('express');

var fs = require('fs');

var jwt = require("jsonwebtoken");
var secret = "thisisasecrete";

// 引用express里面的的router
var Router = express.Router;

// 实例化对象
var router = new Router();

// 引入数据库,相较于router.js文件自身
var database = require('../db/mongodb');
var connectStr = "mongodb://localhost:27017";
var dbName = "test";
var collection = "students";

// 因为在get的时候token都要验证,所以干脆在这边直接统一验证
router.get("*",function(req,res,next){
	var token = req.query.token;
	if(token){
		jwt.verify(token,secret,function(error,result){
			if(error){
				res.send({
				error:1,
				data:"token解析失败"
				})
				// 不需要再执行放行后的其他内容了
				return;
			}
			// 没有错误
			// 将token挂载在req对象上面
			req.token = result;
			// 放行
			next();
		})
		// 这边的return,要放在这边,防止下面的next再次执行,会出现错误，上面的return，跳出function，还是需要这边的return;
		return;
	}
	// 如果没有token,还是要放行
	next();
})



// 处理get事件
router.get("/checkName",function(req,res,next){
		
	// 在这里面的处理访问数据库的内容
	// 获取username
	var username = req.query.username;
	// 使用database里面的findOne方法查找是否有该用户名
	var check = new database(connectStr,dbName,collection); 
	check.findOne({username:username},function(error,result){
		// 没找到
		if(!result){
			res.send({
				error:0,
				message:"该用户可以注册"
			});
			return;
		}
		// 找到
		res.send({
			error:1,
			message:"该用户已经被注册了"
		})
	})
})

// 处理注册请求
router.post("/register",function(req,res,next){
	// 获取用户名和密码
	var username = req.body.register_username;
	var password = req.body.register_password;
	console.log(req.body)
	console.log(username,password)
	// 先读取默认的图片
	fs.readFile("./web/images/default.png",function(error,data){
		if(error){
			console.log(error);
			res.send({
				error:1,
				data:"读取头像文件失败"
			})
			return ;
		}
		console.log("读取成功")
		console.log(data)
		// 没有错误
		// 就创建用户的文件夹
		fs.mkdir("./user/"+username,function(error){
			if(error){
				res.send({
					error:2,
					data:"创建用户文件夹失败"
				})
				return;
			}
			console.log("创建用户文件夹成功");
			// 没有错误,创建用户头像文件夹
			fs.mkdir("./user/"+username+"/header_img",function(error){
				if(error){
					res.send({
						error:3,
						data:"创建用户名头像文件夹失败"
					})
					return;
				}
				console.log("创建用户头像文件夹成功");
				// 接下来就是克隆图片到该文件夹下方了
				fs.appendFile("./user/"+username+"/header_img/default.png",data,function(error){
					if(error){
						res.send({
							error:4,
							data:"添加用户头像失败"
						})
						return;
					}
					console.log("添加用户头像成功");
					// 接下来就是注册了,想数据库添加用户名,密码,和头像地址
					// 先得到用户的头像地址
					var img_addr = "/user/"+username+"/header_img/default.png";
					var storage = new database(connectStr,dbName,collection); 
					// 插入一条数据
					storage.insertOne({username:username,password:password,imgPath:img_addr},function(error){
						if(error){
							res.send({
								error:5,
								data:"注册失败"
							})
							return;
						}
						console.log("注册成功");
						res.send({
							error:6,
							data:"注册成功"
						})
					})
				})
			})
		})
	})
	
})

// 处理登录请求
router.post("/login",function(req,res,next){
	
	// 获取账号密码
	var username = req.body.username;
	var password = req.body.password;
	
	// 连接数据库验证
	var storage =new database(connectStr,dbName,collection);
	
	storage.findOne({username:username,password:password},function(error,result){
		
		if(error){
			// 说明查找过程中发生错误
			res.send({
				error:1,
				data:"查找的过程中发生错误"
			})
			return;
		}
		if(!result){
			// 说明查找的时候没有发生错误,但是没有找到用户
			res.send({
				error:2,
				data:"请检查你的账号和密码"
			})
			return;
		}
		// 接下里就说明找到了
		var img_path = result.imgPath;
		// 在返回给用户的数据中加入token
		// 加密
		var content = {
			username:username,
			login:true,
			img_path:img_path
		}
		var secret_msg = jwt.sign(content,secret);
		// 返回内容和token
		res.send({
			error:0,
			token:secret_msg,
			data:"登录成功"
		})
	})
	
})

// 处理nav 的头像还有名称请求
router.get("/get_nav",function(req,res,next){
	var token = req.query.token;
	// 解密
	jwt.verify(token,secret,function(error,result){
		
		if(error){
			res.send({
				error:1,
				data:"解密失败"
			});
			return;
		}
		// 没有发生错误,解密结果在result里面
		res.send({
			error:0,
			data:result
		})
	})
	
})

// 处理创建album 的请求
router.get("/createAlbum",function(req,res,next){
	var obj = req.token;
	var Album_name = req.query.value;
	if(!obj){
		res.send({
			error:1,
			data:"没有传递token"
		})
		return;
	}
	// console.log(obj,Album_name);
	// 有传递token
	var username = obj.username;
	// 先创建该用户的照片文件夹
	fs.mkdir("./user/"+username+"/"+Album_name,function(error){
		if(error){
			res.send({
				error:2,
				data:"创建用户相册失败"
			})
			return;
		}
		console.log("创建用户相册成功")
		// 创建用户相册成功
		// 将一些数据存入数据库中,方便访问相册
		var storage =new database(connectStr,dbName,"album");
		
		storage.insertOne({username:username,album_name:Album_name,share:"true",albumPath:"/user/"+username+"/"+Album_name},function(error){
			
			if(error){
				// error不为null,说明有错误
				res.send({
					error:3,
					data:"相册存入数据库失败"
				})
				return;
			}
			console.log("相册存入数据库成功");
			// 相册存入没有问题，返回相册名称和是否共享
			res.send({
				error:0,
				Album_name:Album_name,
				share:"true",
				data:"相册存入数据库成功"
			})
		});
	})
})

// 处理获取相册列表的请求
router.get("/getuserAlbum",function(req,res,next){
	
	var obj = req.token;
	// 获取之后查询数据库获得数据列表
	var storage =new database(connectStr,dbName,"album");
	storage.findMany({username:obj.username},function(error,arr){
		if(error){
			res.send({
				error:2,
				data:"查询过程出错"
			})
			return;
		}
		if(!arr){
			res.send({
				error:3,
				data:"未查找到该用户"
			})
			return;
		}
		// 说明查到了
		res.send({
			error:0,
			data:arr
		})
	})
})

// 处理修改album集合中数据的共享状态
router.get("/changeAlbumstate",function(req,res,next){
	var username = req.token.username;
	var state = req.query.state;
	var album_name = req.query.album_name;
	
	// 连接数据库修改
	var storage =new database(connectStr,dbName,"album");
	var query = {
		username:username,
		album_name:album_name
	};
	var updated = {
		$set:{
			share:state
		}
	}
	storage.updateOne(query,updated,function(error){
		if(error){
			res.send({
				error:2,
				data:"修改相册状态失败"
			})
			return;
		}
		res.send({
			error:0,
			data:"修改相册状态成功"
		})
	})
})

// 处理删除某个相册的请求
router.get("/deleteAlbum",function(req,res,next){
	// 获取用户名和相册名
	var username = req.token.username;
	var album_name = req.query.album_name;
	console.log(username,album_name)
	// 删除用户相册文件
	function del(path){
		
		// 读取路径中的下一级目录
		var arr = fs.readdirSync(path)
		// 没错，获取到下一级文件夹数组
		for(var i=0; i<arr.length; i++){
			var newPath = path + "/" + arr[i];
			var state = fs.statSync(newPath);
			if(state.isDirectory()){
				// 下一级还是文件夹
				del(newPath);
			}
			else{
				// 不是文件夹,是文件
				fs.unlinkSync(newPath);
			}
		}
		// 最后面,删完了里面的文件,要删除外面的文件夹了
		fs.rmdirSync(path);
	}
	
	// 调用删除的该方法
	try{
		
		del("./user/"+username+"/"+album_name);
	}catch(e){
		
		res.send({
			error:2,
			data:"删除用户文件夹失败"
		})
		return;
	}
	
	// 删除完了文件夹,删除数据库中的内容
	var storage = new database(connectStr,dbName,'album');
	storage.deleteOne({username:username,album_name:album_name},function(error){
		if(error){
			res.send({
				error:3,
				data:'删除用户数据库相册失败'
			})
			return;
		}
		// 说明没有错
		res.send({
			error:0,
			data:"删除用户相册成功"
		});
	})
})


// 暴露接口
module.exports = router;