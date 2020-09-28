var {resolve}=require('path')

console.log(resolve());


module.exports={
    "wuliu2":{
        pages:['wuliu2-home']
    },
    'wuliu':{//物流详情
        parentDir:'activity/2020',
        pages:['wuliu']
    },
    'fuli':{//物流详情
        parentDir:'activity/2020',
        pages:['task','record']
    },
    'act-tmpl':{
        parentDir:'activity/2020',
        pages:['act-detail','address-edit','gift-detail']
    }
}