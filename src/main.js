import Vue from 'vue'
import App from './App'
import 'weui-wxss'
import '@/utils/plugin'

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue(App)
app.$mount()
export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      '^pages/index/main'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#2593e9',
      navigationBarTitleText: '执法',
      navigationBarTextStyle: '#fff'
    },
    tabBar: {
      'selectedColor': '#3098e9',
      'list': [
        // {
        //   'pagePath': 'pages/index/main',
        //   'text': '首页',
        //   'iconPath': '/static/image/d1.png',
        //   'selectedIconPath': '/static/image/d11.png'
        // }
      ]
    }
  }
}
