require([
    'jquery',
    'pop-picker'
],function(
    $,
    PopPicker
){



    // 实例方法：

    // 1. getValue()
    // 功能： 获取当前值
    // 返回值： String类型

    // 2. getValueInfo()
    // 功能： 获取当前值信息对象
    // 返回值： Object类型

    // 3. setValue(newValue)
    // 功能： 设置当前值
    // newValue 参数： String类型  要设置的值

    // 5. show(callback)
    // 功能： 打开弹层
    // callback参数： Function类型  弹层开启完成后调用此函数 

    // 6. hide(callback)
    // 功能： 关闭弹层
    // callback参数： Function类型  弹层关闭完成后调用此函数 



    // 创建picker
    var demoPicker = new PopPicker({

        // 自定义标题  String类型  可选项
        // 1. 默认值为空字符串 ''
        title: '颜色选择',


        // 自定义按钮  Array类型  可选项
        // 1. 如果给定了一个数组值，数组长度必须是2
        // 2. 第一个按钮显示在标题左边，第二个按钮显示在标题右边
        // buttons: [{
        //     // 指定按钮类型  String类型  必选项
        //     // 1. 可选的取值有： 'submit'|'cancel'
        //     // 2. 'submit'类型的按钮将响应提交操作，'cancel'类型的按钮将响应取消操作。
        //     type: 'cancel',

        //     // 按钮文本  String类型  必选项
        //     // 1. 请竟可能控制在两个字以内
        //     text: '放弃'
        // },{
        //     type: 'submit',
        //     text: '选择'
        // }],

        // 选项数据
        data: [{
            value: '1',
            text: '红色'
        },{
            value: '2',
            text: '橙色'
        },{
            value: '3',
            text: '黄色'
        },{
            value: '4',
            text: '绿色'
        },{
            value: '5',
            text: '青色'
        },{
            value: '6',
            text: '蓝色'
        },{
            value: '7',
            text: '紫色'
        }],

        // 初始值  String类型  可选项
        // 如果指定的值不在选项数据的范围内，则忽略该设置
        value: '2',

        // 点击遮罩时是否关闭弹层  Boolean类型  可选项
        // 1. 默认为 false
        clickMaskForClose: true,

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

});