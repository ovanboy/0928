require(['jquery'], function ($) {
    var nameFieldKey = 'inputUserName';
    $('.actBtn1').on('click', function () {
        //window.location.href = '';
        //继续送祝福
    });
    $('.actBtn2').on('click', function () {
        //下载买单吧，如果已经下载过，直接打开
    });

    initTransferName();

    function initTransferName() {
        $('.page-content .nameSpan').text(getTransferName());
    }

    function getTransferName() {
        var name = '买单吧';
        var hash = window.location.hash.replace(/^#/, '');
        if (hash) {
            name = hash;
        }
        return decodeURIComponent(name);
    }
});