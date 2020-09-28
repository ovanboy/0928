require(['jquery'], function ($) {
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
});