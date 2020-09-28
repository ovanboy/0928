define([
    'jquery',
    'mustache',
    'iscroll'
], function(
    $,
    mustache,
    IScroll
) {

    var namespace = 'ui-';

    var tpl = '<div class="'+ namespace +'page-layer closed {{showMode}} {{className}}">\
                <header class="'+ namespace +'page-layer-header"><a class="btn-back" href="javascript:history.go(-1);"></a>\
                    <div class="page-title">{{title}}</div>\
                </header>\
                <div class="'+ namespace +'page-layer-content">\
                    <div class="'+ namespace +'page-layer-content-base">{{{content}}}</div>\
                </div>\
            </div>';

    function Layer(options){

        if(typeof options !== 'object'){
            return;
        }

        var o = this,
            info = {
                id: options.id || 'page'+(new Date()).getTime()+Math.ceil(Math.random()*1000)+Math.ceil(Math.random()*1000),
                title: options.title || '',
                content: options.content || '<div></div>',
                showMode: options.showMode || 'to-left',
                className: options.className || '',
                scroll: options.scroll === false ? false : true
                // destroyAfterClose: options.destroyAfterClose === false ? false : true
            },
            $layer = $(mustache.render(tpl, info)),
            $content = $layer.find('.'+ namespace +'page-layer-content'),
            $contentBase = $content.find('.'+ namespace +'page-layer-content-base');

        $('body').append($layer);

        o.layer = $layer[0];
        o.info = info;
        o.isRunning = false;
        o.toString = function(){
            return '[object PageLayer]';
        };

        // 内容滚动处理
        if(info.scroll){
            new IScroll($contentBase[0], {
                fadeScrollbars: true,
                shrinkScrollbars: 'clip',
                scrollbars: 'custom',
                preventDefaultException: {
                    tagName: /.*/
                }
            });
        }
        

        // 相关事件
        $layer.on('touchmove.page-layer', function(e) {
            e.preventDefault();
        });
        $layer.on('transitionEnd.page-layer webkitTransitionEnd.page-layer',function(e){
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

        $(window).on('hashchange',function(){
            console.log(window.location.hash);
            if(window.location.hash === '#'+info.id){
                if($layer && !$layer.hasClass('opened')){
                    o.open();
                }
            }else{
                if($layer && !$layer.hasClass('closed')){
                    o.close();
                }
            }
        });
        if(window.location.hash === '#'+info.id && $layer && !$layer.hasClass('opened')){
            o.open();
        }

        typeof options.afterBuild === 'function' && options.afterBuild.apply(o, [$layer[0]]);
    }


    Layer.prototype.open = function(callback){
        var _this = this,
            $layer,
            openDef;

        if(_this.isRunning){return;}
        _this.isRunning = true;

        $layer = $(_this.layer);

        openDef = (function(){
            var def = $.Deferred();
            if($layer.hasClass('opened')){
                def.resolve();
            }else{
                $layer.data('_openDeferred', def).removeClass('closed').addClass('opened');
            }
            return def.promise();
        })();

        $.when(openDef).done(function(){
            window.location.hash = '#'+_this.info.id;
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

        closeDef = (function(){
            var def = $.Deferred();
            $layer.data('_closeDeferred', def).removeClass('opened');
            return def.promise();
        })();

        $.when(closeDef).done(function(){
            $layer.addClass('closed');
            if(window.location.hash === '#'+_this.info.id && window.history.length > 0){
                window.history.go(-1);
            }
            _this.isRunning = false;
            typeof callback === 'function' && callback();
            // if(_this.info.destroyAfterClose){
            //     _this.destroy(callback);
            // }else{
            //     typeof callback === 'function' && callback();
            // }
        });
    };

    Layer.prototype.destroy = function(callback){
        var _this = this,
            $layer = $(_this.layer);

        if($layer.hasClass('opened')){
            // _this.info.destroyAfterClose = true;
            _this.close(function(){
                $layer.remove();
                delete _this.layer;
                delete _this.info;
                delete _this.stack;
                delete _this.isRunning;
                delete _this.toString;
                try{ _this.__proto__ = Object.prototype }catch(e){}
                // mask.layerRemove(_this);
                typeof callback === 'function' && callback();
            });
        }else{
            $layer.remove();
            delete _this.layer;
            delete _this.info;
            delete _this.stack;
            delete _this.isRunning;
            delete _this.toString;
            try{ _this.__proto__ = Object.prototype }catch(e){}
            // mask.layerRemove(_this);
            typeof callback === 'function' && callback();
        }
    };


    return Layer;
});