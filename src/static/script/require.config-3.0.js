
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
        'keyboard-pc': '../public/keyboard-pc/keyboard-pc',
        'wx': '../public/jweixin/jweixin-1.4.0',
        'clipboard': '../public/clipboard/clipboard.min',
        'qrcode': '../public/qrcode/qrcode.min',
        'html2canvas': '../public/html2canvas/html2canvas',
        'mask': './module/3.0/mask',
        'dialog': './module/3.0/dialog',
        'msg': './module/3.0/msg',
        'select-list': './module/3.0/select-list',
        'pop-layer': './module/3.0/pop-layer',
        'picker': './module/3.0/picker',
        'dt-picker': './module/3.0/picker.datetime',
        'pop-picker': './module/3.0/picker.pop',
        'cascade-picker': './module/3.0/cascade-picker',
        'layer': './module/3.0/layer',
        'tip':  './module/3.0/tip',
        'share-component': './module/3.0/wx-share-component',
        'option-list': './module/3.0/option-list',
        'arc-progress': './module/3.0/arc-progress',
        'videojs':'../public/videojs/videojs.min'
    },
    shim: {
        // 'cookie': {
        //     deps: ['jquery']
        //     // exports: 'cookie'
        // }
    }
});
