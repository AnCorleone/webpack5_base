# webpack5_base

###  [webpack5参考文档地址](https://webpack.docschina.org/)

### oneOf

每个文件只被一个loader配置处理

### include, exclude 

包含和排除文文件,只在js loader中配置 babel和 eslint,一般不处理css等

```javascript
 exclude: /(node_modules)/, // 排除node_modules,
 // include :resolve(__dirname,'../src'),
```
- 第三方模块node_modules中的文件已经被编译处理过,需要排除掉,include, exclude 一次只使用一个
- loader和plugins(ESLintPlugin) 中都可以配置

### babel,eslint 缓存

Babel 缓存配置

```javascript
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
```

Eslint缓存配置

```javascript
new ESLintPlugin(
      {
        context: resolve(__dirname, '../src'),
        exclude: 'node_modules', // 默认值
        cache: true, // 开启缓存
        cacheLocation: resolve(__dirname, 'node_modules/.cache/eslintCache')
      }
 ),
```



### ```thread-loader``` 多进程打包,可以对babel和eslint配置

Babel 配置,放在babel-loader 前面

```javascript
const os = require('os')
// 获取cpu核心数
const threads = os.cpus().length
{
     test: /\.js$/,
     // exclude: /(node_modules)/, // 排除node_modules,
     include: resolve(__dirname, '../src'),
     use: [
       //  开启多进程,对bable处理
       {
         loader: 'thread-loader',
         // 有同样配置的 loader 会共享一个 worker 池
         options: {
           // 产生的 worker 的数量，默认是 (cpu 核心数 - 1)，或者，
           // 在 require('os').cpus() 是 undefined 时回退至 1
           workers: threads,
         }
       },
       {
         loader: 'babel-loader',
         options: {
           cacheDirectory: true, // 默认是false
           cacheCompression: true // 默认是true,当设置此值时，会使用 Gzip 压缩每个 Babel transform 输出。
         }
       }
     ]
}
```

Eslint 配置多线程

```javascript
  new ESLintPlugin(
      {
        context: resolve(__dirname, '../src'),
        exclude: 'node_modules', // 默认值
        cache: true, // 开启缓存
        cacheLocation: resolve(__dirname, 'node_modules/.cache/eslintCache'),
        threads: threads // 开启多线程
      }
    ),
```

terser-webpack-plugin 开启多线程

```javascript
// webpack v5 开箱即带有最新版本的 terser-webpack-plugin,该插件使用 terser 来压缩 JavaScript。
new TerserPlugin(
  {
    // parallel: true
    parallel: threads // 启用多进程并发运行并设置并发运行次数。
  }

```

### TreeShaking,减少js代码体积

- *移除在javascript 中没有使用的代码,在生产环境中默认开启了配置*
- babel 为编译的每个文件插入了辅助代码,使代码体积过大!
- ```@babel/plugin-transform-runtime```禁用了 Babel 自动对每个文件的 runtime 注入,而是引入 `@babel/plugin-transform-runtime` 并且使所有辅助代码从这里引用。

```node
npm i @babel/runtime
npm i -s -D babel/plugin-transform-runtime
```

```javascript
 // babel 配置
 {
   test: /\.js$/,
   use: [
     {
       options: {
         plugins: ['babel/plugin-transform-runtime'] // 减少代码体积
       }
     }
   ]
 }
```



### 本地压缩图片 image-minimizer-webpack-plugin

```
npm install image-minimizer-webpack-plugin --save-dev
```

- 无损压缩

  ```npm
  npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo --save-dev
  ```

- 有损压缩

  ```npm
  npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo --save-dev
  ```

我的环境npm 安装失败,具体参考webpack官网:[ImageMinimizerWebpackPlugin](https://webpack.docschina.org/plugins/image-minimizer-webpack-plugin/#root)

### 优化代码性能 Code Split,代码分割

多入口打包

```javascript
module.exports = {
  // 多入口打包
  entry: {
    main: './main.js',
    app: './app.js'
  },
  output: {
    filename: 'js/[name].js',
    path: resolve(__dirname, '../dist'),
    clean: true
  },
  // 单入口打包
  // entry: './main.js',
  // output: {
  //   filename: 'js/main.js',
  //   path: resolve(__dirname, '../dist'),
  //   clean: true
  // }
}
```

多入口打包依赖同一个文件,避免重复打包,比如main: './main.js',app: './app.js',都引入了math.js,会分别打包引入两次,产生重复使用``SplitChunksPlugin`` 避免他们之间的重复依赖

基本写法

```javascript
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', // chunks: 'all'
      // 以下是默认配置
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```



### 动态导入

*import动态导入: 会讲动态导入的文件代码分割*

默认导入方式

```javascript
import { count } from './src/utils/math'
document.getElementById('bt_count').onclick = function() {
   console.log('== count == ', count(1, 2, 3, 4))
}
```

动态导入方式

```javascript
document.getElementById('bt_count').onclick = function() {
  // 动态导入,会在按钮点击时才导入 ./src/utils/math
  import('./src/utils/math').then((res)=>{
    console.log('=== ',res.count(1, 2, 3, 4));
  }).catch((err)=>console.log(err))
}
```

解决eslint动态导入报错,在``.eslintrc.js``增加以下配置

```javascript
module.exports = {
		plugins: ['import'] // 解决eslint动态导入报错
}
```

### 给动态导入模块重命名

.js 文件

```javascript
// 动态导入,会在按钮点击时才导入 ./src/utils/math
document.getElementById('bt_count').onclick = function() {
  import( /* webpackChunkName: "math" */"./src/utils/math").then((res)=>{
    console.log('=== ',res.count(1, 2, 3, 4));
  }).catch((err)=>console.log(err))
}
```

wepback.prod.js 文件

```javascript
output: {
    filename: 'js/main.js',
    path: resolve(__dirname, '../dist'),
    // 给打包输出的其他文件命名,
    chunkFilename:"js/[name].js",
    ...
 },
```

