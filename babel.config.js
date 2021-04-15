
const plugins = [
  [
    "import", 
    { 
      "libraryName": "ant-design-vue",
      "libraryDirectory": "es",
      "style": "css" 
    }
  ],
  "@babel/plugin-transform-runtime",
  "@babel/plugin-syntax-dynamic-import"
]
if (process.env.NODE_ENV === 'production') {
  plugins.push(["transform-remove-console", { "exclude": [ "error", "warn", "debug"] }]);
} else {
  plugins.push("dynamic-import-node");
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: plugins
}
