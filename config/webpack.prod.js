const { resolve } = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
function getStyleLoader(pre) {
  return [
    // 不同于dev,prod使用 ‘MiniCssExtractPlugin.loader’,会将css提取为单独的文件,并将多个css文件单独提取为一个文件
    MiniCssExtractPlugin.loader,
    'css-loader',
    //  css 兼容处理 , 还需要在package.json 中配置browserslist
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            ['postcss-preset-env'] // 能处理大部分兼容问题
          ]
        }
      }
    },
    pre
  ].filter(Boolean)
}

module.exports = {

  entry: './main.js',
  output: {
    filename: 'js/main.js',
    path: resolve(__dirname, '../dist'),
    clean: true
  },
  // loader 配置
  module: {
    rules: [

      { test: /\.css$/, use: getStyleLoader() },
      { test: /\.less$/, use: getStyleLoader('less-loader') },
      { test: /\.s[ac]ss$/, use: getStyleLoader('sass-loader') },
      { test: /\.stylus$/, use: getStyleLoader('stylus-loader') },
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
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin()
    ]
  },
  plugins: [
    // eslint 插件,需要配合.eslintrc.js 文件,.eslintignore 忽略文件,vscode eslint插件
    new ESLintPlugin({ context: resolve(__dirname, '../src') }),
    new HtmlWebpackPlugin({
      // 配置要打包的html 文件的位置 ,会自动引入打包需要的资源
      template: resolve(__dirname, '../public/index.html')
    }),
    // 这个插件使用 cssnano 优化和压缩 CSS。
    new MiniCssExtractPlugin(),
    // 本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件
    new MiniCssExtractPlugin({
      filename: 'static/css/main.css'
    })
  ],
  mode: 'production'
}
