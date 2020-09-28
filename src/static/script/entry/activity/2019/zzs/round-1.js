require(['jquery', 'swiper', 'layer2', 'pop-layer', 'mustache', 'lottie', 'pop-layer-zzs'],
    function ($, Swiper, Layer, PopLayer, mustache, lottie, PopLayerZzs) {
        var multiCard = 1;

        console.log(lottie)
        // 中奖小广播
        var broadcast = new Swiper('#broadcast-list', {
            direction: 'vertical',
            loop: true,
            autoplay: true
        });


        // 日期进度

        $(".dateline-progress-inner").css('width', $(".dateline-progress-inner").attr('rate') + '%');


     
        // $('.record').click()

        function showRecord(data) {
            var template = $('#layer-template-record').html();

            window.__recordLayer = window.__recordLayer || new PopLayerZzs({
                title: '消费明细',
                content: mustache.render(template, data),
                height: 500,
                destroyAfterClose: false,
                className: 'record-layer',
                afterBuild: function (ele) {
                    $(ele).find('.popup-record-item').click(function () {
                        $(this).toggleClass('active')
                    })
                }
            });

            window.__recordLayer.open();
        }

        // 瓜分积分
        $('.guafen button').click(function () {
            multiCard = Math.random() > 0.5;
            if (multiCard) {
                loadCard()
            } else {
                getPoint()
            }
        })

        // 加载卡列表
        function loadCard() {
            setTimeout(function () {
                var data = {
                    cards: [{
                        name: "兴业银行信用卡  尾号1234",
                        logoUrl: '#',
                        valid: true,
                    }, {
                        name: "兴业银行信用卡  尾号6666",
                        logoUrl: '#',
                        valid: true,
                    }, {
                        name: "兴业银行信用卡  尾号3233",
                        logoUrl: '#',
                        valid: false
                    }]
                };
                pickCard(data)
            }, 1000)
        }

        // 选卡
        function pickCard(data) {
            var template = $('#layer-template-card').html();

            window.__cardLayer = window.__cardLayer || new PopLayer({
                title: '选择银行卡',
                content: mustache.render(template, data),
                height: 400,
                destroyAfterClose: false,
                className: 'card-layer',
                afterBuild: function (ele) {
                    $(ele).find('.card').click(function () {
                        if ($(this).hasClass('disabled')) {
                            return;
                        }

                        $(ele).find('.card').removeClass('selected')
                        $(this).addClass('selected');

                        window.__cardLayer.close();
                        getPoint();
                    })
                }
            });

            window.__cardLayer.open();
        }

        // 请求积分抽奖
        function getPoint() {
            setTimeout(function () {
                showPointAnimation(Math.random() > 0.5, 12345)
            }, 1000)
        }

        //  抽奖动效
        function showPointAnimation(isSuccess, point) {
            var layerHTML = $('#popup-template-point-animation').html();
            window.__ponitAnimationLayer = new Layer({
                content: layerHTML,
                width: $(this).attr('data-width') || 300,
                height: $(this).attr('data-height') || 365,
                noPadding: true,
                noButton: 1,
                wrapperClass: "popup-point-animation",
                afterBuild: function (ele) {
                    $(ele).find('[data-action="closeLayer"]').on('click', function () {
                        thisLayer.close();
                    });
                }
            });
            window.__ponitAnimationLayer.open();

            // 展示积分滚动
            setTimeout(function () {
                var params = {
                    container: $('.point-animation').eq(1)[0],
                    renderer: 'svg',
                    loop: false,
                    autoplay: true,
                    path: '/static/data/lottie/point/data.json'
                };
                var ani = lottie.loadAnimation(params);
                ani.addEventListener('complete', function () {
                    showPointPopup(isSuccess, point)
                })
            }, 200)
        }

        // 展示积分抽奖结果
        function showPointPopup(isSuccess, point) {

            if (window.__ponitAnimationLayer && window.__ponitAnimationLayer.close) {
                window.__ponitAnimationLayer.close();
            }
            var layerHTML;
            if (isSuccess) {
                $('#popup-template-point-success .bold span').text(point);
                layerHTML = $('#popup-template-point-success').html()
            } else {
                layerHTML = $('#popup-template-point-fail').html()
            }

            window.__pointResultLayer = new Layer({
                content: layerHTML,
                width: 300,
                height: isSuccess ? 365 : 290,
                // noPadding:true,
                noButton: 1,
                wrapperClass: "popup-point-" + (isSuccess ? 'success' : 'fail'),
                afterBuild: function (ele) {
                    $(ele).find('[data-action="closeLayer"]').on('click', function () {
                        window.__pointResultLayer.close();
                    });
                }
            });
            window.__pointResultLayer.open();
        }



        // 彩蛋点击
        $('.egg').click(function () {
            if ($(this).hasClass('achieve')) {
                return;
            }
            setTimeout(function () {
                showEggLayer({
                    transDate: '12月20日',
                    amount: 78564
                })
            }, 1000)

        });

        // 彩蛋弹层

        function showEggLayer(data) {
            $('.egg-date').text(data.date);
            $('.egg-amount').text('￥' + data.amount);
            $('.egg').addClass('achieve')

            var layerHTML = $('#popup-template-egg').html();
            var thisLayer = new Layer({
                content: layerHTML,
                width: $(this).attr('data-width') || 300,
                height: $(this).attr('data-height') || 365,
                // noPadding:true,
                noButton: 1,
                wrapperClass: "popup-egg",
                afterBuild: function (ele) {

                    $(ele).find('[data-action="closeLayer"]').on('click', function () {
                        thisLayer.close();
                    });
                }
            });
            thisLayer.open();

            setTimeout(function () {
                var params = {
                    container: $('.egg-animation').eq(1)[0],
                    renderer: 'svg',
                    loop: false,
                    autoplay: true,
                    path: '/static/data/lottie/egg/data.json'
                };
                lottie.loadAnimation(params);
            }, 200)
        }



    });