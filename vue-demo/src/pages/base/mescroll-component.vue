<template>
  <div>
    <!--标题-->
    <p class="header">
      <router-link class="btn-left" to="/">main</router-link>
      MeScroll组件,强烈推荐使用
    </p>
    <!--滑动区域 ref='mescroll'不能删, 目的是路由切换时可通过ref调用mescroll-vue组件的beforeRouteEnter方法-->
    <mescroll-vue ref="mescroll" :up="mescrollUp" @init="mescrollInit">
      <!--模拟的轮播,菜单 可在down.callback中配置刷新轮播数据-->
      <img class="swiper" src="../../../static/mock/img/swiper.jpg"/>
      <!--筛选条件; 模拟列表的重置和演示空布局的使用-->
      <div class="nav">
        <p :class="getActiveCls(0)" @click="changeTab(0)">全部</p>
        <p :class="getActiveCls(1)" @click="changeTab(1)">奶粉</p>
        <p :class="getActiveCls(2)" @click="changeTab(2)">图书</p>
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
    </mescroll-vue>
  </div>
</template>

<script>
// 引入mescroll的vue组件
import MescrollVue from 'mescroll.js/mescroll.vue'
// 模拟数据
import mockData from '../../mock/pdlist'

export default {
  name: 'mescrollComponent',
  components: {
    MescrollVue
  },
  data () {
    return {
      mescroll: null, // mescroll实例对象
      mescrollUp: {
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 10 // 每页数据的数量
        },
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        toTop: {
          src: './static/mescroll/mescroll-totop.png' // 回到顶部按钮的图片路径,支持网络图
        },
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
          warpId: 'dataList', // 父布局的id;
          icon: './static/mescroll/mescroll-empty.png', // 图标,支持网络图
          tip: '暂无相关数据~', // 提示
          btntext: '去逛逛 >', // 按钮,默认""
          btnClick () { // 点击按钮的回调,默认null
            alert('点击了按钮,具体逻辑自行实现')
          }
        },
        lazyLoad: {
          use: true // 是否开启懒加载,默认false
        }
      },
      dataList: [], // 列表数据
      pdType: 0 // 菜单
    }
  },
  beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    })
  },
  beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next()
  },
  methods: {
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback (page, mescroll) {
      // 模拟联网
      this.getListDataFromNet(this.pdType, page.num, page.size, (arr) => {
        // 如果是第一页需手动制空列表
        if (page.num === 1) this.dataList = []
        // 把请求到的数据添加到列表
        this.dataList = this.dataList.concat(arr)
        // 数据渲染成功后,隐藏下拉刷新的状态
        this.$nextTick(() => {
          mescroll.endSuccess(arr.length)
        })
      }, () => {
        // 联网异常,隐藏上拉和下拉的加载进度
        mescroll.endErr()
      })
    },

    // 选中状态的样式
    getActiveCls (type) {
      return this.pdType === type ? 'active' : ''
    },
    // 切换菜单
    changeTab (type) {
      if (this.pdType !== type) {
        this.pdType = type
        this.dataList = []// 在这里手动置空列表,可显示加载中的请求进度
        this.mescroll.resetUpScroll() // 刷新列表数据
      }
    },

    /* 联网加载列表数据
       在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
       请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
       实际项目以您服务器接口返回的数据为准,无需本地处理分页.
       * */
    getListDataFromNet (pdType, pageNum, pageSize, successCallback, errorCallback) {
      // 延时一秒,模拟联网
      setTimeout(() => {
        // axios.get("xxxxxx", {
        //   params: {
        //     num: page.num, //页码
        //     size: page.size //每页长度
        //   }
        // }).then((response)=> {
        var listData = []
        // pdType 全部商品0; 奶粉1; 图书2;
        if (pdType === 0) {
          // 全部商品 (模拟分页数据)
          for (var i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
            if (i === mockData.length) break
            listData.push(mockData[i])
          }
        } else if (pdType === 1) {
          // 奶粉
          for (var j = 0; j < mockData.length; j++) {
            if (mockData[j].pdName.indexOf('奶') !== -1) {
              listData.push(mockData[j])
            }
          }
        } else if (pdType === 2) {
          // 图书
          for (var k = 0; k < mockData.length; k++) {
            if (mockData[k].pdName.indexOf('图书') !== -1) {
              listData.push(mockData[k])
            }
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

  .swiper {
    width: 100%;
    vertical-align: bottom;
  }

  .nav {
    text-align: center;
    border-bottom: 1px solid #ddd;
  }

  .nav p {
    display: inline-block;
    width: 30%;
    padding: 10px 0;
  }

  .nav .active {
    border-bottom: 1px solid #FF6990;
    color: #FF6990;
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
