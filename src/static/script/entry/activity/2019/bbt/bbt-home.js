require(['jquery', 'lottie', 'msg', 'layer2'], function ($, lottie, msg, Layer) {
    var isRuning = false;
    var treasureData = {};
    var times = 3; // 抽奖次数
    var params = {
        container: $('.box-ani')[0],
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '/static/data/lottie/bbt/box/data.json',
        name: "box"
    };
    var ani = lottie.loadAnimation(params);
    var $openBtn=$('.open-box')

    window.will=ani

    ani.addEventListener('complete', function () {
        showResult(treasureData);
        isRuning = false;
        $openBtn[0].disabled=false;
    })

    $('.open-box').click(function () {
        if (isRuning || $(this).hasClass('disabled')) return;
        isRuning = true;
        var _this = this;

        $openBtn[0].disabled=true;

        $('.times span').text(--times);
        
  
        setTimeout(function () {
            if(times===0){
                $(_this).addClass('disabled')
                $('.times span').addClass('zero')
            }
            var back_data = {type:'coupon',value:'888元'}
            treasureData = back_data;
            $('.box-img').hide()
            $('.box-ani').show()
            ani.goToAndPlay(0)

        }, 1000)
    });



    function showResult(data) {
        var layerHTML = getResultHtml(data);
        var thisLayer = new Layer({
            content: layerHTML,
            width: 300,
            height: 314,
            noPadding: true,
            noButton: true,
            wrapperClass: "box-layer",
            afterBuild: function (ele) {
                $(ele).find('[data-action="closeLayer"]').on('click', function () {
                    thisLayer.close();
                });
            }
        });
        thisLayer.open();
    }


    function getResultHtml(data) {
        var typeMap = {
            empty: {text:'很遗憾，宝箱是空的',link:'#1'},
            point: {text:'积分',link:'#1'},
            money: {text:'刷卡金',link:'#1'},
            regbag: {text:'红包',link:'#1'},
            coupon: {text:'优惠券',link:'#1'},
        }
        var isEmpty = data.type === 'empty'; // 是否为空
       
        if(isEmpty){
            return [
                '<div>',
                    '<div class="img">',
                        '<div class="treasure empty">',
                        '</div>',
                    '</div>',
                    '<div class="layer-title">',
                        '很遗憾，宝箱是空的',
                    '</div>',
                    '<div class="layer-footer">',
                       '<a  class="layer-btn red" data-action="closeLayer">关闭</a>',
                    '</div>',
                '</div>',
            ].join('\n')
        }else{
            var text = typeMap[data.type].text;
            var link=typeMap[data.type].link;
            return [
                '<div>',
                    '<div class="img">',
                        '<div class="treasure ' + data.type + '">',
                        '</div>',
                    '</div>',
                    '<div class="layer-title">',
                        '恭喜你获得' + data.value + text,
                    '</div>',
                    '<div class="layer-subtitle">',
                        '已存入“我的-' + text,
                    '</div>',
                    '<div class="layer-footer">',
                        '<a href="'+link+'" class="layer-btn red">去看看</a>',
                        '<a  data-action="closeLayer" class="layer-btn complete">完成</a>',
                    '</div>',
                '</div>',
            ].join('\n')
        }
       
    }

});