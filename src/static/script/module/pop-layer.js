define([
    'jquery',
    'mask',
    'mustache',
    'iscroll'
], function(
    $,
    mask,
    mustache,
    IScroll
) {

    var namespace = 'ui-';

    var tpl = '<div class="'+ namespace +'pop-layer {{className}}">\
                <div class="'+ namespace +'pop-layer-header">\
                    <div class="'+ namespace +'pop-layer-head-text">{{title}}</div>\
                    <button class="'+ namespace +'pop-layer-cancel-btn" type="button">{{cancelBtnText}}</button>\
                </div>\
                <div class="'+ namespace +'pop-layer-content">\
                    <div class="'+ namespace +'pop-layer-content-base">{{{content}}}</div>\
                </div>\
            </div>';
    var panelTpl = '{{#list}}<div class="'+ namespace +'pop-layer-content-panel closed {{showMode}}" data-pop-layer-panel-id="{{id}}">{{{content}}}</div>{{/list}}';

    function Layer(options){

        if(typeof options !== 'object'){
            return;
        }

        var o = this,
            info = {
                title: options.title || '',
                content: options.content || '<div></div>',
                cancelBtnText: options.cancelBtnText || '',
                cancelBtnType: options.cancelBtnType || 'close',
                className: options.className || '',
                panels: [],
                panel: {},
                scroll: options.scroll === false ? false : true,
                clickMaskForClose: options.clickMaskForClose === false ? false : true,
                destroyAfterClose: options.destroyAfterClose === false ? false : true,
                oncancel: typeof options.oncancel === 'function' ? options.oncancel : null
            },
            $layer = $(mustache.render(tpl, info)),
            $title = $layer.find('.'+ namespace +'pop-layer-head-text'),
            $cancelBtn = $layer.find('.'+ namespace +'pop-layer-cancel-btn'),
            $content = $layer.find('.'+ namespace +'pop-layer-content'),
            $contentBase = $content.find('.'+ namespace +'pop-layer-content-base');

        if(Object.prototype.toString.call(options.panels) ==='[object Array]'){
            $.each(options.panels, function(index, item){
                var id;
                if(typeof item === 'object'){
                    id = item.id || index + '';
                    info.panels.push({
                        id: id,
                        content: item.content,
                        showMode: item.showMode || 'to-left',
                        title: item.title || '',
                        cancelBtnText: item.cancelBtnText || '',
                        cancelBtnType: item.cancelBtnType || 'back', // 'close'|'back'
                        scroll: item.scroll === false ? false : true,
                        afterOpen: item.afterOpen,
                        afterClose: item.afterClose
                    });
                    info.panel[id] = info.panels.length - 1;
                }
            });
        }

        function setBtnStyle(text, type){
            text === '' ? $cancelBtn.addClass('icon') : $cancelBtn.removeClass('icon');
            type === 'back' ? $cancelBtn.removeClass('close').addClass('back') : $cancelBtn.removeClass('back').addClass('close');
            $cancelBtn.text(text);
        }

        setBtnStyle(info.cancelBtnText, info.cancelBtnType);
        options.height && $layer.css({height: options.height});

        
        $content.append($(mustache.render(panelTpl, {list: info.panels})));
        var $panels = $content.find('.'+ namespace +'pop-layer-content-panel');
        $('body').append($layer);

        o.layer = $layer[0];
        o.stack = [];
        o.info = info;
        o.isRunning = false;
        o.toString = function(){
            return '[object PopLayer]';
        };

        // 内容滚动处理
        if(info.scroll){
            o.scroll = new IScroll($contentBase[0], {
                fadeScrollbars: true,
                shrinkScrollbars: 'clip',
                scrollbars: 'custom',
                preventDefaultException: {
                    tagName: /.*/
                }
            });
        }else{
            o.scroll = null;
        }
        $panels.each(function(index,element){
            if(info.panels[info.panel[$(element).attr('data-pop-layer-panel-id')]].scroll){
                new IScroll(element, {
                    fadeScrollbars: true,
                    shrinkScrollbars: 'clip',
                    scrollbars: 'custom',
                    preventDefaultException: {
                        tagName: /.*/
                    }
                });
            }
        });
        

        // 相关事件
        $layer.on('touchmove.pop-layer', function(e) {
            e.preventDefault();
        });
        $layer.on('transitionEnd.pop-layer webkitTransitionEnd.pop-layer',function(e){
            if(e.target === this){
                if($layer.hasClass('opened')){
                    $layer.data('_openDeferred') && $layer.data('_openDeferred').resolve();
                    $layer.data('_closeDeferred') && $layer.data('_closeDeferred').reject();
                    typeof options.afterOpen === 'function' && options.afterOpen.apply(o,[]);
                }else{
                    $layer.data('_openDeferred') && $layer.data('_openDeferred').reject();
                    $layer.data('_closeDeferred') && $layer.data('_closeDeferred').resolve();
                    typeof options.afterClose === 'function' && options.afterClose.apply(o,[]);
                }
            }
        });

        $cancelBtn.on('click.pop-layer', function(e){
            if(o.stack.length > 0){
                o.closePanel(o.stack[o.stack.length-1]);
            }else{
                o.close();
                typeof o.info.oncancel === 'function' && o.info.oncancel();
            }
        });

        $panels.on('transitionEnd.pop-layer webkitTransitionEnd.pop-layer',function(e){
            var $panel = $(this),
                id = $panel.attr('data-pop-layer-panel-id');
            if(e.target === this){
                if($panel.hasClass('opened')){
                    $title.text(info.panels[info.panel[id]].title);
                    setBtnStyle(info.panels[info.panel[id]].cancelBtnText, info.panels[info.panel[id]].cancelBtnType);
                    o.stack.push(id);
                    o.isRunning = false;
                    typeof info.panels[info.panel[id]].afterOpen === 'function' && info.panels[info.panel[id]].afterOpen.apply(o,[]); 
                }else{
                    o.stack.pop();
                    if(o.stack.length > 0){
                        $title.text(info.panels[info.panel[o.stack[o.stack.length-1]]].title);
                        setBtnStyle(info.panels[info.panel[o.stack[o.stack.length-1]]].cancelBtnText, info.panels[info.panel[o.stack[o.stack.length-1]]].cancelBtnType);
                    }else{
                        $title.text(info.title);
                        setBtnStyle(info.cancelBtnText, 'close');
                    }
                    $panel.css({zIndex: 'auto'}).addClass('closed');
                    o.isRunning = false;
                    typeof info.panels[info.panel[id]].afterClose === 'function' && info.panels[info.panel[id]].afterClose.apply(o,[]);
                }
            }
        });

        typeof options.afterBuild === 'function' && options.afterBuild.apply(o, [$layer[0]]);
    }


    Layer.prototype.open = function(callback){
        var _this = this,
            $layer,
            openDef;

        if(_this.isRunning){return;}
        _this.isRunning = true;

        $layer = $(_this.layer);

        if($layer.hasClass('opened')){
            _this.isRunning = false;
            return;
        };

        openDef = (function(){
            var def = $.Deferred();

            var events = {};
            if(_this.info.clickMaskForClose){
                events.click = function(){
                    _this.close();
                    typeof _this.info.oncancel === 'function' && _this.info.oncancel();
                }
            }
            mask.layerOn({
                layer: _this,
                events: events
            }, function(layerZIndex){
                if($layer.hasClass('opened')){
                    $layer.css({zIndex: layerZIndex});
                    def.resolve();
                }else{
                    $layer.data('_openDeferred', def).css({zIndex: layerZIndex}).addClass('opened');
                }
            });
            return def.promise();
        })();

        $.when(openDef).done(function(){
            _this.isRunning = false;
            typeof callback === 'function' && callback();
        });
    };

    Layer.prototype.close = function(callback){
        var _this = this,
            $layer,
            closeDef;

        if(_this.isRunning){return;}
        _this.isRunning = true;

        $layer = $(_this.layer);

        if(!$layer.hasClass('opened')){
            _this.isRunning = false;
            return;
        };

        closeDef = (function(){
            var def = $.Deferred();
            $layer.data('_closeDeferred', def).removeClass('opened');
            return def.promise();
        })();

        $.when(closeDef).done(function(){
            mask.layerOff(_this,function(){
                $layer.css({zIndex: ''});
                _this.isRunning = false;
                if(_this.info.destroyAfterClose){
                    _this.destroy(callback);
                }else{
                    typeof callback === 'function' && callback();
                }
            });
        });
    };

    Layer.prototype.destroy = function(callback){
        var _this = this,
            $layer = $(_this.layer);

        if($layer.hasClass('opened')){
            _this.info.destroyAfterClose = true;
            _this.close(callback);
        }else{
            $layer.remove();
            delete _this.layer;
            delete _this.info;
            delete _this.stack;
            delete _this.isRunning;
            delete _this.toString;
            try{ _this.__proto__ = Object.prototype }catch(e){}
            mask.layerRemove(_this);
            typeof callback === 'function' && callback();
        }
    };

    Layer.prototype.openPanel = function(id){
        if(this.isRunning){return;}
        this.isRunning = true;
        var _this = this,
            stackLength = _this.stack.length;
        if(stackLength > 0){
            if(_this.stack[stackLength-1] === id){
                try{
                    console.warn('该面板已打开！');
                }catch(e){}
                _this.isRunning = false;
            }else{
                for(var i=0;i<stackLength;i++){
                    if(_this.stack[i] === id){
                        _this.stack.splice(i,1);
                        $(_this.layer).find('[data-pop-layer-panel-id="'+id+'"]').addClass('closed').removeClass('opened');
                        break;
                    }
                }
                for(var i=0;i<_this.stack.length;i++){
                    $(_this.layer).find('[data-pop-layer-panel-id="'+_this.stack[i]+'"]').css({zIndex: i+1});
                }
                setTimeout(function(){
                    $(_this.layer).find('[data-pop-layer-panel-id="'+id+'"]').css({zIndex: _this.stack.length+1}).removeClass('closed').addClass('opened');
                },0);
            }
        }else{
            $(_this.layer).find('[data-pop-layer-panel-id="'+id+'"]').css({zIndex: _this.stack.length+1}).removeClass('closed').addClass('opened');
        }
    };
    Layer.prototype.closePanel = function(id){
        if(this.isRunning){return;}
        this.isRunning = true;
        var _this = this,
            stackLength = _this.stack.length;
        if(stackLength > 0){
            if(_this.stack[stackLength-1] !== id){
                try{
                    console.warn('要关闭的面板不符合关闭条件！');
                }catch(e){}
                _this.isRunning = false;
            }else{
                $(_this.layer).find('[data-pop-layer-panel-id="'+id+'"]').removeClass('opened');
            }
        }else{
            try{
                console.warn('要关闭的面板不符合关闭条件！');
            }catch(e){}
            _this.isRunning = false;
        }
    };


    return Layer;
});