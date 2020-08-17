'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var commander = require('commander');
var fs = _interopDefault(require('fs'));

function needIgnore(name, ignoreList) {
    var result = false;
    ignoreList.forEach(function (regExp) {
        if (regExp.test(name))
            result = true;
    });
    return result;
}
function dirDFS(path, dirName, ignoreList) {
    var rootStat = fs.statSync(path);
    if (!rootStat.isDirectory()) {
        console.log('"' + path + '" is not directory');
        return null;
    }
    var result = new Object();
    result["name"] = dirName;
    result["type"] = "dir";
    result["childD"] = [];
    result["childF"] = [];
    var files = fs.readdirSync(path);
    files.forEach(function (fileName) {
        var stat = fs.statSync(path + "/" + fileName);
        if (needIgnore(fileName, ignoreList)) ;
        else if (stat.isDirectory()) {
            var dirObj = dirDFS(path + "/" + fileName, fileName, ignoreList);
            result["childD"].push(dirObj);
        }
        else {
            var fileObj = new Object();
            fileObj["name"] = fileName;
            fileObj["type"] = "file";
            result["childF"].push(fileObj);
        }
    });
    return result;
}
function stringifyHelper(type, obj, depth, isEnd) {
    var tmpStr = "";
    if (obj["type"] == "dir") {
        if (type != "simple") {
            for (var i = 1; i <= depth - 1; i++) {
                tmpStr += "  " + (isEnd[i] ? " " : "│");
            }
            tmpStr += "  │\r\n";
        }
        for (var i = 1; i <= depth - 1; i++) {
            tmpStr += "  " + (isEnd[i] ? " " : "│");
        }
        tmpStr += "  " + (isEnd[depth] ? "└─" : "├─");
        tmpStr += obj["name"] + "\r\n";
        var arrLength = obj["childD"].length + obj["childF"].length;
        for (var i = 0; i < obj["childD"].length; i++) {
            isEnd[depth + 1] = --arrLength ? false : true;
            tmpStr += stringifyHelper(type, obj["childD"][i], depth + 1, isEnd);
        }
        for (var i = 0; i < obj["childF"].length; i++) {
            isEnd[depth + 1] = --arrLength ? false : true;
            tmpStr += stringifyHelper(type, obj["childF"][i], depth + 1, isEnd);
        }
    }
    else {
        if (type != "simple") {
            for (var i = 1; i <= depth - 1; i++) {
                tmpStr += "  " + (isEnd[i] ? " " : "│");
            }
            tmpStr += "  │\r\n";
        }
        for (var i = 1; i <= depth - 1; i++) {
            tmpStr += "  " + (isEnd[i] ? " " : "│");
        }
        tmpStr += "  " + (isEnd[depth] ? "└─" : "├─");
        tmpStr += obj["name"] + "\r\n";
    }
    return tmpStr;
}
function stringifyDirTree(dirTree, type) {
    var str = "";
    var depth = 0;
    var arrLength = dirTree["childD"].length + dirTree["childF"].length;
    var isEnd = [true];
    str += dirTree["name"] + "\r\n";
    for (var i = 0; i < dirTree["childD"].length; i++) {
        isEnd[depth + 1] = --arrLength ? false : true;
        str += stringifyHelper(type, dirTree["childD"][i], depth + 1, isEnd);
    }
    for (var i = 0; i < dirTree["childF"].length; i++) {
        isEnd[depth + 1] = --arrLength ? false : true;
        str += stringifyHelper(type, dirTree["childF"][i], depth + 1, isEnd);
    }
    return str;
}
var utils = {
    dirDFS: dirDFS,
    stringifyDirTree: stringifyDirTree,
};
//# sourceMappingURL=index.js.map

var program = new commander.Command();
program.version("0.0.1");
program.command("tree <dir> [type] [ignore...]").action(function (dir, type, ignore) {
    if (type && !/(simple|clear)/g.test(type)) {
        throw new Error("simple,clear");
    }
    var cfg = {
        name: "",
        path: "",
        ignoreList: [/^\./, /node_modules/],
        outputType: type || 'simple',
    };
    if (path.isAbsolute(dir)) {
        cfg.name = path.parse(dir).name;
    }
    else {
        cfg.name = path.parse(path.resolve(process.cwd(), dir)).name;
    }
    cfg.path = dir;
    var jsonObj = utils.dirDFS(cfg.path, cfg.name, cfg.ignoreList);
    var str = utils.stringifyDirTree(jsonObj, cfg.outputType);
    console.log(str);
});
program.parse(process.argv);
