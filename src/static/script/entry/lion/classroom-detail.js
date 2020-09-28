require(['jquery','videojs','msg',"mustache","scrollload"], function ($,Videojs,msg,mustache,Scrollload) {
    console.log(Videojs); 
    var player = Videojs('my-video');
    var videoH=$("#my-video").height()
    var contentSmH=$(".content-sm").height()
    // console.log(contentSmH);

    var template = $("#list-template").html();
    var pageIndex = 1;
    var pageSize = 10;
    var currentType = "";
    var listCount = 0;
    var initPage = true;
    var scrollload = new Scrollload.default({
        threshold:1,
        window: document.querySelector(".page-content"),
        container: document.querySelector(".scroll-container"),
        content: document.querySelector(".list"),
        loadingHtml: $("#loadding-html").html(),
        noMoreDataHtml:$("#no-more-data-html").html(),
        loadMore: function(sl) {
            $.ajax({
                url: "/lion/list-comment.json",
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

    $(".page-content").scroll(function () {
        var scroH = $(".page-content").scrollTop(); //滚动高度
        // console.log(scroH);

        if($('#my-video').hasClass('fix-top')){
            //video固定时
            if(scroH>=contentSmH){
                $(".comment-area-title").addClass("fix-video-bottom")
                $(".comment-area-title").css("top",videoH+44)
            }else{
                $(".comment-area-title").removeClass("fix-video-bottom")
                $(".comment-area-title").css("top",'')
            }
        }else{
            //video不固定时
            if(scroH>=contentSmH+videoH){
                $(".comment-area-title").addClass("fix-page-top")
            }else{
                $(".comment-area-title").removeClass("fix-page-top")
            }
        }
        
        if(!player.paused()){
            if(scroH==0){
                $('#my-video').addClass('fix-top')
                $(".page-content").css("padding-top",videoH+44)
            }else if(scroH>10){

            }else{
                $('#my-video').addClass('fix-top')
                $(".page-content").css("padding-top",videoH+44)
            }
            // $('#my-video').addClass('fix-top')
            // $(".page-content").css("padding-top",videoH+44)
        }else{
            if(scroH==0){
                $('#my-video').removeClass('fix-top')
                $(".page-content").css("padding-top",44)
            }
        }
        
    });
    

    $(".comment-say-area .comment-say").click(function(){
        $(".comment-say-area").addClass("hidden")
        $(".comment-area-active").removeClass("hidden")
        $("textarea.comment-con").focus()
        $(".page-content").css("padding-bottom","104px")

    })

    $("textarea.comment-con").on("input",function(){
        if($(this).val().trim()){
            if(!$(".sub-btn").hasClass("active")){
                $(".sub-btn").addClass("active")
            }
        }else{
            $(".sub-btn").removeClass("active")
        }
        if($(this).val().trim().length>200){
            $(this).val($(this).val().substr(0,200))
            msg.info('不能再多啦');
        }
    })

    $("textarea.comment-con").on("blur",function(){
        $(".comment-say-area").removeClass("hidden")
        $(".comment-area-active").addClass("hidden")
        $(".comment-area-active .comment-con").val('')
        $(".page-content").css("padding-bottom","64px")
    })

    $(".sub-btn").click(function(){
        if($(this).hasClass("active")){
            $(".comment-say-area").removeClass("hidden")
            $(".comment-area-active").addClass("hidden")
            $(".comment-area-active .comment-con").val('')
            $(".page-content").css("padding-bottom","64px")
        }
    })

});