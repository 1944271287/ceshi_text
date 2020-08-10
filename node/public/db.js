module.exports = {
    /**
     * 筛选函数
     * @param {*} _this
     * @param {*} parameter 调用参数
     */
    filterData: function(_this, parameter){
        var newData = parameter.data.filter((item,index)=>{
            return parameter.condition(item);
        });

        return {
            data: newData,
            total: newData.length
        }

    }
}