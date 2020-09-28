
let fs = require("fs");
let path = require("path");
let resolve = path.resolve;
let log = (...ar) => { console.log(...ar); }
let viewBase = resolve(__dirname, '../src/view')

module.exports=getProjectLink;
// log(getProjectLink('orc'))

function getProjectLink(project,prefix='http://localhost') {
    let target = resolve(viewBase, project);
    return getAllFiles(target).map(f => {
        return prefix+f.replace(viewBase, '').replace('\\', '/').replace(/\.pug$/, '')
    })
}
function getAllFiles(root) {
    let res = [], files = fs.readdirSync(root).filter(f => !/^_/.test(f));
    files.forEach(function (file) {
        let pathname = root + '/' + file
            , stat = fs.lstatSync(pathname);

        if (!stat.isDirectory()) {
            res.push(pathname);
        } else {
            res = res.concat(getAllFiles(pathname));
        }
    });
    return res
}

