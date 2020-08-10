// 引入express
var express = require('express');
var app = express();
const fs = require('fs');

// 引入url，解析get请求，获取get请求参数
const url = require('url');

// 引入db自定义查询
const db = require('../../public/db.js');
// 引入数据列表
const data = require('../../api/data/student.js');

// 查询
app.all('/inquire',(req, res)=>{

    // 获取请求的数据
    const params = url.parse(req.url, true).query;

    var newArr = db.filterData(this,{
        data: data.student,
        condition: (item)=>{
            var verify = {
                sex: params.sex ? (params.sex == item.sex) : true, // 性别
                name: params.name ? (item.name.indexOf(params.name) != -1) : true, // 名称
                class: params.class ? (params.class == item.class) : true, // 班级
            }

            return verify.sex && verify.name && verify.class; 
        }
    })

    var code = {
        code: 200,
        message: '请求成功',
        list: newArr.data,
    }

    res.send(code);
})

// 新增
app.all('/add', (req, res)=>{
    console.log(req.body.data);

    // return false;
    var allocation = req.body.data; // 获取文件数据 

    var list = data.student,
    index = data.student.length - 1;
    var id = index < 0 ? 0: list[index].id;
    var obj = {
        "id": id + 1,
        "name": allocation.name,
        "age": allocation.age,
        "sex": allocation.sex,
        "class": allocation.class,
        "grade": allocation.grade,
        "enrollment_year": allocation.enrollment_year
    }
    console.log('allocation------->', allocation);

    list.unshift(obj);
    
    readFile(list);

    var code = {
        code: 200,
        message: '新增成功',
        id: id + 1
    }

    res.send(code);

})

// 删除
app.all('/remove', (req, res)=>{
    // return false;
    var allocation = req.body.data; // 获取文件数据 
    var list = data.student;

    for(var i=0; i<list.length; i++){
        if(allocation.id == list[i].id){
            list.splice(i,1);
            break;
        }
    }
    readFile(list);
    var code = {
        code: 200,
        message: '删除成功',
    }

    res.send(code);

})

// 编辑
app.all('edit', (req, res)=>{

})

const readFile = function(list){
    var text = `
        var student = `+ JSON.stringify(list) +`;

        module.exports = {
            student: student
        };
    `;
        
    fs.writeFile('./api/data/student.js', text, (err)=>{
        console.log('err------>', err);
    })
    
}


module.exports = app;