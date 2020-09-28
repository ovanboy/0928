require([
  'jquery',
  'mustache',
  'swiper',
  'dialog',
  'layer',
  'pop-layer',
  'msg'
],function(
  $,
  mustache,
  Swiper,
  dialog,
  Layer,
  PopLayer,
  msg
){
  var page = {
    init: function(){
        var _this = this;

        // 缓存一些公用数据
        _this.cacheData();
        //初始化一些初始事件
        _this.initStyle();
        // 其他页面事件
        _this.bindEvent();

    },
    cacheData: function(){
      var _this=this;
      //请求地址
      _this.userInfoRequestUrl = urlInfo.userInfoRequestUrl;
      _this.bannerInfoRequestUrl = urlInfo.bannerInfoRequestUrl;
      _this.choosePrizeRequestUrl = urlInfo.choosePrizeRequestUrl;
      _this.myPrizeRequestUrl = urlInfo.myPrizeRequestUrl;
    },
    initStyle:function () {
      var _this=this;
      var $contentBox= $(".content-box");
      var $swiper= $(".banner-list");
      var $havechoosed= $(".havechoosed");
      var date=new Date();
      //获得当前月份默认展示哪个月
      var month=date.getMonth();
      var monthfalse=4;
      if(month<4){
        monthfalse=4;
      }else if(month>9){
        monthfalse=9
      }else{
        monthfalse=month;
      }
      $(".item").removeClass("active");
      $(".item").eq(monthfalse-4).addClass("active");
      if(month<10){
         //在活动时间内获取用户是否参与返回一些信息
        _this.getUserInfo(function (params) {
          if(params.code==1){
            var obj= params.data.prizeInfo;
            if(obj&&!$.isEmptyObject(obj)){
              $("#today").text(month+1+"月"+date.getDate()+"日");
              $(".big").text(obj.No);
              $(".somebody").text(obj.somebody);
              $(".tagsum").text(obj.sum);
              $(".tagname").text(obj.name);
              $(".tagval").text(obj.val);
              $(".prizebox img").attr("src",obj.image);
              $(".tagtime").text(obj.end);
              $(".allbrick").text(params.data.brick);
              $(".times").text(params.data.times);
              $(".tag").removeClass("hided");
              $(".banner-list").addClass("hided");
            }else{
              _this.buildBanner();
            }
          }else{
            msg(params.message);
          }
        })
      }else{
        $(".maintab").addClass("hided");
      }
      //我的奖品模块信息获取
      //用户月份奖品参与情况展示可以看下com类，要显示那个加类show
      _this.getMyPrize(function (params) {
        
      });
    },
    bindEvent: function(){
      var _this = this;
      $("#banner").on("click",".img",function () {
        var self=this;
        _this.getproInfo(self);
      })
      $("#banner").on("click",".choosebtn",function () {
        var param=$(this).prop("name");
        _this.choosePrize(param);
      })
      $('.box .item').on('click', function () {
        var self=$(this);
        self.siblings().removeClass("active");
        self.addClass("active");
      });
      $(".checkResult").on("click",function () {
        window.location.href="./result-list.html";
      });
      $(".checkall").on("click",function () {
        window.location.href="./check-all.html";
      });
      $(".comfirm").on("click",function () {
        _this.comFirmAdress();
      })
    },
    buildBanner: function(){
      var _this = this;

      _this.$banner = $('#banner');
      _this.$bannerList = _this.$banner.find('.banner-list');

      _this.getBannerInfo(function(data){
          _this.rebuildBannerInfo(data);
          _this.renderBanner();

          new Swiper(_this.$banner[0], {
              setWrapperSize: true,
              slidesPerView:"auto",
              spaceBetween:10,
              freeMode:true
          });
      });
      $(".tag").removeClass("hided");
      $(".havechoosed").addClass("hided");
    },
    getMyPrize: function(callback){
      var _this = this;

      $.ajax({
          type: 'get',
          url: _this.myPrizeRequestUrl,
          dataType: 'json',
          data:{},
          success: function(result){
                  typeof callback === 'function' && callback(result);
          }
      });
    },
    getUserInfo: function(callback){
      var _this = this;

      $.ajax({
          type: 'get',
          url: _this.userInfoRequestUrl,
          dataType: 'json',
          data:{},
          success: function(result){
                  typeof callback === 'function' && callback(result);
          }
      });
    },
    getBannerInfo: function(callback){
      var _this = this;

      $.ajax({
          type: 'get',
          url: _this.bannerInfoRequestUrl,
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
              time:data[i].time
          };
      }
    },
    renderBanner: function(){
      var _this = this;
      _this.$bannerList.html(mustache.render($('#banner-tpl').html(), {list: _this.bannerData}));
    },
    comFirmAdress:function () {
      var _this=this;
      _this.addressdLayer = new PopLayer({
        title: '邮寄地址',
        className: 'address-layer',
        contentHTML: $('#address-tpl').html(),
        destroyAfterClose: false,
        height: 350,
        afterBuild: function () {
            var $layer = $(this.element);

        }
    });
    _this.addressdLayer.open();
    },
    choosePrize:function (params) {
      var _this=this;
      var arr=params.split("-");
      dialog({
        type: 'confirm',
        title: '确定选择' + arr[1] + '吗？',
        content: '奖品一旦选择，本月无法修改',
        submitButtonText: '就选它了',
        cancelButtonText: '我再想想',
        submitCallback: function(value) {
          $.ajax({
            type: 'post',
            url: _this.choosePrizeRequestUrl,
            dataType: 'json',
            data: {id:arr[0]},  
            success: function(result){
                if(result.code=="1"){   
                  //更改页面数据
                  $(".tag").removeClass("hided");
                  $(".banner-list").addClass("hided");
                }else{
                  msg(result.message);
                }
            }
          });
        },
        cancelCallback: function() {

        }
      })
    },
    getproInfo:function (self) {
      var _this=this;
      var data={
        name:$(self).find(".pbox p").eq(0).text(),
        val:$(self).find(".pbox p").eq(1).text().match(/\d+/g)[0],
        No:$(self).next("p").text().match(/\d+/g)[0],
        img:$(self).attr("data-url")
      }
      _this.showAwardList(data);
    },
    showAwardList:function (data) {
        var html = $('#prize-layer-template').html()
       __awardListLayer = new Layer({
            contentHTML: mustache.render(html, data),
            destroyAfterClose: false,
            afterBuild: function (ele) {
                
            }
        });
       __awardListLayer.open();
    }

  }
  page.init();
});