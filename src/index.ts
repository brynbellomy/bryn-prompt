
import * as path from 'path'
import * as chalk from 'chalk'
import { formatPathParts, IPathOptions } from './path'
import * as git from './git'
import * as utils from './utils'


const options = {
    promptStr: chalk.yellow(' λ'),
}

const gitOptions: git.IGitOptions = {
    contractions: {
        'refs/heads/': '',
    },
}

const pathOptions: IPathOptions = {
    homeStr: '~',
    separator: chalk.blue(path.sep),
    contractions: {
        'projects': 'p',
    },
}

export function render () {
    git.getCurrentRepoStatus(gitOptions)
       .done(repoStatus => printPath(repoStatus),
             err        => { console.error(err); printPath(null) })
}

function printPath (repoStatus: git.IRepoStatus) {
    let segments = [
        formatPathParts(pathOptions).join(' ')
    ]

    if (!utils.nullish(repoStatus)) {
        const color = repoStatus.dirty ? chalk.red : chalk.green
        segments.push('' + <any>color(repoStatus.branch))
    }

    segments.push('\n' + options.promptStr)

    process.stdout.write(`\r\n${segments.join(' ')}  `)
}





