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

    var namespace = 'ui-';

    var tpl = '<div class="'+ namespace +'pop-picker">'+
        '<div class="'+ namespace +'pop-picker-header">'+
            '{{#buttons}}<button class="'+ namespace +'pop-picker-btn" data-action="{{type}}">{{text}}</button>{{/buttons}}'+
            '<div class="'+ namespace +'pop-picker-title">{{title}}</div>'+
        '</div>'+
        '<div class="'+ namespace +'pop-picker-body">'+
            '<div class="'+ namespace +'picker">'+
                '<div class="'+ namespace +'picker-inner">'+
                    '<div class="'+ namespace +'pciker-current-row bg"></div>'+
                    '<ul class="'+ namespace +'pciker-list"></ul>'+
                    '<div class="'+ namespace +'pciker-current-row fg"></div>'+
                '</div>'+
            '</div>'
        '</div>'+
    '</div>';

    function PopPicker(options){
        var _this = this;

        _this.options = {
            title: options && typeof options.title === 'string' ? options.title : '',
            className: options && typeof options.className === 'string' ? options.className : '',
            clickMaskForClose: options && typeof options.clickMaskForClose === 'boolean' ? options.clickMaskForClose : false,
            buttons: options && $.isArray(options.buttons) ? options.buttons : [{type: 'cancel',text: '取消'},{type: 'submit',text: '确定'}],
            data: options && $.isArray(options.data) ? options.data : [],
            value: options && typeof options.value ? options.value : undefined,
            beforeCancel: options && typeof options.beforeCancel === 'function' ? options.beforeCancel : null,
            onCancel: options && typeof options.onCancel === 'function' ? options.onCancel : null,
            beforeSubmit: options && typeof options.beforeSubmit === 'function' ? options.beforeSubmit : null,
            onSubmit: options && typeof options.onSubmit === 'function' ? options.onSubmit : null,
            afterBuild: options && typeof options.afterBuild === 'function' ? options.afterBuild : null
        };

        _this.element = $(mustache.render(tpl, this.options))[0];

        // 自定义class
        _this.options.className !== '' && $(this.element).addClass(_this.options.className);

        $('body').append(this.element);

        // 滚动穿透问题处理
        $(_this.element).on('touchmove', function(e) {
            e.preventDefault();
        });

        // 操作按钮
        $(_this.element).find('[data-action="submit"]').on('click',function(){
            if(typeof _this.options.beforeSubmit === 'function' && _this.options.beforeSubmit.call(_this) !== true){
                return;
            }
            _this.hide(function(){
                typeof _this.options.onSubmit === 'function' && _this.options.onSubmit.call(_this, _this.getValue());
            });
        });
        $(_this.element).find('[data-action="cancel"]').on('click',function(){
            if(typeof _this.options.beforeCancel === 'function' && _this.options.beforeCancel.call(_this) !== true){
                return;
            }
            _this.hide(function(){
                typeof _this.options.onCancel === 'function' && _this.options.onCancel.call(_this);
            });
        });

        // 初始为关闭状态
        $(_this.element).addClass('closed');
        _this.state = 'closed';// closed -> opening -> opened -> closing -> closed

        _this.picker = new Picker(
        	$(this.element).find('.'+ namespace +'picker')[0], 
        	{
        		changeEventType: 'pickerOptionChange',
        		name:'popPicker'
        	}
        );
        _this.picker.setData(_this.options.data);

        // 初始值
        if(_this.options.value !== undefined){
        	_this.picker.setValue(_this.options.value);
        }
    }


    PopPicker.prototype.show = function(callback){
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
                    if(typeof _this.options.beforeCancel === 'function' && _this.options.beforeCancel.call(_this) !== true){
                        return;
                    }
                    _this.hide(function(){
                        typeof _this.options.onCancel === 'function' && _this.options.onCancel.call(_this);
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

    PopPicker.prototype.hide = function(callback){
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
            });
        });
    };

    PopPicker.prototype.setValue = function(value){
        this.picker.setValue(value);
    };

    PopPicker.prototype.getValue = function(){
        return this.picker.getValue();
    };

    PopPicker.prototype.getValueInfo = function(){
        return this.picker.getValueInfo();
    };

    return PopPicker;
});
