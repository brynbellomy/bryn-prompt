var _ = require('lodash');
var path = require('path');
var chalk = require('chalk');
var path_1 = require('./path');
var options = {
    promptStr: chalk.yellow(' λ '),
};
// const gitOptions: git.IGitOptions = {
//     contractions: {
//         'refs/heads/': '',
//         'git@github.com:': 'gh:',
//         'git://github.com/': 'gh:',
//         'git@bitbucket.org:': 'bb:',
//         'git://bitbucket.org/': 'bb:',
//         'brynbellomy/': '',
//         '.git': '',
//     },
// }
var pathOptions = {
    homeStr: '~',
    separator: chalk.blue(path.sep),
    contractions: {
        'projects': 'p',
        '_clients': '_c',
        'listenonrepeat': 'lor',
    },
};
function render(cols, rows) {
    printPath(cols, rows);
}
exports.render = render;
function printPath(cols, rows) {
    var segments = [];
    var rightSegments = [];
    // left segments
    segments.push(path_1.formatPathParts(pathOptions).join(' '));
    // right segments
    var date = new Date(), y = '' + date.getFullYear(), m = '' + (date.getMonth() + 1), d = '' + date.getDate(), hrs = '' + date.getHours(), mins = '' + date.getMinutes(), secs = '' + date.getSeconds(), unix = '' + date.getTime();
    rightSegments.push(chalk.grey(chalk.white(hrs) + ':' + chalk.white(mins)));
    rightSegments.push('.');
    rightSegments.push(chalk.grey(chalk.blue(y) + '.' + chalk.blue(m) + '.' + chalk.blue(d)));
    rightSegments.push('.');
    rightSegments.push(chalk.grey(unix.toString()));
    // our powers combined
    var renderedSegments = segments.join(' ');
    var renderedRight = ' ' + rightSegments.join(' ');
    var numSpaces = cols - chalk.stripColor(renderedSegments).length - chalk.stripColor(renderedRight).length;
    var spaces = _.repeat(' ', numSpaces);
    // render
    process.stdout.write("\r\n" + renderedSegments + spaces + renderedRight + "\n" + options.promptStr);
}
