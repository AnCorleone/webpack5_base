module.exports = {
  // cacheDirectory: true, // 默认是false
  // cacheCompression: true, // 默认是true,当设置此值时，会使用 Gzip 压缩每个 Babel transform 输出。
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-transform-runtime']
}
