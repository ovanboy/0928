require([
    'jquery',
    'layer2',
    'dialog',
    'mustache',
    'pop-layer',
    'cascade-picker2',
    'msg'
], function(
    $,
    Layer,
    dialog,
    mustache,
    PopLayer,
    CascadePicker,
    msg
) {
    var addressInfo = {};
    var tempAddressInfo = {};
    var mobileRegx = /^1\d{10}$/;
    var addrRegx = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;


    // 时间线动效
    $(".dateline-progress-inner").css('width', $(".dateline-progress-inner").attr('rate') + '%');

    $('.award-item section').on('click', function(e) {
        var awardid = $(this).parent().attr('awardid');
        var layerHTML = $('#award-template-' + awardid).html();
        if (!layerHTML) return;
        var thisLayer = new Layer({
            content: layerHTML,
            width: $(this).attr('data-width') || 300,
            height: $(this).attr('data-height') || 409,
            noPadding: true,
            noButton: false,
            wrapperClass: "award-detail-layer",
            afterBuild: function(ele) {
                $(ele).find('[data-action="closeLayer"]').on('click', function() {
                    thisLayer.close();
                });
            }
        });
        thisLayer.open();
    });

    // $('.award-item section').eq(0).click()

    $('.award-item .select-me').click(function() {
        var awardid = $(this).parent().attr('awardid');
        var aname = $($('#award-template-' + awardid).html()).find('.award-detail-title').text()
        dialog({
            type: 'confirm',
            content: '确定' + aname + '吗？奖品一旦选择，无法更改哦',
            submitButtonText: '我心已决',
            cancelButtonText: '我再想想',
            submitCallback: function(value) {
                console.log('漩涡')
            },
            cancelCallback: function() {

            }
        })
    });
    // $('.award-item .select-me').eq(0).click()

    // 查看开奖结果
    $('.check-award').click(function() {
            if (window.__awardListLayer) {
                window.__awardListLayer.open()
                return;
            }
            setTimeout(function() {
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

                data.prizeList = data.prizeList.map(function(item) {
                    item.isSelect = item.isSelect == '1';
                    return item;
                })
                showAwardList(data)
            }, 0)
        })
        // $('.check-award').click()
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
            afterBuild: function(ele) {
                $(ele).find('[data-action="closeLayer"]').on('click', function() {
                    window.__awardListLayer.close();
                });
            }
        });
        window.__awardListLayer.open();
    }


    // 地址

    $('.address').click(function() {

        if (window.__addressPopLayer) {
            window.__addressPopLayer.open()
        } else {
            // ajax 异步获取地址信息
            setTimeout(function() {
                var data = {
                    userName: "礼逊湖",
                    mobile: "15102120983",
                    province: "河南省",
                    city: "郑州市",
                    area: "凤阳县",
                    addr: "松涛路80号"
                }
                addressInfo = data;
                tempAddressInfo = $.extend({}, data)
                showAddress(data)
            }, 0)
        }

    });

    // $('.address').click();

    // 弹层打开时赋值
    function setAddressValue(data, element) {
        var context = !element ? $('.address-poplayer') : $(element)
        $('.username', context).text(data.userName)
        $('.mobile', context).text(data.mobile)
        $('.province', context).text(data.province)
        $('.city', context).text(data.city)
        $('.area', context).text(data.area)
        $('.addr', context).text(data.addr)

        $('.mobile-input', context).val(data.mobile)
        $('.addr-textarea', context).val(data.addr)
    }


    function showAddress(data) {
        if (window.__addressPopLayer) {
            window.__addressPopLayer.open();
            return;
        }
        var regionPicker = new CascadePicker({
            title: '所在地区',
            length: 3, // 必选项
            data: regionData,
            valueKey: 'id',
            textKey: 'name',
            subsKey: 'subs',
            onsubmit: function(value) {
                var vals = value.map(function(item) {
                    return item.value
                });
                tempAddressInfo = $.extend(tempAddressInfo, {
                    province: vals[0],
                    city: vals[1],
                    area: vals[2]
                });
                $('[data-pop-layer-panel-id=addresspanel] .province').text(vals[0])
                $('[data-pop-layer-panel-id=addresspanel] .city').text(vals[1])
                $('[data-pop-layer-panel-id=addresspanel] .area').text(vals[2])
                this.layer.closePanel('citypanel')
            },
            placeholder: ['请选择省', '请选择市', '请选择区'],
        });

        window.__addressPopLayer = window.__addressPopLayer || new PopLayer({
            title: '消费明细',
            content: $('#address-popup-template').html(),
            height: 400,
            destroyAfterClose: false,
            className: 'address-poplayer',
            panels: [{
                id: 'addresspanel',
                content: $('#address-popup-edit-template').html(),
                showMode: 'to-left',
                cancelBtnType: 'back',
                scroll: false
            }, {
                id: 'citypanel',
                title: "所在地区",
                content: regionPicker.contentHtml,
                showMode: 'to-left',
                cancelBtnType: 'back',
                scroll: false,

            }],
            afterBuild: function(ele) {
                var layer = this;

                setAddressValue(addressInfo, ele); // 渲染地址数据

                regionPicker.bindEvent(ele, this); // 绑定城市选择插件


                $(ele).find(".edit-address").click(function() {
                    setAddressValue(addressInfo, ele);
                    layer.openPanel('addresspanel');
                })
                $(ele).find(".cityselect").click(function() {
                    regionPicker.setValue([tempAddressInfo.province, tempAddressInfo.city, tempAddressInfo.area]);
                    layer.openPanel('citypanel');
                })
                $(ele).find('[data-action="closeLayer"]').on('click', function() {
                    window.__addressPopLayer.close();
                });



                $('.mobile-input,.addr-textarea').on('input change blur', function(e) {
                    var regx = e.target.nodeName === 'INPUT' ? mobileRegx : addrRegx;
                    var errorMsg = e.target.nodeName === 'INPUT' ? '请输入准确的手机号码' : '详细地址不能有特殊字符'
                    var isBlur = e.type === 'blur';

                    if (regx.test($(this).val())) {
                        $(this).removeClass('error')
                    } else {
                        $(this).addClass('error')
                        isBlur && msg({
                            content: errorMsg,
                            duration: 3000,
                        });
                    }

                    if ($(this).val()) {
                        $(this).parents('.cell-item').find('.reset').show()
                    } else {
                        $(this).parents('.cell-item').find('.reset').hide()
                    }

                    $('.edit-submit-btn').each(function() {
                        this.disabled = !verify()
                    })

                })


                $('.reset').click(function() {
                    $(this).parents(".cell-item").find('textarea,input').val('')
                    $(this).hide();
                    $('.edit-submit-btn').each(function() {
                        this.disabled = true
                    })
                })



                // 地址编辑提交
                $('.edit-submit-btn').click(function() {
                    updateAddress(layer, ele)
                });

            }
        });

        window.__addressPopLayer.open();
    }

    function verify(showMsg) {
        var $mobile = $('[data-pop-layer-panel-id=addresspanel] .mobile-input');
        var $addr = $('[data-pop-layer-panel-id=addresspanel] .addr-textarea');
        tempAddressInfo.mobile = $mobile.val()
        tempAddressInfo.addr = $addr.val()

        if (!mobileRegx.test(tempAddressInfo.mobile)) {
            if (showMsg) {
                msg({
                    content: '请输入准确的手机号码',
                    duration: 3000
                })
                $mobile.addClass('error')
            }
            return false;
        }

        if (!addrRegx.test(tempAddressInfo.addr)) {
            if (showMsg) {
                msg({
                    content: '详细地址不能有特殊字符',
                    duration: 3000
                })
                $addr.addClass('error')
            }
            return false;
        }
        return true;
    }

    function updateAddress() {

        if (!verify(true)) {
            return false;
        }


        setTimeout(function() {
            addressInfo = $.extend({}, tempAddressInfo);
            setAddressValue(addressInfo, $(".address-popup"))

            window.__addressPopLayer.close(function() {
                window.__addressPopLayer.closePanel('addresspanel')
                msg.info("修改成功")
            });
        }, 1000);
    }

    try {
        $('.open-box').click(function() {
            if (isRuning || $(this).hasClass('disabled')) return;
            isRuning = true;
            var _this = this;

            $openBtn[0].disabled = true;

            $('.times span').text(--times);


            setTimeout(function() {
                if (times === 0) {
                    $(_this).addClass('disabled')
                    $('.times span').addClass('zero')
                }
                var back_data = { type: 'coupon', value: '888元' }
                treasureData = back_data;
                $('.box-img').hide()
                $('.box-ani').show()
                ani.goToAndPlay(0)

            }, 1000)
        });
    } catch (e) {

    }

});