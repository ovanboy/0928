require([
    'jquery',
    'keyboard',
    'dialog'
],function(
    $,
    keyboard,
    dialog
){


    function setFormElementValue($formElement, value){
        var v = {};
        if(typeof value === 'string'){
            v.text = value;
            v.value = value;
        }else if(typeof value === 'object'){
            v.text = value.text && typeof value.text === 'string' ? value.text : (value.value && typeof value.value === 'string' ? value.value : '');
            v.value =  value.value && typeof value.value === 'string' ? value.value : '';
        }
        if($formElement.is('.select-btn')){
            if(v.value === ''){
                $formElement.text('');
                $formElement.attr('data-value','');
            }else{
                $formElement.text(v.text);
                $formElement.attr('data-value',v.value);
            }
        }
        if($formElement.is('.input-box')){
            $formElement.find('input').val(v.value);
        }
        $formElement.trigger('valuechange');
    }

    function getFormElementValue($formElement){
        if($formElement.is('.select-btn')){
            return {
                value: $formElement.attr('data-value') || '',
                text: $formElement.text()
            };
        }else if($formElement.is('.input-box')){
            return {
                value: $formElement.find('input').val()
            };
        }
    }

    function setFormItemState($formItem, state){
        switch(state){
            case 'error':
                $formItem.addClass('error');
                break;
            default :
                $formItem.removeClass('error');
        }
    }
    function isFormItemState($formItem, state){
        return $formItem.hasClass(state);
    }

    $(document).on('focus','.input-box input',function(){
        $(this).closest('.input-box').addClass('focus').trigger('elementfocus');
    });
    $(document).on('blur','.input-box input',function(){
        $(this).closest('.input-box').removeClass('focus').trigger('elementblur');
    });
    $(document).on('input','.input-box input',function(){
        var $inputBox = $(this).closest('.input-box');
        $inputBox.trigger('valuechange');
    });
    $(document).on('touchstart','.input-box .clear-btn',function(){
        var $box = $(this).closest('.input-box');
        var $input = $box.find('input');
        $input.val('');
        $input.trigger('input');
    });
    $(document).on('valuechange','.form-element',function(){
        var $this = $(this);
        if(getFormElementValue($this).value !== ''){
            $this.addClass('full');
        }else{
            $this.removeClass('full');
        }
    });




    keyboard.addSource('demo','/demo/ijiami-servlet.json');
    keyboard.addSource('test','/demo/ijiami-servlet2.json');

    $('.h5-keyboard-input').on('keyboardfocus',function(e){
        console.log('focus');
        var _this = this;
        setTimeout(function(){
            console.log($('body').height());
            _this.scrollIntoView(true);
        },700);
    });


    $(document).on('keyboardopen',function(e){
        $('body').addClass('security-keyboard-opened');

        // console.log(keyboard.getStatus());
    });

    $(document).on('keyboardclose',function(e){
        $('body').removeClass('security-keyboard-opened');
    });

});