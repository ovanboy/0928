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

    var tpl = '<div class="'+ namespace +'pop-layer">'+
        '<div class="'+ namespace +'pop-layer-header">'+
            '<div class="'+ namespace +'pop-layer-title">{{title}}</div>'+
            '<button class="'+ namespace +'pop-layer-action-btn close{{^closeBtnText}} icon{{/closeBtnText}}" type="button">{{closeBtnText}}</button>'+
        '</div>'+
        '<div class="'+ namespace +'pop-layer-content">'+
            '<div class="'+ namespace +'pop-layer-content-inner">{{{contentHTML}}}</div>'+
        '</div>'+
    '</div>';

    function Layer(options){
        var _this = this;

        _this.options = {
            className: options && typeof options.className === 'string' ? options.className : '',
            title: options && typeof options.title === 'string' ? options.title : '',
            contentHTML: options && typeof options.contentHTML === 'string' ? options.contentHTML : '',
            closeBtnText: options && typeof options.closeBtnText === 'string' ? options.closeBtnText : '',
            height: options && typeof options.height === 'number' ? Math.ceil(options.height) : undefined,
            // mask: options && typeof options.mask === 'boolean' ? options.mask : true,
            clickMaskForClose: options && typeof options.clickMaskForClose === 'boolean' ? options.clickMaskForClose : true,
            scroll: options && typeof options.scroll === 'boolean' ? options.scroll : true,
            destroyAfterClose: options && typeof options.destroyAfterClose === 'boolean' ? options.destroyAfterClose : true,
            beforeClose: options && typeof options.beforeClose === 'function' ? options.beforeClose : null,
            afterClose: options && typeof options.afterClose === 'function' ? options.afterClose : null,
            afterBuild: options && typeof options.afterBuild === 'function' ? options.afterBuild : null
        };

        _this.element = $(mustache.render(tpl, this.options))[0];

        // 自定义class
        _this.options.className !== '' && $(this.element).addClass(this.options.className);

        // 自定义高度（不推荐）
        typeof _this.options.height === 'number' && $(_this.element).css({height: _this.options.height});

        $('body').append(_this.element);

        // 内容滚动处理
        if(_this.options.scroll){
            _this.scroll = new IScroll($(_this.element).find('.'+ namespace +'pop-layer-content')[0], {
                fadeScrollbars: true,
                shrinkScrollbars: 'clip',
                scrollbars: 'custom',
                preventDefaultException: {
                    tagName: /.*/
                }
            });
        }

        // 相关事件
        $(_this.element).on('touchmove.pop-layer', function(e) {
            e.preventDefault();
        });
        $(_this.element).find('.'+ namespace +'pop-layer-action-btn.close').on('click.pop-layer', function(e){
            if(typeof _this.options.beforeClose === 'function' && _this.options.beforeClose.call(_this) !== true){
                return;
            }
            _this.close(function(){
                typeof _this.options.afterClose === 'function' && _this.options.afterClose.call(_this);
            });
        });

        // 初始为关闭状态
        $(_this.element).addClass('closed');
        _this.state = 'closed';// closed -> opening -> opened -> closing -> closed

        // destroy 方法
        _this.destroy = function(){
            if(_this.state !== 'closed'){
                try{ console.warn('当前层处于非关闭状态,不可被销毁！'); }catch(e){}
                return;
            }
            mask.layerRemove(_this);
            $(_this.element).remove();
            for(var key in _this){
                delete _this[key];
            }
            try{ _this.__proto__ = Object.prototype }catch(e){}
            _this = null;
        };

        typeof _this.options.afterBuild === 'function' && _this.options.afterBuild.call(_this);
    }

    Layer.prototype.open = function(callback){
        var _this = this,
            $layer,
            openDef;
        if(_this.state !== 'closed'){ return; }
        _this.state = 'opening';
        $layer = $(_this.element);
        openDef = (function(){
            var def = $.Deferred();
            var events = {};
            if(_this.options.clickMaskForClose){
                events.click = function(){
                    if(typeof _this.options.beforeClose === 'function' && _this.options.beforeClose.call(_this) !== true){
                        return;
                    }
                    _this.close(function(){
                        typeof _this.options.afterClose === 'function' && _this.options.afterClose.call(_this);
                    });
                }
            }
            mask.layerOn({
                layer: _this,
                events: events
            }, function(layerZIndex){
                $layer.removeClass('closed').css({zIndex: layerZIndex});
                $layer.height();// 通过获取高度，强制浏览器先完成前面的样式设置
                $layer.addClass('opened');
                setTimeout(function(){
                    def.resolve()
                },300);
            });
            return def.promise();
        })();
        
        $.when(openDef).done(function(){
            _this.state = 'opened';
            typeof callback === 'function' && callback();
        });
    };

    Layer.prototype.close = function(callback){
        var _this = this,
            $layer,
            closeDef;
        if(_this.state !== 'opened'){ return; }
        _this.state = 'closing';
        $layer = $(_this.element);
        closeDef = (function(){
            var def = $.Deferred();
            $layer.removeClass('opened');
            setTimeout(function(){
                def.resolve();
            },240);
            return def.promise();
        })();

        $.when(closeDef).done(function(){
            mask.layerOff(_this,function(){
                $layer.css({zIndex: ''}).addClass('closed');
                _this.state = 'closed';
                typeof callback === 'function' && callback();
                if(_this.options.destroyAfterClose){
                    _this.destroy();
                }
            });
        });
    };

    return Layer;
});