define([
    'jquery',
    'mask',
    'mustache',
    'picker'
], function(
    $,
    mask,
    mustache,
    Picker
) {

    //mobile & PC 事件兼容处理
    var EVENT_START, EVENT_MOVE, EVENT_END;
    if ('ontouchstart' in window) {
        EVENT_START = 'touchstart';
        EVENT_MOVE = 'touchmove';
        EVENT_END = 'touchend';
    } else {
        EVENT_START = 'mousedown';
        EVENT_MOVE = 'mousemove';
        EVENT_END = 'mouseup';
    }
    var EVENT_CANCEL = 'touchcancel';

    var enventTypeTap = 'click';//'tap';

    var namespace = 'ui-';


    //模板
    var panelBuffer = '<div class="'+ namespace +'pop-picker">\
        <div class="'+ namespace +'pop-picker-header">\
            <button class="'+ namespace +'pop-picker-btn cancel">取消</button>\
            <button class="'+ namespace +'pop-picker-btn submit">确定</button>\
            <div class="'+ namespace +'pop-picker-title">{{title}}</div>\
        </div>\
        <div class="'+ namespace +'pop-picker-body">\
        </div>\
    </div>';

    var pickerBuffer = '<div class="'+ namespace +'picker">\
        <div class="'+ namespace +'picker-inner">\
            <div class="'+ namespace +'pciker-current-row bg"></div>\
            <ul class="'+ namespace +'pciker-list"></ul>\
            <div class="'+ namespace +'pciker-current-row fg"></div>\
        </div>\
    </div>';

    var defaultOptions = {
        data: [],
        layer: 1,
        changeEventType: 'popOptChange',
        buttons: ['取消', '确定'],
        textKey: 'text',
        valueKey:'value',
        childrenKey: 'children',
        onCancel:function(){ try{ console.log('取消了选择'); }catch(e){} }, //取消回调
        beforeSubmit: function(valueObj){ return true; }, //确定点击后在关闭picker前执行，返回fasle将阻止后续动作
        onSubmit:function(valueObj){ try{ console.log(valueObj); }catch(e){} } //确定回调
    };


    return function(options){

        var  _pickers; //储存picker实例的数组
        
        var _options = $.extend({}, defaultOptions, options || {});

        var _panel = $(mustache.render(panelBuffer, {}))[0];
        document.body.appendChild(_panel);

        var _ok = _panel.querySelector('.'+ namespace +'pop-picker-btn.submit');
        var _cancel = _panel.querySelector('.'+ namespace +'pop-picker-btn.cancel');
        var _body = _panel.querySelector('.'+ namespace +'pop-picker-body');
        var _mask = mask;//mask.create();

        //按钮文本
        // _cancel.innerText = _options.buttons[0];
        // _ok.innerText = _options.buttons[1];

        //按钮事件
        $(_cancel).on(enventTypeTap, function(e){
            _hide();
            typeof _options.onCancel === 'function' && _options.onCancel();
        });
        $(_ok).on(enventTypeTap, function(e) {
            var valueObj = _getSelectedItems();
            if(typeof _options.beforeSubmit === 'function' && _options.beforeSubmit(valueObj) === false){
                return;
            }
            _hide();
            typeof _options.onSubmit === 'function' && _options.onSubmit(valueObj);
        });

        //触摸遮罩时隐藏
        // $(_mask.element).on(enventTypeTap, function(e){
        //     _hide();
        //     typeof _options.onCancel === 'function' && _options.onCancel();
        // });


        _create();
        _setData(_options.data);

        //防止滚动穿透
        _panel.addEventListener(EVENT_START, function(event) {
            // event.preventDefault();
        }, false);
        _panel.addEventListener(EVENT_MOVE, function(event) {
            event.preventDefault();
        }, false);


        //内部方法

        //创建
        function _create() {
            var layer = _options.layer || 1;
            var width = (100 / layer) + '%';
            _pickers = [];
            for (var i = 1; i <= layer; i++) {
                var pickerElement = $(mustache.render(pickerBuffer, {}))[0];
                pickerElement.style.width = width;
                _body.appendChild(pickerElement);
                var picker = pickerElement.picker = new Picker(pickerElement, {
                    changeEventType: _options.changeEventType,
                    textKey: _options.textKey,
                    valueKey: _options.valueKey
                });
                _pickers.push(picker);
                $(pickerElement).on(_options.changeEventType, function(event, data) {
                    var nextPickerElement = this.nextSibling;
                    if (nextPickerElement && nextPickerElement.picker) {
                        var eventData = data || {};
                        var preItem = eventData.item || {};
                        var callback = eventData.callback || function(){};
                        nextPickerElement.picker.setData(preItem[_options.childrenKey], callback);
                    }else{
                        data && typeof data.callback === 'function' && data.callback();
                    }
                });
            }
        }

        //设置选项
        function _setData(data, callback){
            _pickers[0].setData($.isArray(data) ? data : [], callback);
        }

        //将指定的值设置为选中 value ['v1','v2','v3'...]
        function _setSelectedValue(vArr, callback) {
            function setValue(i){
                if (i < _options.layer){
                    _pickers[i].setSelectedValue(vArr[i], 0, function(){
                        setValue(i+1);
                    });
                }else{
                    typeof callback === 'function' && callback();
                }
            }
            if($.isArray(vArr)){
                setValue(0);
            }else{
                try{ console.warn('指定的值无效！') }catch(e){};
            }
        }

        //获取选中的项（数组）
        function _getSelectedItems() {
            var items = [];
            for (var i in _pickers) {
                items.push(_pickers[i].getSelectedItem() || {});
            }
            return items;
        }

        //显示
        function _show(callback) {
            _mask.show();
            document.body.classList.add('poppicker-active-for-page');
            _panel.classList.add('active');
            typeof callback === 'function' && callback();
        }

        //隐藏
        function _hide(callback) {
            _panel.classList.remove('active');
            _mask.hide();
            document.body.classList.remove('poppicker-active-for-page');
            typeof callback === 'function' && callback();
        }



        //对外接口方法

        //获取picker元素
        this.getElement = function(){
            return _panel;
        };

        //填充数据
        this.setData = function(data, callback) {
            _setData(data, callback);
        };

        //显示
        this.show = function(callback){
            _show(callback);
        };

        //隐藏
        this.hide = function(callback){
            _hide(callback);
        };

        //获取当前选中值
        this.getValue = function(){
            return _getSelectedItems();
        },

        //将指定值设置为选中值
        this.setValue = function(valueArr, callback){
            _setSelectedValue(valueArr, callback);
        }

    };
});