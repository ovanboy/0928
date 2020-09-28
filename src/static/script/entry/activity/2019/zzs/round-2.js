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


        // 消费明细
        $('.record').click(function () {
            setTimeout(function () {
                var data = {
                    data: [{
                            duration: "9.6-9.16",
                            list: [{
                                date: "9月6日",
                                money: 1236
                            }, {
                                date: "9月6日",
                                money: 1236
                            }, {
                                date: "9月6日",
                                money: 1236
                            }]
                        },
                        {
                            duration: "9.6-9.16",
                            list: [{
                                date: "9月6日",
                                money: 1236
                            }, {
                                date: "9月6日",
                                money: 1236
                            }, {
                                date: "9月6日",
                                money: 1236
                            }]
                        },
                        {
                            duration: "9.6-9.16",
                            list: [{
                                date: "9月6日",
                                money: 1236
                            }, {
                                date: "9月6日",
                                money: 1236
                            }, {
                                date: "9月6日",
                                money: 1236
                            }]
                        },
                        {
                            duration: "9.6-9.16",
                            list: [{
                                date: "9月6日",
                                money: 1236
                            }, {
                                date: "9月6日",
                                money: 1236
                            }, {
                                date: "9月6日",
                                money: 1236
                            }]
                        },
                        {
                            duration: "9.6-9.16",
                            list: [{
                                date: "9月6日",
                                money: 1236
                            }, {
                                date: "9月6日",
                                money: 1236
                            }, {
                                date: "9月6日",
                                money: 1236
                            }]
                        },
                    ]
                }
                var weektext = '一二三四五六'
                data.data = data.data.map(function (item, index) {
                    item.week = '第' + weektext[index] + '周'
                    return item
                })
                showRecord(data)
            }, 0)
        })
        // $('.record').click()

        function showRecord(data) {
            var template = $('#layer-template-record').html();

            window.__recordLayer = window.__recordLayer || new PopLayerZzs({
                title: '消费明细',
                content: mustache.render(template, data),
                height: 500,
                destroyAfterClose: false,
                className: 'record-layer',
                scroll: false,
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
            setTimeout(function () {
                multiCard = Math.random() > 0.5;
                if (multiCard) {
                    loadCard()
                } else {
                    getPoint()
                }
            })
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
                    date: '12月20日',
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

        // 查看开奖结果
        $('.check-award').click(function () {
            if (window.__awardListLayer) {
                window.__awardListLayer.open()
                return;
            }
            setTimeout(function () {
                var data = {
                    underTwoWeeksDetail: "第一轮您已达标2周，符合累积条件的消费金额为<span>22888.88</span>元",
                    // underTwoWeeksDetail:"第一轮您未参与选奖",
                    prizeList: [{
                        isSelect: '1',
                        prizeNm: "索尼PS4 Pro家庭套装",
                        actStore: 6666,
                        pntConsumeCnt: 8888
                    }, {
                        isSelect: '1',
                        prizeNm: "索尼PS4 Pro家庭套装",
                        actStore: 6666,
                        pntConsumeCnt: 8888
                    }, {
                        isSelect: '0',
                        prizeNm: "索尼PS4 Pro家庭套装",
                        actStore: 6666,
                        pntConsumeCnt: 8888
                    }]
                }

                data.prizeList = data.prizeList.map(function (item) {
                    item.isSelect = item.isSelect == '1';
                    return item;
                })
                showAwardList(data)
            }, 0)
        })

        function showAwardList(data) {
            var html = $('#award-list-layer-template').html()
            window.__awardListLayer = new Layer({
                content: mustache.render(html, data),
                width: $(this).attr('data-width') || 300,
                height: $(this).attr('data-height') || 350,
                noPadding: true,
                noButton: false,
                destroyAfterClose: false,
                wrapperClass: "award-list-layer",
                afterBuild: function (ele) {
                    $(ele).find('[data-action="closeLayer"]').on('click', function () {
                        window.__awardListLayer.close();
                    });
                }
            });
            window.__awardListLayer.open();
        }


    });