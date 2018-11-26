<template>
  <div>
    <!--标题-->
    <p class="header">
      <router-link class="btn-left" to="/">main</router-link>
      MeScroll所有配置项 (详见代码)
    </p>
    <!--滑动区域-->
    <div id="mescroll" class="mescroll">
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
    </div>
  </div>
</template>

<script>
// 引入mescroll.min.js和mescroll.min.css
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
// 模拟数据
import mockData from '../../mock/pdlist'

export default {
  name: 'mescrollOptions',
  data () {
    return {
      mescroll: null, // mescroll实例对象
      dataList: [], // 列表数据
      pdType: 0 // 菜单
    }
  },
  mounted () {
    // 创建MeScroll对象
    this.mescroll = new MeScroll('mescroll', { // 在vue的mounted生命周期初始化mescroll,确保此处配置的id能够被找到
      // 下拉刷新的所有配置项
      down: {
        use: true, // 是否初始化下拉刷新; 默认true
        auto: true, // 是否在初始化完毕之后自动执行下拉回调callback; 默认true
        autoShowLoading: true, // 如果在初始化完毕之后自动执行下拉回调,是否显示下拉刷新进度; 默认false
        isLock: false, // 是否锁定下拉,默认false;
        isBoth: false, // 下拉刷新时,如果滑动到列表底部是否可以同时触发上拉加载;默认false,两者不可同时触发;
        callback: function (mescroll) {
          console.log('down --> callback');
          // 加载轮播数据
          // loadSwiper();
          // 下拉刷新的回调,默认重置上拉加载列表为第一页(down的auto默认true,初始化Mescroll之后会自动执行到这里,而mescroll.resetUpScroll会触发up的callback)
          mescroll.resetUpScroll()
        },
        offset: 60, // 触发刷新的距离,默认80
        inOffsetRate: 1, // 在列表顶部,下拉的距离小于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
        outOffsetRate: 0.2, // 超过指定距离范围外时,改变下拉区域高度比例;值小于1且越接近0,越往下拉高度变化越小;
        bottomOffset: 20, // 当手指touchmove位置在距离body底部20px范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行
        minAngle: 45, // 向下滑动最少偏移的角度,取值区间  [0,90];默认45度,即向下滑动的角度大于45度则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;
        hardwareClass: 'mescroll-hardware', // 硬件加速样式;解决iOS下拉因隐藏进度条而闪屏的问题,参见mescroll.css
        mustToTop: false, // 是否滚动条必须在顶部,才可以下拉刷新.默认false. 当您发现下拉刷新会闪白屏时,设置true即可修复.
        warpId: null, // 可配置下拉刷新的布局添加到指定id的div;默认不配置,默认添加到mescrollId
        warpClass: 'mescroll-downwarp', // 容器,装载布局内容,参见mescroll.css
        resetClass: 'mescroll-downwarp-reset', // 高度重置的动画,参见mescroll.css
        textInOffset: '下拉刷新', // 下拉的距离在offset范围内的提示文本
        textOutOffset: '释放更新', // 下拉的距离大于offset范围的提示文本
        textLoading: '加载中 ...', // 加载中的提示文本
        htmlContent: '<p class="downwarp-progress"></p><p class="downwarp-tip"></p>', // 布局内容
        inited: function (mescroll, downwarp) {
          console.log('down --> inited')
          // 初始化完毕的回调,可缓存dom
          mescroll.downTipDom = downwarp.getElementsByClassName('downwarp-tip')[0]
          mescroll.downProgressDom = downwarp.getElementsByClassName('downwarp-progress')[0]
        },
        inOffset: function (mescroll) {
          console.log('down --> inOffset')
          // 进入指定距离offset范围内那一刻的回调
          if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = mescroll.optDown.textInOffset
          if (mescroll.downProgressDom) mescroll.downProgressDom.classList.remove('mescroll-rotate')
        },
        outOffset: function (mescroll) {
          console.log('down --> outOffset')
          // 下拉超过指定距离offset那一刻的回调
          if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = mescroll.optDown.textOutOffset
        },
        onMoving: function (mescroll, rate, downHight) {
          // 下拉过程中的回调,滑动过程一直在执行; rate下拉区域当前高度与指定距离offset的比值(inOffset: rate<1; outOffset: rate>=1); downHight当前下拉区域的高度
          console.log('down --> onMoving --> mescroll.optDown.offset=' + mescroll.optDown.offset + ', downHight=' + downHight + ', rate=' + rate)
          if (mescroll.downProgressDom) {
            var progress = 360 * rate
            mescroll.downProgressDom.style.webkitTransform = 'rotate(' + progress + 'deg)'
            mescroll.downProgressDom.style.transform = 'rotate(' + progress + 'deg)'
          }
        },
        beforeLoading: function (mescroll, downwarp) {
          console.log('down --> beforeLoading')
          // 准备触发下拉刷新的回调
          return false // 如果要完全自定义下拉刷新,那么return true,此时将不再执行showLoading(),callback();
        },
        showLoading: function (mescroll) {
          console.log('down --> showLoading')
          // 触发下拉刷新的回调
          if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = mescroll.optDown.textLoading
          if (mescroll.downProgressDom) mescroll.downProgressDom.classList.add('mescroll-rotate')
        },
        afterLoading: function (mescroll) {
          console.log('down --> afterLoading');
          // 结束下拉之前的回调. 返回延时执行结束下拉的时间,默认0ms; 常用于结束下拉之前再显示另外一小段动画,才去结束下拉的场景, 参考案例【dotJump】
          return 0
        }
      },
      // 上拉加载的所有配置项
      up: {
        use: true, // 是否初始化上拉加载; 默认true
        auto: true, // 是否在初始化时以上拉加载的方式自动加载第一页数据; 默认true
        isLock: false, // 是否锁定上拉,默认false
        isBoth: true, // 上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认false,两者不可同时触发; 这里为了演示改为true,不必等列表加载完毕才可下拉;
        isBounce: true, // 是否允许ios的bounce回弹;默认true,允许回弹; 此处配置为false,可解决微信,QQ,Safari等等iOS浏览器列表顶部下拉和底部上拉露出浏览器灰色背景和卡顿2秒的问题
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        page: {
          num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10, // 每页数据条数
          time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
        },
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        offset: 100, // 离底部的距离
        toTop: {
          // 回到顶部按钮,需配置src才显示
          warpId: null, // 父布局的id; 默认添加在body中
          src: './static/mescroll/mescroll-totop.png', // 图片路径,默认null;
          html: null, // html标签内容,默认null; 如果同时设置了src,则优先取src
          offset: 1000, // 列表滚动多少距离才显示回到顶部按钮,默认1000
          warpClass: 'mescroll-totop', // 按钮样式,参见mescroll.css
          showClass: 'mescroll-fade-in', // 显示样式,参见mescroll.css
          hideClass: 'mescroll-fade-out', // 隐藏样式,参见mescroll.css
          duration: 300, // 回到顶部的动画时长,默认300ms
          supportTap: false, // 默认点击事件用onclick,会有300ms的延时;如果您的运行环境支持tap,则可配置true;
          btnClick: null // 点击按钮的回调; 小提示:如果在回调里return true,将不执行回到顶部的操作.
        },
        loadFull: {
          use: false, // 列表数据过少,不足以滑动触发上拉加载,是否自动加载下一页,直到满屏或者无更多数据为止;默认false,因为可通过调高page.size或者嵌套mescroll-bounce的div避免这个情况
          delay: 500 // 延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载中区域动画已执行完毕;
        },
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
          warpId: 'dataList', // 父布局的id; 如果此项有值,将不使用clearEmptyId的值;
          icon: './static/mescroll/mescroll-empty.png', // 图标,默认null
          tip: '暂无相关数据~', // 提示
          btntext: '去逛逛 >', // 按钮,默认""
          btnClick: function () { // 点击按钮的回调,默认null
            alert('点击了按钮,具体逻辑自行实现')
          },
          supportTap: false // 默认点击事件用onclick,会有300ms的延时;如果您的运行环境支持tap,则可配置true;
        },
        clearId: null, // 加载第一页时需清空数据的列表id; 如果此项有值,将不使用clearEmptyId的值; 使用vue则不能配置此项
        clearEmptyId: null, // 相当于同时设置了clearId和empty.warpId; 简化写法,默认null; 使用vue则不能配置此项
        hardwareClass: 'mescroll-hardware', // 硬件加速样式,动画更流畅,参见mescroll.css
        warpId: null, // 可配置上拉加载的布局添加到指定id的div;默认不配置,默认添加到mescrollId
        warpClass: 'mescroll-upwarp', // 容器,装载布局内容,参见mescroll.css
        htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>', // 上拉加载中的布局
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>', // 无数据的布局
        inited: function (mescroll, upwarp) {
          console.log('up --> inited')
          // 初始化完毕的回调,可缓存dom 比如 mescroll.upProgressDom = upwarp.getElementsByClassName("upwarp-progress")[0];
        },
        showLoading: function (mescroll, upwarp) {
          console.log('up --> showLoading')
          // 上拉加载中.. mescroll.upProgressDom.style.display = "block" 不通过此方式显示,因为ios快速滑动到底部,进度条会无法及时渲染
          upwarp.innerHTML = mescroll.optUp.htmlLoading
        },
        showNoMore: function (mescroll, upwarp) {
          console.log('up --> showNoMore')
          // 无更多数据
          upwarp.innerHTML = mescroll.optUp.htmlNodata
        },
        onScroll: function (mescroll, y, isUp) { // 列表滑动监听,默认onScroll: null;
          // y为列表当前滚动条的位置
          console.log('up --> onScroll 列表当前滚动的距离 y = ' + y + ', 是否向上滑动 isUp = ' + isUp)
        },
        scrollbar: {
          use: typeof window.orientation === 'undefined', // 默认只在PC端自定义滚动条样式
          barClass: 'mescroll-bar'
        },
        lazyLoad: {
          use: true, // 是否开启懒加载,默认false
          attr: 'imgurl', // html标签中,存放网络图片地址的属性名: <img src='占位图' imgurl='网络图'/>
          showClass: 'mescroll-lazy-in', // 显示样式,参见mescroll.css
          delay: 500, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
          offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
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
      this.mescroll.lastScrollTop = this.mescroll.getScrollTop()// 记录当前滚动条的位置
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

    // 选中状态的样式
    getActiveCls (type) {
      return this.pdType === type ? 'active' : ''
    },
    // 切换菜单
    changeTab (type) {
      if (this.pdType !== type) {
        this.pdType = type
        this.dataList = []// 在这里手动置空列表,可显示加载中的请求进度
        this.mescroll.resetUpScroll()// 刷新列表数据
      }
    },

    /* 联网加载列表数据
       在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
       请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
       实际项目以您服务器接口返回的数据为准,无需本地处理分页.
       * */
    getListDataFromNet (pdType, pageNum, pageSize, successCallback, errorCallback) {
      // 延时一秒, 模拟联网
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
