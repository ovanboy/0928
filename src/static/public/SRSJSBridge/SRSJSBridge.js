// nativeMethodName : 调用的原生方法名称, String类型
// parameters       : Web页面传递给原生的参数, object类型
// htmlCallBack     : Web页面的回调方法名称, String类型
function srsCallNative(nativeMethodName, parameters, htmlCallBack) {
     
    if (typeof parameters != 'object') {
        srsParametersTypeError(nativeMethodName, '参数格式错误');
        return;
    }
     
    if(navigator.userAgent.indexOf('Android') != -1) { // 安卓
        var parametersStr = JSON.stringify(parameters);
        if(typeof(window.metaObj.srsNativeMethod) == 'function') {
            window.metaObj.srsNativeMethod(nativeMethodName, parametersStr, htmlCallBack,'srsCallback');
        }else{
            srsNativeEntranceNotFound();
        }
    } else { //苹果
        var nativePara = {};
        if(parameters != null){
            nativePara.parameters = parameters;
        }
        nativePara.webCallBack = htmlCallBack;
        nativePara.nativeMethod = nativeMethodName+':';
        if(navigator.userAgent.indexOf('UIWebView') != -1) {
            if(typeof(__srsNative__) == 'object') {
                __srsNative__.srsNativeEntrance(nativePara);
            } else {
                srsNativeEntranceNotFound();
            }
        } else if(navigator.userAgent.indexOf('WKWebView') != -1) {
            if (window.webkit.messageHandlers.__srsNative__) {
                nativePara.nativeEntrance = 'srsNativeEntrance:';
                window.webkit.messageHandlers.__srsNative__.postMessage(nativePara);
            } else {
                srsNativeEntranceNotFound();
            }
        } else {
            srsNativeEntranceNotFound();
        }
         
    }
}
 
 
// 判断原生方法是否实现
// nativeMethodName : 调用的原生方法名称, String类型
// nativeMethodExistCallback : 方法是否存在的回调(方法名, 字符串), 该方法需要两个参数
// nativeMethodExistCallback(nativeMethodName,exist): 检查的方法名, 方法是否存在(true, false)
function srsCheckNativeMethodExist(nativeMethodName, nativeMethodExist) {
    if(typeof nativeMethodExist !== 'string'){
        return;
    }
    if(navigator.userAgent.indexOf('Android') != -1) { // 安卓
        if(typeof(window.metaObj.srsCheckMethodExist) == 'function') {
            window.metaObj.srsCheckMethodExist(nativeMethodName, nativeMethodExist);
        }else{
            window[nativeMethodExist] && typeof window[nativeMethodExist] === 'function' && window[nativeMethodExist](nativeMethodName, 'false');
        }
    } else { //苹果
        var nativePara = {};
        nativePara.webCallBack = nativeMethodExist;
        nativePara.nativeMethod = nativeMethodName+':';
        if(navigator.userAgent.indexOf('UIWebView') != -1) {
            if(typeof(__srsNative__) == 'object') {
                __srsNative__.srsNativeCheckEntrance(nativePara);
            } else {
                window[nativeMethodExist] && typeof window[nativeMethodExist] === 'function' && window[nativeMethodExist](nativeMethodName, 'false');
            }
        } else if(navigator.userAgent.indexOf('WKWebView') != -1) {
            if (window.webkit.messageHandlers.__srsNative__) {
                nativePara.nativeEntrance = 'srsNativeCheckEntrance:';
                window.webkit.messageHandlers.__srsNative__.postMessage(nativePara);
            } else {
                window[nativeMethodExist] && typeof window[nativeMethodExist] === 'function' && window[nativeMethodExist](nativeMethodName, 'false');
            }
        } else {
            window[nativeMethodExist] && typeof window[nativeMethodExist] === 'function' && window[nativeMethodExist](nativeMethodName, 'false');
        }
    }
}
 
 
// 该方法被调用,说明不支持新JS调用方式,为老版本
function srsNativeEntranceNotFound() {
    console.log('Native Entrance not Found');
}
 
 
// 该方法被调用,说明原生方法未找到
function srsNativeMethodNotFound(nativeMethodName) {
    console.log(nativeMethodName + ' Method Not Found');
}
 
 
function srsParametersTypeError(nativeMethodName, errorInfo) {
    console.log('Method of '+ nativeMethodName + ' parameters type error,' + errorInfo);
}
 
 
 
function srsCallback(htmlCallBack,result){
    if(typeof(eval(htmlCallBack)) == 'function'){
        var params = JSON.parse(result);
        eval(htmlCallBack+'(params);');
    }
}