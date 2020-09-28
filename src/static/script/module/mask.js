define([
    'jquery'
],function(
    $
){

    var namespace = 'ui-';

    var $mask = $('<div class="'+ namespace +'mask closed"></div>'),
        layerStack = [],
        isRunning = false,
        minZIndex = 998;

    $('body').append($mask);

    $mask.on('touchmove.mask', function(e) {
        e.preventDefault();
    });
    $mask.on('transitionEnd.mask webkitTransitionEnd.mask',function(){
        if($mask.hasClass('opened')){
            $mask.data('_showDeferred') && $mask.data('_showDeferred').resolve();
            $mask.data('_hideDeferred') && $mask.data('_hideDeferred').reject();
        }else{
            //$mask.addClass('closed');
            $mask.data('_showDeferred') && $mask.data('_showDeferred').reject();
            $mask.data('_hideDeferred') && $mask.data('_hideDeferred').resolve();
        }
    });

    
    function getMaxZIndex(){
        var maxZIndex = 0;
        $('body>*:not(.'+ namespace +'mask)').each(function(){
            var z = Number($(this).css('z-index'));
            if(!isNaN(z) && z > maxZIndex){
                maxZIndex = z;
            }
        });
        return maxZIndex;
    }

    function layerStackOn(layer, maskZIndex, events){
        var i,
            layerStackLength = layerStack.length,
            currentLayerIndex,
            eventType;

        // 解绑已存在的事件
        for(i=layerStackLength-1;i>=0;i--){
            if(layerStack[i].isOpened){
                currentLayerIndex = i;
                break;
            }
        }
        if(currentLayerIndex >= 0){
            for(eventType in layerStack[currentLayerIndex].events){
                $mask.off(eventType+'.mask');
            }
        }

        // 设置当前层
        for(i=0; i<layerStack.length; i++){
            if(layerStack[i].layer === layer){
                layerStack.splice(i,1);
            }
        }
        layerStack.push({
            layer: layer,
            isOpened: true,
            events: events,
            maskZIndex: maskZIndex
        });

        // 绑定当前层事件
        for(eventType in events){
            $mask.on(eventType+'.mask',function(e){
                typeof events[eventType] === 'function' && events[eventType].call(layer);
            });
        }
    }


    window.layerStack = layerStack;

    return {
        layerOn: function(info, callback){
            // info.layer
            // info.events
            // info.maskZIndex
            var _this = this,
                events = info.events || {},
                currentMaxZIndex,
                minZ,
                maskZIndex,
                maskOnDef;

            currentMaxZIndex = getMaxZIndex();
            minZ = currentMaxZIndex+1 > minZIndex ? currentMaxZIndex+1 : minZIndex;
            maskZIndex = typeof info.maskZIndex === 'number' && info.maskZIndex > minZ ? info.maskZIndex : minZ;

            maskOnDef = (function(){
                var def = $.Deferred();
                if($mask.hasClass('closed')){
                    _this.show(function(){
                        $mask.css({zIndex: maskZIndex});
                        def.resolve();
                    });
                }else{
                    $mask.css({zIndex: maskZIndex});
                    def.resolve();
                    // setTimeout(function(){
                    //     def.resolve();
                    // },0);
                }
                return def.promise();
            })();

            $.when(maskOnDef).done(function(){
                typeof callback === 'function' && callback(maskZIndex+1);
                layerStackOn(info.layer, maskZIndex, events);
            });
        },
        layerOff: function(layer, callback){
            var _this = this,
                layerStackLength = layerStack.length,
                layerIndex = -1,
                currentLayerIndex,
                prevOpenedLayerIndex = -1,
                eventType,
                i;

            for(i=0;i<layerStackLength;i++){
                if(layer === layerStack[i].layer){
                    layerIndex = i;
                }
                if(layerStack[i].isOpened){
                    currentLayerIndex = i;
                }
            }

            if(layerIndex === 0){
                if(currentLayerIndex === layerIndex){
                    _this.hide(function(){
                        for(eventType in layerStack[layerIndex].events){
                            $mask.off(eventType+'.mask');
                        }
                        layerStack[layerIndex].isOpened = false;
                        typeof callback === 'function' && callback();
                    });
                }else{
                    layerStack[layerIndex].isOpened = false;
                    typeof callback === 'function' && callback();
                }
            }else if(layerIndex > 0){
                if(currentLayerIndex === layerIndex){
                    for(i=layerIndex-1; i>=0; i--){
                        if(layerStack[i].isOpened){
                            prevOpenedLayerIndex = i;
                            break;
                        }
                    }
                    if(prevOpenedLayerIndex >= 0){
                        for(eventType in layerStack[layerIndex].events){
                            $mask.off(eventType+'.mask');
                        }
                        for(eventType in layerStack[prevOpenedLayerIndex].events){
                            $mask.on(eventType+'.mask',function(){
                                typeof layerStack[prevOpenedLayerIndex].events[eventType] === 'function' && layerStack[prevOpenedLayerIndex].events[eventType].call(layerStack[prevOpenedLayerIndex].layer);
                            });
                        }
                        $mask.css({zIndex: layerStack[prevOpenedLayerIndex].maskZIndex});
                        layerStack[layerIndex].isOpened = false;
                        typeof callback === 'function' && callback();
                    }else{
                        _this.hide(function(){
                            for(eventType in layerStack[layerIndex].events){
                                $mask.off(eventType+'.mask');
                            }
                            layerStack[layerIndex].isOpened = false;
                            typeof callback === 'function' && callback();
                        });
                    }
                }else{
                    layerStack[layerIndex].isOpened = false;
                    typeof callback === 'function' && callback();
                }
            }else{
                // 要关闭的层不在队列中 或 队列为空
                typeof callback === 'function' && callback();
            }
        },
        layerRemove: function(layer){
            var i;
            for(i=0;i<layerStack.length;i++){
                if(layerStack[i].layer === layer){
                    layerStack.splice(i,1);
                }
            }
        },
        show: function(callback){
            var _this = this,
                showDef;

            if(isRunning){ return; }
            isRunning = true;

            showDef = (function(){
                var def = $.Deferred();
                $mask.data('_showDeferred',def).removeClass('closed').addClass('opened');
                return def.promise();
            })();

            $.when(showDef).done(function(){
                isRunning = false;
                typeof callback === 'function' && callback();
            });
        },
        hide: function(callback){
            var _this = this,
                hideDef;
            
            if(isRunning){ return; }
            isRunning = true;

            hideDef = (function(){
                var def = $.Deferred();
                $mask.data('_hideDeferred',def).removeClass('opened');
                return def.promise();
            })();

            $.when(hideDef).then(function(){
                $mask.css({zIndex: ''}).addClass('closed');
                isRunning = false;
                typeof callback === 'function' && callback();
            });
        }
    };

});