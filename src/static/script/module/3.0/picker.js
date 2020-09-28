define([
    'jquery'
],function(
    $
){
    
    var namespace = 'ui-';

    //是否为IOS设备
    var isIos = (function(){
        var platform = navigator.platform.toLowerCase();
        var userAgent = navigator.userAgent.toLowerCase();
        return (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1 || userAgent.indexOf('ipod') > -1) &&
            (platform.indexOf('iphone') > -1 || platform.indexOf('ipad') > -1 || platform.indexOf('ipod') > -1);
    })();

    var defaultOptions = {
        name: '',
        blurWidth: 10, //picker上下边沿的虚化边界宽度
        visibleRange: 90, //可视角度
        itemHeight: 40, //选项默认高度（像素）
        maxExceed: 30, //最大越界角度
        changeEventType: 'pickerChange', //自定义的change事件类型
        textKey: 'text',
        valueKey:'value'
    }; 

    function Picker(holder, options){
        var _this = this;

        _this.options = $.extend({}, defaultOptions, options || {});

        _this.$element = $(holder);
        _this.$list = _this.$element.find('ul.'+ namespace +'pciker-list');

        _this.r = 120; // 半径
        _this.itemAngle = 26; // 单个选项占用角度
        _this.minAngle = 0;
        _this.exceedAngle = 30; //最大可超出角度
        _this.highlightRange = _this.itemAngle / 2; //高亮范围
        _this.visibleRange = 90; //可视范围
        _this.scrollFrameInterval = 30;// 滚动帧间隔时间(ms)

        _this.index = 0; // 储存当前选项index 用于判断是否需要触发change事件

        if(_this.options.data){
            _this.setData(_this.options.data);
        }
        
        var startAngle,
            startY,
            endY,
            inertiaStartY,
            inertiaStartTime;

        _this.$element.on('touchstart',function(e){
            e.preventDefault();
            _this.$list.css({webkitTransition:''});
            startAngle = _this.$list.data('angle');
            startY = e.originalEvent.changedTouches[0].pageY;
            // 初始化惯性效果起始信息
            inertiaStartY = startY;
            inertiaStartTime = e.originalEvent.changedTouches[0].timeStamp || Date.now();
        });
        _this.$element.on('touchmove',function(e){
            e.preventDefault();
            var endY = e.originalEvent.changedTouches[0].pageY;
            var dargDistance = endY - startY;
            var dragAngle = _this._calcAngle(dargDistance);
            var endAngle = dargDistance > 0 ? (startAngle - dragAngle) : (startAngle + dragAngle);
            if(endAngle < _this.exceedMinAngle){
                endAngle = _this.exceedMinAngle;
            }else if(endAngle > _this.exceedMaxAngle){
                endAngle = _this.exceedMaxAngle;
            }
            _this._setAngle(endAngle);
            // 移动时每隔200毫秒刷新一下惯性效果起始信息
            var now = e.originalEvent.changedTouches[0].timeStamp || Date.now();
            if(now - inertiaStartTime > 200){
                inertiaStartY = endY;
                inertiaStartTime = now;
            }
        });
        _this.$element.on('touchend',function(e){
            e.preventDefault();
            // 惯性效果
            _this._inertiaScroll(
                inertiaStartTime,
                e.originalEvent.changedTouches[0].timeStamp || Date.now(),
                inertiaStartY,
                e.originalEvent.changedTouches[0].pageY
            );
        });
        _this.$element.on('touchcancel',function(e){
            e.preventDefault();
            // 惯性效果
            _this._inertiaScroll(
                inertiaStartTime,
                e.originalEvent.changedTouches[0].timeStamp || Date.now(),
                inertiaStartY,
                e.originalEvent.changedTouches[0].pageY
            );
        });

    }

    // 根据移动的距离计算应该滚动的角度
    Picker.prototype._calcAngle = function(distance){
        return (Math.abs(distance) * 180) / (Math.PI * this.r);
    };

    // 按照指定的方向在指定的时间内滚动指定角度
    // angle 滚动角度  带方向的角度 正数表示向上 负数表示向下 默认为0deg
    // duration 持续时间 默认500ms
    Picker.prototype._scroll = function(angle, duration, callback, forceTriggerChange){
        var _this = this,
            a,// 带方向的角度
            t,// 持续时间
            currentAngle, // 当前角度
            n,// 帧数
            i = 0;// 初始帧
        a = typeof angle === 'number'&& !isNaN(angle) ? angle : 0;
        if(a === 0){
            _this._stop(forceTriggerChange);
            typeof callback === 'function' && callback(); 
            return;
        }
        t = typeof duration === 'number'&& !isNaN(duration) ? duration : 500;
        currentAngle = _this.$list.data('angle');
        n = t / _this.scrollFrameInterval;// 滚动帧间隔时间(ms)
        (function run(){
            var targetAngle = (function(i, start, dist, n){
                return -dist * ((i = i / n - 1) * i * i * i - 1) + start;
            })(i, currentAngle, a, n);
            _this._setAngle(targetAngle);
            i++;
            if(i > n-1 || targetAngle > _this.exceedMaxAngle || targetAngle < _this.exceedMinAngle){
                _this._stop(forceTriggerChange);
                typeof callback === 'function' && callback();
            }else{
                setTimeout(run, _this.scrollFrameInterval);
            }
        })();
    };

    // 滚动停止
    Picker.prototype._stop = function(forceTriggerChange){
        var _this = this,
            targetAngle = _this.$list.data('angle');
        if(targetAngle < _this.minAngle){
            targetAngle = _this.minAngle;
        }else if(targetAngle > _this.maxAngle){
            targetAngle = _this.maxAngle;
        }else{
            targetAngle = (targetAngle / _this.itemAngle).toFixed(0) * _this.itemAngle;
        }
        _this._setAngle(targetAngle);
        _this._triggerChange(forceTriggerChange);
    };

    // 设置list的滚动角度
    Picker.prototype._setAngle = function(angle){
        var _this = this;
        if (isIos) {
            _this.$list.css({
                webkitTransform: 'perspective(9000px) rotateY(0deg) rotateX('+ angle +'deg)',
                webkitTransformOrigin: 'center center 0px'
            });
        }else{
            _this.$list.css({
                webkitTransform: 'perspective(9000px) rotateY(0deg) rotateX('+ angle +'deg)',
                webkitTransformOrigin: 'center center -'+ _this.r +'px'
            });
        }
        // 计算可见选项和当前选项
        _this.$list.children().each(function(){
            var $item = $(this);
            var x =  Math.abs($item.data('angle') - angle);
            if(x < _this.highlightRange){
                $item.addClass('highlight');
            }else if(x < _this.visibleRange){
                $item.addClass('visible').removeClass('highlight');
            }else{
                $item.removeClass('highlight visible');
            }
        });

        // 刷新记录list滚动的角度
        _this.$list.data('angle', angle);
    };

    // 触发change事件
    Picker.prototype._triggerChange = function(force){
        var _this = this;

        // 为了配合 datetimePicker 的setValue处理逻辑，此处事件才用异步触发方式
        var index = parseInt((_this.$list.data('angle')/_this.itemAngle).toFixed(0));
        var item = _this.data[index];
        if (index != _this.index || force === true) {
            setTimeout(function() {
                _this.$element.trigger(_this.options.changeEventType, {
                    pickerName: _this.options.name,
                    index: index,
                    item: item
                });
            }, 0);
        }
        _this.index = index;
        
        // setTimeout(function() {
        //     var index = parseInt((_this.$list.data('angle')/_this.itemAngle).toFixed(0));
        //     var item = _this.data[index];
        //     if (index != _this.index || force === true) {
        //         _this.$element.trigger(_this.options.changeEventType, {
        //             // callback: callback,
        //             pickerName: _this.options.name,
        //             index: index,
        //             item: item
        //         });
        //     }
        //     _this.index = index;
        // }, 0);
    };

    // 惯性滚动
    Picker.prototype._inertiaScroll = function(startTime, endTime, startY, endY){
        var _this = this;
        var v = (endY - startY) / (endTime - startTime);// 速度
        var dir = v > 0 ? -1 : 1;// 方向 -1表示向下 1表示向上
        var a = 0.0006; // 加速度
        var t = Math.abs(v/a); // 持续时间
        var s = Math.abs(v*t/2); // 移动距离
        var angle = _this._calcAngle(s); // 移动角度
        var currentAngle = _this.$list.data('angle');
        var tmpAngle = angle;

        if(currentAngle + angle*dir > _this.exceedMaxAngle){
            angle =_this.exceedMaxAngle - currentAngle;
            t = t*(angle/tmpAngle)*0.6;
        }else if(currentAngle + angle*dir < _this.exceedMinAngle){
            angle = currentAngle - _this.exceedMinAngle;
            t = t*(angle/tmpAngle)*0.6;
        }
        _this._scroll(angle*dir, t);
    };

    // 初始化 picker
    Picker.prototype._init = function(forceTriggerChange){
        var _this = this,
            $items = _this.$list.children();
        _this.length = $items.length;
        _this.maxAngle = _this.minAngle + _this.itemAngle * (_this.length - 1);
        _this.exceedMinAngle = _this.minAngle - _this.exceedAngle;
        _this.exceedMaxAngle = _this.maxAngle + _this.exceedAngle;
        $items.each(function(index){
            var $item = $(this);
            $item.css({
                webkitTransformOrigin: 'center center -' + _this.r + 'px',
                webkitTransform: 'rotateX(' + (- _this.itemAngle * index) + 'deg)'
            }).data('angle', _this.itemAngle * index);
        });

        // 设置初始值
        // 本应该使用 _this.setValue() 方法，但这里直接使用下面的代码效率更高
        _this._setAngle(_this.$list.data('angle') || _this.minAngle);
        _this._stop(forceTriggerChange);
    };

    // 更新 picker 的选项数据
    Picker.prototype.setData = function(arr, forceTriggerChange){
        var _this = this;
        _this.data = arr || [];
        var html = '';
        $.each(_this.data, function(){
            html = html + '<li>' + this[_this.options.textKey] + '</li>';
        });
        _this.$list.html(html);
        // 数据更新后需要重新初始化 picker
        _this._init(forceTriggerChange);
    };

    // 设置当前选项 
    Picker.prototype.setValue = function(value, duration, callback, forceTriggerChange){
        var _this = this;
        var index = -1;
        for(var i=0;i<_this.data.length;i++){
            if(_this.data[i][_this.options.valueKey] === value){
                index = i;
            }
        }
        if(index === -1){
            try{
                console.warn('要设置的值不存在于选项当中');
            }catch(e){}
        }else{
            if(typeof duration !== 'number' || isNaN(duration) || duration === 0){
                _this._setAngle(_this.itemAngle * index);
                _this._stop(forceTriggerChange);
                typeof callback === 'function' && callback();
            }else{
                _this._scroll(
                    index * _this.itemAngle - _this.$list.data('angle'),
                    duration,
                    callback,
                    forceTriggerChange
                );
            }
        }
    };

    // 获取当前选项value
    Picker.prototype.getValue = function(){
        // console.log(this.$list.data('angle'));
        // return this.data[(this.$list.data('angle') / this.itemAngle).toFixed(0)].value;
        return this.data[this.index].value;
    };

    // 获取当前选项的信息
    Picker.prototype.getValueInfo = function(){
        // return this.data[(this.$list.data('angle') / this.itemAngle).toFixed(0)];
        return this.data[this.index];
    };
    

    return Picker;
});