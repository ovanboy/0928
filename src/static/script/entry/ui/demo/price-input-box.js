require([
	'jquery'
],function(
	$
){

	// function setAmountInputBoxData($ele){
	// 	$ele.data('shadow-box',$ele.find('.shadow-box'));
	// 	$ele.data('view-box',$ele.find('.view-box'))
	// 	$ele.data('input-box',$ele.find('.input-box'))
	// 	$ele.data('.view-box',$ele.find('.shadow-box'))
	// 	$ele.data('.view-box',$ele.find('.shadow-box'))
	// 	$ele.data('.view-box',$ele.find('.shadow-box'))
	// };

	$(document).on('input','.amount-input-box .input-box',function(){
		var $inputBox = $(this);
		var $amountInputBox = $inputBox.closest('.amount-input-box');
		var $shadowBox = $amountInputBox.find('.shadow-box');
		var $viewBox = $amountInputBox.find('.view-box');
		//var $edit = $viewBox.find('.edit');
		var $view = $viewBox.find('.view');
		var $clearBtn = $amountInputBox.find('.clear-btn');
		var $valueInput = $amountInputBox.find('.value-input');
		var $errorBox = $amountInputBox.find('.error-box');
		var attrMax = $amountInputBox.attr('data-max');
		var attrMin = $amountInputBox.attr('data-min');
		var dm = $amountInputBox.attr('data-multiple') || '1';
		var value = $inputBox.val();

		var maxValue, minValue, multiple, postfix, v, isOk;

		if(attrMax === '' || isNaN(Number(attrMax))){
			maxValue = null
		}else{
			maxValue = Number(attrMax);
		}
		if(attrMin === '' || isNaN(Number(attrMin))){
			minValue = null
		}else{
			minValue = Number(attrMin);
		}
		//console.log(minValue + '~' + maxValue);

		if(value === '0'){
			value = '';
		}
		if(value !== ''){
			value = parseInt(value, 10);
			if(isNaN(value)){
				value = '';
			}
		}
		if(value !== ''){
			if(/^10*$/.test(dm)){
				multiple = Number(dm);
				postfix = dm.replace(/^1/,'');
			}else{
				try{
					console.warn('data-multiple 属性值必须是1/10/100/1000/...（10的N次幂）这样的数字！');
				}catch(e){}
				multiple = 1;
				postfix = '';
			}
			// console.log('倍数['+ (typeof multiple) + ']:' + multiple);
			// console.log('后缀['+ (typeof postfix) + ']:' + postfix);

			v = value * multiple;
			//console.log(v);

			$inputBox.val(value);
			$shadowBox.val(value + postfix);
			$view.val(v.toLocaleString());
			$valueInput.val(v+'');
			//$clearBtn.show();
			$amountInputBox.addClass('has-value');
		}else{
			v = '';
			$inputBox.val('');
			$shadowBox.val('');
			$view.val('');
			$valueInput.val(v);
			//$clearBtn.hide();
			$amountInputBox.removeClass('has-value');
		}

		// if(v !== ''){
		// 	isOk = true;
		// 	if(maxValue !== null && v > maxValue){
		// 		$errorBox.text('最高借款金额' + maxValue.toLocaleString());
		// 		isOk = false;
		// 	}
		// 	if(minValue !== null && v < minValue){
		// 		$errorBox.text('最低借款金额' + minValue.toLocaleString());
		// 		isOk = false;
		// 	}
		// 	if(isOk){
		// 		$amountInputBox.removeClass('error');
		// 	}else{
		// 		$amountInputBox.addClass('error');
		// 	}
		// }
	});

	$(document).on('blur','.amount-input-box .input-box',function(){
		var $inputBox = $(this);
		var $amountInputBox = $inputBox.closest('.amount-input-box');
		// var $shadowBox = $amountInputBox.find('.shadow-box');
		// var $viewBox = $amountInputBox.find('.view-box');
		// var $clearBtn = $amountInputBox.find('.clear-btn');

		var $errorBox = $amountInputBox.find('.error-box');
		var v = $amountInputBox.getAmountInputBoxValue();
		var attrMax = $amountInputBox.attr('data-max');
		var attrMin = $amountInputBox.attr('data-min');
		var maxValue, minValue, isOk;

		if(attrMax === '' || isNaN(Number(attrMax))){
			maxValue = null
		}else{
			maxValue = Number(attrMax);
		}
		if(attrMin === '' || isNaN(Number(attrMin))){
			minValue = null
		}else{
			minValue = Number(attrMin);
		}

		if(v !== ''){
			isOk = true;
			if(maxValue !== null && v > maxValue){
				$errorBox.text('最高借款金额' + maxValue.toLocaleString());
				isOk = false;
			}
			if(minValue !== null && v < minValue){
				$errorBox.text('最低借款金额' + minValue.toLocaleString());
				isOk = false;
			}
			if(isOk){
				$amountInputBox.removeClass('error');
			}else{
				$amountInputBox.addClass('error');
			}
		}

		// $inputBox.hide();
		// $shadowBox.hide();
		// $clearBtn.hide();
		// $viewBox.show();
	});

	// $(document).on('focus','.amount-input-box .input-box',function(){
	// 	var $inputBox = $(this);
	// 	var $amountInputBox = $inputBox.closest('.amount-input-box');
	// 	var $shadowBox = $amountInputBox.find('.shadow-box');
	// 	var $viewBox = $amountInputBox.find('.view-box');
	// 	var $clearBtn = $amountInputBox.find('.clear-btn');

	// 	$inputBox.trigger('input');
	// 	$inputBox.show();
	// 	$shadowBox.show();
	// 	$viewBox.hide();
	// });

	$(document).on('touchstart','.amount-input-box .clear-btn',function(){
		var $clearBtn = $(this);
		var $amountInputBox = $clearBtn.closest('.amount-input-box');
		var $shadowBox = $amountInputBox.find('.shadow-box');
		var $inputBox = $amountInputBox.find('.input-box');
		var $viewBox = $amountInputBox.find('.view-box');

		$inputBox.val('').trigger('input').trigger('focus');
	});

	$(document).on('click','.amount-input-box .view-box',function(){
		var $viewBox = $(this);
		var $amountInputBox = $viewBox.closest('.amount-input-box');
		var $shadowBox = $amountInputBox.find('.shadow-box');
		var $inputBox = $amountInputBox.find('.input-box');
		var $clearBtn = $amountInputBox.find('.clear-btn');

		//$inputBox.show().trigger('focus');
		$inputBox[0].focus();
	});

	$.fn.getAmountInputBoxValue = function(){
		var value = $(this).find('.value-input').val();
		if(value === ''){
			return '';
		}else{
			return Number(value);
		}
	}

	$.fn.setAmountInputBoxValue = function(value){
		var $this = $(this);
		var dm, multiple, postfix;
		if($this.is('.amount-input-box')){
			if(value === ''){
				$this.find('.value-input').val('');
				$this.find('.input-box').val('');
				$this.find('.shadow-box').val('');
				//$this.find('.view-box').val(value);
				$this.find('.view-box .view').val('');
				$clearBtn.hide();
				$this.removeClass('has-value');
			}else{
				var dm = $this.attr('data-multiple') || '1';
				if(/^10*$/.test(dm)){
					multiple = Number(dm);
					postfix = dm.replace(/^1/,'');
				}else{
					try{
						console.warn('data-multiple 属性值必须是1/10/100/1000/...（10的N次幂）这样的数字！');
					}catch(e){}
					multiple = 1;
					postfix = '';
				}
				if(typeof value === 'number' && value > 0 && value % multiple === 0){

					$this.find('.value-input').val(value);
					$this.find('.input-box').val(value/multiple);
					$this.find('.shadow-box').val(value);
					$this.find('.view-box .view').val(value.toLocaleString());
					//$clearBtn.show();
					$this.addClass('has-value');
				}
			}
		}else{
			try{
				console.warn('setAmountInputBoxValue 方法仅适用于.amount-input-box');
			}catch(e){}
		}
		return $this;
	};


	$('.amount-input-box .min-tips').on('click',function(){
		var $this = $(this);
		var $amountInputBox =  $this.closest('.amount-input-box');
		//var v = Number($this.attr('data-amount'));
		$amountInputBox.setAmountInputBoxValue(Number($this.attr('data-amount')));
	});

	$('.amount-input-box .max-tips').on('click',function(){
		var $this = $(this);
		var $amountInputBox =  $this.closest('.amount-input-box');
		//var v = Number($this.attr('data-amount'));
		$amountInputBox.setAmountInputBoxValue(Number($this.attr('data-amount')));
	});

});