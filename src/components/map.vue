<template>
  <div>
    <map v-if="mapShow" id="map" show-location :longitude="longitude"
         :latitude="latitude" scale="12" @regionchange="bindRegionChange"
         :markers="markers" @markertap="bindMarkerTap" @click="bindTap"
         :style="'width:100%;height:'+height+'px'">
      <cover-view class='alert-box' v-if="info">
        <cover-view class='alert'>
          <cover-image mode='widthFix' class='polygon' src='/static/image/dbx.png'></cover-image>
          <cover-view class='alert-in'>
            <cover-view class='alert_t'>
              <cover-view style='width:10%'>
                <cover-image src='/static/image/wz.png'></cover-image>
              </cover-view>
              <cover-view style='width:70%'>{{info.WRYMC}}</cover-view>
            </cover-view>
            <cover-view class='alert_c'>
              <cover-view class='alert_l'>
                <cover-image src='/static/image/zf.png'></cover-image>
                <cover-view>0次</cover-view>
              </cover-view>
              <cover-view class='alert_r'>
                <cover-view>2017-03-04</cover-view>
                <!-- <cover-view style='color:#ccc'>最近执法时间</cover-view> -->
              </cover-view>
            </cover-view>
            <cover-view class='alert_b'>
              <cover-view :data-id="info.enterId" @click='enforcement'>立即执法</cover-view>
              <cover-view @click='history'>执法记录</cover-view>
            </cover-view>
          </cover-view>
        </cover-view>
      </cover-view>
      <cover-view class='task-box' @click='taskList'>
        <cover-view class='task'>
          <cover-image mode='widthFix' src='/static/image/rr.png'></cover-image>
        </cover-view>
        <cover-view class="bubble" v-if="messageNumber>0">{{messageNumber}}</cover-view>
      </cover-view>
      <cover-view class='enterprise' @click='enterprise'>
        <cover-image mode='widthFix' src='/static/image/cplb.png'></cover-image>
      </cover-view>
    </map>
    <button v-else open-type="openSetting">打开授权</button>
  </div>
</template>

