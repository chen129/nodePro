// 加载express模块
var express = require("express");
// 创建一个服务
var app = express();
// 加载body-parser模板处理post请求
var bodyParser = require("body-parser");

// 加载模板处理引擎
var swig = require("swig");

// 加载cookies中间件
var Cookies = require('cookies'); 

// 加载读取配置文件模块，默认以default配置文件作为配置
var config = require("config-lite");

/*// 加载express-session中间件,运行于服务器端
var session = require("express-session");
// 加载express-mysql-session模块，将session存储到mysql中，结合express-session使用
var sessionsql = require("express-mysql-session");
// 页面通知提示的中间件，基于session实现
var flash = require("connect-flash");*/

// 引入path对路径进行解析
var path = require("path");
// 加载数据库连接文件
var conn = require("./lib/db");setTimeout(function() {}, 10);
// 使用express.static托管静态文件,设置静态文件路径
app.use("/public", express.static(path.join(__dirname, "public")));

// 设置模板路径
app.set("/views", path.join(__dirname, "views"));
// 定义当前模板使用的模板引擎，第一个参数为解析的模板的后缀名，第二个参数使用swig这个模板解析器去读取解析.html文件
app.engine("html", swig.renderFile);
// 注册模板使用的引擎，第一个参数必须为view engine ，第二个参数要与app.engine中的第一个参数一致
app.set("view engine", "html");

// 设置bodyParser
app.use(bodyParser.urlencoded({ extended:false }));

/*// session 中间件
app.use(session({
	name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
	secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
	resave: true,// 强制更新 session
	saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
	cookie: {
		maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
	},
	store: new MongoStore({// 将 session 存储到 mongodb
    	url: config.mongodb// mongodb 地址
	})
}));
// flash 中间件，用来显示通知
app.use(flash());*/

// 设置模板引擎不使用缓存  在开发的过程中不使用缓存，在上线之后在使用缓存
swig.setDefaults({cache:false});


// 使用cookies中间件，不管什么请求，都会执行我们以下的这个代码
app.use(function(req,res,next){
    // 给req对象增加一个cookies对象
    req.cookies = new Cookies(req,res);
    // 在req对象上绑定一个属性，这个属性将来用来保存登录用户的信息
    req.users = {};
    // req.originalUrl  这个可以获取当前访问的路径地址
    var url = req.originalUrl;
    // 当访问的不是首页以及登陆路由的时候，我们需要去验证登陆用户的信息
    // 登陆了就将cookies中的信息放到req.users
    // 如果没有登陆，直接重定向到首页
   /* if(!req.cookies.get("user") && url != "/" && url != "/api/login"){
        return res.redirect("/");
    }*/
    if(req.cookies.get("users")){
       req.user = JSON.parse(req.cookies.get("users"));
    }
    next();
});


// 加载页面路由
app.use("/front",require("./routes/index.js"));

// API接口路由
app.use("/api",require("./routes/api.js"));

//app.use(require('./routes/index'))

/*
 * req 请求
 * res 响应
 */
/*app.get("/", function (req, res) {
	
	res.send("hello express");
	
});*/

/*
*	req   request对象   请求对象
*	res   response      响应对象
*   next  方法   用来执行和下一个路径匹配的函数   进行一个传递	
*/
app.get("/",function(req,res){
	res.render( "home", {users: req.user} );
});


// 设置服务监听窗口
/*// supervisor --harmony index
var server = app.listen(8082, function () {
	
	
	console.log("应用程序启动成功，访问localhost:8082");
	
});*/

// 调用方法获取连接
var connection = conn.getConnection();
connection.connect(function(err) {
  if (err) {
    console.log("数据库连接失败");
    return;
  }
  // 设置服务监听的端口
  console.log("数据库连接成功");
	app.listen(8082,function(){
      connection.end();
		  console.log("应用程序启动成功,访问 localhost:8082");
	});
});