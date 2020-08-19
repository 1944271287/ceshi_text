/**
 * 数据库连接模块,配置
 * 2020-8-17 16:05:35
 * @param host  主机地址
 * @param user  用户名
 * @param password  数据库密码
 * @param port  端口号
 * @param database  数据库名称
 * @param charset  连接字符集
 * @param connectionLimit  连接超时
 * @param supportBigNumbers  数据库支持bigint或decimal类型列时，需要设置为true
 * @param bigNumberStrings  supportBigNumbers和bigNumberStrings启用 强制bigint或decimal列以JavaScript字符串类型返回（默认：false）
 * @param debug  是否开启调式
 */

 
    
var mysql = require('mysql');

// 数据库配置
module.exports = {
    /**
     * 数据库配置
     */
    config: {
        'host': '120.78.152.53',
        'user': 'root',
        'password': 'root',
        'port': '3306',
        'database': 'light_fixture',
    },
    conn: null,

    /**
     * 创建连接池并连接
     * @param callback
     */
    openConn: function (callback) {
        var me = this;
        console.log('me.config.host', me.config);
        me.conn = mysql.createConnection(me.config);
    },

    /**
     * 释放连接池
     * @param conn
     */
    closeConn: function () {
        var me = this;
        me.conn.end(function (err) {
            // console.log(err);
        });
    },

    /**
     * 执行连接
     * @param config
     */
    exec: function (config) {
        const me = this;
        me.openConn();
        me.conn.query(config.sql, config.params, function (err, res) {
            if (err) {

            } else if (config.callback) {
                config.callback(res);
            }
            // 关闭数据库连接
            me.closeConn();
        });
    }
};