
import * as path from 'path'
import * as chalk from 'chalk'
import * as π from 'pants'

export {
    formatPathParts,
}

export interface IPathOptions {
    homeStr:      string
    separator:    string
    contractions: { [name: string]: string }
}

function formatPathParts (opts: IPathOptions): string[] {
    const pathParts = getPathParts(opts.homeStr)

    return pathParts.ancestors
                .map(shortenDirNames(opts.contractions))
                .concat(pathParts.lastComponents[0])
                .reduce(π.intersperse(opts.separator), [] as string[])
                .concat(pathParts.lastComponents[1])
}

function getPathParts(homeStr: string) {
    const ancestors = process.cwd().replace(process.env['HOME'], homeStr)
                                   .split(path.sep)

    const lastComponents = [].concat( chalk.blue.bold(ancestors.pop()), chalk.blue(ancestors.pop()) ).reverse() as string[]

    return { ancestors, lastComponents }
}

export interface IContractionOverrides {
    [name: string]: string
}

function shortenDirNames (contractionOverrides: IContractionOverrides) {
    return function (dir: string): string {
        if (!π.nullish(contractionOverrides[ dir ])) {
            return contractionOverrides[ dir ]
        }
        const matches = dir.match(/^([_\.]*([a-zA-Z0-9\-\.]{1,3}))/)
        return (matches !== null && matches.length > 0) ? matches[0] : dir
    }
}


