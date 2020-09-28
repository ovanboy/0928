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

    var tpl = '<div class="'+ namespace +'layer-wrapper closed {{className}}">\
                <div class="'+ namespace +'layer">\
                    <div class="'+ namespace +'layer-content-wrapper"><div class="'+ namespace +'layer-content">{{{html}}}</div></div>\
                    <button class="'+ namespace +'layer-close-btn" type="button"></button>\
                </div>\
            </div>';

    function Layer(options){
        var o = this,
            $layerWrapper = $(mustache.render(tpl, {
                className: options.className || '',
                html: options.content
            })),
            $layer = $layerWrapper.find('.'+ namespace +'layer'),
            $contentWrapper = $layerWrapper.find('.'+ namespace +'layer-content-wrapper'),
            $closeBtn = $layer.find('.'+ namespace +'layer-close-btn');

        o.wrapper = $layerWrapper[0];
        o.element = $layer[0];
        o.destroyAfterClose = options.destroyAfterClose === false ? false : true;
        o.isRunning = false;
        o.toString = function(){
            return '[object Layer]';
        };

        options.width && $layer.css({width: options.width});
        options.height && $layer.css({height: options.height});
        options.noPadding && $layerWrapper.addClass('no-padding');
        options.noButton && $layerWrapper.addClass('no-button');

        $('body').append($layerWrapper);

        options.scroll = options.scroll === false ? false : true;
        if(options.scroll){
            new IScroll($contentWrapper[0], {
                fadeScrollbars: true,
                shrinkScrollbars: 'clip',
                scrollbars: 'custom',
                preventDefaultException: {
                    tagName: /.*/
                }
            });
        }

        $layerWrapper.on('touchmove.layer', function(e) {
            e.preventDefault();
        });
        $layerWrapper.on('transitionEnd.layer webkitTransitionEnd.layer',function(e){
            if(e.target === this){
                if($layerWrapper.hasClass('opened')){
                    $layerWrapper.data('_openDeferred') && $layerWrapper.data('_openDeferred').resolve();
                    typeof options.afterOpen === 'function' && options.afterOpen($layerWrapper[0]);
                }else{
                    $layerWrapper.data('_closeDeferred') && $layerWrapper.data('_closeDeferred').resolve();
                    typeof options.afterClose === 'function' && options.afterClose();
                }
            }
        });

        $closeBtn.on('click.layer', function(e) {
            o.close();
        });

        typeof options.afterBuild === 'function' && options.afterBuild.apply(o,[$layerWrapper[0]]);
    }

    Layer.prototype.open = function(callback){
        var _this = this,
            openDef,
            $wrapper = $(_this.wrapper);

        if(_this.isRunning){return;}
        _this.isRunning = true;

        openDef = (function(){
            var def = $.Deferred();
            mask.layerOn({
                layer: _this,
                events: {}
            },function(layerZIndex){
                $wrapper.data('_openDeferred', def).removeClass('closed').css({zIndex: layerZIndex}).addClass('opened');
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
            closeDef,
            $wrapper = $(_this.wrapper);

        if(_this.isRunning){return;}
        _this.isRunning = true;

        closeDef = (function(){
            var def = $.Deferred();
            $wrapper.data('_closeDeferred', def).removeClass('opened');
            return def.promise();
        })();

        $.when(closeDef).done(function(){
            mask.layerOff(_this, function(){
                $wrapper.css({zIndex: ''}).addClass('closed');
                _this.isRunning = false;
                if(_this.destroyAfterClose){
                    _this.destroy(callback);
                }else{
                    typeof callback === 'function' && callback();
                }
            });
        });
    };

    Layer.prototype.destroy = function(callback){
        var _this = this,
            $wrapper = $(_this.wrapper);

        if($wrapper.hasClass('opened')){
            _this.destroyAfterClose = true;
            _this.close(callback);
        }else{
            $wrapper.remove();
            delete _this.wrapper;
            delete _this.element;
            delete _this.destroyAfterClose;
            delete _this.isRunning;
            delete _this.toString;
            try{ _this.__proto__ = Object.prototype }catch(e){}
            mask.layerRemove(_this);
            typeof callback === 'function' && callback();
        }
    };

    return Layer;
});