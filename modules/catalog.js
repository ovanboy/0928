const path = require('path');
const fs = require('fs');

module.exports = function(dir, depth, base){
    function readDir(directory, depth, base){
        var list = [];
        fs.readdirSync(directory).forEach(function(name, index){
            let fileName = name;
            let filePath = path.resolve(directory, name);
            let relativePath = path.relative(base, filePath);
            let isDirectory = fs.lstatSync(path.resolve(directory, name)).isDirectory();
            if(isDirectory && depth-1 >= 0){
                subs = readDir(filePath, depth-1, base);
            }else{
                subs = null;
            }
            list.push({
                name: fileName,
                path: filePath,
                relativePath: relativePath,
                isDirectory: isDirectory,
                subs: subs
            });
        });
        return list;
    }

    if(typeof dir === 'string'){
        if(path.isAbsolute(dir)){
            dir = dir;
        }else{
            dir = path.resolve(process.cwd(), dir);
        }
    }else{
        dir = process.cwd();
    }
    if(!fs.existsSync(dir)){
        return null;
    }
    if(!fs.lstatSync(dir).isDirectory()){
        return null;
    }

    depth = typeof depth === 'number' ? Math.floor(Math.abs(depth)) : Infinity;

    if(typeof base === 'string'){
        if(path.isAbsolute(base)){
            base = base;
        }else{
            base = path.resolve(process.cwd(), base);
        }
    }
    base = fs.existsSync(base) && fs.lstatSync(base).isDirectory() ? base : process.cwd();

    return depth-1 >= 0 ? readDir(dir, depth-1, base) : null;
};