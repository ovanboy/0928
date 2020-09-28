require([
    'jquery',
    'pop-picker',
    'dt-picker',
    'dialog',
    'msg'
],function(
    $,
    PopPicker,
    DtPicker,
    dialog,
    msg
){


    // var picker = new PopPicker({
    //     data: [
    //         {text:'选项1',value:'1'},
    //         {text:'选项2',value:'2'},
    //         {text:'选项3',value:'3'},
    //         {text:'选项4',value:'4'},
    //         {text:'选项5',value:'5'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项6',value:'6'},
    //         {text:'选项7',value:'7'}
    //     ],
    //     layer: 1,//级联层级
    //     textKey: 'text',//显示文本的键名
    //     valueKey: 'value',//值的键名
    //     childrenKey: 'sub',//子选项的键名
    //     onSubmit:function(v){
    //         var lastIndex = v.length - 1;
    //         // $valueInput.val(v[lastIndex][pickerValueKey]);
    //         // $textInput.val(v[lastIndex][pickerTextKey]);
    //         // $this.trigger('select');
    //         console.log({
    //             value: v[lastIndex]['value'],
    //             text: v[lastIndex]['text']
    //         })
    //     }
    // });
    // // 示例
    // $('#select-btn').on('click',function(){
    //     picker.show();
    // });





    // 日期和时间
    var datetimePicker = new DtPicker({

        // picker类型 'datetime'|'date'|'time'|'month'|'hour'五种类型之一 默认值: 'datetime'
        type: 'datetime',

        // 当前选中值
        // '2018-08-27 19:57'|'2018/08/27 19:57'|new Date(2018,7,27,19,57)
        // 默认值为当前时间（new Date()） 如果当前时间不在指定的范围内，默认为最小选项值
        // 如果给定的时间不在时间选项范围(开始时间到结束时间)内，默认为最小选项值
        value: '2019-07-31',

        // 开始时间 Date类型 默认当前时间前5年
        beginDate: new Date(2010,0,1),

        // 结束时间 Date类型 默认当前时间后5年
        endDate: new Date(),

        // 当前选项变更触发的事件类型
        changeEventType: 'dtOptChange',

        // 自定义标题 String 默认值为''
        title: '',

        // 自定义label  Object|Boolean  
        // false表示不显示label  true使用默认值({year:'年',month:'月',day:'日',hour:'时',minute:'分'})
        label: {
            year: '年',
            month: '月',
            day: '日',
            hour: '时',
            minute: '分'
        },

        // 自定义按钮文本和位置
        // type可选的取值： 'submit'|'cancel'
        buttons: [{
            type: 'cancel',
            text: '放弃'
        },{
            type: 'submit',
            text: '选择'
        }],

        // 格式化函数
        // formatYear:function(year){
        //     return year + '年';
        // },
        // formatMonth: function(month){
        //     return month + '月';
        // },
        // formatDay: function(day){
        //     return day + '日';
        // },
        // formatHour: function(hour){
        //     return hour + '时';
        // },
        // formatMinute: function(minute){
        //     return minute + '分';
        // },

        // 取消时回调
        onCancel: function(){},

        //确定点击后在关闭picker前执行，返回fasle将阻止后续动作
        beforeSubmit: function(value){
            return true;
        },

        // 提交时回调
        onSubmit: function(value){
            console.log(value);
            console.log(this.getValueInfo());
        }
    });
    $('#datetime-select-btn').on('click',function(){
        datetimePicker.show();
    });

    // 日期
    var datePicker = new DtPicker({
        type: 'date',
        title: '购票日期',
        label: false,
        beginDate: new Date(2010,0,1),
        endDate: new Date(),
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
    $('#date-select-btn').on('click',function(){
        datePicker.show();
    });

    // 月份
    var monthPicker = new DtPicker({
        type: 'month',
        beginDate: new Date(2010,0,1),
        endDate: new Date()
    });
    $('#month-select-btn').on('click',function(){
        monthPicker.show();
    });

    // 时间
    var timePicker = new DtPicker({
        type: 'time'
    });
    $('#time-select-btn').on('click',function(){
        timePicker.show();
    });

    // 小时
    var hourPicker = new DtPicker({
        type: 'hour'
    });
    $('#hour-select-btn').on('click',function(){
        hourPicker.show();
    });

});