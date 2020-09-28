require(['jquery', 'wx'], function ($, wx) {
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '', // 必填，公众号的唯一标识
        timestamp: new Date(), // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
    });

    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
        wx.updateAppMessageShareData({//分享给朋友
            title: '具体的描述信息1', // 分享标题
            desc: '具体的描述信息2', // 分享描述
            link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: '', // 分享图标
        }, function(res) {
            //这里是回调函数
            wx.closeWindow()
        });
        wx.updateTimelineShareData({//分享到朋友圈
            title: '具体的描述信息3', // 分享标题
            link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: '', // 分享图标
        }, function(res) {
            //这里是回调函数
            wx.closeWindow()
        });
    });

    var nameFieldKey = 'inputUserName';
    var $transferBtn1 = $('#transferBtn1');
    var $transferBtn2 = $('#transferBtn2');
    var $receiveBtn = $('#receiveBtn');
    var hashName = window.location.hash.replace(/^#/, '');
	initListeners();
    initTransferName();
    initButtonBars();
    initTrigger();

	function initListeners() {
		$('#transferBtn1,#transferBtn2').on('click', function () {
			//传递祝福给亲友按钮触发显示填写浮层
			$('.mainContentCon').addClass('hide');
            $('.sendCon').removeClass('hide').addClass('panelAnimate').css('bottom', '0px');
		});

        $receiveBtn.on('click', function () {
            $('.mainContentCon').addClass('hide');
            $('.transferCon').removeClass('hide').addClass('panelAnimate').css('bottom', '0px');
        });

		$('.telNOField').on('blur', validateTelNO);//电话号码输入框失去焦点，进行号码正确性验证
        $('.telNOField').on('focus', function () {
            //电话输入框聚焦时，默认隐藏号码验证错误提示窗口
            var $telField = $('.telNOField');
            $telField.siblings('.errorMsg').addClass('techniqueHide');
		});

        $('.sendBtn').on('click', function () {
            //点击送祝福按钮事件
            var $tranferNameFieldVal = $('.tranferNameField').val();
            if ($tranferNameFieldVal !== undefined && $tranferNameFieldVal !== null && $tranferNameFieldVal.length > 0) {
                //在进行传递祝福的时候， 进行验证当前的浏览器平台。
                // 起始送祝福开始于移动app，需要调用app分享接口。
                // 微信平台的祝福窗口直接显示引导分享弹层
                if (isMDBApp()) {
                    console.log(prepareSharedURL())
                    //调用app接口
                } else {
                    guideSharePanel();
                    prepareSharedURL();//获取url
                }
            } else {
                //没有填写内容会阻止继续进行
                return;
            }
        });

		$('.receiveImd').on('click', function () {
            if (!validateTelNOResult()) {
                //提交信息前，进行电话号码的正确性验证,失败
                var $telField = $('.telNOField');
                $telField.siblings('.errorMsg').removeClass('techniqueHide');
                return;
            } else {
                //电话输入正确
                console.log('提交电话号码，领取礼包。给你送祝福的人：' + hashName)
                //window.location.href = '';
            }
		});
	}

	function initTransferName() {
	    $('.wishesAndSignatureCon .nameSpan').text(getTransferName());
    }

    //从url获取参数
    function getParamFromURL(name) {
        var reg = new RegExp(name + "=([^&]*)");
        var r = window.location.href.match(reg);
        if (r != null) {
            return r[1];
        }
        return null;
    }

    function getTransferName() {
        var name = '买单吧';
        var hash = window.location.hash.replace(/#/, '');
        if (hash) {
            name = hash;
        }
        return decodeURIComponent(name);
    }


	function validateTelNO() {
		var $telField = $('.telNOField');
        if (validateTelNOResult()) {
            $telField.siblings('.errorMsg').addClass('techniqueHide');//电话号码输入正确， 隐藏验证提示错误文本
        } else {
            $telField.siblings('.errorMsg').removeClass('techniqueHide');//电话号码输入不正确，显示验证提示错误文本
        }
	}

    function validateTelNOResult() {
        var $telField = $('.telNOField');
        var val = $telField.val();
        return telNOPattField(val);
    }

	function telNOPattField(val) {
        var regu = /^[0-9]{11}$/;
        var patt = new RegExp(regu);
        return patt.test(val);
	}

    function isWeiChat() {
        var ua = navigator.userAgent.toLowerCase();
        return /MicroMessenger/i.test(ua);
    }

    //判断是否是买单吧环境
    function isMDBApp() {
        var ua = navigator.userAgent.toLowerCase();
        return /com/i.test(ua);
    }

    // function prepareSharedURLParam() {
    //     var $tranferNameFieldVal = $('.tranferNameField').val();
	//     var url = window.location.href.replace(/\?.*?$/,'') + '?' + encodeURIComponent(nameFieldKey) + '=' + encodeURIComponent($tranferNameFieldVal);
	//     return url;
    // }

    function prepareSharedURL() {
	    //hash
        var $tranferNameFieldVal = $('.tranferNameField').val();
        window.location.hash = encodeURIComponent($tranferNameFieldVal);
        return window.location.href;
    }

    function guideSharePanel() {
        $('.guideSharePanel').removeClass('hide');
    }

    function initTrigger() {
        var passFlag = getParamFromURL('pass');
        if (/^true/.test(passFlag)) {
            $('#transferBtn1').trigger('click');
        }
    }

    function initButtonBars() {
        if (hashName) {
            $transferBtn1.remove();
            $transferBtn2.removeClass('hide');
            $receiveBtn.removeClass('hide');
        } else {
            $transferBtn1.removeClass('hide');
            $transferBtn2.remove();
            $receiveBtn.remove();
        }
    }
});