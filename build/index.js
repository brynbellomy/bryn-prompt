var path = require('path');
var chalk = require('chalk');
var utils_1 = require('./utils');
var git = require('./git');
var utils = require('./utils');
var options = {
    homeStr: '~',
    promptStr: chalk.yellow(' λ'),
    styledSeparator: chalk.blue(path.sep),
    pathComponentOverrides: {
        'projects': 'p'
    },
};
function render() {
    git.getCurrentRepoStatus()
        .done(function (repoStatus) { return printPath(repoStatus); }, function (err) { console.error(err); printPath(null); });
}
exports.render = render;
function printPath(repoStatus) {
    var segments = [
        utils_1.formatPathParts(options).join(' ')
    ];
    if (!utils.nullish(repoStatus)) {
        var color = repoStatus.dirty ? chalk.red : chalk.green;
        segments.push('' + color(repoStatus.branch));
    }
    segments.push('\n' + options.promptStr);
    process.stdout.write("\r\n" + segments.join(' ') + "  ");
}
