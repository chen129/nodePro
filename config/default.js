/*
 * port：程序启动要监听的端口号
 * session：express-session的配置信息
 * mysql:地址，mysql://localhost:27017/myblog
 */

/*module.exports = {
  port: "",
  session: {
    secret: '',
    key: '',
    maxAge: 
  },
  mysql:""
};*/

var dbConfig = {
	// 所访问的数据库所在的主机名
  	host : 'localhost',
  	// 数据库的账号
 	user : 'root',
 	// 数据库的密码
  	password : '123',
  	// 连接的数据库名称
  	database : 'test',
  	// 数据库服务所在的端口号
  	port : "3306"
}

module.exports = dbConfig;