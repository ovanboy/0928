require(['jquery', 'layer2', 'dialog'], function($, Layer, dialog) {


    $(".dateline-progress-inner").css('width', $(".dateline-progress-inner").attr('rate') + '%');


    $('.award-item section').on('click', function(e) {
        var awardid = $(this).parent().attr('awardid');
        var layerHTML = $('#award-template-' + awardid).html();
        if (!layerHTML) return;
        var thisLayer = new Layer({
            content: layerHTML,
            width: $(this).attr('data-width') || 300,
            height: $(this).attr('data-height') || 409,
            noPadding: true,
            noButton: false,
            wrapperClass: "award-detail-layer",
            afterBuild: function(ele) {
                $(ele).find('[data-action="closeLayer"]').on('click', function() {
                    thisLayer.close();
                });
            }
        });
        thisLayer.open();
    });

    // $('.award-item section').eq(0).click()

    $('.award-item .select-me').click(function() {
            var awardid = $(this).parent().attr('awardid');
            var aname = $($('#award-template-' + awardid).html()).find('.award-detail-title').text()
            dialog({
                type: 'confirm',
                content: '确定' + aname + '吗？奖品一旦选择，无法更改哦',
                submitButtonText: '我心已决',
                cancelButtonText: '我再想想',
                submitCallback: function(value) {
                    console.log('漩涡')
                },
                cancelCallback: function() {

                }
            })
        })
        // $('.award-item .select-me').eq(0).click()
    try {
        (function() {
            var w = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);

            document.documentElement.style.fontSize = w / 7.5 + 'px';

            window.addEventListener('resize', function() {
                w = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
                document.documentElement.style.fontSize = w / 7.5 + 'px';
            })

        })();
    } catch (e) {

    }
});