require([
    'jquery',
    'pop-layer',
    'option-list'
],function(
    $,
    PopLayer,
    OptionList
){

    // 实例方法：

    // 1. open(callback)
    // 功能： 打开弹出层
    // callback参数： Function类型  弹层打开完成后调用此函数 

    // 2. close(callback)
    // 功能： 关闭弹出层
    // callback参数： Function类型  弹层关闭完成后调用此函数 

    // 3. destroy()
    // 功能： 销毁对象内部资源，减少资源占用



    // 创建弹出层
    var demoLayer = new PopLayer({

        // 弹层标题  String类型  可选项
        // 1. 默认值为空字符串
        title: '弹出层标题',

        // 自定义类名  String类型  可选项
        // 1. 默认值为空字符串
        // 2. 给生成的层最外层元素添加自定义类名，以便必要时可以自定义弹出层的某些样式
        // 3. 如需添加多个class，请使用空格隔开，如：'class-a class-b'
        className: 'demo-layer',

        // 自定义内容  String类型  必选项
        // 1. 默认值为空字符串（虽然此设置项不是组件执行必须，但不设值此项将没有任何意义）
        // 2. 该值应当是以标准的HTML代码字符串
        contentHTML: '<div style="height:600px;padding:10px 15px;background-color:#fafafa;">弹出层内容</div>',

        // 关闭按钮文本  String类型  可选项
        // 1. 如果未设置此项，或设置为空字符串时，关闭按钮显示为关闭图标
        // 2. 按钮尺寸有限，请尽量控制在两个字以内
        closeBtnText: '关闭',

        // 点击遮罩时是否关闭弹层  Boolean类型  可选项
        // 1. 默认为true
        clickMaskForClose: false,

        // 自定义弹层高度  Number类型  可选项/弃用项
        // 1. 单位为像素（px）
        // 2. 默认值为 360
        // 3. 当设置的高度大于视口高度时，组件自动限制最大高度为视口高度
        // 4. 建议使用 className 设置项来控制弹层高度
        // height: 2000,

        // 内容超出弹层高度时是否启用滚动  Boolean类型  可选项
        // 1. 默认值为 true
        // 2. 当明确知道弹层内容不会超出内容区时，请禁用滚动（将此值设置为false）以提升性能
        scroll: true,

        // 关闭弹出层后是否销毁DOM  Boolean类型  可选项
        // 1. 默认值为 true
        // 2. 如果您希望保持弹出层中曾执行过的DOM操作，您应当将此值设置为 false
        destroyAfterClose: false,

        // 关闭前钩子函数  Function类型  可选项
        // 1. 此函数在关闭按钮被点击之后，弹出层关闭之前调用。
        // 2. 如果该函数执行的返回值不是 true， 后续关闭动作会被阻止。
        // 3. 其中this指向该弹出层对象
        beforeClose: function(){
            console.log('弹层将要关闭');
            return true;
        },

        // 关闭后回调函数  Function类型  可选项
        // 1. 此函数在关闭按钮被点击致使弹出层关闭之后调用。
        // 2. 其中this指向该弹出层对象
        afterClose: function(){
            console.log('弹层已关闭');
        },

        // 弹层对象生成后回调  Function类型  可选项
        // 1. 此函数将在对象创建完成后调用（仅调用一次）
        // 2. 其中this指向该弹出层对象
        afterBuild: function(){
            console.log('弹层对象已创建完成');
        }
    });


    // optionList组件      
    // optionList实例方法同popLayer实例方法 
    // 1. open(callback)
    // 功能： 打开弹出层
    // callback参数： Function类型  弹层打开完成后调用此函数 

    // 2. close(callback)
    // 功能： 关闭弹出层
    // callback参数： Function类型  弹层关闭完成后调用此函数 

    // 3. destroy()
    // 功能： 销毁对象内部资源，减少资源占用

    /* 
     *  新增 
     */

    // 4. setValue(newValue)
    // 功能： 设置选中值的value值 
    // 注: 当chooseNumber值小于setValue的长度时 选中setValue中的前chooseNumber项 同choose默认选中项
    // 注: data中choose选中项和setValue选中项同时存在 setValue 优先
    // newValue 参数： Array类型 [ '弹出层数据1','弹出层数据2' ]

    var optionListLayer = new OptionList({

        /* popLayer配置 */

        // 弹层标题  String类型  可选项
        // 1. 默认值为空字符串
        title: '弹出层标题',

        // 自定义类名  String类型  可选项
        // 1. 默认值为空字符串
        // 2. 给生成的层最外层元素添加自定义类名，以便必要时可以自定义弹出层的某些样式
        // 3. 如需添加多个class，请使用空格隔开，如：'class-a class-b'
        className: 'demo-option-list-layer',

        // 交换左右按钮 提交 关闭 按钮位置
        // 默认为false 即 提交在右 关闭在左
        exchangeBtn: false,

        // 关闭按钮文本  String类型  可选项
        // 1. 如果未设置此项，或设置为空字符串时,关闭按钮显示为'取消'
        // 2. 按钮尺寸有限，请尽量控制在两个字以内
        closeBtnText: '关闭',

        // 提交按钮文本  String类型  可选项
        // 1. 如果未设置此项，设置为空字符串时,提交按钮显示为'确定'
        // 2. 按钮尺寸有限，请尽量控制在两个字以内
        submitBtnText:'确定',

        // 点击遮罩时是否关闭弹层  Boolean类型  可选项
        // 1. 默认为true
        clickMaskForClose: true,

        // 自定义弹层高度  Number类型  可选项/弃用项
        // 1. 单位为像素（px）
        // 2. 默认值为 360
        // 3. 当设置的高度大于视口高度时，组件自动限制最大高度为视口高度
        // 4. 建议使用 className 设置项来控制弹层高度
        // height: 2000,

        // 内容超出弹层高度时是否启用滚动  Boolean类型  可选项
        // 1. 默认值为 true
        // 2. 当明确知道弹层内容不会超出内容区时，请禁用滚动（将此值设置为false）以提升性能
        scroll: true,

        // 关闭弹出层后是否销毁DOM  Boolean类型  可选项
        // 1. 默认值为 true
        // 2. 如果您希望保持弹出层中曾执行过的DOM操作，您应当将此值设置为 false
        destroyAfterClose: false,

        // 关闭前钩子函数  Function类型  可选项
        // 1. 此函数在关闭按钮被点击之后或mask层被点击，弹出层关闭之前调用。
        // 2. 如果该函数执行的返回值不是 true， 后续关闭动作会被阻止。
        // 3. 其中this指向该弹出层对象
        beforeClose: function(){
            console.log('弹层将要关闭');
            return true;
        },

        // 关闭后回调函数  Function类型  可选项
        // 1. 此函数在关闭按钮被点击或mask层被点击，弹出层关闭之后调用。
        // 2. 其中this指向该弹出层对象
        afterClose: function(){
            console.log('弹层已关闭');
        },

        // 弹层对象生成后回调  Function类型  可选项
        // 1. 此函数将在对象创建完成后调用（仅调用一次）
        // 2. 其中this指向该弹出层对象
        afterBuild: function(){
            console.log('弹层对象已创建完成');
        },

        // 提交按钮点击回调函数 Function类型 可选项
        // 1. value返回数组形式 数组格式[{ value:'',text:''}] 
        // 2. 当无选中值时点击提交返回空数组
        onSubmit: function(value){
            console.log('提交成功',value)
        },

        // 提交按钮点击后在关闭窗口前调用此函数 Function类型 可选项
        // 1. value返回值和onSubmit一致
        // 2. return false 页面会暂停执行
        beforeSubmit: function(value){
            console.log('提交数据审核',value)
            return true;
        },
        

        // 自定义数据内容 Array类型 可选项
        // 1. 值必须为 [{value: '',text: ''}]
        // 2. value: 数据内容 text：文本显示的值 choose: 默认选中项
        // 3. choose选中项和setValue选中项同时存在 setValue 优先
        // 4. choose默认选中项大于chooseNumbers时 选取前chooseNumber项展示 同 setValue
        data: 
        [
            {
                value1: '弹出层数据1',
                text1: '弹出层数据显示1',
                choose: true
            }, 
            {
                value1: '弹出层数据2',
                text1: '弹出层数据显示2'
            },
            {
                value1: '弹出层数据3',
                text1: '弹出层数据显示3'
            },
            {
                value1: '弹出层数据4',
                text1: '弹出层数据显示4'
            },
            {
                value1: 1,
                text1: '弹出层数据显示5'
            },
            {
                value1: 2,
                text1: '弹出层数据显示6'
            },
            {
                value1: 3,
                text1: '弹出层数据显示7'
            },
            {
                value1: 4,
                text1: '弹出层数据显示8'
            },
            {
                value1: 5,
                text1: '弹出层数据显示9'
            }
        ],

        // 自定义data中的value属性 String属性 可选项
        // 1. 默认为'value'
        // 2. 需跟data中value属性名一致
        valueKey: 'value1',

        // 自定义data中的text属性
        // 1. 默认为'text'
        // 2. 需跟data中text属性名一致
        textKey: 'text1',

        /* 
         *   多选选项 
         */

        // 是否删除上一次选中 Boolean类型 可选项
        // 1. 仅多选生效
        // 2. 默认值为false
        // 3. false时当选中数量大于等于chooseNumber时弹出提示，点击下一个不能选取
        // 4. true时当选中数量大于等于chooseNumber时，可以继续选中，按点击顺序取消一个选中项
        deleteChoise: false, 
        
        // 禁止用户选中提示方法  Function类型 可选项
        // 1. 仅deleteChoise为false生效
        // 2. 默认弹出msg提示
        deleteChoiseAlert: function(){
            alert('最多选择两项')
        },

        // 自定义选择数量 Number类型 整数 可选项
        // 1. 默认值为 1 只可勾选一个值
        chooseNumber: 2,
        /* 
         *   多选选项 
         */

    })








    $('#btn-demo').on('click',function(){
        console.log('弹层将要打开');
        demoLayer.open(function(){
            console.log('弹层已打开');
        });
    });

    $('#btn-demo-option-list').on('click',function(){
        console.log('弹层将要打开');
        optionListLayer.open(function(){
            console.log('弹层已打开');
        });
        console.log( 'getValue',optionListLayer.getValue())
        // optionListLayer.setValue(['弹出层数据3','弹出层数据5'])
    });

});