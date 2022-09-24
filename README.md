# webpack5_base

 [webpack5参考文档地址](https://webpack.docschina.org/)

#### oneOf
每个文件只被一个loader配置处理

#### include, exclude 包含和排除文文件,只在js loader中配置 babel和 eslint,一般不处理css等
```
 exclude: /(node_modules)/, // 排除node_modules,
 // include :resolve(__dirname,'../src'),
```
- 第三方模块node_modules中的文件已经被编译处理过,需要排除掉,include, exclude 一次只使用一个
- loader和plugins(ESLintPlugin) 中都可以配置
