<template>
  <div>
    <!--模拟的标题-->
    <p class="header">
      <router-link class="btn-left" to="/">main</router-link>
      商品列表
      <router-link class="btn-right" to="listNews">list-news</router-link>
    </p>
    <!--滑动区域-->
    <div ref="mescroll" class="mescroll">
      <div class="notice">
        因为商品的名称价格销量会变动,也可能会下架删除<br/>所以本Demo的下拉刷新会重置列表数据<br/>
        <p class="btn-change" @click="isEdit=!isEdit">模拟后台修改商品信息{{isEdit}}</p>
      </div>
      <!--展示上拉加载的数据列表-->
      <ul id="dataList" class="data-list">
        <li v-for="pd in dataList" :key="pd.id">
          <img class="pd-img" :imgurl="pd.pdImg" src="../../../static/mock/img/loading.png"/>
          <p class="pd-name">{{pd.pdName}}</p>
          <p class="pd-price">{{pd.pdPrice}} 元</p>
          <p class="pd-sold">已售{{pd.pdSold}}件</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// 引入mescroll.min.js和mescroll.min.css
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
// 模拟数据
import mockData from '../../mock/pdlist'
import mockDataEdit from '../../mock/pdlistEdit'

export default {
  name: 'listProducts',
  data () {
    return {
      mescroll: null, // mescroll实例对象
      dataList: [], // 列表数据
      isEdit: false // 是否获取编辑的列表数据
    }
  },
  mounted: function () {
    // 创建MeScroll对象
    this.mescroll = new MeScroll(this.$refs.mescroll, { // 在vue的mounted生命周期初始化mescroll,确保此处配置的ref有值
      up: {
        callback: this.upCallback,
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 10 // 每页数据的数量
        },
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        toTop: { // 配置回到顶部按钮
          src: './static/mescroll/mescroll-totop.png'
        },
        lazyLoad: {
          use: true // 是否开启懒加载,默认false
        }
      }
    })
  },
  beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      if (vm.mescroll) {
        // 恢复到之前设置的isBounce状态
        if (vm.mescroll.lastBounce != null) vm.mescroll.setBounce(vm.mescroll.lastBounce)
        // 滚动到之前列表的位置(注意:路由使用keep-alive才生效)
        if (vm.mescroll.lastScrollTop) {
          vm.mescroll.setScrollTop(vm.mescroll.lastScrollTop)
          setTimeout(() => { // 需延时,因为setScrollTop内部会触发onScroll,可能会渐显回到顶部按钮
            vm.mescroll.setTopBtnFadeDuration(0)// 设置回到顶部按钮显示时无渐显动画
          }, 16)
        }
      }
    })
  },
  beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    if (this.mescroll) {
      this.mescroll.lastBounce = this.mescroll.optUp.isBounce// 记录当前是否禁止ios回弹
      this.mescroll.setBounce(true) // 允许bounce
      this.mescroll.lastScrollTop = this.mescroll.getScrollTop() // 记录当前滚动条的位置
      this.mescroll.hideTopBtn(0)// 隐藏回到顶部按钮,无渐隐动画
    }
    next()
  },
  methods: {
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback (page) {
      // 模拟联网
      this.getListDataFromNet(this.pdType, page.num, page.size, (arr) => {
        // 如果是第一页需手动制空列表
        if (page.num === 1) this.dataList = []
        // 把请求到的数据添加到列表
        this.dataList = this.dataList.concat(arr)
        // 数据渲染成功后,隐藏下拉刷新的状态
        this.$nextTick(() => {
          this.mescroll.endSuccess(arr.length)
        })
      }, () => {
        this.mescroll.endErr()
      })
    },
    /* 联网加载列表数据
     * 在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
     * 请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
     * 实际项目以您服务器接口返回的数据为准,无需本地处理分页.
     */
    getListDataFromNet (pdType, pageNum, pageSize, successCallback, errorCallback) {
      // 延时一秒,模拟联网
      setTimeout(() => {
        // axios.get("xxxxxx", {
        //   params: {
        //     num: page.num, //页码
        //     size: page.size //每页长度
        //   }
        // }).then((response)=> {
        // 模拟分页数据
        var listData = []
        for (var i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
          if (this.isEdit) {
            if (i === mockDataEdit.length) break
            listData.push(mockDataEdit[i])
          } else {
            if (i === mockData.length) break
            listData.push(mockData[i])
          }
        }
        // 回调
        successCallback(listData)
        // }).catch((e)=> {
        //   //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        //   errorCallback&&errorCallback()
        // })
      }, 1000)
    }
  }
}
</script>

<style scoped>
  /*以fixed的方式固定mescroll的高度*/
  .mescroll {
    position: fixed;
    top: 44px;
    bottom: 0;
    height: auto;
  }

  .header {
    z-index: 9990;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border-bottom: 1px solid #eee;
    background-color: white;
  }

  .header .btn-left {
    position: absolute;
    top: 0;
    left: 0;
    padding: 12px;
    line-height: 22px;
  }

  .header .btn-right {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 12px;
  }

  .notice {
    padding: 20px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: #555;
  }

  .btn-change {
    display: inline-block;
    margin-top: 14px;
    font-size: 14px;
    padding: 3px 15px;
    text-align: center;
    border: 1px solid #FF6990;
    border-radius: 20px;
    color: #FF6990;
  }

  .btn-change:active {
    opacity: .5;
  }

  .data-list li {
    position: relative;
    padding: 10px 8px 10px 120px;
    border-bottom: 1px solid #eee;
  }

  .data-list .pd-img {
    position: absolute;
    left: 18px;
    top: 18px;
    width: 80px;
    height: 80px;
  }

  .data-list .pd-name {
    font-size: 16px;
    line-height: 20px;
    height: 40px;
    overflow: hidden;
  }

  .data-list .pd-price {
    margin-top: 8px;
    color: red;
  }

  .data-list .pd-sold {
    font-size: 12px;
    margin-top: 8px;
    color: gray;
  }
</style>
