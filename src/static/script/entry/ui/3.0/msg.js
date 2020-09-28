require([
    'jquery',
    'msg'
],function(
    $,
    msg
){

    // 使用方式一
    // *    msg.info('普通消息');
    // *    msg.warn('警告消息');
    // *    msg.error('错误消息');
    // *    msg.success('成功消息');

    // 使用方式二(此方式需要严格的参数顺序，不建议使用，请使用方式三代替)
    // msg(content, type, duration, hasMask)
    // 各参数说明如下：
    // *    content  消息内容   String类型  必选项
    // *    type     消息类型   String类型  可选项 默认为'info' 可选值有 'info'|'warn'|'error'|'success'
    // *    duration 消息内容   Number类型  可选项 默认为2000   单位：毫秒(ms)
    // *    hasMask  是否带遮罩 Boolean类型 可选项 默认为false

    // 使用方式三
    // msg(options)
    // 参数options  Object类型  说明如下：
    // *    options.content  消息内容     String类型   必选项
    // *    options.type     消息类型     String类型   可选项  默认为'info' 可选值有 'info'|'warn'|'error'|'success'
    // *    options.duration 消息内容     Number类型   可选项  默认为2000   单位：毫秒(ms)
    // *    options.mask     是否有遮罩   Boolean类型  可选项  默认为false



    $('#btn-info').on('click', function(e){
        msg.info('这是一条普通信息');
    });

    $('#btn-warn').on('click', function(e){
        msg.warn('这是一条警告信息');
    });

    $('#btn-success').on('click', function(e){
        msg.success('这是一条成功信息');
    });

    $('#btn-error').on('click', function(e){
        msg.error('这是一条错误信息');
    });


    $('#btn-demo').on('click', function(e){
        msg({
            // 消息类型  String类型  可选项
            // 1. 默认值为 'info'
            // 2. 可选值有 'info'|'warn'|'success'|'error' 
            type: 'success',

            // 消息内容  String类型  必选项
            content: '示例信息，5秒后消失',

            // 持续时间  Number类型  可选项
            // 1. 默认值：2000
            // 2. 单位：毫秒(ms)
            duration: 500000,

            // 是否带遮罩效果  Boolean类型  可选项
            // 1. 默认值：false
            mask: true 
        });
    });

});
