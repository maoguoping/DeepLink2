class ShowHookPlugin {
    constructor(option) {
        this.option = option
    }
    apply(compiler) {
        if (this.option.done) {
            compiler.hooks.done.tap('ShowHookPlugin', (compilation) => {
                console.log('hook-done:构建成功')
            });
        }
        if (this.option.failed) {
            compiler.hooks.failed.tap('ShowHookPlugin', (compilation) => {
                console.log('hook-failed:构建失败')
            });
        }
    }
}
module.exports = ShowHookPlugin