var COLOR_TEMPLATES = {
    bash: function (s) { return '\\[\\e' + s + '\\]'; },
    zsh: function (s) { return '%{' + s + '%}'; },
};
var Shell = (function () {
    function Shell(which) {
        if (Object.keys(COLOR_TEMPLATES).indexOf(which) === -1) {
            throw new Error("shell " + which + " not supported");
        }
        this.name = which;
        this.colorTemplate = COLOR_TEMPLATES[which];
        this.reset = this.colorTemplate('[0m');
    }
    Shell.prototype.color = function (prefix, code) {
        return this.colorTemplate('[' + prefix + ';5;' + code + 'm');
    };
    Shell.prototype.fgcolor = function (code) {
        return this.color('38', code);
    };
    Shell.prototype.bgcolor = function (code) {
        return this.color('48', code);
    };
    return Shell;
})();
exports.default = Shell;
