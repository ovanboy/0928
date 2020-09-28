require([
  'jquery',
  'mustache',
  'dialog'
],function(
  $,
  mustache,
  dialog
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
      _this.getMoreListRequestUrl = urlInfo.getMoreListRequestUrl;
      _this.changeProRequestUrl = urlInfo.changeProRequestUrl;
    },
    initStyle:function () {
      var _this=this;
      
    },
    bindEvent: function(){
      var _this = this;
      $(".list").on("click",".change",function () {
       var params=$(this).attr("name");
       var arr=params.split("-");
       dialog({
        type: 'confirm',
        content: '确定选择' + arr[1] + '吗？每月只可更改一次奖品',
        submitButtonText: '就选它了',
        cancelButtonText: '我再想想',
        submitCallback: function(value) {
          // console.log(arr[0]);
          $.ajax({
            type: 'post',
            url: _this.changeProRequestUrl,
            dataType: 'json',
            data: {id:arr[0]},  
            success: function(result){
                if(result.code=="1"){   
                 window.location.reload();
                }else{

                }
            }
          });
        },
        cancelCallback: function() {

        }
      })
      })
    },
    buildBanner: function(){
      var _this = this;

      _this.getBannerInfo(function(data){
        if(data.code=="1"){
          var choose=data.data.choosepro;
          $("#pro").attr("src",choose.image);
          $("#name").text(choose.name);
          $("#time").text(choose.time);
          $("#val").text(choose.val);
          _this.rebuildBannerInfo(data);
          _this.renderBanner();
        }
      });
    
    },
    getBannerInfo: function(callback){
      var _this = this;

      $.ajax({
          type: 'get',
          url: _this.getMoreListRequestUrl,
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
      var datalist=data.data.prolist
      for(i=0;i<datalist.length;i++){
          _this.bannerData[i] = {
              name: datalist[i].name,
              No: datalist[i].No,
              val: datalist[i].val,
              image: datalist[i].image,
              id:datalist[i].id,
              hadchanged:data.data.hadchanged,//已选中的必须移到第一个并且有标识
              time:datalist[i].time//已选中的必须移到第一个并且有标识
          };
      }
    },
    renderBanner: function(){
      var _this = this;
      $(".list").html(mustache.render($('#result-tpl').html(), {list: _this.bannerData}));
    }

  }
  page.init();
});