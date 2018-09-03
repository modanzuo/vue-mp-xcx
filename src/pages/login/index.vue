<template>
  <div class='login-box'>
    <div class='login-content'>
      <img mode='widthFix' src='/static/image/login.png'/>
      <div class='login-content-box'>
        <div class='login-line login-phone'>
          <text>+86</text>
          <input placeholder='请输入手机号' v-model="phone"/>
        </div>
        <div class='login-line login-code'>
          <input placeholder='请输入短信验证码' v-model="sendCode"/>
          <text v-if="!sendCounts" @click='send'>获取验证码</text>
          <text v-if="sendCounts">{{sendCounts}}秒后重新获取</text>
        </div>
        <button @click='submit'>登录</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index.vue',
    data () {
      return {
        sendOut: 0, // 验证码发送状态
        sendCounts: 0,
        phone: '',
        sendCode: ''
      }
    },
    onLoad () {
      console.log('onLoad')
    },
    methods: {
      async send (e) {
        let timer
        let sendCounts = 60
        try {
          const phone = this.phone
          // 验证手机号 为true ,才发送验证码
          if (phone) {
            this.sendOut = 1
            const data = await this.$loginApi.sendSms(phone)
            if (!data.success) {
              wx.showToast({
                title: '手机号未在授权名单中',
                icon: 'none',
                duration: 3000
              })
              return
            }
            wx.setStorage({
              key: 'yzm',
              data: data.body.yzm
            })
            this.phone = data.body.phonenum
            this.sendCounts = sendCounts
            this.sendCode = data.body.yzm
            timer = setInterval(() => {
              sendCounts--
              if (sendCounts === 0) {
                clearInterval(timer)
                this.sendOut = 0
              }
              this.sendCounts = sendCounts
            }, 1000)
          } else {
            wx.showToast({
              title: '请输入手机号',
              icon: 'none',
              duration: 3000
            })
          }
        } catch (e) {
          console.log(e)
        }
      },
      // 登录按钮
      async submit (e) {
        const yzm = this.yzm
        const yzmsync = wx.getStorageSync('yzm')
        const openId = wx.getStorageSync('openid')
        if (!yzmsync) {
          wx.showToast({
            title: '请输入验证码',
            icon: 'none',
            duration: 3000
          })
          return
        }
        if (openId) {
          if (yzmsync === yzm) {
            try {
              const data = await this.$loginApi.saveOpenId({
                openId,
                telephone: this.phone,
                yzm
              })
              wx.removeStorageSync('yzm')
              const userId = data.body.userId
              if (data.errorCode === 4) {
                wx.showLoading({
                  title: '您没有权限'
                })
              }
              if (userId) {
                wx.showToast({
                  title: '登录成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.setStorage({
                  key: 'userId',
                  data: userId
                })
                this.userId = userId
                wx.switchTab({
                  url: '/pages/index/main'
                })
              }
            } catch (e) {
            }
          } else {
            wx.showToast({
              title: '验证码不正确',
              duration: 2000
            })
          }
        } else {
          this.userId = false
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .login-box {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;

  }

  .login-content {
    width: (520px)/2;
    height: (530px)/2;
    border-radius: (12px)/2;
    background: #fff;
    position: relative;
    image {
      display: block;
      width: 100%;
    }
  }

  .login-content-box {
    width: 100%;
    height: auto;
    padding: (100px)/2 0;
    position: absolute;
    top: 0;
    left: 0;
    button {
      width: (411px)/2;
      height: (60px)/2;
      display: block;
      background: linear-gradient(to right, #2593e9, #29c4fc);
      border-radius: (50px)/2;
      font-size: (26px)/2;
      color: #fff;
      border: 0;
      line-height: (60px)/2;
      margin: (60px)/2 auto;
      padding: 0;
      box-shadow: 0 (6px)/2 (25px)/2 (3px)/2 #ccc;
    }
  }

  .login-line {
    width: auto;
    height: (50px)/2;
    margin: 0 (25px)/2 (30px)/2;
    border-bottom: (1px)/2 solid #eee;
    color: #333;
    font-size: (23px)/2;
    display: flex;
    align-items: center;
    &.login-phone {
      text {
        border-right: (1px)/2 solid #eee;
        padding-right: (15px)/2;
      }
      input {
        padding-left: (15px)/2;
      }
    }
    &.login-code {
      justify-content: space-between;
      text {
        color: #155acd;
      }
    }
  }
</style>
