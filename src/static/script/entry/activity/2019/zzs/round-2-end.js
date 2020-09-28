require(['jquery', 'layer2', 'mustache'], function ($, Layer, mustache) {

       // 消费明细
       $('.record').click(function () {
        setTimeout(function () {
            var data = {
                data: [{
                        date: "9.6-9.16",
                        detail: [{
                            transDate: "9月6日",
                            transAmt: 1236
                        }, {
                            transDate: "9月6日",
                            transAmt: 1236
                        }, {
                            transDate: "9月6日",
                            transAmt: 1236
                        }]
                    },
                    {
                        date: "9.6-9.16",
                        detail: []
                    },
                    {
                        date: "9.6-9.16",
                        detail: [{
                            transDate: "9月6日",
                            transAmt: 1236
                        }, {
                            transDate: "9月6日",
                            transAmt: 1236
                        }, {
                            transDate: "9月6日",
                            transAmt: 1236
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