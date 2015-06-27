

const COLOR_TEMPLATES = {
    bash: function (s: string) { return '\\[\\e' + s + '\\]' },
    zsh:  function (s: string) { return '%{' + s + '%}' },
}

class Shell
{
    name: string
    reset: string
    colorTemplate: (str: string) => string

    constructor (which: string) {
        if (Object.keys(COLOR_TEMPLATES).indexOf(which) === -1) {
            throw new Error(`shell ${which} not supported`)
        }

        this.name = which
        this.colorTemplate = COLOR_TEMPLATES[which]
        this.reset = this.colorTemplate('[0m')
    }

    color (prefix: string, code: string) {
        return this.colorTemplate('[' + prefix + ';5;' + code + 'm')
    }

    fgcolor (code: string) {
        return this.color('38', code)
    }

    bgcolor (code: string) {
        return this.color('48', code)
    }
}

export default Shell