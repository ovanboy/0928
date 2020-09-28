require([
  'jquery',
],function(
  $
){

  $('.button,.rule').on('touchstart',function(){
    $(this).find('.inner').addClass('show');
  })

  $('.button,.rule').on('touchend',function(){
    $(this).find('.inner').removeClass('show');
  })
  
});