// 引入express
var express = require('express');
var app = express();

// 引入url，解析get请求，获取get请求参数
const url = require('url');

// 引入common自定义查询
const common = require('../../public/common.js');
// 引入数据列表
const student = require('../../api/data/student.js');
// 修改文件路径
const filePath = './api/data/student.js';

// 查询
app.all('/inquire',(req, res)=>{

    // 获取请求的数据
    const params = url.parse(req.url, true).query;
    var newArr = common.filterData(this,{
        data: student.data,
        isPage: false,
        pageSize: 2,
        currentPage: 3,
        returnField: ['id', 'name', 'age', 'sex'],
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
    var code = {
        code: 200,
        message: '新增成功',
    }

    do{
        var allocation = req.body.data; // 获取文件数据

        // 做唯一检验
        var newArr = common.filterData(this,{
            data: student.data,
            condition: (item)=>{
                return item.name == allocation.name; 
            }
        });

        if(newArr.data.length > 0){
            code.code = 301;
            code.message = '该名称已经存在';
            break;
        }

        code.id = common.addInsert(this, {
            data: student.data,
            path: filePath,
            isAddTime: true,
            form: allocation,
            field: {
                "name": '',
                "age": '',
                "sex": '',
                "class": '',
                "grade": '',
                "enrollment_year": ''
            }
        })
        
    }while(0);

    res.send(code);
})

// 删除
app.all('/remove', (req, res)=>{

    var allocation = req.body.data; // 获取文件数据 
    common.removeInsert(this,{
        data: student.data,
        path: filePath,
        id: allocation.id
    })

    var code = {
        code: 200,
        message: '删除成功',
    }

    res.send(code);

})

// 编辑
app.all('/edit', (req, res)=>{
    var code = {
        code: 200,
        message: '编辑成功',
    }

    do{
        var allocation = req.body.data; // 获取文件数据
        // 做唯一检验
        var newArr = common.filterData(this,{
            data: student.data,
            condition: (item)=>{
                return item.name == allocation.name && item.id != allocation.id; 
            }
        });

        if(newArr.data.length > 0){
            code.code = 301;
            code.message = '该名称已经存在';
            break;
        }

        code.id = common.editInsert(this, {
            data: student.data,
            path: filePath,
            isUpdateTime: true,
            form: allocation
        })

    }while(0);

    res.send(code);
})


module.exports = app;