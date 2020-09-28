define([
    'jquery'
], function(
    $
) {
    $(document).off('click.optionList');
    $(document).on('click.optionList','ul.ui-option-list>li',function(e){
        var $option =  $(this),
            $list,
            $selectedOptions,
            selectedNumber,
            multiple,
            required,
            n,
            max;

        if($option.hasClass('disabled')){
            return;
        }

        $list = $option.closest('ul.ui-option-list');
        $selectedOptions = $list.children('li.selected');
        selectedNumber = $selectedOptions.size();
        multiple = $list.attr('data-multiple');
        required = $list.attr('data-required') !== undefined;

        if(multiple !== undefined){
            n = parseInt(multiple);
            max = isNaN(n) ? Number.POSITIVE_INFINITY : (n > 0 ? n : 1);
        }else{
            max = 1;
        }

        if($option.hasClass('selected')){
            if(selectedNumber === 1 && required){
                $option.trigger('select');
                try{
                    console.warn('至少要选择1个');
                }catch(e){}
                $list.trigger('error',{
                    msg:'至少要选择1个'
                });
            }else{
                $option.removeClass('selected');
                $list.trigger('change');
            }
        }else{
            if(selectedNumber < max){
                $option.addClass('selected').trigger('select');
                $list.trigger('change');
            }else if(selectedNumber === max){
                if(max === 1 && !$selectedOptions.hasClass('disabled')){
                    $selectedOptions.removeClass('selected');
                    $option.addClass('selected').trigger('select');
                    $list.trigger('change');
                }else{
                    try{
                        console.warn('最多只能选择'+ max +'个');
                    }catch(e){}

                    $list.trigger('error',{
                        msg:'最多只能选择'+ max +'个'
                    });
                }
            }else{
                try{
                    console.error('已选数量('+ selectedNumber +')超过了最大可选数量('+ max +')');
                }catch(e){}

                $list.trigger('error',{
                    msg:'已选数量('+ selectedNumber +')超过了最大可选数量('+ max +')'
                });
            }
            // if(max === 1){
            //     $selectedOptions.removeClass('selected');
            //     $option.addClass('selected').trigger('select');
            // }else{
            //     if(selectedNumber < max){
            //         $option.addClass('selected').trigger('select');
            //     }else if(selectedNumber === max){
            //         if(max === 1){
            //             $selectedOptions.removeClass('selected');
            //             $option.addClass('selected').trigger('select');
            //         }else{
            //             $list.trigger('error',{
            //                 msg:'最多只能选择'+ max +'个'
            //             });
            //         }
            //     }else{
            //         $list.trigger('error',{
            //             msg:'已选数量超过了设定的最大值:'+ max
            //         });
            //     }
            // }
        }
    });


    // 获取选项列表的值
    $.fn.getOptionListValue = function(){
        var $this = $(this),
            values = [];
        if($this.is('ul.ui-option-list')){
            $this.children('li.selected').each(function(i,option){
                values.push($(option).attr('data-value'));
            });
            return values;
        }else{
            try{
                console.warn('getSelectedOptions方法不适用于当前元素');
            }catch(e){}
        }
    };

});