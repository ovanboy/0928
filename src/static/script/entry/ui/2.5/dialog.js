require([
    'jquery',
    'dialog'
],function(
    $,
    dialog
){

    var isRunning = false;

    $('#alert-btn').on('click', function(e){
        dialog.alert('dialog.alert()', function(){
            console.log('点击了确定');
        });

        // dialog({
        //     type: 'alert',
        //     content: 'dialog.alert()',
        //     submitButtonText: '同意',
        //     closeBtn: true,
        //     submitCallback: function(value){
        //         dialog.alert('您同意了');
        //     },
        //     // cancelCallback: function(){
        //     //     dialog.alert('您拒绝了');
        //     // }
        // });
    });

    $('#confirm-btn').on('click', function(e){
        if(isRunning){ return; }
        isRunning = true;
        dialog.confirm('确定要删除所选择的内容？',function(){
            dialog.alert('您选择了确定');
            isRunning = false;
        },function(){
            dialog.alert('您选择了取消');
            isRunning = false;
        });
    });

    $('#prompt-btn').on('click', function(e){
        if(isRunning){ return; }
        isRunning = true;
        dialog.prompt('请输入您的姓名', function(value){
            dialog.alert('您输入的信息为：' + value);
            isRunning = false;
        }, function(){
            dialog.alert('您取消了输入');
            isRunning = false;
        });
    });

    $('#custom-btn').on('click', function(e){
        if(isRunning){ return; }
        isRunning = true;
        dialog({
            type: 'prompt',
            title: '姓名',
            content:'请输入您的姓名',
            placeholder: '您的姓名',
            submitButtonText: '填好了',
            cancelButtonText: '不告诉你',
            closeBtn: true,
            submitCallback: function(value){
                dialog.alert('您输入的信息为：' + value);
                isRunning = false;
            },
            cancelCallback: function(){
                dialog.alert('您取消了输入');
                isRunning = false;
            }
        });
    });


    $('#authorization-btn').on('click', function(e){
        if(isRunning){ return; }
        isRunning = true;
        dialog({
            type: 'dialog',
            inner: $('#authorization-layer-tpl').html(),
            submitButtonText: '同意',
            cancelButtonText: '拒绝',
            submitCallback: function(value){
                dialog.alert('您同意了');
                isRunning = false;
            },
            cancelCallback: function(){
                dialog.alert('您拒绝了');
                isRunning = false;
            }
        });
    });

});
