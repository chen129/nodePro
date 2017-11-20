$(function(){
	// 登录模态框的显示与隐藏
	$("#login").click(function(event){
		event.preventDefault();
		$("#modal").show();
	});
	
	$("#dfuot").click(function(event){
		event.preventDefault();
		$("#modal").hide();
	});
	
	// 用户登录请求
	$("#login-form").submit(function(event){
		event.preventDefault();
		$.ajax({
			url:"/api/login",
			type:"post",
			data:$("#login-form").serialize()
		}).success(function(result){
			if(result){
				sessionStorage.setItem("loginUser", JSON.stringify(result[0]));
				// 页面刷新
				location.reload();
			}else{
				$("#msg").html("用户名或密码错误!");
			}
		});
	});
	
	// 当页面显示错误提示后，用户再次输入时清空错误提示
	$("#name,#pad").focus(function(){
		if ($("#msg").html()) {
			
			$("#msg").html("");
			
		}
	});

	var session = JSON.parse(sessionStorage.getItem("loginUser"));
	// var session = JSON.parse()
	if (session) {
		$(".user-login").html("<a href id='user'>" + session.name + "</a><a href id='rets'>退出</a>");
		
		$("#rets").click(function(){
			sessionStorage.clear();
			location.reload();
		})
	}
});