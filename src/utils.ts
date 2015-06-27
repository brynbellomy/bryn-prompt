
import * as path from 'path'
import * as chalk from 'chalk'

export {
    zip,
    intersperse,
    logthru,
    nullish,
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


