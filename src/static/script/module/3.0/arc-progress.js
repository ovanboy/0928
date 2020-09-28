define(function(
){
    
    var defaultOptions = {
        startAngle: 180,//开始角
        endAngle: 180,//结束角
        interval: 5,//画面每帧时间间隔
        duration: 2000,//动画总时间
        lineWidth: 15,//线宽度
        bgColor: '#cccc',
        r: 100,//圆半径
        colors: {
            0: "#009",
            1: "#f00"
        },
        type: 'full',//画半圆或者圆，full｜half
    };

    // 构造函数
    function ArcProgress(options){
        var _this = this;
        var count = 0;//计数器
        var _ff;//一共绘制帧数
        var ff;//每帧变化角度数
        var ctx;//画布上下文

        
        rebuild();
        _creat();

        function rebuild(){
            _this.options = $.extend({}, defaultOptions, options);
            if(_this.options.type === 'half'){
                _this.options.duration = _this.options.duration*(Math.abs(_this.options.endAngle - _this.options.startAngle)/180);
            }else {
                _this.options.duration = _this.options.duration*(Math.abs(_this.options.endAngle - _this.options.startAngle)/360);
            }
            _ff = _this.options.duration/_this.options.interval;
            ff = (_this.options.endAngle - _this.options.startAngle)/_ff;
            _this.options.clockwise = (_this.options.endAngle - _this.options.startAngle > 0);
        }

        function _creat(){
            var canvas = document.getElementById(options.canvasId);
            if (canvas) {
                ctx = canvas.getContext('2d');
                _this.options.palette = createPalette(_this.options.colors);
                _this.options.w = canvas.width;
                _this.options.h = canvas.height;
                setLineStyle();
                startDraw();
            }
        }

        function setLineStyle() {
            ctx.lineWidth = _this.options.lineWidth;//线宽度
            ctx.globalAlpha = 1;//画布默认透明度
            ctx.lineCap = "round";//线末端样式square，round
        }
        
        function startDraw() {
            count = 0;
            //开始绘制画面
            var timer = setInterval(function () {
                count++;
                drawArc(_this.options.startAngle, _this.options.startAngle + count*ff);
                if (count >= _ff) {
                    clearInterval(timer);
                }
            }, _this.options.interval);
        }
        
        //画出图形
        function drawArc(start, end) {
            ctx.clearRect(0,0,_this.options.w,_this.options.h);               
            //画默认背景圆
            ctx.beginPath();
            ctx.strokeStyle = _this.options.bgColor;
            var c = _this.options.type == 'full'?(2* Math.PI):(Math.PI);
            var d = _this.options.startAngle/180*Math.PI;
            c=c+d;
            ctx.arc(_this.options.w/2, _this.options.h/2, _this.options.r,d, c,!_this.options.clockwise);
            ctx.stroke();
            
            //画进度条
            splitArc(_this.options.w/2, _this.options.h/2, _this.options.r, start, end);         
        }
        
        //设置笔触样式 
        function setStrokeStyle(r,g,b,a) {
            ctx.strokeStyle = 'rgb('+r + ','+ g + ','+ b +')';
            ctx.globalAlpha = a;
        }
        
        //画渐变弧线
        function splitArc(x,y,r,start,end) {
            var f = 0.6;//柔和度
            var t = Math.abs(end - start) * f;//切分总数
            var _i = _this.options.clockwise?(1/f): (-1/f);
            var _j = _this.options.clockwise?1:-1;
            var current = start;
            
            for(var i=0;i<t;i++) {
                var color = _this.options.palette.pickColor(Math.round(i*255/t));
                ctx.beginPath();
                setStrokeStyle(color[0],color[1],color[2],1);
                ctx.arc(x,y,r,current/180*Math.PI,(current+_j)/180*Math.PI, !_this.options.clockwise);
                ctx.stroke();
                current = current + _i;
            }
        }
        
        //渐变色调色盘
        function createPalette(colorStops) {                
            var width = 256, height = 20;
        
            // 创建canvas
            var palatteCanvas = document.createElement("canvas");
            palatteCanvas.width = width;
            palatteCanvas.height = height;
            var ctx = palatteCanvas.getContext("2d");
        
            // 创建线性渐变色
            var linearGradient = ctx.createLinearGradient(0, 0, width, 0);
            for (var key in colorStops) {
                linearGradient.addColorStop(key, colorStops[key])
            }
        
            // 绘制渐变色条
            ctx.fillStyle = linearGradient;
            ctx.fillRect(0, 0, width, height);
        
            // 读取像素值
            var imageData = ctx.getImageData(0, 0, width, 1).data;
        
            return {
                canvas: palatteCanvas,
                pickColor: function (position) {
                    return imageData.slice(position * 4, position * 4 + 3)
                }
            }
        }
        function updata(end){
            ctx.clearRect(0,0,_this.options.w,_this.options.h);
            _this.options.endAngle = end ? end : _this.options.endAngle;
            rebuild();
            startDraw();
        }
        return {
            updata: updata
        }
    }
        
    var arcProgress = function (options) {
       return new ArcProgress(options);
    };
    return arcProgress;
})