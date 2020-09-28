define([
    'jquery',
    'mustache'
], function(
    $,
    mustache
) {

    var namespace = window.uiNamespace || 'ui-';
    var defaultOptions = {
        //target: null, //必选项
        content: '',
        namespace: namespace,
        position: 'bottom',
        mode: 'absolute',
        width: 'auto',
        onOpen: function(){},
        onClose: function(){},
    };

    var tpl = '<div class="{{namespace}}tips-wrapper closed"><div class="{{namespace}}tips">{{content}}</div><div class="{{namespace}}tips-arrow"></div></div>';

    function Tips(options){
        var o = this,
            opts = $.extend({}, defaultOptions, options),
            $wrapper = $(mustache.render(tpl, opts)),
            $arrow = $wrapper.find('.'+ opts.namespace +'tips-arrow'),
            $tips = $wrapper.find('.'+ opts.namespace +'tips'),
            $target = $(opts.target);

        o.wrapper = $wrapper[0];

        $('body').append($wrapper);

        var build = function(){
            var winWidth = $(window).width(),
                //winHeight = $(window).height(),
                arrowWidth = $arrow.outerWidth(),
                arrowHeight = $arrow.outerHeight(),
                tipsWidth = $tips.outerWidth(),
                tipsHeight = $tips.outerHeight(),
                targetWidth = $target.outerWidth(),
                targetHeight = $target.outerHeight(),
                targetOffsetTop = $target.offset().top,
                targetOffsetLeft = $target.offset().left,
                isLeft = (winWidth - targetWidth) / 2 >= targetOffsetLeft, 
                wrapperClass,
                wrapperTop,
                arrowLeft,
                arrowRight,
                tipsLeft,
                tipsRight;
            if(opts.position === 'top'){
                wrapperClass = 'top';
                wrapperTop = targetOffsetTop - arrowHeight / 2;
            }else{
                wrapperClass = 'bottom';
                wrapperTop = targetOffsetTop + targetHeight + arrowHeight / 2;
            }
            $wrapper.addClass(wrapperClass).css({top: wrapperTop});
            if(isLeft){
                arrowLeft = targetOffsetLeft + targetWidth / 2 - 15 - arrowWidth / 2;
                arrowLeft = arrowLeft >= 6 ? arrowLeft : 6;
                tipsLeft = targetOffsetLeft + targetWidth / 2 - 15 - tipsWidth / 2;
                tipsLeft = tipsLeft >= 0 ? tipsLeft : 0;
                $tips.css({left: tipsLeft});
                $arrow.css({left: arrowLeft});
            }else{
                arrowRight = winWidth - targetOffsetLeft - targetWidth / 2 -15 - arrowWidth / 2;
                arrowRight = arrowRight >= 6 ? arrowRight : 6;
                tipsRight = winWidth - targetOffsetLeft - targetWidth / 2 -15 - tipsWidth / 2;
                tipsRight = tipsRight >= 0 ? tipsRight : 0;
                $tips.css({right: tipsRight});
                $arrow.css({right: arrowRight});
            }
        }

        build();


        // console.log({
        //     win: {
        //         w: winWidth,
        //         h: winHeight
        //     },
        //     arrow: {
        //         w: arrowWidth,
        //         h: arrowHeight
        //     },
        //     tips: {
        //         w: tipsWidth,
        //         h: tipsHeight
        //     },
        //     target: {
        //         w: targetWidth,
        //         h: targetHeight,
        //         t: targetOffsetTop,
        //         l: targetOffsetLeft
        //     }
        // });

        
        
        
        

        
        $(window).on('resize.tips', function(){
            build();
        });
        


        $wrapper.on('transitionEnd.tips webkitTransitionEnd.tips',function(e){
            if(!$wrapper.hasClass('opened')){
                $wrapper.remove();
                typeof opts.onClose === 'function' && opts.onClose();
            }else{
                typeof opts.onOpen === 'function' && opts.onOpen();
            }
        });
    }

    Tips.prototype.open = function(){
        var $wrapper = $(this.wrapper);
        $wrapper.removeClass('closed').addClass('opened');
    };
    Tips.prototype.close = function(){
        var $wrapper = $(this.wrapper);
        $wrapper.removeClass('opened');
    };

    return Tips;
});