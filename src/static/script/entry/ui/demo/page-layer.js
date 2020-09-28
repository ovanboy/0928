requirejs.config({
    paths: {
        'page-layer': './entry/ui/demo/module_page-layer'
    }
});

require([
    'jquery',
    'page-layer',
    'layer',
    'dialog',
    'msg'
    // 'option-list'
],function(
    $,
    PageLayer,
    Layer,
    dialog,
    msg
    // optionList
){


    // 创建弹出层
    window.pageLayer = new PageLayer({

        // 页面ID 用于改变hash
        // id: 'panel1',

        // 页面标题
        title: '页面标题',

        // 页面内容 HTML代码(至少包含一个元素节点)
        content: $('#page-layer-content').html(),

        // 内容超出弹层高度时是否启用滚动 Boolean 默认为true
        // scroll: false,

        // 页面打开后回调
        afterOpen: function(){
            console.log('弹层已打开');
        },

        // 页面关闭后回调
        afterClose: function(){
            console.log('弹层已关闭');
        },

        // 关闭页面时是否销毁DOM 默认为true
        destroyAfterClose: false,

        // 给生成的层最外层元素添加自定义class，以便必要时可以自定义弹出层的某些样式
        className: 'demo-layer',

        // 面板展现方式 'to-left'|'to-right'|'to-top'|'to-bottom'四个可选值，默认值为'to-left'
        showMode: 'to-left',

        // 弹层对象生成后回调 （一般用于绑定一些自定事件）
        afterBuild: function(ele){
            // var layer = this;
            // $(ele).find('[data-action="openPanel1"]').on('click',function(){
            //     // 弹层实例方法-打开面板，需要传入面板的id
            //     layer.openPanel('panel1');
            // });
            // $(ele).find('[data-action="openPanel2"]').on('click',function(){
            //     layer.openPanel('panel2');
            // });
            // $(ele).find('[data-action="openPanel3"]').on('click',function(){
            //     layer.openPanel('panel3');
            // });
            // $(ele).find('[data-action="openPanel4"]').on('click',function(){
            //     layer.openPanel('panel4');
            // });
            // $(ele).find('[data-action="alert"]').on('click',function(){
            //     //dialog.alert('进行层上弹层测试');
            //     new PopLayer({
            //         title: '进行层上弹层测试',
            //         content: '<div><button class="ui-btn bigger primary block" data-action="layer3">弹层</button></div>',
            //         height: 300,
            //         clickMaskForClose: false,
            //         afterBuild: function(element){
            //             console.log(element);
            //             $(element).find('[data-action="layer3"]').on('click',function(){
            //                 new PopLayer({
            //                     title: '进行层上弹层测试2',
            //                     content: '<div></div>',
            //                     height: 200,
            //                 }).open();
            //             });
            //         }
            //     }).open();
            // });
            $(ele).find('.ui-btn').on('click',function(){
                dialog.alert('进行层上弹层测试');
            });
        }
    });


    // 示例
    $('#page-layer-btn').on('click',function(){

        // 弹层实例方法-打开弹层 一共三个实例方法：open()|close()|destroy()
        window.pageLayer.open();
    });


    $('#multiple-layer-btn').on('click',function(){
        dialog.alert('进行层上弹层测试');
    });

});