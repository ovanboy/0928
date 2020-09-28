require([
    'jquery',
    'dt-picker'
],function(
    $,
    DtPicker
){

    // 日期时间
    var datetimePicker = new DtPicker({
        type: 'datetime'
    });
    $('#btn-datetime').on('click',function(){
        datetimePicker.show();
    });


    // 日期
    var datePicker = new DtPicker({
        type: 'date'
    });
    $('#btn-date').on('click',function(){
        datePicker.show();
    });


    // 月份
    var monthPicker = new DtPicker({
        type: 'month'
    });
    $('#btn-month').on('click',function(){
        monthPicker.show();
    });


    // 时间
    var timePicker = new DtPicker({
        type: 'time'
    });
    $('#btn-time').on('click',function(){
        timePicker.show();
    });


    // 小时
    var hourPicker = new DtPicker({
        type: 'hour'
    });
    $('#btn-hour').on('click',function(){
        hourPicker.show();
    });







    // 实例方法：

    // 1. getValue()
    // 功能： 获取当前值
    // 返回值： Date类型

    // 2. getValueInfo()
    // 功能： 获取当前值信息对象
    // 返回值： Object类型

    // 3. setValue(newValue)
    // 功能： 设置当前值
    // newValue 参数： String|Date类型  要设置的值 （参考 value 配置选项）

    // 4. setRange(beginDate, endDate, newValue)
    // 功能： 设置日期时间选项范围
    // beginDate 参数： String|Date类型  可选参数  要设置的选项起始时间值 （参考 beginDate 配置选项）
    // endDate 参数： String|Date类型  可选参数  要设置的选项结束时间值 （参考 endDate 配置选项）
    // newValue 参数： String|Date类型  可选参数  要设置的新值 （参考 value 配置选项）

    // 5. show(callback)
    // 功能： 打开日期时间弹层
    // callback参数： Function类型  弹层开启完成后调用此函数 

    // 6. hide(callback)
    // 功能： 关闭日期时间弹层
    // callback参数： Function类型  弹层关闭完成后调用此函数 



    // 创建picker
    var demoPicker = new DtPicker({

        // picker类型  String类型  可选项
        // 1. 默认值为 'datetime'
        // 2. 可选的取值有 'datetime'|'date'|'time'|'month'|'hour'
        type: 'datetime',

        // 初始值  String|Date类型  可选项
        // 1. 默认值为当前时间（picker被创建时的时间）
        // 2. 如果是字符串，格式应符合 '2018-08-27 19:57' 或 '2018/08/27 19:57'
        // 3. 如果指定的时间不在选项的范围内，则默认时间为最小选项值
        value: '2018-11-23 13:48',

        // 开始时间  String|Date类型  可选项
        // 1. 默认为初始值时间向前第5年的1月1日0时0分0秒0毫秒
        beginDate: '2017-10-01',

        // 结束时间  String|Date类型  可选项
        // 2. 默认为初始值时间向后第5年的12月31日23时59分59秒999毫秒
        endDate: '2020-10-01',

        // 自定义标题  String类型  可选项
        // 1. 默认值为空字符串 ''
        title: '日期时间选择',

        // 自定义label  Object|Boolean类型  可选项
        // 1. 默认值为 {year:'年',month:'月',day:'日',hour:'时',minute:'分'}
        // 2. 设置为 false 表示不显示label
        // 3. 设置为 true 将使用默认值
        label: {
            year: '年份',
            // month: '月份',
            // day: '日期',
            hour: '小时',
            minute: '分钟'
        },

        // 自定义按钮  Array类型  可选项
        // 1. 如果给定了一个数组值，数组长度必须是2
        // 2. 第一个按钮显示在标题左边，第二个按钮显示在标题右边
        buttons: [{
            // 指定按钮类型  String类型  必选项
            // 1. 可选的取值有： 'submit'|'cancel'
            // 2. 'submit'类型的按钮将响应提交操作，'cancel'类型的按钮将响应取消操作。
            type: 'cancel',

            // 按钮文本  String类型  必选项
            // 1. 请竟可能控制在两个字以内
            text: '放弃'
        },{
            type: 'submit',
            text: '选择'
        }],

        // 点击遮罩时是否关闭弹层  Boolean类型  可选项
        // 1. 默认为 false
        clickMaskForClose: true,

        // 选项格式化函数
        formatYear: function(year){
            return year + '年';
        },
        formatMonth: function(month){
            return month + '月';
        },
        formatDay: function(day){
            return day + '日';
        },
        formatHour: function(hour){
            return hour + '时';
        },
        formatMinute: function(minute){
            return minute + '分';
        },

        // 确定点击后在关闭picker前执行，返回fasle将阻止后续动作
        beforeCancel: function(value){
            console.log('取消已执行，picker将要关闭');
            return true;
        },

        // 取消时回调
        onCancel: function(){
            console.log('取消已执行，picker已关闭');
        },

        //确定点击后在关闭picker前执行，返回fasle将阻止后续动作
        beforeSubmit: function(value){
            console.log('提交已执行，picker将要关闭');
            return true;
        },

        // 提交时回调
        onSubmit: function(value){
            console.log('提交已执行，picker已关闭');
            console.log(value);
            console.log(this.getValueInfo());
        }
    });
    $('#btn-demo').on('click',function(){
        demoPicker.show();
    });





    // 设计常见日期
    var now = new Date();
    var demoDatePicker = new DtPicker({
        type: 'date',
        title: '选择日期',
        label: false,
        value: now,
        beginDate: now,
        //endDate: '2020-12-31',
        formatYear:function(year){
            return year + '年';
        },
        formatMonth: function(month){
            return month + '月';
        },
        formatDay: function(day){
            return day + '日';
        }
    });
    $('#btn-demo-date').on('click',function(){
        demoDatePicker.show();
    });

});