define(function(require,exports,module){
	
	var Observer = require("../../tools/tool").Observe;
	
	require("../../common/tips");
	
	// 获取输入框和按钮对象
	var $Album_name = $("#Album_name");
	var $create_btn = $("#create_btn");
	var $album_list = $("#album_list");
	// 获取token,用于发送请求
	var token = localStorage.getItem("token");
	// 当点击按钮的时候获取输入框的内容
	$create_btn.click(function(){
		var val = $Album_name.val();
		if(val === ""){
			// 不创建空文件夹
			return ;
		}
		// 点击之后内容框清空
		$Album_name.val("");
		// 发送ajax请求
		$.ajax({
			url:"/createAlbum",
			type:"get",
			dataType:"json",
			data:{
				value:val,
				token:token
			},
			success(data){
				// 获取到数据之后
				var share = data.share;
				var Album_name = data.Album_name;
				// 接下来要做到是上树
				var html=[
					'<li class="list-group-item">',
					  '<p><span>'+Album_name+'</span></p>',
					  '<p><input type="checkbox" checked data-albumname='+Album_name+'></span></p>',
					  '<p><span class="delete_btn" data-albumname='+Album_name+'>&times;</span></p>',
					'</li>',
				].join("");
				$album_list.append(html);
			}
		})
	})
	
	// 刷新页面或者打开页面发送ajax 重新渲染列表
	$.ajax({
		url:"/getuserAlbum",
		type:"get",
		dataType:"json",
		data:{token:token},
		success(data){
			// 将多条数据循环上树
			data.data.forEach(function(item){
				var html=[
					'<li class="list-group-item">',
					  '<p><span>'+item.album_name+'</span></p>',
					  '<p><input type="checkbox" '+(item.share === 'true' ? "checked" : "")+' data-albumname='+item.album_name+'></span></p>',
					  '<p><span class="delete_btn" data-albumname='+item.album_name+'>&times;</span></p>',
					'</li>',
				].join("");
				$album_list.append(html);
			})
		}
	})
	
	// 点击共享按钮
	$album_list.on("click","input",function(){
		// 获取状态值
		var state = this.checked;
		// 获取该对象的相册名,使用自定义变量
		var album_name = $(this).attr("data-albumname");
		
		// 发送ajax请求修改后台数据
		$.ajax({
			url:"/changeAlbumstate",
			type:"get",
			dataType:"json",
			data:{
				token:token,
				state:state,
				album_name:album_name
			},
			success(data){
				if(data.error){
					Observer.trigger("msg",'修改状态失败')
					return;
				}
			}
		})
	})

	// 点击删除按钮,发送ajax,删除文件夹,删除数据库,下树
	$album_list.on("click",".delete_btn",function(){
		
		var me = $(this);
		var album_name = me.attr("data-albumname");
		// console.log(album_name)
		$.ajax({
			url:"/deleteAlbum",
			data:{
				token:token,
				album_name:album_name
			},
			type:"get",
			dataType:"json",
			success(data){
				if(data.error){
					// 输出相册删除失败
					Observer.trigger('msg',data.data);
					return;
				}
				// 删除成功
				Observer.trigger('msg',data.data);
				// 下树,删除自己所在的li
				me.parent().parent().remove();
			}
		})
	})
		
})