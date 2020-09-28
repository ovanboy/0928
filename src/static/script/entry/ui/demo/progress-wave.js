require([
	'jquery'
],function(
	$
){


	$('.wave-progress').each(function(index, ele){
        var $progress = $(ele);
        var progress = Number($progress.attr('data-value'));
        $progress.find('.value-bar').css({
            top: (1 - progress) * 240 - 18
        }).addClass('animate');
    });


});