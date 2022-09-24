const { resolve } = require('path')
const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const cssLoader = ['style-loader', 'css-loader']
module.exports = {

  entry: './main.js',
  output: {
    filename: 'js/main.js',
    path: undefined
  },
  // loader 配置
  module: {
    rules: [
      {
        oneOf: [
          { test: /\.css$/, use: cssLoader },
          { test: /\.less$/, use: [...cssLoader, 'less-loader'] },
          { test: /\.s[ac]ss$/, use: [...cssLoader, 'sass-loader'] },
          { test: /\.stylus$/, use: [...cssLoader, 'stylus-loader'] },
          // 图片资源处理
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: 'asset',
            // 各种图片资源/base64图片,处理
            parser: { dataUrlCondition: { maxSize: 4 * 1024 }},
            generator: {
              filename: 'static/images/[hash:10][ext][query]'
            }
          },
          // iconfont 字体图标/音视频 处理
          {
            test: /\.(ttf|woff|woff2|mp3|mp4|avi)$/,
            type: 'asset/resource',
            generator: {
              filename: 'static/media/[hash:10][ext][query]'
            }
          },
          // babel 配置
          {
            test: /\.js$/,
            // exclude: /(node_modules)/, // 排除node_modules,
            include: resolve(__dirname, '../src'),
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true, // 默认是false
                cacheCompression: true // 默认是true,当设置此值时，会使用 Gzip 压缩每个 Babel transform 输出。
              }
              // babel配置文,单独写在babel.config.js文件中
              // options: {
              //   presets: ['@babel/preset-env']
              // }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // eslint 插件,需要配合.eslintrc.js 文件,.eslintignore 忽略文件,vscode eslint插件
    new ESLintPlugin(
      {
        context: resolve(__dirname, '../src'),
        exclude: 'node_modules', // 默认值
        cache: true, // 开启缓存
        cacheLocation: resolve(__dirname, 'node_modules/.cache/eslintCache')
      }
    ),
    new HtmlWebpackPlugin({
      // 配置要打包的html 文件的位置 ,会自动引入打包需要的资源
      template: path.resolve(__dirname, '../public/index.html')
    })
  ],
  mode: 'development',
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true,
    hot: true // 默认为true 热模块替换,只能用于dev,代码发生改变只有更新某个模块,不会全部更新,js文件需要每个文件单独处理,vue,react 有单独的loader处理
  },
  //  源码和编译后的代码映射关系,方便调试,定位错误
  devtool: 'cheap-module-source-map'
}
