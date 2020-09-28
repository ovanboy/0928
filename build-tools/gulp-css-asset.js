const path = require('path');
const fs = require('fs');
const url = require('url');

const File = require('vinyl');
const through = require('through2');
const Spritesmith = require('spritesmith');
const colors = require('colors');
const flog = require('fancy-log');
const bl = require('bl');
const mime = require('mime');

// 插件名称
const PLUGIN_NAME = 'gulp-css-asset';


// 消息处理
const msg = (function(){
    let text = {
        'info': '[' + colors.green('info') + ']',
        'error': '[' + colors.red('error') + ']',
        'warn': '[' + colors.yellow('warning') + ']',
    };
    let _msg = function(args, type){
        args.unshift(text[type]);
        args.unshift('[' + colors.green(PLUGIN_NAME) + ']');
        flog[type](...args);
    };
    return {
        info: function(){
            _msg(Array.prototype.slice.call(arguments), 'info');
        },
        err: function(){
            _msg(Array.prototype.slice.call(arguments), 'error');
        },
        warn: function(){
            _msg(Array.prototype.slice.call(arguments), 'warn');
        }
    }
})();


// 根据文件路径得到最终URL
function getUrlFormPath(filePath, opts){
    return url.resolve(opts.staticPath, path.relative(path.resolve(opts.cwd, opts.base), filePath).replace(/\\/g,'/'));
}


