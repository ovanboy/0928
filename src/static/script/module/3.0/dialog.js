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

    var tpl = '<div class="'+ namespace +'dialog">'+
        '<div class="'+ namespace +'dialog-content">'+
            '<div class="'+ namespace +'dialog-inner">{{{contentHTML}}}</div>'+
            '{{#hasCloseBtn}}<div class="'+ namespace +'dialog-close-btn"></div>{{/hasCloseBtn}}'+
        '</div>'+
        '<div class="'+ namespace +'dialog-buttons">'+
            '{{#buttons}}<span class="'+ namespace +'dialog-button{{#isMain}} main{{/isMain}}{{#disabled}} disabled{{/disabled}}"><span class="button-text">{{text}}</span></span>{{/buttons}}'+
        '</div>'+
    '</div>';

    var alertTpl = '<div class="'+ namespace +'dialog-title">{{title}}</div><div class="'+ namespace +'dialog-text">{{content}}</div>';
    var confirmTpl = '<div class="'+ namespace +'dialog-title">{{title}}</div><div class="'+ namespace +'dialog-text">{{content}}</div>';
    var promptTpl = '<div class="'+ namespace +'dialog-title">{{title}}</div><div class="'+ namespace +'dialog-text">{{content}}</div><div class="'+ namespace +'dialog-input">{{{inputHTML}}}</div>';

    var dialogList = [];
    var isrunning = false;

    function showNext(){
        var next = dialogList.shift();
        if(next){
            setTimeout(function(){
                next.open();
            },0);
        }else{
            isrunning = false;
        }
    }

    //构造器
    function Dialog(options){
        var _this = this;

        _this.options = {
            async: false,
            className: options && typeof options.className === 'string' ? options.className : '',
            contentHTML: options && typeof options.contentHTML === 'string' ? options.contentHTML : '',
            closeBtn: options && options.closeBtn ? {
                beforeClose: typeof options.closeBtn.beforeClose === 'function' ? options.closeBtn.beforeClose : null,
                afterClose: typeof options.closeBtn.afterClose === 'function' ? options.closeBtn.afterClose : null
            } : {},
            hasCloseBtn: options && options.closeBtn ? true : false,
            buttons: (function(buttons){
                var btns = [];
                $.each(buttons, function(index, item){
                    btns.push({
                        isMain: item && typeof item.isMain === 'boolean' ? item.isMain : false,
                        text: item && typeof item.text === 'string' ? item.text : '',
                        disabled: item && typeof item.disabled === 'boolean' ? item.disabled : false,
                        beforeClose: item && typeof item.beforeClose === 'function' ? item.beforeClose : null,
                        afterClose: item && typeof item.afterClose === 'function' ? item.afterClose : null
                    });
                });
                return btns.length > 0 ? btns : [{
                    isMain: true,
                    text: '确定',
                    disabled: false,
                    beforeClose: null,
                    afterClose: null
                }];
            })(options && $.isArray(options.buttons) ? options.buttons : []),
            afterBuild: options && typeof options.afterBuild === 'function' ? options.afterBuild : null
        };

        _this.element = $(mustache.render(tpl, _this.options))[0];
        _this.options.className !== '' && $(_this.element).addClass(_this.options.className);

        $(_this.element).on('touchmove.dialog',function(e){
            e.preventDefault();
        });

        // 按钮事件
        $(_this.element).find('.'+ namespace +'dialog-button').on('click.dialog',function(e){
            var $this = $(this);
            var i;
            var v;
            if($this.hasClass('disabled')){ return }
            i = $this.index();
            if(typeof _this.options.buttons[i].beforeClose === 'function' && _this.options.buttons[i].beforeClose.call(_this) !== true){
                return;
            }
            v = $(_this.element).find('.'+ namespace +'dialog-input input').eq(0).val();
            _this.close(function(){
                typeof _this.options.buttons[i].afterClose === 'function' && _this.options.buttons[i].afterClose.call(_this, v);
            });
        });

        // 关闭按钮事件
        $(_this.element).find('.'+ namespace +'dialog-close-btn').on('click.dialog',function(e){
            var $this = $(this);
            if(typeof _this.options.closeBtn.beforeClose === 'function' && _this.options.closeBtn.beforeClose.call(_this) !== true){
                return;
            }
            _this.close(function(){
                typeof _this.options.closeBtn.afterClose === 'function' && _this.options.closeBtn.afterClose.call(_this);
            });
        });

        typeof _this.options.afterBuild === 'function' && _this.options.afterBuild.call(_this);
    }

    Dialog.prototype.open = function(){
        var _this = this;
        $('body').append(_this.element);
        setTimeout(function(){
            var showDef = (function(){
                var def = $.Deferred();
                mask.layerOn({
                    layer: _this,
                    events: {}
                },function(layerZIndex){
                    $(_this.element).css({zIndex: layerZIndex}).addClass('opened');
                    setTimeout(function(){
                        def.resolve();
                    },300);
                });
                return def.promise();
            })();
            $.when(showDef).done(function(){});
        },0);
    };
    Dialog.prototype.close = function(callback){
        var _this = this;
        $(_this.element).find('.'+ namespace +'dialog-input input').eq(0).trigger('blur');
        var hideDef = (function(){
            var def = $.Deferred();
            $(_this.element).removeClass('opened');
            setTimeout(function(){
                def.resolve();
            },300)
            return def.promise();
        })();
        $.when(hideDef).done(function(){
            mask.layerOff(_this,function(){
                mask.layerRemove(_this);
                $(_this.element).remove();
                typeof callback === 'function' && callback();
                showNext();
            });
        });
    };


    function dialog(options){
        var opt = $.extend({}, options);
        switch(opt.type){
            case 'alert':
                o = new Dialog({
                    async: false,
                    contentHTML: mustache.render(alertTpl, {
                        title: typeof opt.title === 'string' ? opt.title : '',
                        content: typeof opt.content === 'string' ? opt.content : '',
                    }),
                    buttons: [{
                        isMain: true,
                        text: typeof opt.submitButtonText === 'string' ? opt.submitButtonText : '确定',
                        disabled: false,
                        afterClose: typeof opt.submitCallback === 'function' ? opt.submitCallback : null
                    }]
                });
                break;
            case 'confirm':
                o = new Dialog({
                    async: false,
                    contentHTML: mustache.render(confirmTpl, {
                        title: typeof opt.title === 'string' ? opt.title : '',
                        content: typeof opt.content === 'string' ? opt.content : '',
                    }),
                    buttons: [{
                        isMain: false,
                        text: typeof opt.cancelButtonText === 'string' ? opt.cancelButtonText : '取消',
                        disabled: false,
                        afterClose: typeof opt.cancelCallback === 'function' ? opt.cancelCallback : null
                    },{
                        isMain: true,
                        text: typeof opt.submitButtonText === 'string' ? opt.submitButtonText : '确定',
                        disabled: false,
                        afterClose: typeof opt.submitCallback === 'function' ? opt.submitCallback : null
                    }]
                });
                break;
            case 'prompt':
                o = new Dialog({
                    async: false,
                    contentHTML: mustache.render(promptTpl, {
                        title: typeof opt.title === 'string' ? opt.title : '',
                        content: typeof opt.content === 'string' ? opt.content : '',
                        inputHTML: typeof opt.inputHTML === 'string' ? opt.inputHTML : '<input type="text" placeholder="请输入" maxlength="100">'
                    }),
                    buttons: [{
                        isMain: false,
                        text: typeof opt.cancelButtonText === 'string' ? opt.cancelButtonText : '取消',
                        disabled: false,
                        afterClose: typeof opt.cancelCallback === 'function' ? opt.cancelCallback : null
                    },{
                        isMain: true,
                        text: typeof opt.submitButtonText === 'string' ? opt.submitButtonText : '确定',
                        disabled: false,
                        afterClose: typeof opt.submitCallback === 'function' ? opt.submitCallback : null
                    }]
                });
                break;
            // 不建议使用（为了向前兼容而保留）
            case 'dialog':
                o = new Dialog({
                    async: false,
                    contentHTML: typeof opt.inner === 'string' ? opt.inner : '',
                    buttons: (function(opt){
                        var btns = [];
                        if(typeof opt.cancelButton !== 'boolean' || opt.cancelButton){
                            btns.push({
                                isMain: false,
                                text: typeof opt.cancelButtonText === 'string' ? opt.cancelButtonText : '取消',
                                disabled: false,
                                afterClose: typeof opt.cancelCallback === 'function' ? opt.cancelCallback : null
                            });
                        }
                        if(typeof opt.submitButton !== 'boolean' || opt.submitButton){
                            btns.push({
                                isMain: true,
                                text: typeof opt.submitButtonText === 'string' ? opt.submitButtonText : '确定',
                                disabled: false,
                                afterClose: typeof opt.submitCallback === 'function' ? opt.submitCallback : null
                            });
                        }
                        return btns;
                    })(opt),
                    afterBuild: opt && typeof opt.afterBuild === 'function' ? opt.afterBuild : null
                });
                break;
            default:
                o = new Dialog(opt);
        }

        if(!o.options.async){
            dialogList.push(o);
            if(!isrunning){
                isrunning = true;
                showNext();
            }
        }else{
            o.open();
        }
    }

    dialog.alert = function(content, callback){
        var o = new Dialog({
            async: false,
            contentHTML: mustache.render(alertTpl, {
                title: '',
                content: content
            }),
            buttons: [{
                isMain: true,
                text: '确定',
                disabled: false,
                afterClose: typeof callback === 'function' ? callback : function(){}
            }]
        });

        dialogList.push(o);
        if(!isrunning){
            isrunning = true;
            showNext();
        }
    };

    dialog.confirm = function(content, submitCallback, cancelCallback){
        var o = new Dialog({
            async: false,
            contentHTML: mustache.render(confirmTpl, {
                title: '',
                content: content
            }),
            buttons: [{
                isMain: false,
                text: '取消',
                disabled: false,
                afterClose: typeof cancelCallback === 'function' ? cancelCallback : function(){}
            },{
                isMain: true,
                text: '确定',
                disabled: false,
                afterClose: typeof submitCallback === 'function' ? submitCallback : function(){}
            }]
        });

        dialogList.push(o);
        if(!isrunning){
            isrunning = true;
            showNext();
        }
    };

    dialog.prompt = function(content, submitCallback, cancelCallback){
        var o = new Dialog({
            async: false,
            contentHTML: mustache.render(promptTpl, {
                title: '',
                content: content,
                inputHTML: '<input type="text" placeholder="请输入" maxlength="100">'
            }),
            buttons: [{
                isMain: false,
                text: '取消',
                disabled: false,
                afterClose: typeof cancelCallback === 'function' ? cancelCallback : function(){}
            },{
                isMain: true,
                text: '确定',
                disabled: false,
                afterClose: typeof submitCallback === 'function' ? submitCallback : function(){}
            }]
        });

        dialogList.push(o);
        if(!isrunning){
            isrunning = true;
            showNext();
        }
    };

    dialog.empty = function(){
        dialogList = [];
    };

    return dialog;
});