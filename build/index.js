///<reference path='all-typings.d.ts' />
var _ = require('lodash');
var path = require('path');
var chalk = require('chalk');
var path_1 = require('./path');
var git = require('./git');
var π = require('pan.ts');
var options = {
    promptStr: chalk.yellow(' λ '),
};
var gitOptions = {
    contractions: {
        'refs/heads/': '',
        'git@github.com:': 'gh:',
        'git://github.com/': 'gh:',
        'git@bitbucket.org:': 'bb:',
        'git://bitbucket.org/': 'bb:',
        'brynbellomy/': '',
        '.git': '',
    },
};
var pathOptions = {
    homeStr: '~',
    separator: chalk.blue(path.sep),
    contractions: {
        'projects': 'p',
    },
};
function render(cols, rows) {
    git.getCurrentRepoStatus(gitOptions)
        .done(function (repoStatus) { return printPath(repoStatus, cols, rows); }, function (err) { return printPath(null, cols, rows); });
}
exports.render = render;
function printPath(repoStatus, cols, rows) {
    var segments = [];
    var rightSegments = [];
    segments.push(path_1.formatPathParts(pathOptions).join(' '));
    if (!π.nullish(repoStatus)) {
        if (!π.nullish(repoStatus.branch)) {
            var color = repoStatus.dirty ? chalk.red : chalk.green;
            segments.push(color(repoStatus.branch));
        }
    }
    if (!π.nullish(repoStatus)) {
        if (!π.nullish(repoStatus.origin)) {
            var parts = repoStatus.origin.split(':');
            rightSegments.push(chalk.blue(parts[0], chalk.bold(parts[1])));
        }
    }
    var renderedSegments = segments.join(' ');
    var renderedRight = ' ' + rightSegments.join(' ');
    var numSpaces = cols - chalk.stripColor(renderedSegments).length - chalk.stripColor(renderedRight).length;
    var spaces = _.repeat(' ', numSpaces);
    process.stdout.write("\r\n" + renderedSegments + spaces + renderedRight + "\n" + options.promptStr);
}
