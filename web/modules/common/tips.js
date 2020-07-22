define(function(require,exports,module){
	
	var Observer = require("../tools/tool").Observe;
	
	var $myModal = $("#myModal");
	var $myModal_html = $("#myModal_html");
	
	// 加入观察者模式中
	Observer.on("msg",function(data){
		
		$myModal.modal();
		$myModal_html.html(data);
	})
})