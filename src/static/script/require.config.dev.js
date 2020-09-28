requirejs.config({
    // baseUrl 配置在模板中(view/_unit/base-3.0.pug)
    waitSeconds: 30,
    paths: {
        'iscroll': '../public/iscroll/iscroll',
        'jquery': '../public/jquery/jquery.min',
        // 'cookie': '../public/jquery.cookie/jquery.cookie',
        'calc': '../public/calc/calc.min',
        // 'islider': '../public/islider/islider.min',
        'swiper': '../public/swiper/swiper.min',
        'mustache': '../public/mustache/mustache.min',
        'scrollload': '../public/scrollload/scrollload',
        'keyboard': '../public/keyboard/keyboard',
        'wx': '../public/jweixin/jweixin-1.4.0',
        'clipboard': '../public/clipboard/clipboard.min',

        'mask': './module/3.0/mask',
        'dialog': './module/3.0/dialog',
        'msg': './module/3.0/msg',
        'pop-layer': './module/3.0/pop-layer',
        'picker': './module/3.0/picker',
        'dt-picker': './module/3.0/picker.datetime',
        'pop-picker': './module/3.0/picker.pop',
        'layer': './module/3.0/layer',
        'tip':  './module/3.0/tip',
        'qrcode': '../public/qrcode/qrcode.min',
        'jsbarcode': '../public/jsbarcode/jsbarcode.all.min',
        'cascade-picker': './module/cascade-picker',
    },
    shim: {
        // 'cookie': {
        //     deps: ['jquery']
        //     // exports: 'cookie'
        // }
    }
});
