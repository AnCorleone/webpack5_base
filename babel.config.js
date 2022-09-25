module.exports = {
  // cacheDirectory: true, // 默认是false
  // cacheCompression: true, // 默认是true,当设置此值时，会使用 Gzip 压缩每个 Babel transform 输出。
  presets: ['@babel/preset-env'], // 智能预设,能够编译ES语法
  presets: [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage", // usage|entry , 按需要加载自动引入
        "corejs": "3.22"
      }
    ]
  ],
  plugins: ['@babel/plugin-transform-runtime']
}
