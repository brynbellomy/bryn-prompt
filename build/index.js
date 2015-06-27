var path = require('path');
var chalk = require('chalk');
var path_1 = require('./path');
var git = require('./git');
var utils = require('./utils');
var options = {
    promptStr: chalk.yellow(' λ'),
};
var gitOptions = {
    contractions: {
        'refs/heads/': '',
    },
};
var pathOptions = {
    homeStr: '~',
    separator: chalk.blue(path.sep),
    contractions: {
        'projects': 'p',
    },
};
function render() {
    git.getCurrentRepoStatus(gitOptions)
        .done(function (repoStatus) { return printPath(repoStatus); }, function (err) { console.error(err); printPath(null); });
}
exports.render = render;
function printPath(repoStatus) {
    var segments = [
        path_1.formatPathParts(pathOptions).join(' ')
    ];
    if (!utils.nullish(repoStatus)) {
        var color = repoStatus.dirty ? chalk.red : chalk.green;
        segments.push('' + color(repoStatus.branch));
    }
    segments.push('\n' + options.promptStr);
    process.stdout.write("\r\n" + segments.join(' ') + "  ");
}
