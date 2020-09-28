require([
    'jquery'
],function(
    $
){


    var $input = $('#test-input');
    var $cleanBtn = $('#clean-btn');
    var $completeBtn = $('#complete-btn');

    var isClean = false;
    $input.on('blur',function(e){
        console.log(e);
        // if(e.relatedTarget === $cleanBtn[0]){
        //     $input.val('').focus();
        // }else{
        //    $input.addClass('error'); 
        // }
        if(isClean){
            $input.val('').focus();
            return;
        }
        $input.addClass('error');
    });

    $input.on('focus',function(e){
        // console.log(e);
        // // if(e.relatedTarget === $cleanBtn[0]){
        // //     $input.val('').focus();
        // // }else{
        // //    $input.addClass('error'); 
        // // }
        // if(isClean){
        //     $input.val('').focus();
        //     return;
        // }
        $input.removeClass('error');
    });

    // document.getElementById('test-input').addEventListener('blur',function(e){
    //     console.log(e);
    // },false);

    $cleanBtn.on('touchstart',function(){
        isClean = true;
        console.log('btn touchstart');
    });
    $cleanBtn.on('touchend',function(){
        console.log('btn touchend');
        // $input.val('').focus();
        // isClean = false;
    });
    $cleanBtn.on('click',function(){
        console.log('btn click');
        // $input.val('').focus();
        isClean = false;
    });


});