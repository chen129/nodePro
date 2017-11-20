// 加载模块（express）
var express = require("express");
// 创建一个路由对象
var router = express.Router();
// 引入path对路径进行解析
var path = require("path");
// 引入文件系统
var fs = require("fs");
// 加载数据库连接文件
var conn = require("../lib/db");

// 注册接口
router.post("/regest",function(req,res,next){
	var obj = {};
	if (req.busboy) { 
		// 从req.busboy中获取所传递过来的其他的表单字段
		req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
			obj[key] = value;
	    });  
	    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {  
	    	// 所保存的目录
	    	var pathName = new Date().getTime() + path.basename(filename);
	        var saveTo = path.join(__dirname.replace('routes', 'public/upfile'), pathName);  
	        // 将文件保存在服务器对应的文件位置
	        file.pipe(fs.createWriteStream(saveTo)); 
	        // 当文件上传完成之后，进行数据库保存操作
	        file.on('end', function () { 
	            var sql = "insert into user (account,pwd,isadmin,amount,sum,imgfile) values (?,?,?,?,?,?)";
				var sqlParam = [obj.account,obj.pwd,0,0,0,"public/upfile/"+pathName];
				// 调用方法获取连接
				var connection = conn.getConnection();
				connection.query(sql,sqlParam,function(err, results) {
					if(results.affectedRows){
						res.send(true);
					}else{
						res.send(false);
					}
				});
				// 关闭连接
				connection.end(function(err){
					console.log("连接关闭");
				});
	        });
	    }); 
	    req.pipe(req.busboy);  
	}  
});

// 查询用户名是否存在节api接口
router.post("/checkAccount",function(req,res,next){
	// 定义查询sql字符串
	var sql = "select * from user where account = ?";
	// 以数组的形式替代sql语句中的？
	var sqlParam = [req.body.account];
	// 调用方法获取连接
	var connection = conn.getConnection();
	// 通过连接执行数据库操作
	connection.query(sql,sqlParam,function(err,results){
		if(results.length){
			res.send(false);
		}else{
			res.send(true);
		}
	});
	// 关闭连接
	connection.end(function(err){
		console.log("连接关闭");
	});
});


// 登陆的请求
router.post("/login",function(req,res,next){
	// 定义查询sql字符串
	var sql = "select * from users where name = ? and pad = ?";
	// 以数组的形式替代sql语句中的？
	var sqlParam = [req.body.name,req.body.pad];
	// 调用方法获取连接
	var connection = conn.getConnection();
	// 通过连接执行数据库操作
	connection.query(sql,sqlParam,function(err,results){
		if(results.length){
			// 对应的在浏览器的cookie中会保存一份
			req.cookies.set("users",JSON.stringify(results[0]));
			res.send(results);
		}else{
			res.send(false);
		}
	});
	// 关闭连接
	connection.end(function(err){
		console.log("连接关闭");
	});
});

// 退出登陆的接口
router.get("/logout",function(req,res,next){
	req.cookies.set("user",null);
	res.send(true);
});


module.exports = router;