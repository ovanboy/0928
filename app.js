const path = require('path');
const fs = require('fs');
const url = require('url');

const express = require('express');
const pug = require('pug');

const creatFile = require("./build-tools/create-file");


const app = express();

const defaultConfig = require('./config.js');
var customConfig; 
if(app.get('env') === 'development'){
    customConfig = fs.existsSync('./config.dev.js') ? require('./config.dev.js') : {};
}else{
    customConfig = fs.existsSync('./config.prod.js') ? require('./config.prod.js') : {};
}


global.appDir = __dirname;
global.appConfig = app.locals.config = Object.assign({}, defaultConfig, customConfig);


// 模板设置
app.engine('pug', pug.renderFile);
app.set('views', path.resolve(global.appDir, './view'));
app.set('view engine','pug');

// pug配置
app.locals.pretty = '\t'; 
app.locals.basedir = path.resolve(global.appDir, './view');
app.locals.compileDebug = true;
app.locals.cache = false;


// 静态资源
app.use('/favicon.ico', function(req, res, next){
    res.sendFile(path.resolve(global.appDir, './favicon.ico'), { maxAge: '1y' });
});
app.use(global.appConfig.staticPath.replace(/\/$/,''), express.static(path.resolve(global.appDir, './static'), {
    lastModified: false,
    etag: false,
    maxAge: 0
}));

// 其他请求
app.use('/', function(req, res, next){
    let reqPath = decodeURI(url.parse(req.originalUrl).pathname.replace(/^\//,'').replace(/\/$/,''));
    if(/\.json$/i.test(reqPath)){
        // 数据
        let filePath = path.resolve(global.appDir, './data', reqPath);
        if(fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()){
            delete require.cache[require.resolve(filePath)];
            if(req.query.callback){
                res.jsonp(require(filePath));
            }else{
                res.json(require(filePath));
            }
        }else{
            res.json({
                success: false,
                msg: '接口暂未实现'
            });
        }
    }else if(/\.html$/i.test(reqPath)){
        // 页面
        let filePath = path.resolve(global.appDir, './view', reqPath.replace(/\.html$/i,'.pug'));
        if(fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()){
            res.render(filePath, function(err, html){
                if(err){
                    next(err);
                    return;
                }
                res.send(html);
                if(app.get('env') === 'production'){
                    creatFile({
                        src: path.resolve(global.appDir, './html/'+reqPath),
                        content: html,
                        override: true,
                        callback(err){
                            if(err){
                                console.log('写入html文件失败');
                                console.log(err);
                            }
                        }
                    });
                    // fs.writeFile(path.resolve(global.appDir, './html/'+s+'.html'), html, 'utf8', function(err){
                    //     if(err){
                    //         console.log('写入html文件失败');
                    //         console.log(err);
                    //     }
                    // });
                }
            });
        }else{
            next();
        }
    }else{
        // 目录
        let filePath = path.resolve(global.appDir, './view', reqPath);
        if(fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()){
            res.locals.pageData = {};
            res.locals.pageData.directories = reqPath ? reqPath.split('/') : [];
            res.locals.pageData.fileInfoList = require('./modules/catalog.js')(filePath, 1, path.resolve(global.appDir, './view')).sort(function(a,b){
                if(a.isDirectory){
                    if(b.isDirectory){
                        if(a.name > b.name){
                            return 1;
                        }else{
                            return -1;
                        }
                    }else{
                        return -1;
                    }
                }else{
                    if(b.isDirectory){
                        return 1;
                    }else{
                         if(a.name > b.name){
                            return 1;
                        }else{
                            return -1;
                        }
                    }
                }
            }).filter(function(item){
                return !(/^_/.test(item.name) || (!item.isDirectory && !/\.pug$/g.test(item.name)));
            }).map(function(item){
                return {
                    name: item.name,
                    isDirectory: item.isDirectory,
                    url: (function(relativePath, isDirectory){
                        if(isDirectory){
                            return '/' + relativePath.replace(new RegExp('\\'+path.sep,'g'),'/');
                        }else{
                            return '/' + relativePath.replace(new RegExp('\\'+path.sep,'g'),'/').replace(/\.pug$/i,'.html');
                        }
                    })(item.relativePath, item.isDirectory)
                };
            });

            res.render('_index', function(err, html){
                if(err){
                    next(err);
                    return;
                }
                res.send(html);
            });
        }else{
            next();
        }
    }
});


// 错误处理
app.use(function(req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});
app.use(function(err, req, res, next){
	if(err.status === 404){
		res.status(404).render('_404');
	}else{
		res.status(500).render('_500', {
			stack: err.stack
		});
	}
});


// 启动server
app.listen(global.appConfig.port);