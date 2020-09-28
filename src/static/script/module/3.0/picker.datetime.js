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

    var tpl = '<div class="'+ namespace +'dtpicker{{^label}} no-label{{/label}}" data-type="{{type}}">'+
        '<div class="'+ namespace +'dtpicker-header">'+
            '{{#buttons}}<button class="'+ namespace +'dtpicker-btn" data-action="{{type}}">{{text}}</button>{{/buttons}}'+
            '<div class="'+ namespace +'dtpicker-title">{{title}}</div>'+
        '</div>'+
        '<div class="'+ namespace +'dtpicker-label"><h5 data-id="title-y">{{label.year}}</h5><h5 data-id="title-m">{{label.month}}</h5><h5 data-id="title-d">{{label.day}}</h5><h5 data-id="title-h">{{label.hour}}</h5><h5 data-id="title-i">{{label.minute}}</h5></div>'+
        '<div class="'+ namespace +'dtpicker-body">'+
            '<div data-id="picker-year" class="'+ namespace +'picker">'+
                '<div class="'+ namespace +'picker-inner">'+
                    '<div class="'+ namespace +'pciker-current-row bg"></div>'+
                    '<ul class="'+ namespace +'pciker-list"></ul>'+
                    '<div class="'+ namespace +'pciker-current-row fg"></div>'+
                '</div>'+
            '</div>'+
            '<div data-id="picker-month" class="'+ namespace +'picker">'+
                '<div class="'+ namespace +'picker-inner">'+
                    '<div class="'+ namespace +'pciker-current-row bg"></div>'+
                    '<ul class="'+ namespace +'pciker-list"></ul>'+
                    '<div class="'+ namespace +'pciker-current-row fg"></div>'+
                '</div>'+
            '</div>'+
            '<div data-id="picker-day" class="'+ namespace +'picker">'+
                '<div class="'+ namespace +'picker-inner">'+
                    '<div class="'+ namespace +'pciker-current-row bg"></div>'+
                    '<ul class="'+ namespace +'pciker-list"></ul>'+
                    '<div class="'+ namespace +'pciker-current-row fg"></div>'+
                '</div>'+
            '</div>'+
            '<div data-id="picker-hour" class="'+ namespace +'picker">'+
                '<div class="'+ namespace +'picker-inner">'+
                    '<div class="'+ namespace +'pciker-current-row bg"></div>'+
                    '<ul class="'+ namespace +'pciker-list"></ul>'+
                    '<div class="'+ namespace +'pciker-current-row fg"></div>'+
                '</div>'+
            '</div>'+
            '<div data-id="picker-minute" class="'+ namespace +'picker">'+
                '<div class="'+ namespace +'picker-inner">'+
                    '<div class="'+ namespace +'pciker-current-row bg"></div>'+
                    '<ul class="'+ namespace +'pciker-list"></ul>'+
                    '<div class="'+ namespace +'pciker-current-row fg"></div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';

    var types = ['datetime','date','time','month','hour'];

    function DateTimePicker(options){
        var _this = this;

        _this.options = {
            type: options && typeof options.type === 'string' && $.inArray(options.type, types) !== -1 ? options.type : 'datetime',
            title: options && typeof options.title === 'string' ? options.title : '',
            className: options && typeof options.className === 'string' ? options.className : '',
            clickMaskForClose: options && typeof options.clickMaskForClose === 'boolean' ? options.clickMaskForClose : false,
            label: (function(opts){
                if(opts){
                    if(typeof opts.label === 'object' && opts.label !== null){
                        return {
                            year: typeof opts.label.year === 'string' ? opts.label.year : '年',
                            month: typeof opts.label.month === 'string' ? opts.label.month : '月',
                            day: typeof opts.label.day === 'string' ? opts.label.day : '日',
                            hour: typeof opts.label.hour === 'string' ? opts.label.hour : '时',
                            minute: typeof opts.label.minute === 'string' ? opts.label.minute : '分'
                        };
                    }else if(opts.label === true || opts.label === undefined){
                        return {year: '年',month: '月',day: '日',hour: '时',minute: '分'};
                    }else{
                        return false;
                    }
                }else{
                    return {year: '年',month: '月',day: '日',hour: '时',minute: '分'};
                }
            })(options),
            buttons: options && $.isArray(options.buttons) ? options.buttons : [{type: 'cancel',text: '取消'},{type: 'submit',text: '确定'}],
            beginDate: options && typeof options.beginDate ? options.beginDate : undefined,
            endDate: options && typeof options.endDate ? options.endDate : undefined,
            value: options && typeof options.value ? options.value : undefined,
            formatYear: options && typeof options.formatYear === 'function' ? options.formatYear : null,
            formatMonth: options && typeof options.formatMonth === 'function' ? options.formatMonth : null,
            formatDay: options && typeof options.formatDay === 'function' ? options.formatDay : null,
            formatHour: options && typeof options.formatHour === 'function' ? options.formatHour : null,
            formatMinute: options && typeof options.formatMinute === 'function' ? options.formatMinute : null,
            beforeCancel: options && typeof options.beforeCancel === 'function' ? options.beforeCancel : null,
            onCancel: options && typeof options.onCancel === 'function' ? options.onCancel : null,
            beforeSubmit: options && typeof options.beforeSubmit === 'function' ? options.beforeSubmit : null,
            onSubmit: options && typeof options.onSubmit === 'function' ? options.onSubmit : null,
            afterBuild: options && typeof options.afterBuild === 'function' ? options.afterBuild : null
        };

        this.createTime = new Date();
        this.type = this.options.type;
        this.changeEventType = 'datetimeOptionChange';// 当选项变更时触发的事件类型
        
        this.initValue = this._createDate(_this.options.value) || this.createTime;
        // this._setRange(this.options.beginDate, this.options.endDate);
        this._setRange(this._createDate(this.options.beginDate), this._createDate(this.options.endDate));

        this.element = $(mustache.render(tpl, this.options))[0];
        this.$element = $(this.element);
        this.$submitBtn = this.$element.find('[data-action="submit"]');
        this.$cancelBtn = this.$element.find('[data-action="cancel"]');
        this.$year = this.$element.find('[data-id="picker-year"]');
        this.$month = this.$element.find('[data-id="picker-month"]');
        this.$day = this.$element.find('[data-id="picker-day"]');
        this.$hour = this.$element.find('[data-id="picker-hour"]');
        this.$minute = this.$element.find('[data-id="picker-minute"]');

        this.state = 'closed';// closed -> opening -> opened -> closing -> closed

        $('body').append(this.$element);

        // 滚动穿透问题处理
        this.$element.on('touchmove', function(e) {
            e.preventDefault();
        });

        // 操作按钮
        this.$submitBtn.on('click',function(){
            if(typeof _this.options.beforeSubmit === 'function' && _this.options.beforeSubmit.call(_this) !== true){
                return;
            }
            _this.hide(function(){
                typeof _this.options.onSubmit === 'function' && _this.options.onSubmit.call(_this, _this.getValue());
            });
        });
        this.$cancelBtn.on('click',function(){
            if(typeof _this.options.beforeCancel === 'function' && _this.options.beforeCancel.call(_this) !== true){
                return;
            }
            _this.hide(function(){
                typeof _this.options.onCancel === 'function' && _this.options.onCancel.call(_this);
            });
        });

        // 内部逻辑事件
        this.$year.on(this.changeEventType, function(e, data){
            // 月数据仅受起止时间影响
            _this._createMonth(true);
        });
        this.$month.on(this.changeEventType, function(e, data){
            // 日数据受年份(平年闰年)、月份(大月小月)和起止时间影响
            _this._createDay(true);
        });
        this.$day.on(this.changeEventType, function(e, data){
            // 时数据仅受起止时间影响
            _this._createHour(true);
        });
        this.$hour.on(this.changeEventType, function(e, data){
            // 分数据仅受起止时间影响
            _this._createMinute(true);
        });

        this.$element.on(this.changeEventType, function(e, data){
            if(data && data.pickerName === 'minutePicker'){
                _this.$element.trigger('datatimePickerValueChange');
            }
        });

        // 各picker初始化完成时设置一下初始值
        this.$element.one('datatimePickerValueChange',function(){
            _this.setValue(_this.initValue);
        });

        this._yearPicker = new Picker(this.$year[0], {changeEventType: _this.changeEventType, name:'yearPicker'});
        this._monthPicker = new Picker(this.$month[0], {changeEventType: _this.changeEventType, name:'monthPicker'});
        this._dayPicker = new Picker(this.$day[0], {changeEventType: _this.changeEventType, name:'dayPicker'});
        this._hourPicker = new Picker(this.$hour[0], {changeEventType: _this.changeEventType, name:'hourPicker'});
        this._minutePicker = new Picker(this.$minute[0], {changeEventType: _this.changeEventType, name:'minutePicker'});

        this._createYear(true); // 强制触发级联效应以初始化各个picker
    }


    DateTimePicker.prototype._setRange = function(dateBegin, dateEnd){
        var beginDate = dateBegin instanceof Date && !isNaN(dateBegin.valueOf()) ? dateBegin : null;
        var endDate = dateEnd instanceof Date && !isNaN(dateEnd.valueOf()) ? dateEnd : null;
        this.beginDate = null;
        this.endDate = null;
        if(beginDate !== null && endDate !== null && beginDate > endDate){
            this.beginDate = endDate;
            this.endDate = beginDate;
        }
        if(this.type === 'time'){
            this.beginDate = this.beginDate || beginDate || new Date(this.initValue.getFullYear(),this.initValue.getMonth(),this.initValue.getDate());
            this.endDate = this.endDate || endDate || new Date(this.initValue.getFullYear(),this.initValue.getMonth(),this.initValue.getDate(),23,59,59,999);
        }else{
            this.beginDate = this.beginDate || beginDate || new Date(this.initValue.getFullYear() - 5,0,1);
            this.endDate = this.endDate || endDate || new Date(this.initValue.getFullYear() + 5,11,31,23,59,59,999);
        }

        this.beginYear = this.beginDate.getFullYear();
        this.beginMonth = this.beginDate.getMonth() + 1;
        this.beginDay = this.beginDate.getDate();
        this.beginHour = this.beginDate.getHours();
        this.beginMinute = this.beginDate.getMinutes();

        this.endYear = this.endDate.getFullYear();
        this.endMonth = this.endDate.getMonth() + 1;
        this.endDay = this.endDate.getDate();
        this.endHour = this.endDate.getHours();
        this.endMinute = this.endDate.getMinutes(); 
    };

    DateTimePicker.prototype._createYear = function(forceTriggerChange){
        var _this = this,
            data = [],
            begin = this.beginYear,
            end = this.endYear,
            i;
        for(i=begin; i<=end; i++){
            data.push({
                text: typeof _this.options.formatYear === 'function' ? _this.options.formatYear(i+'') : i+'',
                value: i
            });
        }
        this._yearPicker.setData(data, forceTriggerChange);
    };
    DateTimePicker.prototype._createMonth = function(forceTriggerChange){
        var _this = this,
            data = [],
            currentYear = parseInt(this._yearPicker.getValue()),
            begin = this.beginYear === currentYear ? this.beginMonth : 1,
            end = this.endYear === currentYear ? this.endMonth : 12,
            i;
        for(i=begin; i<=end; i++){
            data.push({
                text: typeof _this.options.formatMonth === 'function' ? _this.options.formatMonth(i+'') : (i+'').replace(/^(\d)$/,'0$1'),
                value: i
            });
        }
        this._monthPicker.setData(data, forceTriggerChange);
    };
    DateTimePicker.prototype._createDay = function(forceTriggerChange){
        var _this = this,
            data = [],
            currentYear = parseInt(this._yearPicker.getValue()),
            currentMonth = parseInt(this._monthPicker.getValue()),
            begin = this.beginYear === currentYear && this.beginMonth === currentMonth ? this.beginDay : 1,
            end = this.endYear === currentYear && this.endMonth === currentMonth ? this.endDay : (new Date(currentYear,currentMonth).getTime()-new Date(currentYear,currentMonth-1).getTime())/(24*60*60*1000),
            i;
        for(i=begin; i<=end; i++){
            data.push({
                text: typeof _this.options.formatDay === 'function' ? _this.options.formatDay(i+'') : (i+'').replace(/^(\d)$/,'0$1'),
                value: i
            });
        }
        this._dayPicker.setData(data, forceTriggerChange);
    };
    DateTimePicker.prototype._createHour = function(forceTriggerChange){
        var _this = this,
            data = [],
            currentYear = parseInt(this._yearPicker.getValue()),
            currentMonth = parseInt(this._monthPicker.getValue()),
            currentDay = parseInt(this._dayPicker.getValue()),
            begin = this.beginYear === currentYear && this.beginMonth === currentMonth && this.beginDay === currentDay ? this.beginHour : 0,
            end = this.endYear === currentYear && this.endMonth === currentMonth && this.endDay === currentDay ? this.endHour : 23,
            i;
        for(i=begin; i<=end; i++){
            data.push({
                text: typeof _this.options.formatHour === 'function' ? _this.options.formatHour(i+'') : (i+'').replace(/^(\d)$/,'0$1'),
                value: i
            });
        }
        this._hourPicker.setData(data, forceTriggerChange);
    };
    DateTimePicker.prototype._createMinute = function(forceTriggerChange){
        var _this = this,
            data = [],
            currentYear = parseInt(this._yearPicker.getValue()),
            currentMonth = parseInt(this._monthPicker.getValue()),
            currentDay = parseInt(this._dayPicker.getValue()),
            currentHour = parseInt(this._hourPicker.getValue()),
            begin = this.beginYear === currentYear && this.beginMonth === currentMonth && this.beginDay === currentDay && this.beginHour === currentHour ? this.beginMinute : 0,
            end = this.endYear === currentYear && this.endMonth === currentMonth && this.endDay === currentDay && this.endHour === currentHour ? this.endMinute : 59,
            i;
        for(i=begin; i<=end; i++){
            data.push({
                text: typeof _this.options.formatMinute === 'function' ? _this.options.formatMinute(i+'') : (i+'').replace(/^(\d)$/,'0$1'),
                value: i
            });
        }
        this._minutePicker.setData(data, forceTriggerChange);
    };

    DateTimePicker.prototype._createDate = function(value){
        var parsedValue = {};
        if(value === undefined){
            return undefined;
        }else if(
            value instanceof Date &&
            !isNaN(value.valueOf())
        ){
            return value;
        }else if(
            typeof value === 'string' &&
            /^\d{4}(?:([\-\/])\d{1,2}(?:\1\d{1,2}(?:\ \d{1,2}(?:\:\d{1,2}){0,2})?)?)?$/.test(value)
        ){
            var parts = value.replace(/[\:\/-]/g, ' ').split(' ');
            parsedValue.y = Number(parts[0]);
            parsedValue.m = parts[1] ? Number(parts[1]) : 0;
            parsedValue.d = parts[2] ? Number(parts[2]) : 0;
            parsedValue.h = parts[3] ? Number(parts[3]) : 0;
            parsedValue.i = parts[4] ? Number(parts[4]) : 0;

            return new Date(parsedValue.y, parsedValue.m-1, parsedValue.d, parsedValue.h, parsedValue.i);
        }else{
            try{
                console.error('要设置的值不符合要求: 必须是一个日期类型或类似于“2018-08-30 11:27”或“2018/08/30 11:27”这样的日期字符串');
            }catch(e){}
            return undefined;
        }
    };


    DateTimePicker.prototype.show = function(callback){
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

    DateTimePicker.prototype.hide = function(callback){
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

    

    DateTimePicker.prototype.setRange = function(dateBegin, dateEnd, valueDate){
        var _this = this;

        this.initValue = this._createDate(valueDate) || this.getValue() || new Date();

        // 各picker初始化完成时设置一下初始值
        this.$element.one('datatimePickerValueChange',function(){
            _this.setValue(_this.initValue);
        });
        this._setRange(this._createDate(dateBegin), this._createDate(dateEnd));
        this._createYear(true);
    };

    DateTimePicker.prototype.setValue = function(value){
        // 注意: setValue 是异步操作, 不能在 setValue 后同步 getValue
        // 由于异步设置各个picker的值，不要同步多次调用 setValue 方法, 同步多次调用会导致相互间发生干扰，从而出现设置错误
        
        var _this = this;
        var v = _this._createDate(value);
        if(v === undefined){
            try{
                console.warn('未指定要设置的值');
            }catch(e){}
            return;
        }
        if(v < _this.beginDate || v > _this.endDate){
            try{
                console.warn('要设置的值不存在于选项范围内');
            }catch(e){}
            return;
        }

        var parsedValue = {};
        parsedValue.y = v.getFullYear();
        parsedValue.m = v.getMonth() + 1;
        parsedValue.d = v.getDate();
        parsedValue.h = v.getHours();
        parsedValue.i = v.getMinutes();

        // 因为picker的change事件是异步(考虑到性能)的，所以为了保证change之后再setValue，使用回调处理
        // * 考虑到级联影响 此处setValue()的第二个参数duration(动画时间)必须是0 保证同步执行
        //     1. 因为存在级联关系，需要在一个picker的setValue完成后再执行下一个picker的setValue
        //     2. 级联中的某些picker(例如dayPicker)不仅仅受制于前一个picker的当前值（例如同样是2月，天数会因为
        // 年份不同而不同 - 平年或闰年） 所以每一次setValue 后都需要强制触发一下change事件
        //     3. 另外因为起止时间的存在也会出现上一条的状况
        //     4. 为了尽快完成者一系列变化，setValue的过程中不要使用动画 - setValue()的第二个参数duration(动画时间)必须是0
        _this._yearPicker.setValue(parsedValue.y, 0, function(){
            _this.$element.on('datatimePickerValueChange', function(e){
                _this.$element.off('datatimePickerValueChange');
                _this._monthPicker.setValue(parsedValue.m, 0, function(){
                    _this.$element.on('datatimePickerValueChange', function(e){
                        _this.$element.off('datatimePickerValueChange');
                        _this._dayPicker.setValue(parsedValue.d, 0, function(){
                            _this.$element.on('datatimePickerValueChange', function(e){
                                _this.$element.off('datatimePickerValueChange');
                                _this._hourPicker.setValue(parsedValue.h, 0, function(){
                                    _this.$element.on('datatimePickerValueChange', function(e){
                                        _this.$element.off('datatimePickerValueChange');
                                        _this._minutePicker.setValue(parsedValue.i, 0, null, true);
                                    });
                                }, true);
                            });
                        }, true);
                    });
                }, true);
            });
        }, true);

    };

    DateTimePicker.prototype.getValue = function(){
        var _this = this;
        return new Date(
            _this._yearPicker.getValue(),
            _this._monthPicker.getValue() - 1,
            _this._dayPicker.getValue(),
            _this._hourPicker.getValue(),
            _this._minutePicker.getValue()
        );
    };

    DateTimePicker.prototype.getValueInfo = function(){
        var _this = this;
        return {
            type: _this.type,
            year: _this._yearPicker.getValueInfo(),
            month: _this._monthPicker.getValueInfo(),
            day: _this._dayPicker.getValueInfo(),
            hour: _this._hourPicker.getValueInfo(),
            minute: _this._minutePicker.getValueInfo()
        };
    };

    return DateTimePicker;
});
