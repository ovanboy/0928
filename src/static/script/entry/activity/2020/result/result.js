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
       
    },
    bindEvent: function(){
      var _this = this;
      $(".btn").on("click",function () {
        history.go(-1);
      })
    }
  }
  page.init();
});