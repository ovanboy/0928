require(["jquery", "layer","lottie"], function($, Layer,lottie) {

        var params = {
            container: $('.lottie')[0],
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: '/static/data/image/zuihong/data.json'
        };
        var ani = lottie.loadAnimation(params);
        ani.addEventListener('data_ready', function () {
            setTimeout(function(){
                $('.lottie').css('opacity',1)
            },100)
        })




    $(".signup").click(function() {
        show_invalid2();
    });

    function show_success() {
        var tpl = $("#tpl-success").html();
        window.success_layer =
            window.success_layer ||
            new Layer({
                contentHTML: tpl,
                className: "zh-layer",
                destroyAfterClose: false
            });
        window.success_layer.open();
    }

    function show_fail() {
        var tpl = $("#tpl-fail").html();
        window.fail_layer =
            window.fail_layer ||
            new Layer({
                contentHTML: tpl,
                className: "zh-layer",
                destroyAfterClose: false
            });
        window.fail_layer.open();
    }

    function show_invalid() {
        var tpl = $("#tpl-invalid").html();
        window.invalid_layer =
            window.invalid_layer ||
            new Layer({
                contentHTML: tpl,
                className: "zh-layer zh-layer-invalid",
                destroyAfterClose: false
            });
        window.invalid_layer.open();
    }

    function show_invalid2() {
        var tpl = $("#tpl-invalid2").html();
        window.invalid2_layer =
            window.invalid2_layer ||
            new Layer({
                contentHTML: tpl,
                className: "zh-layer zh-layer-invalid",
                destroyAfterClose: false
            });
        window.invalid2_layer.open();
    }

    function renderCanvas() {
        var canvas = $("canvas", this)[0];
        var ctx = canvas.getContext("2d");
        var max = parseInt($(this).attr("max"));
        var current = parseInt($(this).attr("current"));
        var per = current / max;
        var width=$(this).width() // 220
        var height=$(this).height() // 120 
        var radius=85;
        var posX=width/2
        var poxY=radius+5
        var lineWidth=10;
        canvas.height = height * window.devicePixelRatio;
        canvas.width = width * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);


        ctx.beginPath()
        ctx.arc(posX, poxY, radius, 0, Math.PI , true);
        ctx.lineWidth=lineWidth;
        ctx.lineCap ="round"
        ctx.strokeStyle="#ecb77e" 
        ctx.stroke();
        ctx.beginPath()
        ctx.arc(posX, poxY, radius, Math.PI,  Math.PI*(1+per), false);
        ctx.lineWidth=lineWidth;
        ctx.lineCap ="round"
        ctx.strokeStyle="#ff3d3e"
        ctx.stroke();
    }

    $(".pie").each(renderCanvas);
});
