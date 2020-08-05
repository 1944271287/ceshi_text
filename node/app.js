// 引入express
var express = require('express');
var app = express();

// 引入cors，解决跨域的问题
const cors = require('cors')
app.use(cors())

// 开启服务,监听8888端口
app.listen(8888,(req,res)=>{
    console.log('您的应用程序正在这里运行：http://localhost:8888');
})

// 引入学生信息
const student =  require('./api/data/student.js')

app.all('/ceshi',(req,res)=>{
    var code = {
        data: student,
        status:'成功调用测试接口，get请求',
        status_code: 200,
    }
    res.send(code);
})