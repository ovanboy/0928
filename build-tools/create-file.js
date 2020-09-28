module.exports=createFile;

function createFile(option) {
    let { src, content, callback, override = false } = option;
    let path = require("path");
    let fs = require("fs");
    let tar = src.split(path.sep);
    let filename = tar.splice(tar.length - 1, 1);
    let isEx = p => fs.existsSync(p);

    console.log('构建路径',src)
    if (!src) {
        console.log('缺少文件路径');
        return;
    }

    if (isEx(src)) {
        override ? fs.writeFile(src, content, 'utf-8', (er) => {
            er ? console.log(`${src},文件生成失败`, er) : (typeof callback === 'function' && callback());
        }) : console.log(`${src} 文件已经存在`);
    } else {
        tar.forEach((s, i) => {
            let tp = tar.slice(0, i + 1).join(path.sep);
			if (tp === '') {
				return;
			}
            isEx(tp) || fs.mkdirSync(tp)
        })
        fs.writeFile(src, content, 'utf-8', callback)
    }


}

