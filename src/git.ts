
import * as assert from 'assert'
import * as when from 'when'
import * as whenNode from 'when/node'
import * as _ from 'lodash'
import ng = require('nodegit')
const find: {
    dir: (needle:string, cwd:string, cb: (err:any, found:string) => void) => void
} = require('fs-find-root')

import * as π from 'pan.ts'


export interface IRepoStatus {
    branch: string;
    dirty: boolean;
    origin: string;
}

export function findRepo (cwd: string = process.cwd()) {
    assert(!π.nullish(cwd))
    return whenNode.lift(find.dir)('.git', cwd)
}

export interface IGitOptions {
    contractions: { [name: string]: string }
}

export function getCurrentRepoStatus (opts: IGitOptions, cwd: string = process.cwd()) {
    return findRepo(cwd).then(repoPath => {
        return getRepoStatus(opts, repoPath)
    })
}

export function getRepoStatus (opts: IGitOptions, repoPath: string)
{
    return ng.Repository.open(repoPath)
                .then(repo => when.join(
                    repo.getStatus().catch(_ => null),
                    repo.getCurrentBranch().catch(_ => null),
                    repo.getRemote('origin').catch(_ => null)
                ))
                .then((tuple: [ng.Status[], ng.Reference, ng.Remote]) => {
                    const [statuses, currentBranch, origin] = tuple

                    return <IRepoStatus> {
                        branch: !!currentBranch ? applyContractions(currentBranch.toString(), opts.contractions) : null,
                        dirty:  !!statuses      ? _.some(statuses, isDirty) : null,
                        origin: !!origin        ? applyContractions(origin.url(), opts.contractions) : null,
                    }
                })
                .catch(err => {
                    return {branch: null, dirty: null, origin: null}
                })
}

function applyContractions (str: string, contractions: {[name: string]: string}) {
    const pairs = < [string, string][] > _.pairs(contractions)
    return pairs.reduce((branch, p) => branch.replace(p[0], p[1]), str)
}

export function isDirty (status: ng.Status) {
    return status.isModified() || status.isNew() || status.isRenamed() || status.isTypechange()
}



export function statusToText (status: ng.Status) {
    const words: string[] = []
    if (status.isNew()) { words.push('NEW') }
    if (status.isModified()) { words.push('MODIFIED') }
    if (status.isTypechange()) { words.push('TYPECHANGE') }
    if (status.isRenamed()) { words.push('RENAMED') }
    if (status.isIgnored()) { words.push('IGNORED') }

    return words.join(' ')
}