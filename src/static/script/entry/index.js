require([
    'jquery',
    'iscroll'
],function(
    $,
    IScroll
){

    var $nav = $('#nav'); 
    var $catalog = $('#catalog');

    new IScroll($catalog[0], {
        fadeScrollbars: true,
        shrinkScrollbars: 'clip',
        scrollbars: 'custom',
        preventDefaultException: {
            tagName: /.*/
        }
    });

    $nav.on('touchmove', function(e) {
        e.preventDefault();
    });
    $catalog.on('touchmove',function(e) {
        e.preventDefault();
    });

});
