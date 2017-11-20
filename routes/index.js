var express = require("express");
// 创建一个路由对象
var router = express.Router();
// get路由
/*router.get("/",function(req,res){
	res.render("home");
});*/
router.get("/index",function(req,res){
	res.render("front/index",{title: "我的主页"});
});

module.exports = router;