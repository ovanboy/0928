require(["jquery", "mustache", "msg", "scrollload","pop-layer","swiper"], function(
    $,
    mustache,
    msg,
    Scrollload,
    PopLayer,
    Swiper
) {
    console.log(111);
    var Swiper=new Swiper(".banner .swiper-container",{
        pagination: {
            el: ".swiper-pagination"
        }
    });

    var template = $("#list-template").html();
    var pageIndex = 1;
    var pageSize = 10;
    var currentType = "";   //类型:全部
    var listCount = 0;
    var initPage = true;
    var scrollload = new Scrollload.default({
        threshold:1,
        window: document.querySelector(".main"),
        container: document.querySelector(".scroll-container"),
        content: document.querySelector(".list"),
        loadingHtml: $("#loadding-html").html(),
        noMoreDataHtml:$("#no-more-data-html").html(),
        loadMore: function(sl) {
            $.ajax({
                url: "/lion/list.json",
                data: {
                    type: currentType,
                    pageIndex: pageIndex,
                    pageSize: pageSize
                },
                success: function(data) {
                    console.log(data);
                    
                    setTimeout(function() {
                        var _html = mustache.render(template, data);
                        var max = data.countNum;

                        $(".list").append(_html);
                        if (initPage) {
                            $("body").addClass("exchangeLoadding");
                            initPage = false;
                        }

                        if (pageSize * pageIndex >= 40) {
                            sl.noMoreData();
                        } else {
                            pageIndex++;
                            sl.unLock();
                        }
                    }, 2000);
                }
            });
        }
    });

    $(".nav-list .link").click(function() {
        if ($(this).hasClass("active")) return;
        $(".nav-list .link.active").removeClass("active");
        $(this).addClass("active");
        currentType = $(this).attr("type") || ""; // 获取类型
        console.log(currentType);

        initPage = true;
        pageIndex = 1;
        listCount = 0;
        $("body").removeClass("exchangeLoadding");
        $(".list").html("");
        if(scrollload.hasMoreData){
            scrollload.unLock();
        }else{
            scrollload.refreshData();
        }
    });
    
    $(".title-content .title-classroom").click(function(e){
        fn("none","block",e)
    })
    $(".title-content .title-theatre").click(function(e){
        fn("block","none",e)
    })
    function fn(a,b,e){
        if($(e.tatget).hasClass("active")) return;
        $(".title-content div.active").removeClass("active");
        $(e.target).addClass("active")
        $(".theatre-content").css("display",a)
        $(".classroom-content").css("display",b)
    }

    $(".tv-btn .single-btn.link").click(function(){
        $(".tv-btn.hidden").removeClass("hidden")
        $(this).text(12)
    })

    // $(".tv-btn .single-btn.link").click(function(){
    //     // console.log("显示集数");
    //     demoLayer.open(function(){
    //         // console.log('弹层已打开');
    //     });
    // })

    // var num=46;  //集数
    // var str=`<div class="link">1</div>`;
    // for(var i=2;i<=num;i++){
    //     str=str+`<div class="link">${i}</div>`
    // }
    // var demoLayer = new PopLayer({
    //     title: '选择集数',
    //     className: 'demo-layer',
    //     contentHTML: `<div class="pop-layer-content-lg"><div class="pop-layer-content-sm">${str}</div></div>`,
    //     closeBtnText: '',
    //     clickMaskForClose: false,
    //     scroll: true,
    //     destroyAfterClose: false,

    //     // 关闭前钩子函数  Function类型  可选项
    //     // 1. 此函数在关闭按钮被点击之后，弹出层关闭之前调用。
    //     // 2. 如果该函数执行的返回值不是 true， 后续关闭动作会被阻止。
    //     // 3. 其中this指向该弹出层对象
    //     beforeClose: function(){
    //         console.log('弹层将要关闭');
    //         return true;
    //     },

    //     // 关闭后回调函数  Function类型  可选项
    //     // 1. 此函数在关闭按钮被点击致使弹出层关闭之后调用。
    //     // 2. 其中this指向该弹出层对象
    //     afterClose: function(){
    //         console.log('弹层已关闭');
    //     },

    //     // 弹层对象生成后回调  Function类型  可选项
    //     // 1. 此函数将在对象创建完成后调用（仅调用一次）
    //     // 2. 其中this指向该弹出层对象
    //     afterBuild: function(){
    //         console.log('弹层对象已创建完成');
    //     }
    // });

})