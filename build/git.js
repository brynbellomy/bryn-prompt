var when = require('when');
var whenNode = require('when/node');
var _ = require('lodash');
var ng = require('nodegit');
var find = require('fs-find-root');
function findRepo(cwd) {
    if (cwd === void 0) { cwd = process.cwd(); }
    return whenNode.lift(find.dir)('.git', cwd);
}
exports.findRepo = findRepo;
function getCurrentRepoStatus(opts, cwd) {
    if (cwd === void 0) { cwd = process.cwd(); }
    return findRepo(cwd).then(function (repoPath) {
        return getRepoStatus(opts, repoPath);
    });
}
exports.getCurrentRepoStatus = getCurrentRepoStatus;
function getRepoStatus(opts, repoPath) {
    return ng.Repository.open(repoPath)
        .then(function (repo) { return when.join(repo.getStatus(), repo.getCurrentBranch()); })
        .then(function (tuple) {
        var statuses = tuple[0], currentBranch = tuple[1];
        return {
            branch: applyBranchNameContractions(currentBranch.toString(), opts.contractions),
            dirty: _.some(statuses, isDirty),
        };
    });
}
exports.getRepoStatus = getRepoStatus;
function applyBranchNameContractions(branchName, contractions) {
    var pairs = _.pairs(contractions);
    return pairs.reduce(function (branch, p) { return branch.replace(p[0], p[1]); }, branchName);
}
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
