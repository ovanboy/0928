requirejs.config({
    // baseUrl 配置在模板中(view/_unit/base.pug)
    waitSeconds: 30,
    paths: {
        'iscroll': '../public/iscroll/iscroll',
        'jquery': '../public/jquery/jquery.min',
        'cookie': '../public/jquery.cookie/jquery.cookie',
        'calc': '../public/calc/calc.min',
        'islider': '../public/islider/islider.min',
        'swiper': '../public/swiper/swiper.min',
        'mustache': '../public/mustache/mustache.min',
        'scrollload': '../public/scrollload/scrollload',
        'wx': '../public/jweixin/jweixin-1.4.0',
        'mask': './module/mask',
        'dialog': './module/dialog',
        'tips': './module/tips',
        'msg': './module/msg',
        'keyboard': './module/keyboard',
        'keyboard-pc': './module/keyboard-pc',
        'option-list': './module/option-list',
        'select-list': './module/select-list',
        'pop-layer': './module/pop-layer',
        'page-layer': './module/page-layer',
        'picker': './module/picker',
        'pop-picker': './module/picker.pop',
        'dt-picker': './module/picker.datetime',
        'cascade-picker': './module/cascade-picker',
        'url': './module/url',
        'layer': './module/layer',
        'html2canvas': '../public/html2canvas/html2canvas',
        'qrcode': '../public/qrcode/qrcode.min'

    },
    shim: {
        'cookie': {
            deps: ['jquery']
            // exports: 'cookie'
        },
        'ijiami-rsa': {
            deps: ['jquery']
        },
        'ijiami-bigint': {
            deps: ['jquery']
        },
        'ijiami-barrett': {
            deps: ['jquery']
        },
        'ijiamiKey':  {
            deps: ['jquery'],
            exports: 'ijiamiKey'
        },
        'qrcode': {
            exports: 'QRCode'
        }
    }
});
