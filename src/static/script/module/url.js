define([], function (){
    
    
    return {
        getInfoFormURL:function(url){
            var _this = this;

            var info = {};
            var url = url || window.location.href;
            var tArr1 = url.split('?');
            info.base = tArr1.shift();
            var tArr2 = tArr1.join('?').split('&');
            info.params = {};
            for(var i=0;i<tArr2.length;i++){
                var tArr3 = tArr2[i].split('=');
                if(tArr3.length == 2){
                    info.params[decodeURIComponent(tArr3[0])] = decodeURIComponent(tArr3[1]);
                }
            }
            return info;
        },
        getURLParams:function(url){
            var _this = this;

            var url = url || window.location.href;
            return _this.getInfoFormURL(url).params;
        },
        updateURL:function(url,data){
            var _this = this;

            var url = url || window.location.href;
            var info = _this.getInfoFormURL(url);
            var params = info.params;
            for(var key in data){
                if(data[key] !== null){
                    params[key] = data[key];
                }else if(typeof params[key] !== 'undefined'){
                    delete params[key];
                }
            }
            var paramsArr = [];
            for(var a in params){
                paramsArr.push(encodeURIComponent(a) + '=' + encodeURIComponent(params[a]+''));
            }
            var newUrl = info.base + '?' + paramsArr.join('&');
            return newUrl;
        }
    };


});