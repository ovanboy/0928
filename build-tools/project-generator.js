let fs = require('fs-extra');
let path = require('path')
let routes =require('../projects.js')
let baseDir = path.resolve(__dirname,'../src')
let fileType = ['pug', 'js', 'scss']

let typeDirPath = {
    pug: 'view',
    js: 'static/script/entry',
    scss: 'static/style'
}
let FileTmpl = {
    pug: './build-tools/template/pug',
    js: './build-tools/template/js',
    scss: './build-tools/template/scss'
}

let project=process.argv[2];
// project='mygift'
if (project && routes[project]) {
    buildProject(project)
} else {
    console.log('无项目路由信息')
}

function buildProject(project) {
    let {pages,parentDir}=routes[project];
    pages.forEach(fileName => {
        fileType.forEach(type => {
            buildFile(project, fileName, type,parentDir)
        })
    })
}


function buildFile(project, fileName, type,parentDir) {
    let relativePath=[parentDir,project,fileName].filter(Boolean).join('/')
    let targetPath = path.resolve(baseDir,typeDirPath[type],parentDir||'',project,fileName+'.'+type);
    let pugData = { jsPath: relativePath, scssPath: relativePath };
    let tmpl = type === 'pug' ? getTemplate(type, pugData) : getTemplate(type);
    
    if (fs.existsSync(targetPath)) {
        console.log(`${relativePath}.${type}已存在`);
    } else {
        fs.outputFile(targetPath, tmpl, 'utf8', function (err) {
            if (err) {
                console.log(`创建${relativePath}.${type}文件失败`);
                console.log(err);
            }else{
                console.log(`${relativePath}.${type} √`)
            }
        });
    }
}



function getTemplate(type, data) {
    let content = fs.readFileSync(FileTmpl[type]).toString('utf-8')
    return data ? dealPug(content, data) : content
}


function dealPug(content, data) {
    var rex = /<%\s*(\w*)\s*%>/g;
    return content.replace(rex, (p, g) => {
        return data[g] || '';
    })
}

