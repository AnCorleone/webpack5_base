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







