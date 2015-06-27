var when = require('when');
var whenNode = require('when/node');
var _ = require('lodash');
var ng = require('nodegit');
var find = require('fs-find-root');
var utils = require('./utils');
function findRepo(cwd) {
    if (cwd === void 0) { cwd = process.cwd(); }
    return whenNode.lift(find.dir)('.git', cwd).then(utils.logthru);
}
exports.findRepo = findRepo;
function getCurrentRepoStatus(cwd) {
    if (cwd === void 0) { cwd = process.cwd(); }
    return findRepo(cwd).then(function (repoPath) {
        return getRepoStatus(repoPath);
    });
}
exports.getCurrentRepoStatus = getCurrentRepoStatus;
function getRepoStatus(repoPath) {
    return ng.Repository.open(repoPath)
        .then(function (repo) { return when.join(repo.getStatus(), repo.getCurrentBranch()); })
        .then(function (tuple) {
        var statuses = tuple[0], currentBranch = tuple[1];
        return {
            branch: currentBranch.toString(),
            dirty: _.some(statuses, isDirty),
        };
    });
}
exports.getRepoStatus = getRepoStatus;
function isDirty(status) {
    return status.isModified() || status.isNew() || status.isRenamed() || status.isTypechange();
}
exports.isDirty = isDirty;
function statusToText(status) {
    var words = [];
    if (status.isNew()) {
        words.push('NEW');
    }
    if (status.isModified()) {
        words.push('MODIFIED');
    }
    if (status.isTypechange()) {
        words.push('TYPECHANGE');
    }
    if (status.isRenamed()) {
        words.push('RENAMED');
    }
    if (status.isIgnored()) {
        words.push('IGNORED');
    }
    return words.join(' ');
}
exports.statusToText = statusToText;
