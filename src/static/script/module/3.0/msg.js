define([
    'jquery',
    'mustache'
],function(
    $,
    mustache
){
    var namespace = 'ui-';

    var tpl = '<div class="'+namespace+'toast-container{{#mask}} mask{{/mask}}">'+
        '<div class="'+namespace+'toast-message {{type}}">{{{content}}}</div>'+
    '</div>';

    var activeClassName = 'active';
    var typeList = ['info','error','warn','success'];
    var defaultOptions = {
        type: 'info',
        content: '',
        mask: false,
        duration: 2000
    };

    function getMaxZIndex(){
        var maxZIndex = 0;
        $('body>*').each(function(){
            var z = Number($(this).css('z-index'));
            if(!isNaN(z) && z > maxZIndex){
                maxZIndex = z;
            }
        });
        return maxZIndex + 1;
    }

    var  _createMsg = function(options){
        var opts = $.extend({}, defaultOptions, options);
        var $msg = $(mustache.render(tpl, opts));
        $msg.on('touchmove.msg', function(e) {
            e.preventDefault();
        });
        $msg.on('transitionEnd.msg webkitTransitionEnd.msg',function(){
            if(!$msg.hasClass(activeClassName)){
                $msg.remove();
            }
        });
        
        $('body').append($msg.css({zIndex: getMaxZIndex()}));
        setTimeout(function(){
            $msg.addClass(activeClassName);
            setTimeout(function() {
                $msg.removeClass(activeClassName);
            }, opts.duration);
        },0);
    };


    var msg = function(content, type, duration, hasMask){
        var options = {};
        if(typeof content === 'object'){
            options = content;
        }else{
            options.type = (new RegExp('\\b'+type+'\\b','i')).test(typeList.join()) ? type.toLowerCase() : 'info';
            options.content = content,
            options.mask = !!hasMask;
            options.duration = typeof duration === 'number' ? parseInt(duration) : undefined;
        }
        _createMsg(options);
    };

    msg.success = function(content){
        _createMsg({
            type: 'success',
            content: content,
            mask: false
        });
    };
    msg.warn = function(content){
        _createMsg({
            type: 'warn',
            content: content,
            mask: false
        });
    };
    msg.error = function(content){
        _createMsg({
            type: 'error',
            content: content,
            mask: false
        });
    };
    msg.info = function(content){
        _createMsg({
            type: 'info',
            content: content,
            mask: false
        });
    };

    return msg;
});