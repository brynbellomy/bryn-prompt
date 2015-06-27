
import * as path from 'path'
import * as chalk from 'chalk'
import { formatPathParts, IFormatPathPartsOptions } from './utils'
import * as git from './git'
import * as utils from './utils'


const options: IFormatPathPartsOptions = {
    homeStr:         '~',
    promptStr:       <string><any>chalk.yellow(' λ'),
    styledSeparator: <string><any>chalk.blue(path.sep),
    pathComponentOverrides: {
        'projects': 'p'
    },
}


export function render () {
    git.getCurrentRepoStatus()
       .done(repoStatus => printPath(repoStatus),
             err        => { console.error(err); printPath(null) })
}

function printPath (repoStatus: git.IRepoStatus) {
    let segments = [
        formatPathParts(options).join(' ')
    ]

    if (!utils.nullish(repoStatus)) {
        const color = repoStatus.dirty ? chalk.red : chalk.green
        segments.push('' + <any>color(repoStatus.branch))
    }

    segments.push('\n' + options.promptStr)

    process.stdout.write(`\r\n${segments.join(' ')}  `)
}





