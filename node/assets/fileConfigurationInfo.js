/**
 * 
 */

module.exports = {

    // student.js 配置信息
    student: {
        // 是否自动添加创建时间、更新时间
        isOpenAutoAddUpdateTime: true,

        // 文件修改路径
        filePath: '/assets/student.js',

        // 文件数据列表


        // 文件内容
        fileLayout: function (data) {
            var text = `
            /** 
             * 学生信息列表
             * @param {*} id  唯一标识,自增
             * @param {*} name  名称
             * @param {*} age  年龄
             * @param {*} sex  性别
             * @param {*} class 班级
             * @param {*} grade  年级
             * @param {*} enrollment_year  入学年份
             * @param {*} creation_time 创建时间
             * @param {*} update_time 更新时间
            */
           module.exports = {
               data: `+ JSON.stringify(data) + `
           }
        `;
            return text;
        }
    },

    // gradeClass.js 配置信息
    gradeClass: {
        // 是否自动添加创建时间、更新时间
        isOpenAutoAddUpdateTime: true,

        // 文件路径
        filePath: '/assets/gradeClass.js',

        // 文件内容
        fileLayout: function (data) {
            var text = `
            /** 
             * 年级、班级信息列表
             * @param {*} id  唯一标识,自增
             * @param {*} name  名称
             * @param {*} code 编号
             * @param {*} grade  年级
             * @param {*} pid  上级id
             * @param {*} creation_time 创建时间
             * @param {*} update_time 更新时间
            */
           module.exports = {
               data: `+ JSON.stringify(data) + `
           }
        `;
            return text;
        }
    }
}