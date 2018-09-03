import Vue from 'vue'

class LoginApi extends Vue {
  sendSms (telephone) {
    let url = `sms/sendSms`
    return this.$ajax(url, { telephone })
  }

  saveOpenId (data) {
    let url = `basUser/saveOpenId`
    return this.$ajax(url, data)
  }
}

export default new LoginApi()
