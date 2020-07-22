// 引入mongodb模块
var mongodb = require("mongodb");
// 定义连接客户端
var mongoClient = mongodb.MongoClient;


// 建立连接字符串
// var connectStr = 'mongodb://localhost:27017';

// 定义构造函数
// 传递的参数有
// @connectStr     数据库连接端口
// @dbName         数据库名称
// @collectionName 数据库集合名称
function MongoDatabase(connectStr,dbName,collectionName){
	// 安全类判断,太重要了，会经常忘记书写new
	if(!(this instanceof MongoDatabase)){
		// 不是安全类
		throw new Error("请书写正确样式的类");
		return ;
	}
	this.connectStr = connectStr;
	this.dbName = dbName;
	this.collectionName = collectionName;
}
// 接下里是添加原型中的各种方法

// **********************增加一条数据  没有封装连接函数
// @query 是添加的数据项
// @callback 是回调函数
MongoDatabase.prototype.insertOne = function(query,callback){
	
	// 保存this
	var me = this;
	// 连接
	mongoClient.connect(this.connectStr,{useNewUrlParser:true},function(error,client){
		
		// 获取要操作的集合对象
		var coll = client.db(me.dbName).collection(me.collectionName);
		
		// 将要插入的query语句添加到集合中
		coll.insertOne(query,function(err,result){
			// 插入之后关闭通道
			client.close();
			if(err){
				// 存在插入错误
				console.log("插入数据错误");
				callback(err,result);
				return;
			}
			console.log("插入数据成功");
			callback(null,result);
		})
		// 插入数据是异步语句,下面的可以提前执行
		if(error){
			console.log("连接数据库失败");
			return;
		}
		console.log("连接成功");
	})
}


// **********************增加多条数据   以下都使用封装的连接函数
// @query 是添加的数据项
// @callback 是回调函数
MongoDatabase.prototype.insertMany = function(query,callback){
	
	// 保存this
	var me = this;
	// 连接
	this.connect(this.connectStr,this.dbName,this.collectionName,function(error,coll,client){
		
		// 如果存在错误,直接输出错误，没有结果
		if(error){
			callback(error,null);
			return;
		}
		// 没有错误继续执行
		// 将要插入的query语句添加到集合中
		coll.insertMany(query,function(err,result){
			// 插入之后关闭通道
			client.close();
			if(err){
				// 存在插入错误，输出插入错误和结果
				console.log("插入数据错误");
				callback(err,null);
				return;
			}
			console.log("插入数据成功");
			// 没有错误,不输出错误,输出结果
			callback(null,result);
		})
	})
}

// 包装连接函数，只负责连接，需要进行操作的可以在回调函数中进行
// @connectStr 连接端口
// @dbName 数据库名称
// @collectionName 该数据库集合名称
// @callback  连接的回调函数
MongoDatabase.prototype.connect = function(connectStr,dbName,collectionName,callback){
	
	mongoClient.connect(connectStr,{useNewUrlParser:true},function(error,client){
		
		if(error){
			console.log("连接数据库失败")
			// 并将通道传递出去,链接失败，只传递错误，通道打不开
			callback(error,null);
			return ;
		}
		console.log("连接数据库成功");
		var coll = client.db(dbName).collection(collectionName);
		callback(null,coll,client);
	})
}



// ********************删除一条数据
// @query 是添加的数据项
// @callback 是回调函数
MongoDatabase.prototype.deleteOne = function(query,callback){
	
	// 保存this
	var me = this;
	// 连接
	this.connect(this.connectStr,this.dbName,this.collectionName,function(error,coll,client){
		
		// 如果存在错误,直接输出错误，没有结果
		if(error){
			callback(error,null);
			return;
		}
		// 没有错误继续执行
		// 执行将要删除的query语句
		coll.deleteOne(query,function(err,result){
			// 插入之后关闭通道
			client.close();
			if(err){
				// 存在插入错误，输出插入错误和结果
				console.log("删除一条数据错误");
				callback(err,null);
				return;
			}
			console.log("删除一条数据成功");
			// 没有错误,不输出错误,输出结果
			callback(null,result);
		})
	})
}

// ********************删除多条数据
// @query 是添加的数据项
// @callback 是回调函数
MongoDatabase.prototype.deleteMany = function(query,callback){
	
	// 保存this
	var me = this;
	// 连接
	this.connect(this.connectStr,this.dbName,this.collectionName,function(error,coll,client){
		
		// 如果存在错误,直接输出错误，没有结果
		if(error){
			callback(error,null);
			return;
		}
		// 没有错误继续执行
		// 执行将要删除的query语句
		coll.deleteMany(query,function(err,result){
			// 插入之后关闭通道
			client.close();
			if(err){
				// 存在插入错误，输出插入错误和结果
				console.log("删除多条数据错误");
				callback(err,null);
				return;
			}
			console.log("删除多条数据成功");
			// 没有错误,不输出错误,输出结果
			callback(null,result);
		})
	})
}


