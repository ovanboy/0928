require([
    'jquery',
    'pop-layer',
    'cascade-picker',
    'layer',
    'dialog',
    'msg',
    'option-list'
],function(
    $,
    PopLayer,
    CascadePicker,
    Layer,
    dialog,
    msg,
    optionList
){


    // 示例
    $('#pop-layer-btn').on('click',function(){

        // 创建弹出层
        window.demoLayer = window.demoLayer && window.demoLayer.toString() === '[object PopLayer]' ?  window.demoLayer : new PopLayer({

            // 弹层标题
            title: '弹出层标题',

            // 弹层内容 HTML代码(至少包含一个元素节点)
            content: $('#pop-layer-content').html(),

            // 关闭按钮文本 （最多两个字）
            // cancelBtnText: '关闭',

            // 是否点击遮罩执行关闭动作 Boolean 默认为true
            // clickMaskForClose: false,

            // 关闭按钮类型 'back'|'close'两个可选值，默认值为'close'
            // cancelBtnType: 'back',

            // 弹层高度（像素值） Number （组件内部自动限制最大高度为窗口高度）默认高度360px
            // height: 2000,

            // 内容超出弹层高度时是否启用滚动 Boolean 默认为true
            // scroll: false,

            // 弹层打开后回调
            afterOpen: function(){
                console.log('弹层已打开');
            },

            // 弹层关闭后回调
            afterClose: function(){
                console.log('弹层已关闭');
            },

            // 关闭弹出层时是否销毁DOM 默认为true
            destroyAfterClose: false,

            // 给生成的层最外层元素添加自定义class，以便必要时可以自定义弹出层的某些样式
            className: 'demo-layer',

            // 弹层中的面板信息
            panels: [{

                // 面板ID string类型
                id: 'panel1',
                content: $('#panel-1').html(),

                // 面板展现方式 'to-left'|'to-right'|'to-top'|'to-bottom'四个可选值，默认值为'to-left'
                showMode: 'to-left',

                // 面板标题
                title: '面板1标题',

                // 关闭按钮文本
                cancelBtnText: '返回',

                // 关闭按钮类型 'back'|'close'两个可选值，默认值为'back'
                cancelBtnType: 'back',

                // 内容超出弹层高度时是否取用滚动 Boolean 默认为true
                // scroll: false,

                // 面板打开后回调
                afterOpen: function(){
                    console.log('panel1已打开');
                },

                // 面板关闭后回调
                afterClose: function(){
                    console.log('panel1已关闭');
                }
            },{
                id: 'panel2',
                content: $('#panel-2').html(),
                showMode: 'to-top',
                title: '面板2标题',
                cancelBtnText: '取消',
                cancelBtnType: 'back',
                afterOpen: function(){
                    console.log('panel2已打开');
                },
                afterClose: function(){
                    console.log('panel2已关闭');
                }
            },{
                id: 'panel3',
                content: $('#panel-3').html(),
                showMode: 'to-right',
                title: '面板3标题',
                //cancelBtnText: '返回',
                cancelBtnType: 'back',
                afterOpen: function(){
                    console.log('panel3已打开');
                },
                afterClose: function(){
                    console.log('panel3已关闭');
                }
            },{
                id: 'panel4',
                content: $('#panel-4').html(),
                showMode: 'to-bottom',
                title: '面板4标题',
                //cancelBtnText: '关闭',
                cancelBtnType: 'close',
                afterOpen: function(){
                    console.log('panel4已打开');
                },
                afterClose: function(){
                    console.log('panel4已关闭');
                }
            }],

            // 弹层对象生成后回调 （一般用于绑定一些自定事件）
            afterBuild: function(ele){
                var layer = this;
                $(ele).find('[data-action="openPanel1"]').on('click',function(){
                    // 弹层实例方法-打开面板，需要传入面板的id
                    layer.openPanel('panel1');
                });
                $(ele).find('[data-action="openPanel2"]').on('click',function(){
                    layer.openPanel('panel2');
                });
                $(ele).find('[data-action="openPanel3"]').on('click',function(){
                    layer.openPanel('panel3');
                });
                $(ele).find('[data-action="openPanel4"]').on('click',function(){
                    layer.openPanel('panel4');
                });
                $(ele).find('[data-action="alert"]').on('click',function(){
                    //dialog.alert('进行层上弹层测试');
                    new PopLayer({
                        title: '进行层上弹层测试',
                        content: '<div><button class="ui-btn bigger primary block" data-action="layer3">弹层</button></div>',
                        height: 300,
                        clickMaskForClose: false,
                        afterBuild: function(element){
                            console.log(element);
                            $(element).find('[data-action="layer3"]').on('click',function(){
                                new PopLayer({
                                    title: '进行层上弹层测试2',
                                    content: '<div></div>',
                                    height: 200,
                                }).open();
                            });
                        }
                    }).open();
                });
            }
        });

        // 弹层实例方法-打开弹层 一共五个实例方法：open()|close()|openPanel(panelId)|closePanel(panelId)|destroy()
        window.demoLayer.open();
    });




    // 多重弹层
    var layerA = new Layer({
        destroyAfterClose: false
    });
    var layerB = new PopLayer({
        title: '多重弹层3',
        destroyAfterClose: false
    });
    var layerC = new Layer({
        destroyAfterClose: false
    });
    var layerD = new PopLayer({
        title: '多重弹层2',
        content: $('#multiple-layer-tpl').html(),
        destroyAfterClose: false,
        height: 430,
        afterBuild: function(layerElement){
            var $layer = $(layerElement);
            $layer.on('click','[data-action="msg"]',function(){
                msg('消息内容');
            });
            $layer.on('click','[data-action="dialog"]',function(){
                dialog.alert('请确认');
            });
            $layer.on('click','[data-action="layer"]',function(){
                layerA.open();
            });
            $layer.on('click','[data-action="pop-layer"]',function(){
                layerB.open();
            });
        }
    });
    
    var layerE = new PopLayer({
        title: '多重弹层1',
        content: $('#multiple-layer-tpl').html(),
        height: 500,
        destroyAfterClose: false,
        afterBuild: function(layerElement){
            var $layer = $(layerElement);
            $layer.on('click','[data-action="msg"]',function(){
                msg('消息内容');
            });
            $layer.on('click','[data-action="dialog"]',function(){
                dialog.alert('请确认');
            });
            $layer.on('click','[data-action="layer"]',function(){
                layerC.open();
            });
            $layer.on('click','[data-action="pop-layer"]',function(){
                layerD.open();
            });
        }
    });
    $('#multiple-layer-btn').on('click',function(){
        layerE.open();
    });



    // 通用支付
    $('#pay-btn').on('click',function(){
        var payLayer = new PopLayer({
            title: '支付确认',
            content: $('#pay-layer-content').html(),
            //scroll: false,
            height: 408,
            panels: [{
                id: 'cards',
                content: $('#pay-layer-cards-content').html(),
                title: '选择付款方式',
                //cancelBtnType: 'close',
                //scroll: false
            },{
                id: 'accumulatePoints',
                content: $('#panel-3').html(),
                title: '积分抵扣',
                //cancelBtnType: 'close',
                //scroll: false
            }],
            afterBuild: function(ele){

                var $jifenBtn = $(ele).find('[data-dom="jifenBtn"]');
                var $jifenSwicth = $(ele).find('[data-dom="jifen-switch"]');
                var $jifenSwitchBtn = $(ele).find('[data-dom="jifenSwitchBtn"]');
                var $cardList = $(ele).find('.pay-card-list');

                // 初始化 要根据银行卡判断积分是否可用
                var jifenEnabled = Math.random() > 0.5;
                var defaultStatus = Math.random() > 0.5;
                if(jifenEnabled){
                    if(defaultStatus){
                        $jifenSwicth.prop('checked',true);
                    }else{
                        $jifenBtn.hide();
                        $jifenSwicth.prop('checked',false);
                    }
                }else{
                    if(defaultStatus){
                        $jifenSwicth.prop('checked',true).prop('disabled',true);
                        $jifenSwitchBtn.addClass('disabled');
                    }else{
                        $jifenBtn.hide();
                        $jifenSwicth.prop('checked',false).prop('disabled',true);
                        $jifenSwitchBtn.addClass('disabled');
                    }
                }
                
                // 相关事件
                $(ele).find('[data-action="cards"]').on('click',function(){
                    payLayer.openPanel('cards');
                });
                $(ele).find('[data-action="accumulatePoints"]').on('click',function(){
                    payLayer.openPanel('accumulatePoints');
                });

                $jifenSwicth.on('change',function(){
                    var $this = $(this);
                    if($this.is(':checked')){
                        $jifenBtn.show();
                    }else{
                        $jifenBtn.hide();
                    }
                });
               

                $cardList.on('select','li',function(){
                    $(ele).find('[data-action="cards"]').find('.ui-form-value-input').val($(this).attr('data-value'));
                    $(ele).find('[data-action="cards"]').find('.ui-form-item-cont').text($(this).find('.base').text());
                    payLayer.closePanel('cards');
                });
                $cardList.on('change',function(){

                });
                
            }
        });
        payLayer.open();
    });


    // var posLayer = new PopLayer({
    //     title: '所在地区',
    //     content: $('#pos-layer-tpl').html(),
    //     destroyAfterClose: false,
    //     scroll: false,
    //     height: 400,
    //     afterBuild: function(layerElement){
    //         var $layer = $(layerElement);
    //         $layer.on('click','[data-action="msg"]',function(){
    //             msg('消息内容');
    //         });
    //         $layer.on('click','[data-action="dialog"]',function(){
    //             dialog.alert('请确认');
    //         });
    //         $layer.on('click','[data-action="layer"]',function(){
    //             layerA.open();
    //         });
    //         $layer.on('click','[data-action="pop-layer"]',function(){
    //             layerB.open();
    //         });
    //     }
    // });


    var posLayer = new CascadePicker({
        // title: '所在地区', // 标题 默认为''
        className: 'custom-class', //自定义class
        height: 400, // 弹出层高度(px) 默认 400
        length: 3, // 级联层级数(必选项)
        placeholder: ['请选择省','请选择市','请选择区'], //每个选择title
        
        // 最后一个选择列表被选择时触发
        onsubmit: function(value){
            console.log(value);
        },

        // 取消选择时触发
        oncancel: function(){
            console.log('取消选择');
        },

        // 每个选项列表被选择时都会触发
        onselect: function(index, value){
            // index 当前选择列表的索引
            // value 当前选项的值
            console.log(index+':'+JSON.stringify(value));
        },


        // 一次性传入所有选项数据
        // data: [{id:'01',name:'选项01',children:[{id:'11',name:'选项11'}]}],
        // valueKey: 'id', // 默认为'value'
        // textKey: 'name', // 默认为'text'
        // subsKey: 'children', // 默认为'subs'

        // 获取数据的方法
        fetch: [function(value, callback){
            $.ajax({
                type: 'get',
                url: '/common/address/province.json',
                dataType: 'json',
                success: function(result){
                    if(result.code === '0'){
                        var list = [];
                        var n = result.data.length;
                        for(var i=0;i<n;i++){
                            list.push({
                                value: result.data[i].id,
                                text: result.data[i].name
                            });
                        }
                        callback(list);
                    }else{
                        callback();
                    }
                }
            });
        },function(value, callback){
            $.ajax({
                type: 'get',
                url: '/common/address/city.json',
                data: {
                    provinceid: value
                },
                dataType: 'json',
                success: function(result){
                    if(result.code === '0'){
                        var list = [];
                        var n = result.data.length;
                        for(var i=0;i<n;i++){
                            list[i] = {
                                value: result.data[i].id,
                                text: result.data[i].name
                            };
                        }
                        callback(list);
                    }else{
                        callback();
                    }
                },
                error: function(){
                    callback();
                }
            });
        },function(value, callback){
            $.ajax({
                type: 'get',
                url: '/common/address/district.json',
                data: {
                    cityid: value
                },
                dataType: 'json',
                success: function(result){
                    if(result.code === '0'){
                        var list = [];
                        var n = result.data.length;
                        for(var i=0;i<n;i++){
                            list[i] = {
                                value: result.data[i].id,
                                text: result.data[i].name
                            };
                        }
                        callback(list);
                    }else{
                        callback();
                    }
                },
                error: function(){
                    callback();
                }
            });
        }],
        initValue: ['01','02','03'] // 初始值
    });

    $('#pos-select-btn').on('click',function(){
        posLayer.open();
    });

    window.pl = posLayer;
});