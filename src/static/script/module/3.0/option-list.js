define([
  'jquery',
  'mask',
  'mustache',
  'iscroll',
  'pop-layer',
  'msg'
], function (
  $,
  mask,
  mustache,
  IScroll,
  PopLayer,
  msg
) {
    var namespace = 'ui-';
    var defaultInnerHtml = '{{#data}}<li class="' + namespace + 'option-item {{#choose}}select{{/choose}}"  data-value="{{valueKey}}">{{textKey}}</li>{{/data}}';

    function optionList(options) {
      var _this = this,
        $layer;
      var valueKey = options && typeof options.valueKey === 'string' ? options.valueKey : 'value';
      var textKey = options && typeof options.textKey === 'string' ? options.textKey : 'text';
      // innerHtml 样式
      var innerHtml = options && typeof options.innerHtml ==='string'? options.innerHtml : defaultInnerHtml
      var tpl = 
      '<ul class="' + namespace + 'option-inner">' + 
        innerHtml +
      '</ul>'


      _this.options = {
        className: options && typeof options.className === 'string' ? options.className + ' ui-option-list' : 'ui-option-list',
        title: options && typeof options.title === 'string' ? options.title : '',
        contentHTML: options && typeof options.title === 'string' ? options.title : '',
        exchangeBtn: options && typeof options.exchangeBtn === 'boolean' ? options.exchangeBtn : false,
        closeBtnText: options && typeof options.closeBtnText === 'string' ? options.closeBtnText : '',
        height: options && typeof options.height === 'number' ? Math.ceil(options.height) : undefined,
        // mask: options && typeof options.mask === 'boolean' ? options.mask : true,
        clickMaskForClose: options && typeof options.clickMaskForClose === 'boolean' ? options.clickMaskForClose : false,
        scroll: options && typeof options.scroll === 'boolean' ? options.scroll : true,
        destroyAfterClose: options && typeof options.destroyAfterClose === 'boolean' ? options.destroyAfterClose : false,
        beforeClose: options && typeof options.beforeClose === 'function' ? options.beforeClose : null,
        afterClose: options && typeof options.afterClose === 'function' ? options.afterClose : null,
        afterBuild: options && typeof options.afterBuild === 'function' ? options.afterBuild : null,

        data: options && $.isArray(options.data) ? options.data : [],
        valueKey: function () {
          return this[valueKey]
        },
        textKey: function () {
          return this[textKey]
        },
        deleteChoise: options && typeof options.deleteChoise === 'boolean' ? options.deleteChoise : false,
        deleteChoiseAlert: options && typeof options.deleteChoiseAlert === 'function' ? options.deleteChoiseAlert : null,
        chooseNumber: options && typeof Number(options.chooseNumber) === 'number' && Number(options.chooseNumber) > 1 ? Math.floor(Number(options.chooseNumber)) : 1,
        onSubmit: options && typeof options.onSubmit === 'function' ? options.onSubmit : null,
        setValue: options && typeof options.setValue === 'function' ? options.setValue : null,
        submitBtnText: options && typeof options.submitBtnText === 'string' ? options.submitBtnText : '',
        beforeSubmit: options && typeof options.beforeSubmit === 'function' ? options.beforeSubmit : null,
      };

      _this.clickList = [];
      _this.layer = new PopLayer({
        className: _this.options.className,
        title: _this.options.title,
        contentHTML: mustache.render(tpl, _this.options),
        closeBtnText: _this.options.closeBtnText,
        height: _this.options.height,
        scroll: _this.options.scroll,
        clickMaskForClose: _this.options.clickMaskForClose,
        destroyAfterClose: _this.options.destroyAfterClose,
        beforeClose: _this.options.beforeClose,
        afterClose: _this.options.afterClose,
        afterBuild: function () {
          var __this = this
          $layer = $(__this.element);
          if(_this.options.submitBtnText){
            $layer.find('.ui-pop-layer-header').append(
              '<button class="ui-pop-layer-action-btn submit" type="button">' + _this.options.submitBtnText + '</button>'
            )
          }else {
            $layer.find('.ui-pop-layer-header').append(
              '<button class="ui-pop-layer-action-btn submit icon" type="button">'+'</button>'
            )
          }

          if(_this.options.exchangeBtn){
            $layer.find('.ui-pop-layer-header .ui-pop-layer-action-btn.close,.ui-pop-layer-header .ui-pop-layer-action-btn.submit').addClass('exchange-btn');
          }

          var selectItems = $layer.find('.ui-option-inner .ui-option-item.select');
          if (selectItems.length > _this.options.chooseNumber) {
            selectItems.removeClass('select');
            selectItems.each(function (index, ele) {
              if (index  < _this.options.chooseNumber) {
                $(this).addClass('select');
                _this.clickList.push({
                  value: $(this).attr('data-value'),
                  text: $(this).text()
                })
              }
            })
          }else {
            selectItems.each(function () {
              _this.clickList.push({
                value: $(this).attr('data-value'),
                text: $(this).text()
              })
            })
          }


          typeof _this.options.afterBuild === 'function' && _this.options.afterBuild.call(_this);
        },
      });

      $layer.find('.ui-option-inner').on('click', '.ui-option-item', function () {
        var $this = this;
        var selectItems = $layer.find('.ui-option-inner .ui-option-item.select');
        if (_this.options.chooseNumber > 1) {
          if (!$($this).hasClass('select')) {
            var selectLen = selectItems.length;
            if (selectLen + 1 > _this.options.chooseNumber) {
              if (_this.options.deleteChoise) {
                $($this).addClass('select');
                _this.clickList.push({
                  value: $(this).attr('data-value'),
                })
                var deleteItem = _this.clickList.shift()
                selectItems.each(function () {
                  if ($(this).attr('data-value') == deleteItem.value) {
                    $(this).removeClass('select')
                  }
                })
              } else {
                if (typeof _this.options.deleteChoiseAlert === 'function') {
                  _this.options.deleteChoiseAlert()
                } else {
                  msg.info('最多选择' + _this.options.chooseNumber + '项');
                }
              }
            } else {
              $($this).addClass('select');
              _this.clickList.push({
                value: $(this).attr('data-value'),
              })
            }
          } else {
            var indexFlag
            $.each(_this.clickList, function (index, item) {
              if (item.value == $($this).attr('data-value')) {
                indexFlag = index;
              }
            })
            _this.clickList.splice(indexFlag, 1)
            $($this).removeClass('select');
          }
        } else {
          $($this).siblings().removeClass('select');
          $($this).addClass('select');
          if(typeof _this.options.beforeClose === 'function' && _this.options.beforeClose.call(_this) !== true){
            return;
          }
          _this.layer.close(function(){
            typeof _this.options.afterClose === 'function' && _this.options.afterClose.call(_this);
          })
        }
      })

      $layer.find('.ui-pop-layer-header').on('click', '.ui-pop-layer-action-btn.submit', function () {
        var valueObj =_this.getSelectedItems();
        if (typeof _this.options.beforeSubmit === 'function' && _this.options.beforeSubmit.call(_this, valueObj) === false) {
          return
        }
        typeof _this.options.onSubmit === 'function' && _this.options.onSubmit(valueObj);
        if(typeof _this.options.beforeClose === 'function' && _this.options.beforeClose.call(_this) !== true){
          return;
        }
        _this.layer.close(function(){
          typeof _this.options.afterClose === 'function' && _this.options.afterClose.call(_this);
        })
      })

      _this.getSelectedItems = function() {
        var items = [];
        var chooseEle = $layer.find('.ui-option-item.select'),
          chooseLen = chooseEle.length;
        if (chooseLen > 0) {
          for (var i = 0; i < chooseLen; i++) {
            for(var j =0; j < _this.options.data.length; j++){
              if($(chooseEle[i]).attr('data-value') == _this.options.data[j][valueKey]){
                items.push(_this.options.data[j])
              }
            }
          }
        }
        return items;
      }
    }


    optionList.prototype.open = function (callback) {
      var _this = this;
      _this.layer.open(callback)
    }
    optionList.prototype.close = function (callback) {
      var _this = this;
      _this.layer.close(callback)
    }
    optionList.prototype.destroy = function () {
      var _this = this;
      _this.layer.destroy()
    }
    optionList.prototype.getValue = function () {
      var _this = this;
      return _this.getSelectedItems()
    }
    optionList.prototype.setValue = function (newValue) {
      var _this = this;
      if (!$.isArray(newValue)) {
        console.warn('请确认设置的值为数组');
        return;
      }
      var selectLen = Math.min(_this.options.chooseNumber, newValue.length)
      var item = $(_this.layer.element).find('.ui-option-inner .ui-option-item')
      item.removeClass('select');
      _this.clickList = [];
      for (var i = 0; i < selectLen; i++) {
        item.each(function (index) {
          if (newValue[i] == $(this).attr('data-value')) {
            $(this).addClass('select');
            _this.clickList.push({
              value: $(this).attr('data-value'),
            })
          }
        })
      }
    }
    return optionList;
  });
