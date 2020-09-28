// 此js文件是推荐办卡页面分享JS方法, 在需要的地方调用

(function () {
    // 必须定义方法为window下的对象  ios需要注册webkitEvent
    var W = window;
    // 事件队列
    var _mevents = [];
    // 各种分享
    var _sharePageContent = {}, _appCheckVersion = {};
    // push 增加入队列
    // shift 先进先出
    // 设置自定义事件
    setWebitEvent = function (evtName, evtCode) {

        if (evtName == "") {
            return;
        }
        _mevents.push(JSON.stringify({
            code: evtCode,
            name: evtName
        }));
    };

    // 获取EventCode
    W.getWebkitEventCode = function () {
        return _mevents.length > 0 ? _mevents.shift() : "0";
    };
    _WK_DATAS = {};

})();

var ua = navigator.userAgent.toLowerCase();

function getAppShare(shareType, imageUrl, title, desc, pageUrl, channel, isOnlyImg, imageData, callback, flag) {
    _sharePageContent = {
        shareType: shareType,  //分享类型: qq、weixin、朋友圈
        imageUrl: imageUrl,
        title: title,    // 标题
        desc: desc,     // 描述
        pageUrl: pageUrl,
        channel: channel,
        isOnlyImg: isOnlyImg,
        imageData: imageData,
        callback: callback
    };


}

// AppSharePage() 为自定义的方法名称, 可以修改, "appShares" 为H5 与客户端定义好的接口名称, 不能修改
function AppSharePage() {
    return JSON.stringify(_sharePageContent);
}
