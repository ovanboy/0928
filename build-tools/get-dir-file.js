
let fs = require("fs");
let path = require("path");
let log = (...ar) => { console.log(...ar); }

module.exports = getAllFiles;

function getAllFiles(dir) {
    let res = [];
    let files = fs.readdirSync(dir).filter(f => !/^_/.test(f));
    files.forEach(function (file) {
        let pathname = dir + path.sep + file
            , stat = fs.lstatSync(pathname);

        if (!stat.isDirectory()) {
            res.push(pathname);
        } else {
            res = res.concat(getAllFiles(pathname));
        }
    });
    return res
}

