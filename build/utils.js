var path = require('path');
var chalk = require('chalk');
function formatPathParts(opts) {
    var pathParts = getPathParts(opts.homeStr);
    return pathParts.ancestors
        .map(shortenDirNames(opts.pathComponentOverrides))
        .concat(pathParts.lastComponents[0])
        .reduce(intersperse(opts.styledSeparator), [])
        .concat(pathParts.lastComponents[1]);
}
exports.formatPathParts = formatPathParts;
function getPathParts(homeStr) {
    var ancestors = process.cwd().replace(process.env['HOME'], homeStr)
        .split(path.sep);
    var lastComponents = [].concat(chalk.blue.bold(ancestors.pop()), chalk.blue(ancestors.pop())).reverse();
    return { ancestors: ancestors, lastComponents: lastComponents };
}
function shortenDirNames(contractionOverrides) {
    return function (dir) {
        if (!nullish(contractionOverrides[dir])) {
            return contractionOverrides[dir];
        }
        var matches = dir.match(/^([_\.]*([a-zA-Z0-9\-\.]{1,3}))/);
        return (matches !== null && matches.length > 0) ? matches[0] : dir;
    };
}
function nullish(val) {
    return val === null || val === undefined;
}
exports.nullish = nullish;
function intersperse(thing) {
    return function (into, each) {
        return into.concat(each, thing);
    };
}
exports.intersperse = intersperse;
function zip(lhs, rhs) {
    return lhs.reduce(function (into, each) {
        into.push([each, rhs.shift()]);
        return into;
    }, []);
}
exports.zip = zip;
function logthru(val) {
    console.log('log: ', val);
    return val;
}
exports.logthru = logthru;
