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

    var tpl = '<div class="'+ namespace +'layer">'+
        '<div class="'+ namespace +'layer-content-wrapper">'+
            '<div class="'+ namespace +'layer-content">{{{contentHTML}}}</div>'+
        '</div>'+
        '{{#closeBtn}}<button class="'+ namespace +'layer-close-btn" type="button"></button>{{/closeBtn}}'+
    '</div>';

    function Layer(options){
        var _this = this;

        _this.options = {
            className: options && typeof options.className === 'string' ? options.className : '',
            contentHTML: options && typeof options.contentHTML === 'string' ? options.contentHTML : '',
            closeBtn: options && typeof options.closeBtn === 'boolean' ? options.closeBtn : true,
            clickMaskForClose: options && typeof options.clickMaskForClose === 'boolean' ? options.clickMaskForClose : false,
            scroll: options && typeof options.scroll === 'boolean' ? options.scroll : true,
            destroyAfterClose: options && typeof options.destroyAfterClose === 'boolean' ? options.destroyAfterClose : true,
            beforeClose: options && typeof options.beforeClose === 'function' ? options.beforeClose : null,
            afterClose: options && typeof options.afterClose === 'function' ? options.afterClose : null,
            afterBuild: options && typeof options.afterBuild === 'function' ? options.afterBuild : null
        };

        _this.element = $(mustache.render(tpl, _this.options))[0],
        _this.options.className !== '' && $(_this.element).addClass(_this.options.className);

        $('body').append(this.element);

        // 内容滚动处理
        if(_this.options.scroll){
            _this.scroll = new IScroll($(this.element).find('.'+ namespace +'layer-content-wrapper')[0], {
                fadeScrollbars: true,
                shrinkScrollbars: 'clip',
                scrollbars: 'custom',
                preventDefaultException: {
                    tagName: /.*/
                }
            });
        }

        // 滚动穿透处理
        $(_this.element).on('touchmove.layer', function(e) {
            e.preventDefault();
        });

        // 关闭按钮事件
        $(_this.element).find('.'+ namespace +'layer-close-btn').on('click.layer', function(e) {
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

        // 构建完成回调
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
            },function(layerZIndex){
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
            mask.layerOff(_this, function(){
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