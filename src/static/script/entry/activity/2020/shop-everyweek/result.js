require([
  'jquery'
],function(
  $
){
  var page = {
    init: function(){
        var _this = this;
        //初始化一些初始事件
        _this.initStyle();
        // 其他页面事件
        _this.bindEvent();
    },
    
    initStyle:function () {
      var _this=this;
      var result=_this.getQuery()["result"];//状态结果页跳转带参数result 1无权限  2结束过期  3拥挤火爆
      var $mainbg= $(".mainbg");
      var $tab= $(".tab");
      var $info= $(".info");
      $tab.removeClass("show").eq(result-1).addClass("show");
      if(result==1){
        $mainbg.removeClass().addClass("mainbg access");
        $info.removeClass("hide").eq(1).addClass("hide");
      }else if(result==2){
        $mainbg.removeClass().addClass("mainbg end");
        $info.removeClass("hide").eq(1).addClass("hide");
      }else{
        $mainbg.removeClass().addClass("mainbg crowd");
        $info.removeClass("hide").eq(0).addClass("hide");
       }
       
    },
    bindEvent: function(){
      var _this = this;
      $(".btn").on("click",function () {
        history.go(-1);
      })
    },
    getQuery:function () {
      var url=location.search;
      var theRequest=new Object();
      if(url.indexOf("?")!=-1){
        var str=url.substr(1);
        strs=str.split("&");
        for(var i=0;i<strs.length;i++){
          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    }
  }
  page.init();
});