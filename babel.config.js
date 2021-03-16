
const plugins = [
  [
    "import", 
    { 
      "libraryName": "ant-design-vue",
      "libraryDirectory": "es",
      "style": "css" 
    }
  ], // `style: true` 会加载 less 文件
  "dynamic-import-node",
  "@babel/plugin-transform-runtime"
]
if (process.env.NODE_ENV === 'production') {
  plugins.push(["transform-remove-console", { "exclude": [ "error", "warn", "debug"] }]);
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: plugins
}
