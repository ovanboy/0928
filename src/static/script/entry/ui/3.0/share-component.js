require(['jquery', 'share-component'], function ($, ShareComponent) {
    var shareData = {
        title: '分享标题',
        description: '分享描述',
        picture: '',//图片链接
        QRCode: '',//用于生成二维码的url
        content: '',//点击分享后跳转的url
        contentType: 0,//分享类型，0为分享链接，1为分享图片，默认0
        shareType: 0,//0分享微信好友，1分享朋友圈，2分享二维码，默认0
        productName: '',//产品名称
        autoClose: true //尝试进行触发app分享功能后h5分享组件自动关闭//默认 true
    }

    initListeners()
    function initListeners() {
        $('.open-btn').on('click', function () {
            var sharecomponent = new ShareComponent(shareData);
            sharecomponent.open(function () {//可以省略不填
                console.log('打开分享弹窗后的操作')
            })
        })
    }
})
