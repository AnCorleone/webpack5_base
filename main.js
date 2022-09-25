/**
 *  webpack 入口文件
 *
 * 运行指令
 */

// import 'core-js'; // 全局引入 <- at the top of your entry point 
// import 'core-js/es/promise' // 按需要引入
import './src/css/index.css'
import './src/css/index.less'
import './src/css/index.sass'
import './src/css/index.scss'
import './src/css/index.stylus'
import './src/css/iconfont.css'
import './src/utils/constants.json'
import { add } from './src/index'
import { count } from './src/utils/math'
console.log('== add == ', add(1, 2))
console.log("es6 includes ==",[1,2,3].includes(2));
// document.getElementById('bt_count').onclick = function() {
// document.getElementById('bt_count').onclick = function() {
//   console.log('== count == ', count(1, 2, 3, 4))
// }
// 动态导入,会在按钮点击时才导入 ./src/utils/math
// document.getElementById('bt_count').onclick = function() {
//   import( /* webpackChunkName: "math" */"./src/utils/math").then((res)=>{
//     console.log('=== ',res.count(1, 2, 3, 4));
//   }).catch((err)=>console.log(err))
// }

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