// 根据css文件收集其引用的资源文件的信息，并统一css中的引用路径以方便后续替换操作
function collectInfo(cssFile, cssFiles, assetPaths, opts){
    let newContent = cssFile.contents.toString().replace(
        /\burl\(\s*(['"]?)\s*(([\:\.\w\/\-@]+)(\?[\w%&\=\-]*)?(#[\w]*)?)\s*\1\s*\)/ig,
        function(
            matchedStr,
            qoute,
            fullUrl,
            baseUrl,
            search,
            hash,
            index,
            fileContent
        ){
            let assetPath;
            let finalUrl;

            let searchStr = search || '';
            let hashStr = hash || '';

            // base64 编码资源 （因为正则限制，实际进不了这个判断）
            if(/^data\:/.test(fullUrl)){
                msg.info('跳过base64编码资源: '+ fullUrl);
                return 'url("'+ fullUrl +'")';
            }

            // 网络资源
            if(/^(https?\:)?\/\//.test(fullUrl)){
                msg.info('跳过网络资源: '+ fullUrl);
                return 'url("'+ fullUrl +'")';
            }

            if(/^\//.test(fullUrl)){
                assetPath = path.resolve(opts.cwd, opts.rootPath, baseUrl.replace(/^\//,''));
                finalUrl = url.resolve(opts.staticPath, baseUrl.replace(/^\//,''));
            }else{
                assetPath = path.resolve(cssFile.dirname, baseUrl);
                finalUrl = getUrlFormPath(assetPath, opts);
            }

            if(fs.existsSync(assetPath)){
                if(/\.css$/i.test(assetPath)){
                    msg.warn('跳过导入的css资源: '+ assetPath); //例如： @import url(...);
                }else{
                    assetPaths.includes(assetPath) || assetPaths.push(assetPath);
                }
                return 'url("'+ finalUrl + searchStr + hashStr +'")';
            }else{
                msg.err('引用资源不存在: ' + fullUrl + ' (引用位置：'+ cssFile.path +')');
                return 'url("'+ fullUrl +'")';
            }
        }
    );

    cssFile.contents = Buffer.from(newContent);
    cssFiles.push(cssFile);
}


// 根据资源路径和相关配置生成处理信息  
function createBuildInfo(assetPaths, opts){
    let buildInfos = [];

    assetPaths.forEach(function(assetPath, index){

        if(typeof opts.base64 === 'function' ? !!opts.base64(assetPath) : !!opts.base64){
            buildInfos.push({
                type: 'base64',
                path: assetPath
            });
        }else if(['.png','.jpg','.gif'].includes(path.extname(assetPath).toLowerCase())){

            let sprite = '';
            if(typeof opts.sprite === 'function'){
                sprite = opts.sprite(assetPath)
            }else if(typeof opts.sprite === 'string'){
                sprite = opts.sprite;
            }
            if(sprite !== ''){
                let spritePath = path.resolve(opts.cwd, opts.base, sprite);
                let spriteUrl = url.resolve(opts.staticPath, sprite);
                let exists = false;
                buildInfos.forEach(function(info, index){
                    if(info.path === spritePath){
                        info.images.push(assetPath);
                        exists = true;
                    }
                });
                if(!exists){
                    buildInfos.push({
                        type: 'sprite',
                        path: spritePath,
                        url: spriteUrl,
                        images: [assetPath]
                    })
                }
            }else{
                buildInfos.push({
                    type: 'none',
                    path: assetPath
                });
            }
        }else{
            buildInfos.push({
                type: 'none',
                path: assetPath
            });
        }
    });

    return buildInfos;
}


// 根据处理信息生成替换信息以及处理资源文件
function build(buildInfos, opts){
    let pList = [];
    let updateInfos = [];
    let assetFiles = [];

    buildInfos.forEach(function(info, index){
        if(info.type === 'base64'){
            // 执行base64编码
            let mimeType = mime.lookup(info.path);
            let f = function(resolve, reject){
                fs.createReadStream(info.path).pipe(bl(function(err, data){
                    if(err){
                        msg.err('base64编码错误: '+ info.path);
                        reject(err);
                        return;
                    }
                    updateInfos.push({
                        type: 'base64',
                        target: getUrlFormPath(info.path, opts),
                        base64: 'data:' + (mimeType ? mimeType + ';' : '') + 'base64,' + data.toString('base64')
                    });
                    resolve();
                }));
            };
            pList.push(new Promise(f));
        }else if(info.type === 'sprite'){
            // 执行图片合并
            let spritesmith = new Spritesmith();
            let f = function(resolve, reject){
                spritesmith.createImages(info.images, function(err, images){
                    if(err){
                        msg.err('图片合并发生错误: '+ info.path);
                        reject(err);
                        return;
                    }
                    //console.log(images);
                    let result = spritesmith.processImages(images, {
                        padding: 0,//
                        //exportOpts: {},
                        algorithm: 'binary-tree', //排列算法
                        //algorithmOpts: {},//算法选项
                    });
                    result.image.pipe(bl(function(err, data){
                        if(err){
                            msg.err('合并图片读取错误: '+ info.path);
                            reject(err);
                            return;
                        }
                        let assetFile = new File({
                            cwd: opts.cwd,
                            base: opts.base,
                            path: info.path,
                            contents: data
                        });
                        assetFiles.push(assetFile);
                        let spriteUrl = getUrlFormPath(info.path, opts);
                        info.images.forEach(function(imagePath, index){
                            updateInfos.push({
                                type: 'sprite',
                                target: getUrlFormPath(imagePath, opts),
                                sprite: spriteUrl,
                                x: result.coordinates[imagePath].x,
                                y: result.coordinates[imagePath].y,
                                width: result.coordinates[imagePath].width,
                                height: result.coordinates[imagePath].height,
                                // spriteWidth: result.properties.width,
                                // spriteHeight: result.properties.height
                            });
                        });
                        resolve();
                    }));
                });
            };
            pList.push(new Promise(f));
        }else{
            // 不处理
            let f = function(resolve, reject){
                fs.createReadStream(info.path).pipe(bl(function(err, data){
                    if(err){
                        msg.err('文件处理错误: '+ info.path);
                        reject(err);
                        return;
                    }
                    let assetFile = new File({
                        cwd: opts.cwd,
                        base: opts.base,
                        path: info.path,
                        contents: data,
                    });
                    assetFiles.push(assetFile);
                    resolve();
                }));
            };
            pList.push(new Promise(f));
        }
    });

    return Promise.all(pList).then(function(){
        return {
            updateInfos: updateInfos,
            assetFiles: assetFiles
        };
    });
}


// 根据替换信息更新css文件
function updateCss(cssFiles, updateInfos, opts){
    let tabStr = (function(){
        let str= opts.tabSize === 0 ? '\t' : '';
        for(let i=0;i<opts.tabSize;i++){
            str = str + ' ';
        }
        return str;
    })();
    cssFiles.forEach(function(cssFile, index){
        var content = cssFile.contents.toString();
        updateInfos.forEach(function(updateInfo){
            var reg;
            if(updateInfo.type === 'sprite'){
                // reg = new RegExp('background-image\\s*:\\s*url\\(\\s*(["\']?)\\s*'+ updateInfo.matchedStr.replace(/[|\\/{}()\[\]^$+*?.]/g, '\\$&') +'\\s*\\1\\s*\\)\\s*\\;','ig');
                // reg = new RegExp('(background(\\-image)?\\s*\\:\\s*.*?url\\(")'+ updateInfo.target.replace(/[|\\/{}()\[\]^$+*?.]/g,'\\$&') +'((\\?[\\w%&\\=\\-]*)?(#[\\w]*)?"\\)\\s*?.*?;)', 'ig');
                reg = new RegExp('(background(\\-image)?\\s*\\:.*?url\\(")'+ updateInfo.target.replace(/[|\\/{}()\[\]^$+*?.]/g,'\\$&') +'((\\?[\\w%&\\=\\-]*)?(#[\\w]*)?"\\).*?;)', 'ig');
                content = content.replace(reg, function(matchedStr, prefix, imagesuffix, suffix, search, hash, index, cssContent){
                    return prefix + updateInfo.sprite + suffix +'\n'+ tabStr +'background-position: -'+ updateInfo.x + 'px -'+ updateInfo.y +'px;';
                });
            }else if(updateInfo.type === 'base64'){
                // /\burl\(['"]?(((https?\:\/\/)?[\.\/\w\-]+)(\?[\w%\-&=]*?)?)['"]?\)/ig,
                // reg = new RegExp('\\burl\\(\\s*(["\']?)\\s*'+ updateInfo.matchedStr.replace(/[|\\/{}()\[\]^$+*?.]/g, '\\$&') +'\\s*\\1\\s*\\)','ig');

                // reg = new RegExp('\\burl\\("'+ updateInfo.target.replace(/[|\\/{}()\[\]^$+*?.]/g,'\\$&') +'"\\)', 'ig');
                // content = content.replace(reg, 'url("'+ updateInfo.base64 +'")');

                reg = new RegExp('\\burl\\("'+ updateInfo.target.replace(/[|\\/{}()\[\]^$+*?.]/g,'\\$&') +'(\\?[\\w%&\\=\\-]*)?(#[\\w]*)?"\\)', 'ig');
                content = content.replace(reg, function(matchedStr, search, hash, index, cssContent){
                    return 'url("'+ updateInfo.base64 + '")'; // base64转码后无法保留 search 和 hash
                });
            }
        });
        cssFile.contents = Buffer.from(content);
    });
    return cssFiles;
}



// 根据css文件收集其引用的资源文件的信息，并统一css中的引用路径以方便后续替换操作
function changeToRelative(cssFile, opts){
    let newContent = cssFile.contents.toString().replace(
        /\burl\(\s*(['"]?)\s*((\/@\/[\:\.\w\/\-@]+)(\?[\w%&\=\-]*)?(#[\w]*)?)\s*\1\s*\)/ig,
        function(
            matchedStr,
            qoute,
            fullUrl,
            baseUrl,
            search,
            hash,
            index,
            fileContent
        ){
            let assetRelativePath;
            let assetPath;
            let assetRelativeURL;

            let searchStr = search || '';
            let hashStr = hash || '';

            assetRelativePath = path.relative(opts.staticPath, baseUrl);
            assetPath = path.resolve(opts.cwd, opts.base, assetRelativePath);
            assetRelativeURL = path.relative(cssFile.dirname, assetPath).replace(/\\/g,'/');
            return 'url("'+ assetRelativeURL + searchStr + hashStr +'")';
        }
    );
    cssFile.contents = Buffer.from(newContent);
}


module.exports = function(options){
    'use strict';

    // 配置信息
    let opts = Object.assign({}, {
        sprite: '',
        base64: false,
        staticPath: '/',
        relative: false,
        tabSize: 0
    }, options);
    // 当设置为相对路径时，指定的
    if(opts.relative){
        opts.staticPath = '/@/';
    }

    // 用于收集所有的css文件
    let cssFiles = [];

    // 用于收集所有css文件中引用的非css资源的路径
    let assetPaths = []; 


    function transform(file, encoding, callback){
        let _this = this;

        opts.cwd = opts.cwd || file.cwd;
        opts.base = opts.base || file.base;
        opts.rootPath = opts.rootPath || file.base;

        // 空文件直接通过
        if (file.isNull()) {
            msg.warn('空文件跳过处理:'+ file.path);
            this.push(file);
            return callback();
        }

        // 非css文件
        if(file.extname.toLowerCase() !== '.css'){
            // new Error('文件"'+ file.path +'"不是css文件')
            msg.warn('非CSS文件跳过处理:'+ file.path);
            this.push(file);
            return callback();
        }

        // stream 类型处理
        if (file.isStream()) {
            // new Error(PLUGIN_NAME + ': 不支持 stream 类型')
            msg.warn('stream类型文件跳过处理:'+ file.path);
            this.push(file);
            return callback();
        }

        // 根据css文件收集相关信息并存入对应的容器中
        collectInfo(file, cssFiles, assetPaths, opts);

        callback();
    }

    function flush (callback){
        let _this = this;

        //console.log(cssFiles);
        //console.log(assetPaths); // 查看所有引用资源

        // 根据资源路径和配置信息生成处理信息
        let buildInfos = createBuildInfo(assetPaths, opts); 

        // 根据处理信息执行相关处理并生成替换信息和构建后的资源文件
        build(buildInfos, opts)
        .then(function(result){
            // 将构建后的资源文件加入管道
            result.assetFiles.forEach(function(assetFile){
                _this.push(assetFile);
            });
            // 根据替换信息更新css文件
            return updateCss(cssFiles, result.updateInfos, opts);
        })
        .then(function(updatedCssFiles){
            // 将更新后的css文件放入管道
            updatedCssFiles.forEach(function(cssFile){
                if(opts.relative){
                    // 如果 需要调整为相对路径，将引用路径更改为相对路径
                    changeToRelative(cssFile, opts);
                }
                _this.push(cssFile);
            });
        })

        // 回调处理
        .then(function(){
            callback();
        })
        .catch(function(err){
            callback(err)
        });
    }

    return through.obj(transform, flush);
};
