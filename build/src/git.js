var assert = require('assert');
var when = require('when');
var whenNode = require('when/node');
var _ = require('lodash');
var ng = require('nodegit');
var find = require('fs-find-root');
var π = require('pan.ts/ts');
function findRepo(cwd) {
    if (cwd === void 0) { cwd = process.cwd(); }
    assert(!π.nullish(cwd));
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
        .then(function (repo) { return when.join(repo.getStatus().catch(function (_) { return null; }), repo.getCurrentBranch().catch(function (_) { return null; }), repo.getRemote('origin').catch(function (_) { return null; })); })
        .then(function (tuple) {
        var statuses = tuple[0], currentBranch = tuple[1], origin = tuple[2];
        return {
            branch: !!currentBranch ? applyContractions(currentBranch.toString(), opts.contractions) : null,
            dirty: !!statuses ? _.some(statuses, isDirty) : null,
            origin: !!origin ? applyContractions(origin.url(), opts.contractions) : null,
        };
    })
        .catch(function (err) {
        return { branch: null, dirty: null, origin: null };
    });
}
exports.getRepoStatus = getRepoStatus;
function applyContractions(str, contractions) {
    var pairs = _.pairs(contractions);
    return pairs.reduce(function (branch, p) { return branch.replace(p[0], p[1]); }, str);
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