// ********************修改一条数据,只能修改找到的第一条匹配数据
// @oldquery 是匹配的原字符串
// @newquery 是更新后的字符串
// @callback 是回调函数
MongoDatabase.prototype.updateOne = function(oldquery,newquery,callback){
	
	// 保存this
	var me = this;
	// 连接
	this.connect(this.connectStr,this.dbName,this.collectionName,function(error,coll,client){
		
		// 如果存在错误,直接输出错误，没有结果
		if(error){
			callback(error,null);
			return;
		}
		// 没有错误继续执行
		// 执行将要删除的query语句
		coll.updateOne(oldquery,newquery,function(err,result){
			// 插入之后关闭通道
			client.close();
			if(err){
				// 存在插入错误，输出插入错误和结果
				console.log("修改一条数据错误");
				callback(err,null);
				return;
			}
			console.log("修改一条数据成功");
			// 没有错误,不输出错误,输出结果
			callback(null,result);
		})
	})
}
 
// ********************修改多条数据
// @oldquery 是匹配的原字符串
// @newquery 是更新后的字符串
// @callback 是回调函数
MongoDatabase.prototype.updateMany = function(oldquery,newquery,callback){
	
	// 保存this
	var me = this;
	// 连接
	this.connect(this.connectStr,this.dbName,this.collectionName,function(error,coll,client){
		
		// 如果存在错误,直接输出错误，没有结果
		if(error){
			callback(error,null);
			return;
		}
		// 没有错误继续执行
		// 执行将要删除的query语句
		coll.updateMany(oldquery,newquery,function(err,result){
			// 插入之后关闭通道
			client.close();
			if(err){
				// 存在插入错误，输出插入错误和结果
				console.log("修改多条数据错误");
				callback(err,null);
				return;
			}
			console.log("修改多条数据成功");
			// 没有错误,不输出错误,输出结果
			callback(null,result);
		})
	})
}


// ********************查询一条数据
// @query 是匹配的原字符串
// @callback 是回调函数
MongoDatabase.prototype.findOne = function(query,callback){
	
	// 保存this
	var me = this;
	// 连接
	this.connect(this.connectStr,this.dbName,this.collectionName,function(error,coll,client){
		
		// 如果存在错误,直接输出错误，没有结果
		if(error){
			callback(error,null);
			return;
		}
		// 没有错误继续执行
		// 执行将要删除的query语句
		coll.findOne(query,function(err,result){
			// 插入之后关闭通道
			client.close();
			if(err){
				// 存在插入错误，输出插入错误和结果
				console.log("执行查询数据错误");
				callback(err,null);
				return;
			}
			console.log("执行查询数据成功");
			// 没有错误,不输出错误,输出结果
			callback(null,result);
		})
	})
}


// ********************查询多条数据 没有findMany方法，所以使用find方法
// @query 是匹配的原字符串
// @callback 是回调函数
MongoDatabase.prototype.findMany = function(query,callback){
	
	// 保存this
	var me = this;
	// 连接
	this.connect(this.connectStr,this.dbName,this.collectionName,function(error,coll,client){
		
		// 如果存在错误,直接输出错误，没有结果
		if(error){
			callback(error,null);
			return;
		}
		// 没有错误继续执行
		// 执行将要删除的query语句，找到转化为数组
		coll.find(query).toArray(function(err,result){
			// 插入之后关闭通道
			client.close();
			if(err){
				// 存在插入错误，输出插入错误和结果
				console.log("寻找多条数据错误");
				callback(err,null);
				return;
			}
			console.log("寻找多条数据成功");
			// 没有错误,不输出错误,输出结果
			callback(null,result);
		})
	})
}

// 暴露接口
module.exports = MongoDatabase;





// // 测试添加多条数据
// var database1 = new MongoDatabase("mongodb://localhost:27017","test","students");
// database1.insertMany([{name:"xiaoli",age:13},{name:"xiaoping",age:14}],function(err,result){
// 	console.log(err);
// 	console.log(result);
// })


// // 测试删除一条
// var database1 = new MongoDatabase("mongodb://localhost:27017","test","students");
// database1.deleteOne({name:"xiaoping"},function(err,result){
// 	console.log(err);
// 	console.log(result);
// })




// // // 测试更新一条
// var database1 = new MongoDatabase("mongodb://localhost:27017","test","students");
// database1.updateOne({name:"xiaoping"},{$set:{name:"xiaoyi"}},function(err,result){
// 	console.log(err);
// 	console.log(result);
// })

// // // 测试更新一条
// var database1 = new MongoDatabase("mongodb://localhost:27017","test","students");
// database1.updateMany({name:"xiaoyi"},{$set:{name:"xiaoliu"}},function(err,result){
// 	console.log(err);
// 	console.log(result);
// })

// // // // 测试查询一条
// var database1 = new MongoDatabase("mongodb://localhost:27017","test","students");
// database1.findOne({name:"xiaoliu"},function(err,result){
// 	console.log(err);
// 	console.log(result);
// })

// // // // 测试查询多条
// var database1 = new MongoDatabase("mongodb://localhost:27017","test","students");
// database1.findMany({name:"xiaoliu"},function(err,result){
// 	console.log(err);
// 	console.log(result);
// })


// 原型
// 通过连接客户端连接数据库
// mongoClient.connect(connectStr,{useNewUrlParser:true},function(error,client){
// 	// 其中error 是捕获的异常
// 	// client是连接起来的通道,之后的操作都要靠这条通道
	
// 	// 获取要连接的数据库
// 	var db = client.db('test');
// 	// 确定要操作的集合名称
// 	var students = db.collection('students');
// 	// 进行操作
// 	students.deleteOne({age:49},function(error,result){
// 		if(error){
// 			console.log(error);
// 			return;
// 		}
// 		console.log(result);
// 	})
// })