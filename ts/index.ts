
import * as _ from 'lodash'
import * as path from 'path'
import * as chalk from 'chalk'
import { formatPathParts, IPathOptions } from './path'
// import * as git from './git'
import * as π from 'pants'


const options = {
    promptStr: chalk.yellow(' λ '),
}

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
    printPath(cols, rows)
}

function printPath (cols: number, rows: number) {
    let segments = []
    let rightSegments = []

    // left segments
    segments.push(formatPathParts(pathOptions).join(' '))

    // right segments

    const date = new Date()
        , y = ''+ date.getFullYear()
        , m = ''+ (date.getMonth() + 1)
        , d = ''+ date.getDate()
        , hrs = ''+ date.getHours()
        , mins = ''+ date.getMinutes()
        , secs = ''+ date.getSeconds()
        , unix = ''+ date.getTime()


    rightSegments.push(chalk.grey(chalk.white(hrs) + ':' + chalk.white(mins)))
    rightSegments.push('.')
    rightSegments.push(chalk.grey(chalk.blue(y) + '.' + chalk.blue(m) + '.' + chalk.blue(d)))
    rightSegments.push('.')
    rightSegments.push(chalk.grey(unix.toString()))

    // our powers combined
    const renderedSegments = segments.join(' ')
    const renderedRight    = ' ' + rightSegments.join(' ')

    const numSpaces = cols - chalk.stripColor(renderedSegments).length - chalk.stripColor(renderedRight).length
    const spaces    = _.repeat(' ', numSpaces)

    // render
    process.stdout.write(`\r\n${renderedSegments}${spaces}${renderedRight}\n${options.promptStr}`)
}





