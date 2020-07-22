
// 这是最外面的入口文件


// 引入express模块
var express = require('express');

// 引入body-parse模块
var body_parse = require('body-parser')

// 实例化express，他是安全类
var app = express()

// 静态化web文件夹
app.use('/web/',express.static('./web'));
// 静态化user文件夹
app.use('/user/',express.static('./user'));

// 解析post的Parser
app.use(body_parse.urlencoded({extended:false}));


// 如果用户输入首页地址,将其导向注册页面
app.get('/index.html',function(req,res){
	// 重定向
	res.redirect('/');
})
// 接着上面的内容,将/导向登录界面
app.get('/',function(req,res){
	res.sendFile(__dirname+'/web/html/login.html');
})



// 调用router
var router = require("./server/router");
// 挂载
app.use(router);


// 监听3000端口
app.listen(3000,function(){
	console.log("监听3000端口成功");
})