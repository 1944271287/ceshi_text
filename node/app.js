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

// 引入自定义db文件
const db = require('./public/db.js');

// 读取文件
const studentss = fs.readFileSync('./api/data/student.js', 'utf-8');






// 引入学生信息
const student =  require('./api/data/student.js');
app.all('/ceshi',(req,res)=>{

    var newArr = db.filterData(this,{
        data: student.student,
        condition: (item)=>{
            return item.sex == '女' && item.class == '2班' && item.name.indexOf('离') != -1;
        }
    })


    var code = {
        data: newArr.data,
        totle: newArr.data.length,
        status:'成功调用测试接口，get请求',
        status_code: 200,
    }
    res.send(code);
})

