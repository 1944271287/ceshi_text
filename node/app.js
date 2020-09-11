// 引入express
var express = require('express');
var app = express();

// 引入文件操作系统，fs
const fs = require('fs');

// 引入cors，解决跨域的问题
const cors = require('cors')
app.use(cors())

// 引入body-parser，处理post请求数据
const bodyPaeser =require('body-parser');
app.use(bodyPaeser.json());//数据JSON类型
app.use(bodyPaeser.urlencoded({ extended: false }));//解析post请求数据

// 开启服务,监听8888端口
app.listen(8888,(req,res)=>{
    console.log('您的应用程序正在这里运行：http://localhost:8888');
})

// 引入path，默认加载视图中的index.html文件
var path = require("path");
app.use(express.static(path.resolve(__dirname, './view')));

// 引入学生列表请求
const student = require('./api/student/index.js');
app.use('/student', student);

//test
// app.all('/ceshi',(req,res)=>{
//     var db = require('./public/db.js');
//     db.exec({
//         sql: 'select * from urer',
//         params: [],
//         callback: function (r) {
//             console.log('连接错误了吗------->');
//             console.log(r);
//         }
//     })
//     var code = {
//         data: [],
//         status:'成功调用测试接口，get请求',
//         status_code: 200,
//     }
//     res.send(code);
// })

app.all('user/login', (req, res)    =>{
    var code = {
        data: [],
        status:'成功调用测试接口，get请求',
        status_code: 200,
    }
    res.send(code);
})

var qr = require('qr-image')

app.get('/create_qrcode', function (req, res, next) {
  var text = '丑猪猪，最丑的小猪猪！！哈哈哈哈哈';
  try {
    var img = qr.image(text,{size :10});
    res.writeHead(200, {'Content-Type': 'image/png'});

    var imgs = img.pipe(res);
    console.log('imgs---->', imgs);
  } catch (e) {
    res.writeHead(414, {'Content-Type': 'text/html'});
    res.end('<h1>414 Request-URI Too Large</h1>');
  }
})