<script>
  import Api from '@/api'

  export default {
    props: {
      info: {
        required: true,
        type: Object
      },
      markers: {
        required: true,
        type: Array
      },
      messageNumber: {
        required: true,
        type: Number
      }
    },
    data () {
      return {
        mapShow: true,
        markers: [],
        height: 100,
        longitude: 0,
        latitude: 0
      }
    },
    onLoad () {
      const that = this
      console.log('onLoad1')
      wx.getSystemInfo({
        success (res) {
          that.height = res.windowHeight
        }
      })
      this.getSetting()
    },
    methods: {
      bindRegionChange () {
        this.mapCtx = wx.createMapContext('map')
        this.mapCtx.getCenterLocation({
          success (res) {
            this.getCompany(res)
          }
        })
      },
      enterprise () {
        wx.navigateTo({
          url: './qy/qy'
        })
      },
      enforcement (e) {
        const that = this
        wx.showModal({
          title: '提示',
          content: '您确定要对该企业进行执法？',
          async success (res) {
            if (res.confirm) {
              let enterId = e.target.dataset.id
              const userId = wx.getStorageSync('userId')
              const data = await Api.craeteMeTask({
                userId,
                PK_Guid: enterId
              })
              if (data.success) {
                that.$navigateTo('/pages/index/rwgl/rwgl')
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      history () {
        wx.switchTab({
          url: '/pages/history/main'
        })
      },
      getSetting () {
        const that = this
        console.log('getSetting')
        wx.getSetting({
          success (res) {
            console.log(res)
            if (res.authSetting['scope.userLocation'] !== undefined && res.authSetting['scope.userLocation'] !== true) {
              // 非初始化进入该页面,且未授权
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
                success (res) {
                  if (res.cancel) {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'success',
                      duration: 1000
                    })
                  } else if (res.confirm) {
                    that.mapShow = false
                  }
                }
              })
            } else if (res.authSetting['scope.userLocation'] === undefined) {
              // 初始化进入
              that.getLocation()
            } else {
              // 授权后默认加载
              that.getLocation()
            }
          },
          complete (res) {
            console.log(res)
          }
        })
      },
      getLocation () {
        const that = this
        wx.getLocation({
          type: 'wgs84',
          success (res) {
            const { latitude, longitude } = res
            that.mapShow = true
            that.latitude = latitude
            that.longitude = longitude
            that.$emit('getCompany', {
              latitude,
              longitude
            })
          },
          complete (res) {
            console.log(res)
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">

  .task-box {
    width: (100px)/2;
    height: (100px)/2;
    position: fixed;
    bottom: (100px)/2;
    right: (15px)/2;
    z-index: 999;
    .task {
      width: (100px)/2;
      height: (100px)/2;
      background: #2593e9;
      border-radius: (100px)/2;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .alert {
    width: 100%;
    position: relative;

    .alert-in {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      box-shadow: 0 0 (30px)/2 (5px)/2 #ceddf8;
      .alert_t {
        width: auto;
        padding: (15px)/2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #333;
        font-size: (28px)/2;
        cover-image {
          width: (30px)/2;
          height: (30px)/2;
          display: block;
        }
        cover-view {
          margin-right: (10px)/2;
        }
      }
    }
    .alert_l {
      width: 40%;
      height: 100%;
      color: #7e7e7e;
      display: flex;
      align-items: center;
      font-size: (28px)/2;
      border-right: 1px solid #eee;
      line-height: (80px)/2;
      cover-image {
        width: (30px)/2;
        height: (30px)/2;
        display: block;
        margin-right: (15px)/2;
        margin-bottom: -(5px)/2;
      }
    }
    .alert_c {
      width: auto;
      height: (80px)/2;
      padding: 0 (15px)/2;
      display: flex;
      margin: 0 (15px)/2;
      align-items: center;
      border: 1px solid #eee;
    }
    .alert_r {
      width: 60%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      text-align: center;
      cover-view {
        color: #7e7e7e;
        font-size: (28px)/2;
        width: 100%;
      }
      text {
        width: 100%;
        color: #ccc;
        font-size: (24px)/2;
      }
    }
    .alert_b {
      width: auto;
      margin: (18px)/2;
      display: flex;
      justify-content: space-around;
      cover-view {
        width: (168px)/2;
        height: (55px)/2;
        line-height: (55px)/2;
        border-radius: (55px)/2;
        background: #2593e9;
        font-size: (24px)/2;
        color: #fff;
        text-align: center;
        border: 1px solid #fff
      }
      cover-view:nth-child(2) {
        background: #fff;
        color: #2593e9;
        border: 1px solid #2593e9
      }
    }
  }

  .enterprise {
    width: (127px)/2;
    position: fixed;
    bottom: (210px)/2;
    right: (5px)/2;
    z-index: 999;
    image {
      width: 100%;
      display: block
    }

  }

  .polygon {
    width: 100%;
    height: 100%;
    display: block;
  }

  .alert-box {
    width: (476px)/2;
    height: (297px)/2;
    position: fixed;
    top: 40%;
    left: 50%;
    margin-left: -(238px)/2;
    z-index: 999;
  }

  .bubble {
    position: absolute;
    background: rgb(255, 59, 48);
    color: #fff;
    border-radius: 50%;
    font-size: (30px)/2;
    padding: (5px)/2;
    top: 0;
    right: (0px)/2;
    width: (35px)/2;
    height: (35px)/2;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .task {
    cover-text {
      position: absolute;
      right: (15px)/2;
      top: (50px)/2;
      display: block;
      text-align: center;
      padding: (3px)/2 (5px)/2;
      background: #ff1223;
      font-size: (22px)/2;
      color: #fff;
      border-radius: (50px)/2;
    }
    cover-image {
      width: (60px)/2;
      height: (60px)/2;
      display: block;
    }
  }
</style>
