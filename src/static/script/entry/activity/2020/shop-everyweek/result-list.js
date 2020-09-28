require([
  'jquery',
  'mustache'
],function(
  $,
  mustache
){
  var page = {
    init: function(){
        var _this = this;

        // 缓存一些公用数据
        _this.cacheData();
        //初始化一些初始事件
        _this.initStyle();
        // 构建 banner
        _this.buildBanner();

        // 其他页面事件
        _this.bindEvent();

    },
    cacheData: function(){
      var _this=this;
      //请求地址
      _this.getResultListRequestUrl = urlInfo.getResultListRequestUrl;
    },
    initStyle:function () {
      var _this=this;
      
    },
    bindEvent: function(){
      var _this = this;
      $(".foot").on("click",function () {
        window.location.href="#";
      })
    },
    buildBanner: function(){
      var _this = this;

      _this.getBannerInfo(function(data){
        _this.rebuildBannerInfo(data);
        _this.renderBanner();

      });
    
    },
    getBannerInfo: function(callback){
      var _this = this;

      $.ajax({
          type: 'get',
          url: _this.getResultListRequestUrl,
          dataType: 'json',
          data:{},
          success: function(result){
                  typeof callback === 'function' && callback(result);
          }
      });
    },
    rebuildBannerInfo: function(data){
      var _this = this,
          i;
      _this.bannerData = [];
      for(i=0;i<data.length;i++){
          _this.bannerData[i] = {
              name: data[i].name,
              No: data[i].No,
              val: data[i].val,
              image: data[i].image,
              id:data[i].id,
              hadchoosed:i==0&&data[i].hadchoosed//已选中的必须移到第一个并且有标识
          };
      }
    },
    renderBanner: function(){
      var _this = this;
      $(".content-wrapper").html(mustache.render($('#result-tpl').html(), {list: _this.bannerData}));
    }

  }
  page.init();
});