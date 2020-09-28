require([
    'jquery',
    'layer'
],function(
    $,
    Layer
){

    // 实例方法：

    // 1. open(callback)
    // 功能： 打开弹层
    // callback参数： Function类型  弹层打开完成后调用此函数 

    // 2. close(callback)
    // 功能： 关闭弹层
    // callback参数： Function类型  弹层关闭完成后调用此函数 

    // 3. destroy()
    // 功能： 销毁对象内部资源，减少资源占用



    // 创建弹层
    var demoLayer = new Layer({

        // 自定义类名  String类型  可选项
        // 1. 默认值为空字符串
        // 2. 给生成的层最外层元素添加自定义类名，以便必要时可以自定义弹出层的某些样式
        // 3. 如需添加多个class，请使用空格隔开，如：'class-a class-b'
        className: 'demo-layer',

        // 自定义内容  String类型  必选项
        // 1. 默认值为空字符串（虽然此设置项不是组件执行必须，但不设值此项将没有任何意义）
        // 2. 该值应当是以标准的HTML代码字符串
        contentHTML: '<div style="height:600px;padding:10px 15px;">弹出层内容</div>',

        // 点击遮罩时是否关闭弹层  Boolean类型  可选项
        // 1. 默认为true
        clickMaskForClose: false,

        // 内容超出弹层高度时是否启用滚动  Boolean类型  可选项
        // 1. 默认值为 true
        // 2. 当明确知道弹层内容不会超出内容区时，请禁用滚动（将此值设置为false）以提升性能
        scroll: true,

        // 关闭弹出层后是否销毁DOM  Boolean类型  可选项
        // 1. 默认值为 true
        // 2. 如果您希望保持弹出层中曾执行过的DOM操作，您应当将此值设置为 false
        destroyAfterClose: false,

        // 关闭前钩子函数  Function类型  可选项
        // 1. 此函数在关闭按钮被点击之后，弹出层关闭之前调用。
        // 2. 如果该函数执行的返回值不是 true， 后续关闭动作会被阻止。
        // 3. 其中this指向该弹出层对象
        beforeClose: function(){
            console.log('弹层将要关闭');
            return true;
        },

        // 关闭后回调函数  Function类型  可选项
        // 1. 此函数在关闭按钮被点击致使弹出层关闭之后调用。
        // 2. 其中this指向该弹出层对象
        afterClose: function(){
            console.log('弹层已关闭');
        },

        // 弹层对象生成后回调  Function类型  可选项
        // 1. 此函数将在对象创建完成后调用（仅调用一次）
        // 2. 其中this指向该弹出层对象
        afterBuild: function(){
            console.log('弹层对象已创建完成');
        }
    });

    $('#btn-demo').on('click',function(e){
        console.log('弹层将要打开');
        demoLayer.open(function(){
            console.log('弹层已打开');
        });
    });

});
