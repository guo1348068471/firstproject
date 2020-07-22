define(function(require,exports,module){
	
	// 获取添加的容器
	var $userfile_list = $("#userfile_list");
	
	var token = localStorage.getItem('token');
	// 获取用户的相册信息,并改变下面的脚注
	$.ajax({
		url:"/getuserAlbum",
		type:"get",
		dataType:"json",
		data:{token:token},
		success(data){
			// 将多条数据循环上树，添加脚注
			data.data.forEach(function(item){
				var html=[
					'<li class="list-group-item col-lg-2">',
					  '<!-- 2 -->',
					  '<div class="panel panel-default" >',
						'<div class="panel-body userfile" >',
						  '<img src="/web/images/floder.jpg" />',
						'</div>',
						'<div class="panel-footer">'+item.album_name+'</div>',
					  '</div>',
					'</li>',
				].join("");
				$userfile_list.append(html);
			})
		}
	})
})