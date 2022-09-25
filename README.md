

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

###   预加载 

- preload  ``@vue/preload-webpack-plugin`` 
- prefetch

参考博客[使用 Preload&Prefetch 优化前端页面的资源加载](https://blog.csdn.net/qq_34629352/article/details/121311853)



### 解决js兼容性问题CoreJs

*如promise,async,数组一些方法如includes 在一些低版本的浏览器,可能会存在兼容性问题*

- core-js 是什么

  - cors-js是准专门来做es6及以上的API的``polyfill`` 
  - ``polyfill``翻译为垫片/补丁,就是使用社区上提供的一段代码,让我们在不兼容某些特性的浏览器上,使用新特性

- cors-js 怎么用

  - ```
    npm i core-js
    ```

  - ```javascript
    /**
     *  webpack 入口文件 main.js
     *
     * 运行指令
     */
    import 'core-js'; // <- at the top of your entry point 全局引入,这样会增加打包体积
    import './src/css/index.css'
    import './src/css/index.less'
    import { add } from './src/index'
    import { count } from './src/utils/math'
    console.log('== add == ', add(1, 2))
    ```
  
  - 按需引入
  
    ```javascript
    import 'core-js/es/promise' // 按需引入
    ```
  
  - 按需要加载自动引入,在babel中配置参数,不需要在入口文件手动引入core-js,[参考文档](https://www.babeljs.cn/docs/babel-preset-env)
  
    ```javascript
    // babel.config.js
    module.exports = {
      presets: [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": "usage", // usage|entry , 按需要加载自动引入
            "corejs": "3.22"
          }
        ]
      ],
      ...
    }
    ```

### PWA

*渐进式网络应用程序(progressive web applicatiion ) ,是一种类似于native app(原生应用程序)体验的Web App 技术,其中最重要的是,在离线的时候应用程序能够继续运行. 内部通过service workers 技术实现*

- 下载包,[参考文档](https://webpack.docschina.org/guides/progressive-web-application/#adding-workbox)

  ```
  npm install workbox-webpack-plugin --save-dev
  ```

  

- webpack.config 配置

  ```javascript
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  plugins: [
    	...
      new WorkboxPlugin.GenerateSW({
        // 这些选项帮助快速启用 ServiceWorkers
        // 不允许遗留任何“旧的” ServiceWorkers
        clientsClaim: true,
        skipWaiting: true,
      }),
    ],
  ```

- 入口文件,注册 Service Worker

  ```javascript
  // 注册 Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
  
  ```

- 全局安装 serve ,本地部署打包生成的dist文件,

  ```javascript
  npm i serve -g
  serve dist
  ```

  

- 存在问题,低版本浏览器兼容性差



### 总结

![IMG_0016](./src/assets/images/IMG_0016.jpeg)
