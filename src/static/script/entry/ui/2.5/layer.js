require([
    'jquery',
    'layer'
],function(
    $,
    Layer
){

    var layerHTML = $('#layer-content').html();

    $('.ui-btn').on('click',function(e){
        var thisLayer = new Layer({
            content: layerHTML,
            width: $(this).attr('data-width'),
            height: $(this).attr('data-height'),
            noPadding: $(this).attr('data-no-padding'),
            noButton: $(this).attr('data-no-button'),
            afterBuild: function(ele){
                $(ele).find('[data-action="closeLayer"]').on('click',function(){
                    thisLayer.close();
                });
            }
        });
        thisLayer.open();
    });

});
