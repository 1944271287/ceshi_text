// 引入文件操作
const fs = require('fs');

module.exports = {
    /**
     * 筛选函数
     * @param {*} _this
     * @param {*} config
     * @param {*} config.data 筛选数据
     * @param {*} config.condition 筛选条件
     */
    filterData: function(_this, config){
        var newData = config.data.filter((item,index)=>{
            return config.condition(item);
        });

        return {
            data: newData,
            total: newData.length
        }

    },

    /**
     * 插入文件
     * @param {*} _this
     * @param {*} config
     * @param {*} config.data 插入文件内容
     * @param {*} config.path 插入文件路径
     * @param {*} config.onError 插入失败回调
     * @param {*} config.onSucceed 插入成功回调
     */
    insertionFile: function(_this, config){
        var text = `
            var data = `+ JSON.stringify(config.data) +`;

            module.exports = {
                data: data
            };
        `;
            
        fs.writeFile(config.path, text, (err)=>{
            // console.log('err------>', err);
            if(err && config.onError){
                config.onError(err);
            }

            if(config.onSucceed){
                config.onSucceed('插入成功');
            }
        })

    },

    /**
     * 添加一条数据，id默认自增，返回插入之后的id
     * @param {*} _this
     * @param {*} config
     * @param {*} config.data 原来的数据列表
     * @param {*} config.path 插入文件路径
     * @param {*} config.form 插入的表单数据
     * @param {*} config.field 插入的字段
     * @param {*} config.isAddTime 是否添加创建时间和更新时间
     */
    addInsert: function(_this, config){
        var id = config.data[0] ? config.data[0].id : 0;
        config.field['id'] = id + 1;

        for(var k in config.form){
            config.field[k] = config.form[k];
        }

        
        // 是否添加时间，
        if(config.isAddTime){
            config.field.creation_time = this.getPresentDate();
            config.field.update_time = this.getPresentDate();
        }

        config.data.unshift(config.field);

        this.insertionFile(this, {
            data: config.data,
            path: config.path,
            onError: (error)=>{
                // console.log('插入失败', error);
            }
        })
        return id + 1;

    },

    /**
     * 删除一条数据
     * @param {*} _this
     * @param {*} config
     * @param {*} config.data 操作的数据
     * @param {*} config.path 插入文件路径
     * @param {*} config.id 删除数据的id
     */
    removeInsert: function(_this, config){
        for(var i=0; i<config.data.length; i++){
            if(config.id == config.data[i].id){
                config.data.splice(i,1);
                break;
            }
        }
        this.insertionFile(this, {
            data: config.data,
            path: config.path
        })
    },

    /**
     * 编辑一条数据
     * @param {*} _this
     * @param {*} config
     * @param {*} config.data 操作的数据
     * @param {*} config.path 插入文件路径
     * @param {*} config.form 接受的表单数据
     */
    editInsert: function(_this, config){
        if(!config.form.id){
            return '编辑的失败';
        }

        for(var i=0; i<config.data.length; i++){
            var item = config.data[i];
            if(config.form.id = item.id){
                for(var k in config.form){
                    item[k] = config.form[k];
                }
                break;
            }
        }
        this.insertionFile(this, {
            data: config.data,
            path: config.path,
            onError: (error)=>{
                // console.log('插入失败', error);
            }
        });

        return config.form.id;
    },

    /**
     * 获取当前时间
     * @param {*} _this
     * @param {*} config
     * @param {*} config.format 返回格式，默认yyyy-MM-dd hh:mm:ss
     */
    getPresentDate: function(_this,config){
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth() + 1;//得到月份
        var date = now.getDate();//得到日期
        var day = now.getDay();//得到周几
        var hour = now.getHours();//得到小时
        var minu = now.getMinutes();//得到分钟
        var sec = now.getSeconds();//得到秒
        var MS = now.getMilliseconds();//获取毫秒

        month = month > 10? month:("0" + month);
        date = date > 10? date:("0" + date);
        hour = hour > 10? hour:("0" + hour);
        minu = minu > 10? minu:("0" + minu);
        sec = sec > 10? sec:("0" + sec);
        
        var format = config ? config.format : '';
        if(!format || format == 'yyyy-MM-dd hh:mm:ss' || format == 'dateTime'){

            return year + '-' + month + '-' + date + ' ' + hour+':'+minu+':'+sec;
        }else if(format == 'yyyy-MM-dd' || format == 'date'){

            return year + '-' + month + '-' + date;
        }else if(format == 'MS' || format == 'millisecond'){

            return ms;
        }

    }
}