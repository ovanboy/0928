require(['jquery'], function ($) {
    var canvas=$('canvas')[0]
    var ctx=canvas.getContext("2d")
    console.log(ctx)
    var width=300;
    var height=300
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.height = height * window.devicePixelRatio;
        canvas.width = width * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
   (function(){
    ctx.beginPath()
    ctx.arc(150, 150, 50, 0, Math.PI , true);
    ctx.lineWidth=9;
    ctx.lineCap ="round"
    ctx.strokeStyle="#ecb77e" //236,183,126
    ctx.stroke();
    // return;
    ctx.beginPath()
    ctx.arc(150, 150, 50, Math.PI,  Math.PI*(1+per), false);
    ctx.lineWidth=9;
    ctx.lineCap ="round"
    ctx.strokeStyle="#ff3d3e"
    ctx.stroke();
  
   })()
});