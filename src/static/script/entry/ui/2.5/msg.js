require([
    'jquery',
    'msg'
],function(
    $,
    msg
){

    $('#demo-btn').on('click', function(e){
        msg({
            type: 'info', //消息类型 String类型  可选值：'info'|'warn'|'success'|'error' 默认值：'info'
            content: '示例信息，5秒后消失', //消息内容  String类型
            duration: 5000,// 持续时间（毫秒数） Number类型  单位：毫秒  默认值：2000
            mask: true //是否带遮罩效果（消息显示时页面不可操作） Boolean类型  默认值：false
        });
    });

    $('#info-btn').on('click', function(e){
        // 方案一
        // msg.info('这是一条普通信息');

        // 方案二
        msg({
            content: '这是一条普通信息'
        });
    });

    $('#warn-btn').on('click', function(e){
        // 方案一
        // msg.warn('这是一条警告信息');

        // 方案二
        msg({
            type: 'warn',
            content: '这是一条警告信息'
        });
    });

    $('#success-btn').on('click', function(e){
        // 方案一
        // msg.success('这是一条成功信息');

        // 方案二
        msg({
            type: 'success',
            content: '这是一条成功信息'
        });
    });

    $('#error-btn').on('click', function(e){
        // 方案一
        // msg.error('这是一条错误信息');

        // 方案二
        msg({
            type: 'error',
            content: '这是一条错误信息'
        });
    });


    $('#mask-btn').on('click', function(e){
        // 方案一
        // msg('这条信息存在时页面不可操作','info', 5000, true);

        // 方案二
        msg({
            content: '这条信息存在时页面不可操作',
            duration: 5000,
            mask: true
        });
    });

    $('#custom-btn').on('click', function(e){

        // 方案一
        // msg('这条信息存在10秒后消失','info', 10000);

        // 方案二
        msg({
            content: '这条信息存在10秒后消失',
            duration: 10000
        });
    });
});
