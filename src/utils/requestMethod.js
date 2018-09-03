import App from '../App'

const host = App.data().url

export function Ajax (url, data, options = null) {
  // 请求
  if (!options) {
    options = {}
  }
  if (typeof options === 'string') {
    options = { method: options }
  }
  if (!options.method) {
    options.method = 'GET'
  }
  let header = {}
  if(){
    header['xxx-api-token']="";
  }
  header['content-type'] = 'application/json; charset=utf-8'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${host}${url}`, // 拼接完整的 url
      data,
      header,
      method: options.method,
      success (res) {
        resolve(res.data) // 把返回的数据传出去
      },
      fail (ret) {
        reject(ret)// 把错误信息传出去
      }
    })
  })
}
