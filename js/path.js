var path = require('path');
var chalk = require('chalk');
var π = require('pants');
function formatPathParts(opts) {
    var pathParts = getPathParts(opts.homeStr);
    return pathParts.ancestors
        .map(shortenDirNames(opts.contractions))
        .concat(pathParts.lastComponents[0])
        .reduce(π.intersperse(opts.separator), [])
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
        if (!π.nullish(contractionOverrides[dir])) {
            return contractionOverrides[dir];
        }
        var matches = dir.match(/^([_\.]*([a-zA-Z0-9\-\.]{1,3}))/);
        return (matches !== null && matches.length > 0) ? matches[0] : dir;
    };
}
