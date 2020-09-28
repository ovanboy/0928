define(['jquery'], function ($) {
    var activeEvent = 'touchstart';
    var singleton = true;
    var typeList = ['error', 'success', 'warning', 'info'];

    var defaultOptions = {
        className: '',
        touchClose: true,
        closeBtnVisible: true,
        duration: 2000,
        message: '',
        closeAuto: true,
        type: 'error'//warning | info | success | error
    };
    //构造函数
   function Tip(options) {
       var _t = this;
       _t.options = $.extend({}, defaultOptions, options);
       if (singleton === true) {
           clearAllTips();
       }
       _create();

       function _create() {
           var styleFix;
           if ($('header').length > 0) {
               styleFix = ' style="top: '+ $('header').outerHeight() +'px"';
           }
           var _type = _t.options.type;
           var popType = typeList.indexOf(_type)>=0?_type:typeList[0];
           var eleTpl = '<div ' + styleFix + ' class="ui-tip ' + popType +  ' ' + _t.options.className + '"><div class="info-con">' + _t.options.message + '</div><button class="ui-tip-close-btn ' + (_t.options.closeBtnVisible === false?'hide':'') + '"></button></div>';
           var $ele = $(eleTpl);
           _t.element = $ele;
           $('body').append($ele);
           var time1 = setTimeout(function () {
               $ele.addClass('tip-appear-animation');
               clearTimeout(time1);
               time1 = null;
           }, 0)
           _bindEvents();
           if (_t.options.closeAuto === true) {
               durationHandelr(_t.options.duration);
           }
           var time2 = setTimeout(function () {
               $(this).removeClass('tip-appear-animation');
               clearTimeout(time2);
               time2 = null;
           }, 260)
       }

       function _bindEvents() {
           var options = _t.options;
           if (options.touchClose === true) {
               _t.element.on(activeEvent, function () {
                   _close();
               });
           }
           if (options.closeBtnVisible === true) {
               _t.element.find('.ui-tip-close-btn').on(activeEvent, function () {
                   _close();
               });
           }

           var animationEle = $();

           // _t.element.on('webkitAnimationEnd, animationend', function() {
           //     if ($(this).hasClass('tip-appear-animation')) {
           //         $(this).removeClass('tip-appear-animation');
           //     } else if ($(this).hasClass('tip-disappear-animation')) {
           //         $(this).off('webkitAnimationEnd, animationend');
           //         _clear();
           //     }
           // });
       }

       function _clear() {
           if (_t) {
               _t.element.find('.ui-tip-close-btn').off(activeEvent);
               _t.element.off(activeEvent);
               _t.element.remove();
               _t = null;
           }
       }

       function _close() {
           if (_t) {
               _t.element.removeClass('tip-appear-animation').addClass('tip-disappear-animation');
               var time = setTimeout(function () {
                   clearTimeout(time);
                   time = null;
                   _t.element.removeClass('tip-disappear-animation');
                   _clear();
               }, 300);
           }
       }

       function durationHandelr(duration) {
           var timer = setTimeout(function () {
               clearTimeout(timer);
               _close();
           }, duration);
       }

       function clearAllTips() {
           $('body > .ui-tip').each(function (index, item) {
               $(item).find('.ui-tip-close-btn').off(activeEvent);
               $(item).off(activeEvent);
               $(item).remove();
           });
       }

       return {
           close: _close,
           element: _t.element
       }
   }
   var tip = function (options) {
       return new Tip(options);
   }
   return tip;
})