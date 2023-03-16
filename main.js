import App from './App'
import wyjSign from 'uni_modules/wyj-sign/components/wyj-sign/wyj-sign.vue'
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.component('wyj-sign', wyjSign)//挂载全局组件
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif
// 代码合并123111111222// 代码合并123111111
// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
