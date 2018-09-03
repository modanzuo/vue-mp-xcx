<template>
  <div>
    <div class='top'>
      <div class='search-box'>
        <img mode='widthFix' src='/static/image/ss.png'/>
        <input placeholder='输入企业名称' placeholder-class='placeholder' v-model="name"></input>
      </div>
    </div>
    <div class='enterprise-box' v-for="(item,index) in list" :key="index">
      <div @click='qyEvent' :data-div-guid="item.PK_Guid">
        <div class='enterprise'>
          <div class='title'>{{item.WRYMC}}</div>
        </div>
        <div class='enterprise'>
          <div class='enterprise_r'>{{item.DWDZ==''?'暂无地址信息':item.DWDZ}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Map from '@/components/map'

  export default {
    name: 'searchMap',
    data () {
      return {
        latitude: '',
        longitude: '',
        list: [],
        name: ''
      }
    },
    watch: {
      name (next, old) {
        next = next.trim()
        old = old.trim()
        if (next !== old) {
          this.getCompany()
        }
        this.name = next
      }
    },
    components: {
      Map
    },
    methods: {
      // 企业点击绑定事件
      qyEvent (event) {
        // 获取选中的参数
        console.log(event)
        const that = this
        const guid = event.currentTarget.dataset.viewGuid
        console.log(guid)
        const userId = wx.getStorageSync('userId')
        this.$modal(
          '提示',
          '您确定要对该企业进行执法？',
          {
            async success (res) {
              if (res.confirm) {
                const data = await this.$loginApi.craeteMeTask({
                  userId,
                  PK_Guid: guid
                })
                if (data.success) {
                  that.$modal(
                    '提示',
                    '现场执法任务创建成功，点击确定进入任务管理',
                    {
                      success (res) {
                        if (res.confirm) {
                          wx.redirectTo({
                            url: '/pages/index/rwgl/rwgl'
                          })
                        }
                      }
                    }
                  )
                }
              }
            }
          }
        )
      },
      async getCompany () {
        const userId = wx.getStorageSync('userId')
        try {
          const data = await this.$loginApi.seachCompany({
            userId,
            latitude: this.latitude,
            longitude: this.longitude,
            name: this.name
          })
          this.list = data
        } catch (e) {
        }
      },
      setLatLon (res) {
        this.latitude = res.latitude
        this.longitude = res.longitude
      }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady () {
    }
  }
</script>

<style scoped lang="scss">
  .top {
    width: auto;
    padding: (15px)/2;
    background: #2593e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .placeholder {
    color: #fff;
  }

  .search-box {
    width: 95%;
    height: (54px)/2;
    border: 1px solid #b2caff;
    background: rgba(119, 170, 233, 0.6);
    border-radius: (54px)/2;
    display: flex;
    align-items: center;
    padding: 0 (15px)/2;
    font-size: (22px)/2;
    color: #fff;
    image {
      width: (24px)/2;
      display: inline-block;
      margin-right: (8px)/2;
    }
    input {
      width: 100%;
      margin-bottom: -4rpx;
    }
  }

  .on {
    color: #2593e9;
    border-bottom: (3px)/2 solid #2593e9;
  }

  .banner {
    width: 100%;
  }

  .banner image {
    width: 100%;
    display: block;
  }

  .title {
    font-weight: bold;
    font-size: 14px;
  }

  .enterprise {
    width: 100%;
    height: (75px)/2;
    display: flex;
    align-items: center;
  }

  .enterprise-box {
    border: 1px solid #ccc;
    margin: 10px;
    padding: 10px;
    background-color: #fff;
    border-radius: 10px;
  }

  .enterprise_r {
    width: 80%;
    font-size: 13px;
    color: #ccc;
    border-bottom: 1px solid #eee;
    padding-bottom: (8px)/2;
  }
</style>
