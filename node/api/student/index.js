// 引入express
var express = require('express');
var app = express();

// 引入url，解析get请求，获取get请求参数
const url = require('url');

// 引入common自定义查询
const common = require('../../public/common.js');

// 引入数据列表
const student = require('../../api/data/student.js');

var data  = require('../../assets/student.js').data;

// 查询
app.all('/inquire', (req, res) => {


    // 获取请求的数据
    const params = url.parse(req.url, true).query;
    var newArr = common.filterData(this, {
        isPage: false,
        pageSize: 2,
        currentPage: 3,
        data: data,
        condition: (item) => {
            var verify = {
                sex: params.sex ? (params.sex == item.sex) : true, // 性别
                name: params.name ? (item.name.indexOf(params.name) != -1) : true, // 名称
                class: params.class ? (params.class == item.class) : true, // 班级
            }

            return verify.sex && verify.name && verify.class;
        },
        isSort: (a, b) => {
            return b.id - a.id;
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
app.all('/add', (req, res) => {
    var code = {
        code: 200,
        message: '新增成功',
    }

    do {
        var allocation = req.body.data; // 获取文件数据

        var returnData = common.addInsert(this, {
            form: allocation,
            fileDeployKey: 'student',
            field: {
                "name": '',
                "age": '',
                "sex": '',
                "class": '',
                "grade": '',
                "enrollment_year": ''
            },
            isTheOnlyText: (item) => {
                return item.name == allocation.name;
            }
        })

        // 唯一检验不通过
        if (returnData.theOnly) {
            code.code = 301;
            code.message = '该名称已经存在';
            break;
        }

    } while (0);

    res.send(code);
})

// 删除
app.all('/remove', (req, res) => {

    var allocation = req.body.data; // 获取文件数据 
    common.removeInsert(this, {
        id: allocation.id,
        fileDeployKey: 'student',
    })

    var code = {
        code: 200,
        message: '删除成功',
    }

    res.send(code);

})

// 编辑
app.all('/edit', (req, res) => {

    var code = {
        code: 200,
        message: '编辑成功',
    }

    do {
        var allocation = req.body.data; // 获取文件数据

        var returnData = common.editInsert(this, {
            form: allocation,
            fileDeployKey: 'student',
            isTheOnlyText: (item) => {
                return item.name == allocation.name && item.id != allocation.id;
            }
        })

        // 唯一检验不通过
        if (returnData.theOnly) {
            code.code = 301;
            code.message = '该名称已经存在';
            break;
        }

    } while (0);

    res.send(code);
})

/**
 * 查询班级、年级
 * @param {*} pid 根据pid进行查询
 */
app.all('/inquireClass', (req, res) => {
    // 获取请求数据
    var returnData = {
        code: 200,
        message: '请求成功'
    }
    var data = require('../../assets/gradeClass.js').data;
    const params = url.parse(req.url, true).query;

    var data = common.filterData(this, {
        data: data,
        condition: (item) => { // 筛选
            return item.pid == params.pid;
        }
    })
    returnData.list = data.data;

    res.send(returnData)
})


module.exports = app;