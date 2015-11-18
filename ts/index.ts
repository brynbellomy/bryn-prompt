
import * as _ from 'lodash'
import * as path from 'path'
import * as chalk from 'chalk'
import { formatPathParts, IPathOptions } from './path'
import * as git from './git'
import * as π from 'pants'


const options = {
    promptStr: chalk.yellow(' λ '),
}

const gitOptions: git.IGitOptions = {
    contractions: {
        'refs/heads/': '',
        'git@github.com:': 'gh:',
        'git://github.com/': 'gh:',
        'git@bitbucket.org:': 'bb:',
        'git://bitbucket.org/': 'bb:',
        'brynbellomy/': '',
        '.git': '',
    },
}

const pathOptions: IPathOptions = {
    homeStr: '~',
    separator: chalk.blue(path.sep),
    contractions: {
        'projects': 'p',
        '_clients': '_c',
        'listenonrepeat': 'lor',
    },
}

export function render (cols: number, rows: number) {
    printPath(null, cols, rows)
    // git.getCurrentRepoStatus(gitOptions)
    //    // .done(repoStatus => printPath(repoStatus, cols, rows),
    //    .done(repoStatus => printPath(null, cols, rows),
    //          err        => printPath(null, cols, rows))
}

function printPath (repoStatus: git.IRepoStatus, cols: number, rows: number) {
    let segments = []
    let rightSegments = []

    // left segments
    segments.push(formatPathParts(pathOptions).join(' '))

    if (!π.nullish(repoStatus)) {
        if (!π.nullish(repoStatus.branch)) {
            const color = repoStatus.dirty ? chalk.red : chalk.green
            segments.push(color(repoStatus.branch))
        }
    }

    // right segments
    if (!π.nullish(repoStatus)) {
        if (!π.nullish(repoStatus.origin)) {
            const parts = repoStatus.origin.split(':')
            rightSegments.push(chalk.blue(parts[0], chalk.bold(parts[1])))
        }
    }

    let d = new Date()
    rightSegments.push(chalk.blue(d.toString()))

    // our powers combined
    const renderedSegments = segments.join(' ')
    const renderedRight    = ' ' + rightSegments.join(' ')

    const numSpaces = cols - chalk.stripColor(renderedSegments).length - chalk.stripColor(renderedRight).length
    const spaces    = _.repeat(' ', numSpaces)

    // render
    process.stdout.write(`\r\n${renderedSegments}${spaces}${renderedRight}\n${options.promptStr}`)
}





