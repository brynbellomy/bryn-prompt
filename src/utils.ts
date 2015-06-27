
import * as path from 'path'
import * as chalk from 'chalk'
import * as Shell from './Shell'

export {
    zip,
    formatPathParts,
    intersperse,
    logthru,
    nullish,
}

export interface IFormatPathPartsOptions {
    homeStr:                string
    promptStr:              string
    styledSeparator:        string
    pathComponentOverrides: { [name: string]: string }
}

function formatPathParts (opts: IFormatPathPartsOptions): string[] {
    const pathParts = getPathParts(opts.homeStr)

    return pathParts.ancestors
                .map(shortenDirNames(opts.pathComponentOverrides))
                .concat(pathParts.lastComponents[0])
                .reduce(intersperse(opts.styledSeparator), <string[]>[])
                .concat(pathParts.lastComponents[1])
}

function getPathParts(homeStr: string) {
    const ancestors = process.cwd().replace(process.env['HOME'], homeStr)
                                   .split(path.sep)

    const lastComponents = <string[]> [].concat( chalk.blue.bold(ancestors.pop()), chalk.blue(ancestors.pop()) ).reverse()

    return { ancestors, lastComponents }
}

interface IContractionOverrides {
    [name: string]: string
}

function shortenDirNames (contractionOverrides: IContractionOverrides) {
    return function (dir: string): string {
        if (!nullish(contractionOverrides[ dir ])) {
            return contractionOverrides[ dir ]
        }
        const matches = dir.match(/^([_\.]*([a-zA-Z0-9\-\.]{1,3}))/)
        return (matches !== null && matches.length > 0) ? matches[0] : dir
    }
}

function nullish (val: any) {
    return val === null || val === undefined
}

function intersperse <T> (thing: T) {
    return function (into, each): T[] {
        return into.concat(each, thing)
    }
}

function zip <T, U> (lhs: T[], rhs: U[]) {
    return lhs.reduce(function (into: Array<[T, U]>, each: T) {
        into.push([each, rhs.shift()])
        return into
    }, [])
}

function logthru <T> (val: T): T {
    console.log('log: ', val)
    return val
}


