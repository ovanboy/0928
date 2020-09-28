require([
    'jquery',
    'dialog'
],function(
    $,
    dialog
){

    // alert
    $('#alert-btn').on('click', function(e){
        dialog.alert('您点击了 alert 按钮', function(){
            console.log('您可以在alert后做一些什么');
        });
    });
    $('#alert-custom-btn').on('click', function(e){
        dialog({
            type: 'alert',
            title: '请注意',
            content:'这是一个 alert 对话框',
            submitButtonText: '好的，知道了',
            submitCallback: function(){
                console.log('您可以在alert后做一些什么 ');
            }
        });
    });


    // confirm
    $('#confirm-btn').on('click', function(e){
        dialog.confirm('确定要删除所选择的内容？',function(){
            dialog.alert('您选择了确定');
        },function(){
            dialog.alert('您选择了取消');
        });
    });
    $('#confirm-custom-btn').on('click', function(e){
        dialog({
            type: 'confirm',
            title: '删除警告',
            content:'您确定要删除所选择的内容？',
            submitButtonText: '是的，删了吧',
            cancelButtonText: '不，我点错了',
            submitCallback: function(value){
                dialog.alert('该内容已删除');
            },
            cancelCallback: function(){
                dialog.alert('下次要细心哦');
            }
        });
    });


    // prompt
    $('#prompt-btn').on('click', function(e){
        dialog.prompt('请输入您的姓名', function(value){
            if(value){
                dialog.alert('您输入的信息为：' + value);
            }else{
                dialog.alert('您什么也没有输入');
            }
        }, function(){
            dialog.alert('您取消了输入');
        });
    });
    $('#prompt-custom-btn').on('click', function(e){
        dialog({
            type: 'prompt',
            title: '年龄录入',
            content:'我们需要知道您的年龄',
            inputHTML: '<input type="number" min="1" max="200" placeholder="请输入您的年龄">',
            submitButtonText: '填好了',
            cancelButtonText: '不告诉你',
            submitCallback: function(value){
                if(value){
                    dialog.alert('您年龄为：' + value);
                }else{
                    dialog.alert('骗人');
                }
            },
            cancelCallback: function(){
                dialog.alert('吝啬鬼');
            }
        });
    });


    // 自由定制
    $('#custom-btn').on('click', function(e){
        dialog({
            // 是否为异步非阻塞方式打开  Boolean类型  可选项
            // 1. 默认为 false，表示该dialog之间会在前一个同步dialog关闭后才能打开
            // 2. 正常的对话框应当具有阻塞特性，一般无需设置此项
            async: false, 

            // 自定义类名  String类型  可选项
            // 1. 多个class使用空格隔开
            // 2. 您可以通过自定义类名，来实现自定义样式（如： 尺寸，颜色等）
            className: 'classA classB',

            // 自定义内容  String类型  必选项
            // 1. 该值应当是以标准的HTML代码字符串
            contentHTML: '<div>自定义内容</div>',

            // 是否存在关闭按钮  Boolean|Object类型  可选项
            // 1. 默认为false
            // 2. 对话框应当以用户选择了某个对话项（按钮）来结束对话， 如非必要，请避免使用此项
            closeBtn: {
                // 关闭前钩子函数  Function类型  可选项
                // 1. 此函数将在关闭按钮被点击后对话框关闭前被执行，如果返回值为true则继续关闭对话框，否则将终止后续动作。
                // 2. 其中this指向dialog对象
                beforeClose: function(){
                    console.log('关闭按钮被点击，对话框将要关闭。');
                    return true;
                },

                // 关闭后回调函数  Function类型  可选项
                // 1. 此函数在关闭按钮被点击致使对话框关闭后被调用
                // 2. 其中this指向dialog对象
                afterClose: function(){
                    console.log('关闭按钮被点击，对话框已关闭。');
                }
            },

            // 关闭按钮被点击后要执行的回调  Function类型  可选项
            // 1. 其中this指向dialog对象
            // 2. 此项设置用于配合 closeBtn 设置，同样不建议使用
            closeBtnCallback: function(){},

            // 按钮设置  Array类型  可选项
            // 1. 按钮将按照数组顺序从左至右依次排列
            // 2. 所有按钮（非禁用状态）点击后，都会关闭对话框，然后再执行对应的回调
            // 3. 默认只有一个文本为“确定”的非禁用状态的主操作按钮
            buttons: [{
                // 是否为主操作按钮  Boolean类型  可选项
                // 1. 默认值为false
                // 2. 主操作按钮具有一个 main 类名，一般其表现为文本加粗
                isMain: true,

                // 按钮文本  String类型  必选项
                text: '确定',

                // 是否是禁用状态  Boolean类型  可选项
                // 1. 默认值为false
                // 2. 禁用状态按钮具有一个 disabled 类名，一般其表现为灰色且不响应点击事件
                disabled: true,

                // 关闭前钩子函数  Function类型  可选项
                // 1. 此函数将在当前按钮被点击后对话框关闭前被执行，如果返回值为true则继续关闭对话框，否则将终止后续动作。
                // 2. 其中this指向dialog对象
                beforeClose: function(){
                    console.log('"确定"按钮被点击，对话框将要关闭。');
                    return true;
                },

                // 关闭后回调函数  Function类型  可选项
                // 1. 此函数在当前按钮被点击致使对话框关闭后被调用
                // 2. 其中this指向dialog对象
                afterClose: function(){
                    console.log('"确定"按钮被点击，对话框已关闭。');
                }
            },{
                isMain: false,
                text: '关闭',
                disabled: false,
                beforeClose: function(){
                    console.log('"关闭"按钮被点击，对话框将要关闭。');
                    return true;
                },
                afterClose: function(){
                    console.log('"关闭"按钮被点击，对话框已关闭。');
                }
            },{
                isMain: false,
                text: '取消',
                disabled: false,
                beforeClose: function(){
                    console.log('"取消"按钮被点击，对话框将要关闭。');
                    return true;
                },
                afterClose: function(){
                    console.log('"取消"按钮被点击，对话框已关闭。');
                }
            }],

            // dialog对象构建完成后要执行的回调  Function类型  可选项
            // 1. 其中this指向该dialog对象
            // 2. 如果您需要对dialog进行某些DOM操作，请在此回调内实现
            afterBuild: function(){
                console.log('对话框创建完成');
                console.log(this.element);
            } 
        });
    });

});
