
require([
    'jquery',
    'keyboard',
    'keyboard-pc'
],function(
    $,
    keyboard,
    keyboardPC,
){

    // console.log(keyboard);

    keyboard.addSource('demo','/demo/ijiami-servlet.json');
    keyboard.addSource('test','/demo/ijiami-servlet2.json');

    // 1 sourceName 源名称
    // 2 url 请求获取公钥的json  
    // 3 加密图片路径  若url中自带图片路径则非必填
    // keyboardPC.addSource(sourceName, url, imageUrl);
    keyboardPC.addSource('PC-demo','/demo/ijiami-servlet-pc.json');

    // $(document).on('keyboardopen',function(e){
    //     // $('body').addClass('security-keyboard-opened');

    //     console.log(keyboard.getStatus());
    // });

    // $(document).on('keyboardclose',function(e){
    //     $('body').removeClass('security-keyboard-opened');
    // });

    // $(document).on('keyboardchange',function(){
    //     console.log(keyboard.getStatus().type);
    // });

    $('.h5-keyboard-input').on('keyboardfocus',function(e){
        console.log('focus');
        var _this = this;
        setTimeout(function(){
            _this.scrollIntoView(true);
        },400);
    });
    $('.h5-keyboard-input').on('keyboardblur',function(e){
        console.log('blur');
    });
    $('.h5-keyboard-input').on('keyboardinput',function(e){
        console.log('input');
        console.log(keyboard.encodeValueByInputBox(this));
        console.log(keyboard.encodeValueBySourceName('test'));
        console.log(keyboard.getParamsBySourceName('test'));
    });
    $('.h5-keyboard-input').on('keyboarddelete',function(e){
        console.log('delete');

    });
    $('.h5-keyboard-input').on('keyboardcomplete',function(e){
        console.log('complete');
    });
    $('.h5-keyboard-input').on('keyboardmax',function(e){
        console.log('max');
    });


    $('#btn-clean').on('click',function(){
        keyboard.cleanInputBox();
    });

    $('#btn-open').on('click',function(e){
        e.stopPropagation();
        keyboard.open($('.h5-keyboard-input').eq(0)[0], function(){
            setTimeout(function(){
                keyboard.close();
            },5000);
        });
    });


    // pc 安全键盘 事件方法和h5安全键盘类似

    $('.pc-keyboard-input2').on('keyboardPCInput',function(e){
        console.log(keyboardPC.encodeValueByInputBox(this));
        console.log(keyboardPC.encodeValueBySourceName('PC-demo'));
        console.log(keyboardPC.getParamsBySourceName('PC-demo'));
    });
    $('.pc-keyboard-input').on('keyboardPCMax',function(){
        console.log('max');
    })
    $('.pc-keyboard-input').on('keyboardPCInput',function(){
        console.log('input');
    })
    $('.pc-keyboard-input').on('keyboardPCBlur',function(){
        console.log('blur');
    })
    $('.pc-keyboard-input').on('keyboardPCFocus',function(){
        console.log('focus');
    })
    $('.pc-keyboard-input').on('keyboardPCDelete',function(){
        // 点击删除
        console.log('delete');
    })
    $('.pc-keyboard-input').on('keyboardPCComplete',function(){
        // 点击确定
        console.log('complete');
    })
    $('.pc-keyboard-input').on('keyboardPCClose',function(){
        // 调用close方法时
        console.log('close');
    })
    $('.pc-keyboard-input').on('keyboardPCToggleCase',function(){
        // 大小写切换
        console.log('togglecase');
    })


    $('#btn-clean-pc').on('click',function(){
        // 选择清空
        // keyboardPC.cleanInputBox('.pc-keyboard-input1');
        // 全部清空
        keyboardPC.cleanInputBox();
    });
    $('#btn-open-pc').on('click',function(e){
        // 打开键盘
        e.stopPropagation();
        keyboardPC.open('.pc-keyboard-input1');
    });
});