/**
 *  webpack 入口文件
 *
 * 运行指令
 */
import './src/css/index.css'
import './src/css/index.less'
import './src/css/index.sass'
import './src/css/index.scss'
import './src/css/index.stylus'
import './src/css/iconfont.css'
import './src/utils/constants.json'
import { add } from './src/index'
import { count } from './src/utils/math'
// console.log('== add == ', add(1, 2))
// document.getElementById('bt_count').onclick = function() {
//   console.log('== count == ', count(1, 2, 3, 4))
// }
// 动态导入,会在按钮点击时才导入 ./src/utils/math
document.getElementById('bt_count').onclick = function() {
  import( /* webpackChunkName: "math" */"./src/utils/math").then((res)=>{
    console.log('=== ',res.count(1, 2, 3, 4));
  }).catch((err)=>console.log(err))
}

