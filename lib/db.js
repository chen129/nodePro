// 注入mysql依赖
var mysql = require("mysql");
var conn = {};

conn.getConnection = function(){
	// 创建一个新的连接
	return mysql.createConnection(require("../config/default.js"));
}

module.exports = conn;
