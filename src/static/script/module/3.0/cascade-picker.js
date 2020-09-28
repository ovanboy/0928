define([
    'jquery',
    'mustache',
    'iscroll',
    'pop-layer',
    'select-list'
],function(
    $,
    mustache,
    IScroll,
    PopLayer,
    selectList
){

    var namespace = 'ui-';

    function buildData(list, data, valueKey, textKey, subsKey, length, n){
        var i;
        var n = n || 1;
        for(i=0;i<data.length;i++){
            list[i] = {
                value: data[i][valueKey]+'',
                text: data[i][textKey]+''
            };
            if($.isArray(data[i][subsKey]) && n <= length){
                list[i].subs = [];
                buildData(list[i].subs, data[i][subsKey], valueKey, textKey, subsKey, length, n+1);
            }
        }
    }


    function getOption(data, path, text, value, cascadeValue, cascadeData, index){
        var index = index || 0;
        var n = cascadeValue.length;
        if($.isArray(cascadeData) && cascadeData.length > 0){
            for(var i=0;i<cascadeData.length;i++){
                if(cascadeData[i].value === cascadeValue[index]){
                    path[index] = i;
                    text[index] = cascadeData[i].text;
                    value[index] = cascadeData[i].value;
                    if(index < n-1){
                        return getOption(data, path, text, value, cascadeValue, cascadeData[i].subs, index+1);
                    }else{
                        data.text = cascadeData[i].text;
                        data.value = cascadeData[i].value;
                        if(cascadeData[i].subs){
                            data.subs = cascadeData[i].subs;
                        }
                    }
                    break;
                }
            }
        }else{
            data = null;
        } 
    }

    function getOptionInfo(cascadeValue, cascadeData){
        var info = {
            data: {},
            path: [],
            value: [],
            text: []
        };
        getOption(info.data, info.path, info.text, info.value, cascadeValue, cascadeData);
        return info;
    }



    // var defaultOptions = {
    //     // title: '所在地区',

    //     // length: 3, // 必选项
        
    //     // data: [],
    //     // valueKey: 'id',
    //     // textKey: 'name',
    //     // subsKey: 'subs',

    //     // 最后一个选择列表被选择时 一般必选
    //     // onsubmit: function(value){
    //     //     console.log(value);
    //     // },
    //     // // 取消选择时
    //     // oncancel: function(){
    //     //     console.log('取消选择');
    //     // },
    //     // // 当每一个选择列表被选择时
    //     // onselect: function(index, value){
    //     //     // index 选择列表的索引
    //     //     // value 此时的值
    //     //     console.log(index+':'+JSON.stringify(value));
    //     // },
    //     // placeholder: ['请选择省','请选择市','请选择区'],

    //     // fetch: [function(value, callback){}]
        
    // };

    function CascadePicker(options){
        var _this = this;
        var opts = $.extend({}, options);

        this.valueKey = typeof opts.valueKey === 'string' &&  opts.valueKey !== '' ? opts.valueKey : 'value';
        this.textKey = typeof opts.textKey === 'string' &&  opts.textKey !== '' ? opts.textKey : 'text';
        this.subsKey = typeof opts.subsKey === 'string' &&  opts.subsKey !== '' ? opts.subsKey : 'subs';

        this.onsubmit = typeof opts.onsubmit === 'function' ? opts.onsubmit : null;
        this.oncancel = typeof opts.oncancel === 'function' ? opts.oncancel : null;
        this.onselect = typeof opts.onselect === 'function' ? opts.onselect : null;

        this.clickMaskForClose = opts.clickMaskForClose === false ? false : true;

        this.length = typeof opts.length === 'number' ?  Math.ceil(opts.length) : 1;

        this.title = typeof opts.title === 'string' ?  opts.title : '';
        this.className = typeof opts.className === 'string' ?  opts.className : '';
        this.height = typeof opts.height === 'number' ?  Math.ceil(opts.height) : 400;

        this.initValue = $.isArray(opts.initValue) ? opts.initValue : [];
        this.tempValue = this.initValue;
        this.tempCallback = typeof opts.afterInit === 'function' ? opts.afterInit : null;


        // data的结构：[{value:'',text:'',subs[{value:'',text:'',subs:[{value:'',text:''}]}]}]
        this.data = [];
        if($.isArray(opts.data)){
            buildData(this.data, opts.data, this.valueKey, this.textKey, this.subsKey, this.length);
        }

        this.fetch = opts.fetch;

        this.placeholder = [];
        for(var i=0;i<this.length;i++){
            this.placeholder[i] = $.isArray(opts.placeholder) && typeof opts.placeholder[i] === 'string' ? opts.placeholder[i] : '请选择';
        }

        this.currentValue = [];

        this.layer = new PopLayer({
            className: _this.className,
            height: _this.height,
            title: _this.title,
            contentHTML: _this._renderFrame(_this.length),
            destroyAfterClose: false,
            scroll: false,
            oncancel: _this.oncancel,
            clickMaskForClose: _this.clickMaskForClose,
            afterBuild: function(){
                var $layer = $(this.element);
                var $element = $layer.find('.'+namespace+'cascade-layer-content');
                var $titles = $element.find('.title-item');
                var $conts = $element.find('.cont-item');

                $layer.find('.'+namespace+'pop-layer-content-inner').css({height:'100%'});

                // 追加两个属性
                _this.element = $element[0];
                _this.scrolls = [];

                // 修补title部分样式
                $titles.css('max-width',(100/_this.length).toFixed(2)+'%');

                // 切换事件
                $titles.on('click',function(e){
                    var $title = $(this);
                    var index = $titles.index($title);
                    $titles.removeClass('current');
                    $title.addClass('current');
                    $conts.removeClass('current');
                    $conts.eq(index).addClass('current');
					_this.scrolls[index] && _this.scrolls[index].refresh();
                });

                $conts.each(function(index, cont){
                    // 选项列表滚动效果
                    _this.scrolls[index] = new IScroll(cont, {
                        fadeScrollbars: true,
                        shrinkScrollbars: 'clip',
                        scrollbars: 'custom',
                        preventDefaultException: {
                            tagName: /.*/
                        }
                    });

                    // 选择事件
                    $(cont).find('.'+namespace+'cascade-option-list').on('select',function(e, data){
                        var value = $(this).getSelectListValue()[0];
                        var text = $(data.target).text();

                        // 重置当前值
                        _this.currentValue = _this.currentValue.slice(0, index);
                        _this.currentValue.push(value);

                        // 重置 title 文本
                        $titles.eq(index).attr('data-value',value).find('span').text(text);
                        for(var i=index+1;i<_this.length;i++){
                            $titles.eq(i).removeClass('show').find('span').text(_this.placeholder[i]);
                        }

                        // 如果不是设置的值，触发选择事件
                        if(_this.tempValue.length === 0){
                            typeof _this.onselect === 'function' && _this.onselect(index, {
                                value: value,
                                text: text
                            });
                        }

                        if(index >= _this.length-1){
                            // 最后一个选项列表被选择
                            if(_this.tempValue.length === 0){
                                // 如果不是设置的值，触发提交事件
                                _this.submit();
                            }else{
                                // 如果是设置的值，在设置完成后执行：
                                typeof _this.tempCallback === 'function' && _this.tempCallback();
                            }
                        }else{
                            // 非最后一个选项列表被选择，触发下一级选项被渲染
                            _this._render(_this.currentValue);
                        }

                        // 最后一个选项列表选择完成后清除临时值
                        if(index === _this.tempValue.length - 1){
                            _this.tempValue = [];
                            _this.tempCallback = null;
                        }

                        
                    });
                });

                // 渲染初始值
                _this._render(_this.currentValue);
            }
        });
    }

    CascadePicker.prototype._getData = function(casecadeValue, callback){
        var _this = this;
        var m = casecadeValue.length;
        var optionInfo;

        if(m === 0 && _this.data.length > 0){
            // 渲染第一个选项列表数据（如果已缓存）
            typeof callback === 'function' && callback(_this.data);
        }else{
            optionInfo = getOptionInfo(casecadeValue, _this.data);

            if(optionInfo.data && $.isArray(optionInfo.data.subs)){
                //数据已缓存
                typeof callback === 'function' && callback(optionInfo.data.subs);
            }else{
                // 数据未缓存
                _this.fetch[m](casecadeValue[m-1], function(data){
                    var list = [], o, n, i, j;
                    if($.isArray(data)){
                        // 重构数据
                        for(i=0;i<data.length;i++){
                            list[i] = {
                                value: data[i].value + '',
                                text: data[i].text + ''
                            };
                        }

                        // 缓存数据
                        o = _this.data;
                        n = optionInfo.path.length;
                        if(n > 0){
                            for(j=0;j<n;j++){
                                if(j === n-1){
                                    o = o[optionInfo.path[j]];
                                }else{
                                    o = o[optionInfo.path[j]].subs;
                                };
                            }
                            o.subs = list;
                        }else{
                            _this.data = list;
                        }

                        // 执行回调
                        typeof callback === 'function' && callback(list);
                    }else{
                        try{
                            console.log('获取的数据必须是一个选项数组'); 
                        }catch(e){}
                    }
                });
            }
        }
    };
    CascadePicker.prototype._renderFrame = function(length){
        var _this = this;
        var tpl = '<div class="'+namespace+'cascade-layer-content">'+
            '<div class="'+namespace+'cascade-tab-title">'+
                '{{#list}}<div class="title-item{{#isCurrent}} current{{/isCurrent}}"><span>{{placeholder}}</span></div>{{/list}}'+
            '</div>'+
            '<div class="'+namespace+'cascade-tab-cont">'+
                '{{#list}}<div class="cont-item{{#isCurrent}} current{{/isCurrent}}"><ul class="'+namespace+'cascade-option-list ui-select-list" data-multiple="1" data-required></ul></div>{{/list}}'+
            '</div>'+
        '</div>';
        var arr = [];
        for(var i=0;i<length;i++){
            arr[i] = {
                isCurrent: i === 0,
                placeholder: _this.placeholder[i]
            };
        }
        return mustache.render(tpl, {list: arr});
    };
    CascadePicker.prototype._render = function(casecadeValue, callback){
        var _this = this;
        var index = casecadeValue.length;
        var optionsTpl = '{{#list}}<li data-value="{{value}}">{{text}}</li>{{/list}}';
        _this._getData(casecadeValue, function(list){
            var $optionList = $(_this.element).find('.cont-item').eq(index).find('.'+namespace+'cascade-option-list');
            $(_this.element).find('.title-item').eq(index).trigger('click').addClass('show');
            $optionList.html(mustache.render(optionsTpl, {list: list}));
            _this.scrolls[index].refresh();
            _this.scrolls[index].scrollTo(0,0);

            if(_this.tempValue[index] !== undefined){
                for(var i=0;i<list.length;i++){
                    if(_this.tempValue[index] === list[i].value){
                        $optionList.find('li').eq(i).trigger('click');
                        break;
                    }
                }
            }
        });
    };

    CascadePicker.prototype.setValue = function(value, callback){
        this.tempValue = value;
        this.tempCallback = callback;
        this._render([]);
    };
    CascadePicker.prototype.getValue = function(){
        var optionInfo = getOptionInfo(this.currentValue, this.data);
        var value = [];
        for(var i=0;i<optionInfo.value.length;i++){
            value[i] = {
                value: optionInfo.value[i],
                text: optionInfo.text[i]
            };
        }
        return value;
    };

    CascadePicker.prototype.submit = function(){
        var value = this.getValue();
        this.close();
        typeof this.onsubmit === 'function' && this.onsubmit(value);
    };

    CascadePicker.prototype.open = function(callback){
        var _this = this;
        _this.layer.open(function(){
            $.each(_this.scrolls, function(index, scroll){
                scroll.refresh();
            })
            typeof callback === 'function' && callback();
        });
    };
    CascadePicker.prototype.close = function(callback){
        this.layer.close(callback);
    };

    return CascadePicker;

});