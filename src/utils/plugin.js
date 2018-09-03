import Vue from 'vue'
import Api from '../api'
import LoginApi from '../api/login'
import { Ajax } from '@/utils/requestMethod'

function navigateTo (url) {
  // 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
  wx.navigateTo({ url })
}

function redirectTo (url) {
  // 关闭当前页面，跳转到应用内的某个页面。
  wx.redirectTo({ url })
}

function switchTab (url) {
  // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 不可带参数
  wx.switchTab({ url })
}

function navigateBack (delta) {
  // 关闭当前页面，返回上一页面或多级页面
  wx.navigateBack({ delta })
}

function reLaunch (url) {
  // 关闭所有页面，打开到应用内的某个页面。
  wx.reLaunch({ url })
}

function Error (data) {
  console.log(data)
  let title = data
  if (typeof data === 'object') {
    title = data.msg
  }
  !title && (title = '')
  wx.showToast({
    title,
    icon: 'error'
  })
}

function Modal (title = '', content = '', callback) {
  const { success, fail } = callback
  wx.showModal({
    title,
    content,
    success,
    fail
  })
}

const Loading = {
  show (title) {
    !title && (title = 'loading...')
    wx.showLoading({ title })
  },
  hide () {
    wx.hideLoading()
  }
}
const Plugin = {
  $reLaunch: reLaunch,
  $navigateTo: navigateTo,
  $back: navigateBack,
  $switchTab: switchTab,
  $redirectTo: redirectTo,
  $ajax: Ajax,
  $api: Api,
  $loginApi: LoginApi,
  $modal: Modal,
  $loading: Loading,
  $error: Error
}
Object.keys(Plugin).forEach((index) => {
  Vue.prototype[index] = Plugin[index]
})
