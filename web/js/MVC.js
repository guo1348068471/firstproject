// 在这边设置MVC框架,并返回接口
var MVC = (function() {
	// M层 在这里再添加一层IFIE,允许其他层访问和添加，不允许其他层修改
	M = (function() {

		var data = {

		}

		// 返回数据层的接口,只能执行函数,不怕修改数据
		return {

			// 添加数据
			addData(name, value) {

				// 这边设置的name都是打点,需要像namespace那样存储
				var path = name.split(".");

				// 保存data的地址
				var result = data;

				// 循环创建元素
				for (var i = 0; i < path.length - 1; i++) {
					// null的类型也是object
					if (typeof result[path[i]] == "object" && result[path[i]] != null) {

						// 存在，没问题，前往下一层
						result = result[path[i]];
					} else if (typeof result[path[i]] == "undefined") {

						// 不存在，未定义
						result[path[i]] = {};
						// 创建之后前往下层
						result = result[path[i]];
					} else {

						// 存在问题,不能在值类型上上面定对象,路径填写错误
						throw new Error("存在问题,不能在值类型上上面定对象,路径填写错误");
					}
				}
				// 到达最后一个
				if (typeof result[path[i]] == "undefined") {
					// 不存在,可以定义
					result[path[i]] = value;
				} else {

					throw new Error("位置已被占用");
				}

			},

			// 获取数据
			getData(name) {

				// 这边设置的name都是打点,需要像namespace那样寻找数据
				var path = name.split(".");

				// console.log(path)
				// 保存data的地址
				var result = data;

				// 循环创建元素
				for (var i = 0; i < path.length - 1; i++) {
					// null的类型也是object,      这句话的意思就是：存在这么一个对象，
					if (typeof result[path[i]] == "object" && result[path[i]] != null) {

						// 存在，没问题，前往下一层
						result = result[path[i]];
					} else {

						throw new Error("存在问题,填写路径有错");
					}
				}

				return result[path[i]];

			}

		}
	})();


	// V层 在这里再添加一层IFIE,允许其他层访问和添加，不允许其他层修改
	V = (function() {

		var data = {

		};

		return {

			// 创建视图
			addNewView(name, fn) {

				data[name] = fn;
			},

			// 渲染视图
			renderView(name) {

				// 这边也需要return,及时调用的时候有返回,这边也需要接力返回
				return data[name](M);
			}
		}
	})();

	// C层 在这里再添加一层IFIE,允许其他层访问和添加，不允许其他层修改
	C = (function() {

		var data = {

		}

		return {

			// 添加控制
			addNewCtrl(name, fn) {

				data[name] = fn;

			},

			// 执行全部控制
			init() {

				for (var i in data) {

					data[i](M, V);
				}
				// console.log("C",data);
			}


		}
	})();

	return {

		// 添加数据
		addModule(name, value) {

			M.addData(name, value);
		},

		// 添加视图
		addView(name, fn) {

			V.addNewView(name, fn);
		},

		// 添加控制
		addCtrl(name, fn) {

			C.addNewCtrl(name, fn);
		},

		// 执行所有的控制
		install() {

			C.init();
		}
	}
})()

// console.log(MVC);
