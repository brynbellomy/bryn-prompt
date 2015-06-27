
import * as when from 'when'
import * as whenNode from 'when/node'
import * as _ from 'lodash'
import ng = require('nodegit')
const find: {
    dir: (needle:string, cwd:string, cb: (err:any, found:string) => void) => void
} = require('fs-find-root')

import * as utils from './utils'


export interface IRepoStatus {
    branch: string;
    dirty: boolean;
}

export function findRepo (cwd: string = process.cwd()) {
    return whenNode.lift(find.dir)('.git', cwd).then(utils.logthru)
}

export function getCurrentRepoStatus (cwd: string = process.cwd()) {
    return findRepo(cwd).then(repoPath => {
        return getRepoStatus(repoPath)
    })
}

export function getRepoStatus (repoPath: string)
{
    return ng.Repository.open(repoPath)
            .then(repo => when.join( repo.getStatus(), repo.getCurrentBranch() ))
            .then((tuple: [ng.Status[], ng.Reference]) => {
                const [statuses, currentBranch] = tuple
                return <IRepoStatus> {
                    branch: currentBranch.toString(),
                    dirty:  _.some(statuses, isDirty),
                }
            })
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