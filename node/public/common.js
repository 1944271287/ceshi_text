// 引入文件操作
const fs = require('fs');
// 引入文件模板
const fileInfo = require('../assets/fileConfigurationInfo.js');


// 是否开启自动添加创建时间(creation_time)和更新时间(update_time)，默认添加，如果不需要添加，则改为false;
const isOpenAutoAddUpdateTime = true;

module.exports = {
    /**
     * 筛选函数
     * @param {*} _this
     * @param {*} config
     * @param {*} config.data  筛选的数据
     * @param {*} config.condition 筛选条件, Function
     * @param {*} config.isSort 是否排序，Function
     * @param {*} config.isPage 是否分页, Boolean
     * @param {*} config.pageSize 每页多少条, number
     * @param {*} config.currentPage 当前页, number
     * @param {*} config.returnField 返回字段, array
     * @param {*} config.fileDeployKey 文件配置关键字
     */
    filterData: function (_this, config) {

        // var fileDeploy = fileInfo[config.fileDeployKey], // 获取配置信息
        //     path = '..' + fileDeploy.filePath, // 文件路径
        //     newData = JSON.parse(JSON.stringify(require(path).data)); // 文件列表数据

        var newData = JSON.parse(JSON.stringify(config.data)); // 文件列表数据

        // 筛选条件
        if (config.condition) {
            newData = newData.filter((item, index) => {
                return config.condition(item);
            });
        }

        // 是否进行排序
        if (config.isSort) {
            newData.sort(config.isSort);
        }

        // 是否分页
        if (config.isPage) {
            var start = (config.pageSize * config.currentPage - config.pageSize),
                end = start + config.pageSize;
            newData = newData.slice(start, end);
        }

        // 返回指定字段
        if (config.returnField) {
            var arr = [];
            for (var i = 0; i < newData.length; i++) {
                var item = this.recombination(newData[i], config.returnField);
                arr.push(item)
            }
            newData = arr;
        }

        return {
            data: newData,
            total: newData.length
        }

    },
    /**
     * 重组数据
     * @param {*} item  值
     * @param {*} field 字段
     */
    recombination: function (item, field) {
        var obj = {};
        for (var i = 0; i < field.length; i++) {
            var k = field[i];
            obj[k] = item[k];
        }
        return obj;
    },

    /**
     * 插入文件
     * @param {*} _this
     * @param {*} config
     * @param {*} config.data 插入文件内容
     * @param {*} config.path 插入文件路径
     * @param {*} config.onError 插入失败回调
     * @param {*} config.onSucceed 插入成功回调
     * @param {*} config.customTemplate 是否自定义模板，如果该项值存在，则插入传入的模板
     */
    insertionFile: function (_this, config) {

        var text = `
            module.exports = {
                data: `+ JSON.stringify(config.data) + `
            };
        `;


        if (config.customTemplate) {
            text = fileInfo[config.customTemplate].fileLayout(config.data);
        }

        fs.writeFileSync(config.path, text)

    },

    /**
     * 添加一条数据，id默认自增，返回插入的数据
     * @param {*} _this
     * @param {*} config
     * @param {*} config.form 插入的表单数据
     * @param {*} config.field 插入的字段
     * @param {*} config.fileDeployKey 文件配置关键字
     * @param {*} config.isTheOnlyText 是否做唯一检验
     */
    addInsert: function (_this, config) {

        var fileDeploy = fileInfo[config.fileDeployKey], // 获取配置信息
            path = '..' + fileDeploy.filePath, // 文件路径
            data = JSON.parse(JSON.stringify(require(path).data)); // 文件列表数据

        // 判断是否做唯一检验
        if (config.isTheOnlyText) {
            var list = this.filterData(this, {
                data: data,
                condition: config.isTheOnlyText
            }).data;

            if (list.length > 0) {
                return {theOnly: true};
            }
        }

        // 排序，获取最大的id
        var list = this.filterData(this, {
            data: data,
            isSort: (a, b) => {
                return b.id - a.id;
            }
        }).data;

        // 判断id是否存在，如果存在，则id++，否则id等于1
        config.field['id'] = list[0] ? (list[0].id + 1) : 1;

        // 获取添加的字段值
        for (var k in config.form) {
            config.field[k] = config.form[k];
        }

        // 是否添加时间
        if (fileDeploy.isOpenAutoAddUpdateTime) {
            config.field.creation_time = this.getPresentDate();
            config.field.update_time = this.getPresentDate();
        }

        // 添加一条数据
        data.push(config.field);

        // 重新插入文本
        this.insertionFile(this, {
            data: data,
            path: '.' + fileDeploy.filePath,
            customTemplate: config.fileDeployKey
        })

        return config.field;
    },

    /**
     * 删除一条数据
     * @param {*} _this
     * @param {*} config
     * @param {*} config.data 操作的数据
     * @param {*} config.path 插入文件路径
     * @param {*} config.id 删除数据的id
     * @param {*} config.fileDeployKey 是否自定义模板
     */
    removeInsert: function (_this, config) {

        var fileDeploy = fileInfo[config.fileDeployKey], // 获取配置信息
            path = '..' + fileDeploy.filePath, // 文件路径
            data = JSON.parse(JSON.stringify(require(path).data)); // 文件列表数据

        for (var i = 0; i < data.length; i++) {
            if (config.id == data[i].id) {
                data.splice(i, 1);
                break;
            }
        }

        this.insertionFile(this, {
            data: data,
            path: '.' + fileDeploy.filePath,
            customTemplate: config.fileDeployKey
        })
    },

    /**
     * 编辑一条数据
     * @param {*} _this
     * @param {*} config
     * @param {*} config.form 接受的表单数据
     * @param {*} config.fileDeployKey 是否自定义模板
     * @param {*} config.isTheOnlyText 是否做唯一检验
     */
    editInsert: function (_this, config) {

        var fileDeploy = fileInfo[config.fileDeployKey], // 获取配置信息
            path = '..' + fileDeploy.filePath, // 文件路径
            data = JSON.parse(JSON.stringify(require(path).data)); // 文件列表数据

        // 判断是否做唯一检验
        if (config.isTheOnlyText) {
            var list = this.filterData(this, {
                data: data,
                condition: config.isTheOnlyText
            }).data;

            if (list.length > 0) {
                return false;
            }
        }

        // 更新该条数据的信息
        for (var i = 0; i < data.length; i++) {
            var item = data[i];

            if (config.form.id == item.id) {
                for (var k in config.form) {
                    item[k] = config.form[k];

                    // 是否更新时间，
                    if (fileDeploy.isOpenAutoAddUpdateTime) {
                        item.update_time = this.getPresentDate();
                    }
                }
                break;
            }
        }

        this.insertionFile(this, {
            data: data,
            path: '.' + fileDeploy.filePath,
            customTemplate: config.fileDeployKey
        });

        return config.form.id;
    },

    /**
     * 获取当前时间
     * @param {*} _this
     * @param {*} config
     * @param {*} config.format 返回格式，默认yyyy-MM-dd hh:mm:ss
     */
    getPresentDate: function (_this, config) {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth() + 1;//得到月份
        var date = now.getDate();//得到日期
        var day = now.getDay();//得到周几
        var hour = now.getHours();//得到小时
        var minu = now.getMinutes();//得到分钟
        var sec = now.getSeconds();//得到秒
        var MS = now.getMilliseconds();//获取毫秒

        month = month > 10 ? month : ("0" + month);
        date = date > 10 ? date : ("0" + date);
        hour = hour > 10 ? hour : ("0" + hour);
        minu = minu > 10 ? minu : ("0" + minu);
        sec = sec > 10 ? sec : ("0" + sec);

        var format = config ? config.format : '';
        if (!format || format == 'yyyy-MM-dd hh:mm:ss' || format == 'dateTime') {

            return year + '-' + month + '-' + date + ' ' + hour + ':' + minu + ':' + sec;
        } else if (format == 'yyyy-MM-dd' || format == 'date') {

            return year + '-' + month + '-' + date;
        } else if (format == 'MS' || format == 'millisecond') {

            return ms;
        }

    }
}