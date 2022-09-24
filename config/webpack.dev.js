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
        exclude: /(node_modules)/, // 排除node_modules
        use: {
          loader: 'babel-loader'
          // babel配置文,单独写在babel.config.js文件中
          // options: {
          //   presets: ['@babel/preset-env']
          // }
        }
      }
    ]
  },
  plugins: [
    // eslint 插件,需要配合.eslintrc.js 文件,.eslintignore 忽略文件,vscode eslint插件
    new ESLintPlugin({ context: resolve(__dirname, '../src') }),
    new HtmlWebpackPlugin({
      // 配置要打包的html 文件的位置 ,会自动引入打包需要的资源
      template: path.resolve(__dirname, '../public/index.html')
    })
  ],
  mode: 'development',
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true
  }
}
