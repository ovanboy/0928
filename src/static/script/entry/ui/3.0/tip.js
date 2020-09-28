require(['jquery', 'tip'], function ($, tip) {
    var tip1;
    var tip2;
    var tip3;
    var tip4;
    var tip5;
    initListenders();
    function initListenders() {
        $('body').on('click', '.add', function () {
            /**new tip({
                className: '',//如果有更个性化的样式
                touchClose: true,//touch关闭功能，默认true(有)
                closeBtnVisible: false,//显示关闭按钮，默认true(显示)
                duration: 2000,//倒计时自动关闭的时间(需要和closeAuto/true 使用)
                message: 'hello world!1',//显示的消息
                closeAuto: true,//自动关闭,默认true(自动关)
                type: 'error'//显示类型,默认error
            });*/
            var ele = $(this);
            if (ele.hasClass('add1')) {
                tip1 = new tip({
                    className: '',
                    touchClose: false,
                    closeBtnVisible: false,
                    duration: 2000,
                    message: 'hello world!1测试换行 测试换行 测试换行 测试换行 测试换行 测试换行 测试换行 测试换行 测试换行 测试换行',
                    closeAuto: true,
                    type: 'error'
                });
            } else if (ele.hasClass('add2')) {
                tip2 = new tip({
                    className: '',
                    touchClose: true,
                    closeBtnVisible: false,
                    duration: 2000,
                    message: 'hello world!2',
                    closeAuto: false,
                    type: 'warning'
                });
            } else if (ele.hasClass('add3')) {
                tip3 = new tip({
                    className: '',
                    touchClose: false,
                    closeBtnVisible: true,
                    duration: 2000,
                    message: 'hello world!3',
                    closeAuto: false,
                    type: 'info'
                });
            } else if (ele.hasClass('add4')) {
                tip4 = new tip({
                    className: '',
                    touchClose: true,
                    closeBtnVisible: true,
                    duration: 2000,
                    message: 'hello world!4',
                    closeAuto: true,
                    type: 'success'
                });
            } else if (ele.hasClass('add5')) {
                tip5 = new tip({
                    className: 'tips-personal-class',
                    touchClose: false,
                    closeBtnVisible: false,
                    duration: 2000,
                    message: 'hello world!5',
                    closeAuto: false
                });
            }
        })
        $('body').on('click', '.close', function () {
            if (tip5) {
                tip5.close();
            }
        })
    }
})