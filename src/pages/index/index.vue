<template>
  <div>
    <div class='top'>
      <div class='search-box'>
        <input placeholder='输入企业名称' placeholder-class='placeholder' @click='searchTap'/>
      </div>
      <div class='search_r' @click='zhijiezhifa'>
        直接执法
      </div>
    </div>
    <Map @taskList="taskList" :info="info" :messageNumber="messageNumber" :markers="markers" @getCompany="getCompany"/>
  </div>
</template>

<script>
  import Map from '@/components/map'

  const companyList = []
  const company = []
  export default {
    data () {
      return {
        latitude: '',
        longitude: '',
        markers: [],
        company: null,
        messageNumber: 0,
        mapShow: true,
        height: 0
      }
    },
    components: {
      Map
    },
    onLoad () {
    },
    onShow () {
    },
    methods: {
      getLocation () {
        const that = this
        wx.getLocation({
          type: 'wgs84',
          success (res) {
            const { latitude, longitude } = res
            that.mapShow = true
            that.latitude = latitude
            that.longitude = longitude
            that.getCompany({
              latitude,
              longitude
            })
          },
          complete (res) {
            console.log(res)
          }
        })
      },
      async getCompany (res) {
        const userId = wx.getStorageSync('userId')
        try {
          const data = await this.$api.findEnterList({
            userId,
            latitude: res.latitude,
            longitude: res.longitude
          })
          if (data.errorCode === -1) {
            const result = data.body.basEnterList
            for (let i = 0; i < result.length; i++) {
              if (company.indexOf(result[i].PK_Guid) === -1) {
                company.push(result[i].PK_Guid)
                const companyReturn = {
                  id: company.indexOf(result[i].PK_Guid) + 1,
                  longitude: result[i].longitude,
                  latitude: result[i].latitude,
                  iconPath: '/static/image/dw.png',
                  width: 20,
                  height: 25
                }
                companyList.push(companyReturn)
              }
            }
            this.markers = companyList
          }
        } catch (e) {
        }
      },
      async taskList () {
        const userId = wx.getStorageSync('userId')
        await this.$api.updateTaskStatus({ userId })
        wx.navigateTo({
          url: 'rwgl/rwgl?userid=' + userId
        })
      },
      async bindMarkerTap (res) {
        let userId = wx.getStorageSync('userId')
        let enterId = company[res.markerId - 1]
        const data = await this.$api.findById({
          enterId,
          userId
        })
        this.info = data.body
      },
      bindTap (res) {
        this.info = false
      },
      zhijiezhifa (e) {
        const enterId = e.target.dataset.id
        wx.setStorage({
          key: 'enterId',
          data: enterId
        })
        wx.navigateTo({
          url: '/pages/zhijiezhifa/index'
        })
      },
      searchTap () {
        wx.navigateTo({
          url: '/pages/searchMap/main'
        })
      }
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

  .search-box {
    width: 68%;
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
      margin-bottom: -(4px)/2;
    }
  }

  .placeholder {
    color: #fff;
  }

  .search_r {
    width: 25%;
    font-size: (28px)/2;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .search_r image {
    width: (32px)/2;
    display: block;
    margin-left: (10px)/2;
  }


</style>
