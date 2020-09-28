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

    //默认配置
    var defaultOptions = {
        type: 'datetime', //可选值有：'datetime'、'date'、'time'、'month'、'hour'
        title: '', 
        label: {
            year: '年',
            month: '月',
            day: '日',
            hour: '时',
            minute: '分'
        },
        buttons: [{
            type: 'cancel',
            text: '取消'
        },{
            type: 'submit',
            text: '确定'
        }],
        customData: {}, //自定义数据
        beforeCancel: null,// function(){ return true; },//取消按钮点击后在关闭picker前执行，返回fasle将阻止后续动作
        onCancel: null,//function(){ try{ console.log('取消了选择'); }catch(e){} }, //取消回调
        beforeSubmit: null,// function(valueObj){ return true; }, //确定按钮点击后在关闭picker前执行，返回fasle将阻止后续动作
        onSubmit: null,//function(valueObj){ try{ console.log(valueObj); }catch(e){} } //确定回调
    };


    function DateTimePicker(options){
        var _this = this;
        this._options = $.extend({}, defaultOptions, options || {});
        this._createTime = new Date();
        this._mask = mask;

        this.type = this._options.type;
        this.changeEventType = 'datetimeOptionChange';// 当选项变更时触发的事件类型

        this.initValue = this._createDate(_this._options.value) || this._createTime;
        this._setRange(this._options.beginDate, this._options.endDate);

        this.$element = $(mustache.render(tpl, this._options));
        this.$submitBtn = this.$element.find('[data-action="submit"]');
        this.$cancelBtn = this.$element.find('[data-action="cancel"]');
        this.$year = this.$element.find('[data-id="picker-year"]');
        this.$month = this.$element.find('[data-id="picker-month"]');
        this.$day = this.$element.find('[data-id="picker-day"]');
        this.$hour = this.$element.find('[data-id="picker-hour"]');
        this.$minute = this.$element.find('[data-id="picker-minute"]');

        $('body').append(this.$element);

        // 滚动穿透问题处理
        this.$element.on('touchmove', function(e) {
            e.preventDefault();
        });

        // 操作按钮
        this.$submitBtn.on('click',function(){
            var value = _this.getValue();
            if( typeof _this._options.beforeSubmit === 'function' && _this._options.beforeSubmit.call(_this, value) === false){
                return;
            }
            _this.hide();
            typeof _this._options.onSubmit === 'function' && _this._options.onSubmit.call(_this, value);
        });
        this.$cancelBtn.on('click',function(){
            if( typeof _this._options.beforeCancel === 'function' && _this._options.beforeCancel.call(_this) === false){
                return;
            }
            _this.hide();
            typeof _this._options.onCancel === 'function' && _this._options.onCancel.call(_this);
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
        // this._createYear();
        // this._createMonth();
        // this._createDay();
        // this._createHour();
        // this._createMinute();
    }


    DateTimePicker.prototype._setRange = function(dateBegin, dateEnd){

        // this._createDate(_this.initValue);


        var beginDate = dateBegin instanceof Date && !isNaN(dateBegin.valueOf()) ? dateBegin : null;
        var endDate = dateEnd instanceof Date && !isNaN(dateEnd.valueOf()) ? dateEnd : null;
        this.beginDate = null;
        this.endDate = null;
        if(beginDate !== null && endDate !== null && beginDate > endDate){
            this.beginDate = endDate;
            this.endDate = beginDate;
        }
        // this.beginDate = this.beginDate || beginDate || new Date(this._createTime.getFullYear() - 5,0,1);
        // this.endDate = this.endDate || endDate || new Date(this._createTime.getFullYear() + 5,11,31,23,59,59,999);
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
                text: typeof _this._options.formatYear === 'function' ? _this._options.formatYear(i+'') : i+'',
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
                text: typeof _this._options.formatMonth === 'function' ? _this._options.formatMonth(i+'') : (i+'').replace(/^(\d)$/,'0$1'),
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
                text: typeof _this._options.formatDay === 'function' ? _this._options.formatDay(i+'') : (i+'').replace(/^(\d)$/,'0$1'),
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
                text: typeof _this._options.formatHour === 'function' ? _this._options.formatHour(i+'') : (i+'').replace(/^(\d)$/,'0$1'),
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
                text: typeof _this._options.formatMinute === 'function' ? _this._options.formatMinute(i+'') : (i+'').replace(/^(\d)$/,'0$1'),
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



    DateTimePicker.prototype.getElement = function(){
        return this.$element[0];
    };

    DateTimePicker.prototype.show = function(callback){
        this._mask.show();
        this.$element.addClass('active');
        typeof callback === 'function' && callback();
    };

    DateTimePicker.prototype.hide = function(callback){
        this._mask.hide();
        this.$element.removeClass('active');
        typeof callback === 'function' && callback();
    };

    

    DateTimePicker.prototype.setRange = function(dateBegin, dateEnd, valueDate){
        var _this = this;

        this.initValue = this._createDate(valueDate) || this.getValue() || new Date();

        // 各picker初始化完成时设置一下初始值
        this.$element.one('datatimePickerValueChange',function(){
            _this.setValue(_this.initValue);
        });
        this._setRange(dateBegin, dateEnd);
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
