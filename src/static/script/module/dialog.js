define([
    'jquery',
    'mask',
    'mustache'
], function(
    $,
    mask,
    mustache
) {

    var namespace = 'ui-';

    var alertTpl = '<div class="'+ namespace +'dialog">\
        <div class="'+ namespace +'dialog-inner">\
            <div class="'+ namespace +'dialog-title">{{title}}</div>\
            <div class="'+ namespace +'dialog-text">{{content}}</div>\
            {{#closeBtn}}<div class="'+ namespace +'dialog-close-btn"></div>{{/closeBtn}}\
        </div>\
        <div class="'+ namespace +'dialog-buttons"><span class="'+ namespace +'dialog-button dialog-button-bold dialog-submit">{{submitButtonText}}</span></div>\
    </div>';
    var confirmTpl = '<div class="'+ namespace +'dialog">\
        <div class="'+ namespace +'dialog-inner">\
            <div class="'+ namespace +'dialog-title">{{title}}</div>\
            <div class="'+ namespace +'dialog-text">{{content}}</div>\
            {{#closeBtn}}<div class="'+ namespace +'dialog-close-btn"></div>{{/closeBtn}}\
        </div>\
        <div class="'+ namespace +'dialog-buttons"><span class="'+ namespace +'dialog-button dialog-cancel">{{cancelButtonText}}</span><span class="'+ namespace +'dialog-button dialog-button-bold dialog-submit">{{submitButtonText}}</span></div>\
    </div>';
    var promptTpl = '<div class="'+ namespace +'dialog">\
        <div class="'+ namespace +'dialog-inner">\
            <div class="'+ namespace +'dialog-title">{{title}}</div>\
            <div class="'+ namespace +'dialog-text">{{content}}</div>\
            <div class="'+ namespace +'dialog-input">\
                <input class="dialog-prompt-input" type="text" placeholder="{{placeholder}}">\
            </div>\
            {{#closeBtn}}<div class="'+ namespace +'dialog-close-btn"></div>{{/closeBtn}}\
        </div>\
        <div class="'+ namespace +'dialog-buttons"><span class="'+ namespace +'dialog-button dialog-cancel">{{cancelButtonText}}</span><span class="'+ namespace +'dialog-button dialog-submit">{{submitButtonText}}</span></div>\
    </div>';
    var dialogTpl = '<div class="'+ namespace +'dialog">\
        <div class="'+ namespace +'dialog-inner">{{{inner}}}{{#closeBtn}}<div class="'+ namespace +'dialog-close-btn"></div>{{/closeBtn}}</div>\
        <div class="'+ namespace +'dialog-buttons">{{#cancelButton}}<span class="'+ namespace +'dialog-button dialog-cancel">{{cancelButtonText}}</span>{{/cancelButton}}{{#submitButton}}<span class="'+ namespace +'dialog-button dialog-button-bold dialog-submit">{{submitButtonText}}</span>{{/submitButton}}</div>\
    </div>';

    var defaultAlertOptions = {
        type:'alert',
        title: '',
        content: '',
        submitButtonText: '确定',
        closeBtn: false,
        submitCallback: function(){}
    };
    var defaultConfirmOptions = {
        type:'confirm',
        title: '',
        content: '',
        submitButtonText: '确定',
        cancelButtonText: '取消',
        closeBtn: false,
        submitCallback: function(){},
        cancelCallback: function(){}
    };
    var defaultPromptOptions = {
        type:'prompt',
        title: '',
        content: '',
        placeholder: '请输入',
        submitButtonText: '确定',
        cancelButtonText: '取消',
        closeBtn: false,
        submitCallback: function(value){},
        cancelCallback: function(){}
    };
    var defaultDialogOptions = {
        type:'dialog',
        inner: '',
        submitButton: true,
        submitButtonText: '确定',
        cancelButton: true,
        cancelButtonText: '取消',
        closeBtn: false,
        submitCallback: function(value){},
        cancelCallback: function(){},
        afterBuild: function(){}
    };

    var dialogList = [];
    var isrunning = false;

    function showNext(){
        var next = dialogList.shift();
        if(next){
            setTimeout(function(){
                next.show();
            },200)
        }else{
            isrunning = false;
        }
    }

    //构造器
    function Dialog(options){
        
        var _this = this,
            _name = 'dialog' + (new Date().getTime()) + '' + (Math.floor(Math.random() * 1000)),
            _options,
            _userOptions = options || {},
            _$element;

        _create();

        typeof _options.afterBuild === 'function' && _options.afterBuild.apply(_this,[_$element[0]]);

        

        //创建
        function _create(){
            switch(_userOptions.type){
                case 'dialog':
                    _createDialog();
                    break;
                case 'confirm':
                    _createConfirm();
                    break;
                case 'prompt':
                    _createPrompt();
                    break;
                default:
                    _createAlert();
            }
            _bindEvent();
        }
        
        function _createDialog(){
            _options = $.extend({}, defaultDialogOptions, _userOptions);
            _$element = $(mustache.render(dialogTpl, _createData()));
        }
        function _createAlert(){
            _options = $.extend({}, defaultAlertOptions, _userOptions);
            _$element = $(mustache.render(alertTpl, _createData()));
        }
        function _createConfirm(){
            _options = $.extend({}, defaultConfirmOptions, _userOptions);
            _$element = $(mustache.render(confirmTpl, _createData()));
        }
        function _createPrompt(){
            _options = $.extend({}, defaultPromptOptions, _userOptions);
            _$element = $(mustache.render(promptTpl, _createData()));
        }

        function _createData(){
            var data = {};
            data.title = _options.title || '';
            data.content = _options.content || '';
            data.inner = _options.inner || '';
            data.submitButton = !!_options.submitButton;
            data.cancelButton = !!_options.cancelButton;
            data.submitButtonText = _options.submitButtonText || _options.buttonText  || '确定';
            data.cancelButtonText = _options.cancelButtonText || '取消';
            data.closeBtn = _options.closeBtn === true ? true : false;
            data.placeholder = _options.placeholder || '';
            return data;
        }

        function _bindEvent(){
            _$element.find('.dialog-submit').one('click.dialog',function(e){
                if($(this).hasClass('disabled')){return}
                var v = _options.type === 'prompt' ? _$element.find('.dialog-prompt-input').eq(0).val() : undefined;
                _hide();
                typeof _options.submitCallback === 'function' && _options.submitCallback(v);
            });
            _$element.find('.dialog-cancel').one('click.dialog',function(e){
                if($(this).hasClass('disabled')){return}
                var v = _options.type === 'prompt' ? _$element.find('.dialog-prompt-input').eq(0).val() : undefined;
                _hide();
                typeof _options.cancelCallback === 'function' && _options.cancelCallback(v);
            });

            _$element.find('.'+namespace+'dialog-close-btn').one('click.dialog',function(e){
                if($(this).hasClass('disabled')){return}
                var v = _options.type === 'prompt' ? _$element.find('.dialog-prompt-input').eq(0).val() : undefined;
                _hide();
                typeof _options.cancelCallback === 'function' && _options.cancelCallback(v);
            });

            _$element.on('touchmove.dialog',function(e){
                e.preventDefault();
            });
            _$element.on('transitionEnd.dialog webkitTransitionEnd.dialog',function(e){
                if(e.target === this){
                    if(_$element.hasClass('opened')){
                        _$element.data('_showDeferred') && _$element.data('_showDeferred').resolve();
                        _$element.data('_hideDeferred') && _$element.data('_hideDeferred').reject();
                    }else{
                        _$element.data('_showDeferred') && _$element.data('_showDeferred').reject();
                        _$element.data('_hideDeferred') && _$element.data('_hideDeferred').resolve();
                    }
                }
            });
        }

        function _show(){
            $('body').append(_$element);
            setTimeout(function(){
                var showDef = (function(){
                    var def = $.Deferred();
                    mask.layerOn({
                        layer: _this,
                        events: {}
                    },function(layerZIndex){
                        _$element.data('_showDeferred', def).css({zIndex: layerZIndex}).addClass('opened');
                    });
                    return def.promise();
                })();
                $.when(showDef).done(function(){});
            },0)
        }
        function _hide(){
            _options.type === 'prompt' && _$element.find('.dialog-prompt-input').eq(0).trigger('blur');
            var hideDef = (function(){
                var def = $.Deferred();
                _$element.data('_hideDeferred', def).removeClass('opened');
                return def.promise();
            })();
            $.when(hideDef).done(function(){
                mask.layerOff(_this,function(){
                    mask.layerRemove(_this);
                    _$element.remove();
                    showNext();
                });
            });
        }

        //对外接口
        this.show = function(){
            _show();
        }
        this.hide = function(){
            _hide();
        }

        //自动显示
        //添加进dialog列表
        dialogList.push(this);

        //如果没有正在显示的dialog，就执行显示dialog列表的动作
        if(!isrunning){
            isrunning = true;
            showNext();
        }
    }


    function dialog(options){
        typeof options === 'object' && new Dialog(options);
    }

    dialog.alert = function(content, callback){
        new Dialog({
            type:'alert',
            content: content,
            submitCallback: callback
        });
    };

    dialog.confirm = function(content, submitCallback, cancelCallback){
        new Dialog({
            type:'confirm',
            content: content,
            submitCallback: submitCallback,
            cancelCallback: cancelCallback
        });
    };

    dialog.prompt = function(content, submitCallback, cancelCallback){
        new Dialog({
            type:'prompt',
            content: content,
            submitCallback: submitCallback,
            cancelCallback: cancelCallback
        });
    };

    return dialog;
});