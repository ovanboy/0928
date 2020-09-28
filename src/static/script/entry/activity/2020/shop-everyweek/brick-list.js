require([
  'jquery',
  'mustache',
  'scrollload',
  'pop-picker'
],function(
  $,
  mustache,
  scrollload,
  PopPicker
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
      _this.getShopListRequestUrl = urlInfo.getShopListRequestUrl;
    },
    initStyle:function () {
      var _this=this;
      var date=new Date();
      //获得当前月份默认展示哪几个月/如果月份是固定的可以删除
      var month=date.getMonth();
      // month=4
      $(".year-mon").text("2020年"+(month+1)+"月");
      var timeselect=$(".year-mon")
      _this.timeSelectLayer = new PopPicker({
        title: '请选择月份',
        value: month+"",//默认选中
        clickMaskForClose: true,
        data:[
          {
            value: '4',
            text: '2020年5月'
        },{
            value: '5',
            text: '2020年6月'
        },{
            value: '6',
            text: '2020年7月'
        },{
            value: '7',
            text: '2020年8月'
        },{
            value: '8',
            text: '2020年9月'
        },{
            value: '9',
            text: '2020年10月'
          }
        ],
         // 提交时回调
         onSubmit: function(value){
          timeselect.text(this.getValueInfo().text);
          $('.content-wrapper').empty();
          _this.page=1;
          _this.buildBanner();
          _this.time="";
      }
    });
      
    },
    bindEvent: function(){
      var _this = this;
      $(".year-mon").on("click",function () {
        _this.timeSelectLayer.show();
      })
    },
    buildBanner: function(){
      var _this = this;

      _this.page=1;
      _this.time="";
      var Scrollload = scrollload.default,
        page = _this.page,
        size = 6,
        billTpl = $('#bill-tpl').html(),
        $listContainer = $('.list-container'),
        $contentWrapper = $listContainer.find('.content-wrapper');
    new Scrollload({
        container: $listContainer[0],
        content: $contentWrapper[0],
        //enableLoadMore: false,
        threshold: 100,
        loadingHtml: '',
        noMoreDataHtml: '已显示全部',
        loadMore: function(sl) {
            $.ajax({
                url: _this.getShopListRequestUrl,
                data: {
                    pageIndex: page,
                    pageSize: size,
                    time:_this.time
                },
                dataType: 'json',
                success: function(result){
                    if(result.code=="1"){
                        var data = result.data;
                        var n = data.length;
                        if(n > 0){
                          for(var i=0;i<n;i++){
                            var obj = data[i];
                            obj.minus=obj.fee<0;
                          }
                            $contentWrapper.append(mustache.render(billTpl,{list:data})) 
                            page = page + 1;
                            $(".scrollload-bottom").show()
                        }else{
                          if(page=="1"){
                            $(".page-content").addClass("bgempty");
                          }else{
                            $(".page-content").removeClass("bgempty");
                          }
                          $(".scrollload-bottom").hide()
                        }
                        if(n < size){
                          sl.noMoreData();
                        }
                    }
                    sl.unLock()
                },
                error: function(xhr, type){}
            });
        }
    });
    }
  }
  page.init();
});