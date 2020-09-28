define([
    'jquery'
],function(
    $
){

    var namespace = 'ui-';

    var $mask = $('<div class="'+ namespace +'mask closed"></div>'),
        layerStack = [],
        state = 'closed',
        minZIndex = 998;

    $('body').append($mask);

    $mask.on('touchmove.mask', function(e) {
        e.preventDefault();
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
                i,
                layerInfo,
                currentLayerInfo,
                prevOpenedLayerInfo;

            for(i=0;i<layerStackLength;i++){
                if(layer === layerStack[i].layer){
                    layerIndex = i;
                    layerInfo = layerStack[layerIndex];
                }
                if(layerStack[i].isOpened){
                    currentLayerIndex = i;
                    currentLayerInfo = layerStack[currentLayerIndex];
                }
            }

            if(layerIndex === 0){
                if(currentLayerIndex === layerIndex){
                    _this.hide(function(){
                        for(eventType in layerInfo.events){
                            $mask.off(eventType+'.mask');
                        }
                        layerInfo.isOpened = false;
                        typeof callback === 'function' && callback();
                    });
                }else{
                    layerInfo.isOpened = false;
                    typeof callback === 'function' && callback();
                }
            }else if(layerIndex > 0){
                if(currentLayerIndex === layerIndex){
                    for(i=layerIndex-1; i>=0; i--){
                        if(layerStack[i].isOpened){
                            prevOpenedLayerIndex = i;
                            prevOpenedLayerInfo = layerStack[i];
                            break;
                        }
                    }
                    if(prevOpenedLayerIndex >= 0){
                        for(eventType in layerInfo.events){
                            $mask.off(eventType+'.mask');
                        }
                        for(eventType in prevOpenedLayerInfo.events){
                            $mask.on(eventType+'.mask',function(){
                                typeof prevOpenedLayerInfo.events[eventType] === 'function' && prevOpenedLayerInfo.events[eventType].call(prevOpenedLayerInfo.layer);
                            });
                        }
                        $mask.css({zIndex: prevOpenedLayerInfo.maskZIndex});
                        layerInfo.isOpened = false;
                        typeof callback === 'function' && callback();
                    }else{
                        _this.hide(function(){
                            for(eventType in layerInfo.events){
                                $mask.off(eventType+'.mask');
                            }
                            layerInfo.isOpened = false;
                            typeof callback === 'function' && callback();
                        });
                    }
                }else{
                    layerInfo.isOpened = false;
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
            if(state !== 'closed'){ return; }
            state = 'opening';
            showDef = (function(){
                var def = $.Deferred();
                $mask.removeClass('closed').addClass('opened');
                setTimeout(function(){
                    def.resolve();
                },200);
                return def.promise();
            })();
            $.when(showDef).done(function(){
                state = 'opened';
                typeof callback === 'function' && callback();
            });
        },
        hide: function(callback){
            var hideDef;
            if(state !== 'opened'){ return; }
            state = 'closing';
            hideDef = (function(){
                var def = $.Deferred();
                $mask.removeClass('opened');
                setTimeout(function(){
                    def.resolve();
                },200);
                return def.promise();
            })();
            $.when(hideDef).then(function(){
                $mask.css({zIndex: ''}).addClass('closed');
                state = 'closed';
                typeof callback === 'function' && callback();
            });
        }
    };

});