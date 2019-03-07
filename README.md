# mescroll
## mescroll -- 精致的下拉刷新和上拉加载js框架 (JS framework for pull-refresh and pull-up-loading)
## http://www.mescroll.com
1. 原生js, 支持vue, 不依赖jquery,zepto

2. 一套代码多端运行. 完美运行于android,iOS,手机浏览器,兼容PC主流浏览器

3. 参数自由搭配, 随心定制, 轻松拓展

4. 主流APP案例, 丰富经典

5. MIT协议, 免费商用, 欢迎pull requests ~

6. <a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=1067896895dabdf6cf11f4decb0be8bfd3687d3d208730bf2757238ba1948469">mescroll交流群: 633126761</a>
		

## 目录:  

* <a href="https://github.com/mescroll/mescroll/releases" target="_blank">最新版本:1.4.1 (2019-2-1) 重要升级</a> <br/><br/>
* <a href="#功能亮点-">功能亮点 </a> <br/>
* <a href="#快速入门-">快速入门 </a> <br/>
* <a href="#图片懒加载-">图片懒加载 </a> <br/>
* <a href="#vue-cli">vue单文件 (理解原理)</a>
* <a href="#mescroll组件" target="_blank">mescroll组件 (推荐使用)</a>
* <a href="https://github.com/mescroll/mescroll/tree/master/vue-demo" target="_blank">vue-cli demo (建议看看)</a>
* <a href="http://www.mescroll.com/preview.html?name=list-products-vue" target="_blank">vue在线示例 (了解即可)</a>
* <a href="#基础案例-base-demos-"><b>基础案例 base demos</b></a> <br/>
* <a href="#中级案例-intermediate-demos-"><b>中级案例 intermediate demos</b></a> <br/>
* <a href="#高级案例-senior-demos-"><b>高级案例 senior demos</b></a> <br/><br/>
* <a href="#下载基础中级案例源码-">下载基础中级案例 </a> <br/>
* <a href="#获取高级案例源码-">获取高级案例 </a> <br/><br/>
* <a href="#api文档-">API文档 </a> <br/>
* <a href="#常用方法-">常用方法 </a> <br/>
* <a href="#其他方法-">其他方法 </a> <br/><br/>
* <a href="http://www.mescroll.com/qa.html?v=0201">常见问题 </a> <br/>
* <a href="http://www.mescroll.com/reward.html#tagRank">打赏排行榜 </a> <br/>

## 功能亮点 :

1. 自动判断和提示列表无任何数据或无更多数据

2. 支持监听列表滚动事件,无需手动判断处理列表的页码,时间等变量

3. 可指定列表滚动到任何位置,附带平滑效果一键滚动到顶部或底部

4. 可配置列表数据不满屏时,自动加载下一页  

5. 一个界面可支持多个下拉刷新,上拉加载

6. 可临时锁定下拉刷新和上拉加载  

7. 支持图片懒加载,可配置各种占位图与显示动画,上手超简单

## NPM
#### 特别感谢 @<a href="https://github.com/channg">channg</a> 帮忙整理发布NPM
```
    npm install --save mescroll.js    //不要使用cnpm安装
```  

## 快速入门 :

#### 1. 引用 **mescroll.min.css** , **mescroll.min.js**

#### 2. 拷贝以下布局结构:  
```
        <div id="mescroll" class="mescroll"> //id可以改,而"mescroll"的class不能删
            <div> //这个div不能删, 可以改成ul或者其他容器标签.
            	//内容...
            </div>
        </div>  
```  

#### 3. 固定mescroll的div高度. 推荐通过定位的方式,简单快捷: <a href="http://www.mescroll.com/qa.html#q2">(点此查看其他方法)</a> 
```
       .mescroll{
		position: fixed;
		top: 44px;
		bottom: 0;
		height: auto; /*如设置bottom:50px,则需height:auto才能生效*/
	}
```  

#### 4. 创建MeScroll对象:  
```
        var mescroll = new MeScroll("mescroll", { //第一个参数"mescroll"对应上面布局结构div的id (1.3.5版本支持传入dom对象)
    		down: {
			callback: downCallback //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
		},
		up: {
			callback: upCallback, //上拉加载回调,简写callback:function(page){upCallback(page);}
			//以下是一些常用的配置,当然不写也可以的.
			page: {
				num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
				size: 10, //每页数据条数,默认10
			},
			htmlNodata: '<p class="upwarp-nodata">亲,没有更多数据了~</p>',
			noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看.这就是为什么无更多数据 有时候不显示的原因了.
			toTop: {
				//回到顶部按钮
				src: "../img/mescroll-totop.png", //图片路径,默认null,支持网络图
				offset: 1000, //列表滚动1000px才显示回到顶部按钮			
			},
			empty: {
				//列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
				warpId:	"xxid", //父布局的id (1.3.5版本支持传入dom元素)
				icon: "../img/mescroll-empty.png", //图标,默认null,支持网络图
				tip: "暂无相关数据~" //提示
			},
			lazyLoad: {
		        	use: true, // 是否开启懒加载,默认false
		        	attr: 'imgurl', // 网络图片地址的属性名 (图片加载成功会自动移除改属性): <img imgurl='网络图  src='占位图''/>
				offset: 200 // 超出可视区域多少px的图片仍可触发懒加载 默认200. 目的是提前加载可视区域外的部分图片
		    	}
		}
	});
```  
###### 温馨提示:
###### 1. 如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考<a class="blue" href="http://www.mescroll.com/demo.html?v=0201">第一个基础案例</a>
###### 解析: down内部默认调用的是mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback,从而实现刷新列表数据

###### 2. 如果您的项目是在iOS的微信,QQ,Safari等浏览器访问的,建议配置up的isBounce为false,禁止ios的回弹效果; <a class="blue" href="http://www.mescroll.com/qa.html?v=0201#q10">解析(必读)</a>

#### 5. 处理回调:
```
        //下拉刷新的回调
        function downCallback(){
            $.ajax({
                url: 'xxxxxx',
                success: function(data){
                	//联网成功的回调,隐藏下拉刷新的状态;
        		mescroll.endSuccess();//无参,注意此处无参
        		//设置数据
        		//setXxxx(data);//自行实现 TODO
               },
               error: function(data){
               		//联网失败的回调,隐藏下拉刷新的状态
        	        mescroll.endErr();
                }
            });
        }

        //上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数
        function upCallback(page){
            $.ajax({
                url: 'xxxxxx?num='+ page.num +"&size="+ page.size,
                success: function(curPageData){
			//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
			//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
					
			//方法一(推荐): 后台接口有返回列表的总页数 totalPage
			//必传参数(当前页的数据个数, 总页数)
			//mescroll.endByPage(curPageData.length, totalPage);
					
			//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
			//必传参数(当前页的数据个数, 总数据量)
			//mescroll.endBySize(curPageData.length, totalSize);
					
			//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
			//必传参数(当前页的数据个数, 是否有下一页true/false)
			//mescroll.endSuccess(curPageData.length, hasNext);
					
			//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.
			//如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据
			//如果传了hasNext,则翻到第二页即可显示无更多数据.
			//mescroll.endSuccess(curPageData.length);
			
			//提示:curPageData.length必传的原因:
			// 1.使配置的noMoreSize生效
			// 2.判断是否有下一页的首要依据: 当传的值小于page.size时,则一定会认为无更多数据. 比传入的totalPage, totalSize, hasNext具有更高的判断优先级
			// 3.当传的值等于page.size时,才会取totalPage, totalSize, hasNext判断是否有下一页. 传totalPage, totalSize, hasNext主要目的是避免方法四描述的小问题
					
			//设置列表数据
			//setListData(curPageData);//自行实现 TODO
                },
                error: function(){
                	//联网失败的回调,隐藏下拉刷新和上拉加载的状态
	                mescroll.endErr();
                }
         });
        }
```  

--- 以上为mescroll最基本的用法,强烈建议您下载并查看 <a href="#基础案例-base-demos-">mescroll基础案例</a> , 发现mescroll更强大的功能 ~<br/>
--- 基础案例一共6个, 每个案例3分钟, 一共花您18分钟; 这18分钟您将了解mescroll在不同情况下应如何快速配置 ~<br/>
--- 特别建议您, 手动改改 <a href="http://www.mescroll.com/preview.html?name=mescroll-options">mescroll-options</a> 的每项配置, 观察修改后的效果, 轻松理解各项参数, 还会有意想不到的发现哦 ~<br/>
--- 磨刀不误砍柴工,心急吃不了热豆腐. 请静下心来体验与理解mescroll, 一定会让您事半功倍 ~<br/>
--- 如使用中有疑问, 请先查看  <a href="http://www.mescroll.com/qa.html?v=0201">常见问题专区</a> ~<br/><br/>

## 图片懒加载
mescroll的图片懒加载功能是1.3.6新增的,使用超简单 :
##### 1. 确保mescroll至少更新到1.3.6版本
##### 2. 初始化mescroll的时候,在up中配置lazyLoad的use为true :
```
var mescroll = new MeScroll("mescroll", {
	up: {
		lazyLoad: {
	        	use: true, // 是否开启懒加载,默认false
		        attr: 'imgurl', // 网络图片地址的属性名 (图片加载成功会自动移除改属性): <img imgurl='网络图  src='占位图''/>
		        showClass: 'mescroll-lazy-in', // 图片加载成功的显示动画: 渐变显示,参见mescroll.css
		        delay: 500, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
		        offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
	    	}
	}
})
```

##### 3. 设置img或div的 imgurl 属性, 值为图片的网络地址  
```
img标签: <img imgurl="网络图" src="占位图"/> // 占位图直接在src设置; 图片加载成功,就会替换src的占位图
div或其他标签: <div imgurl="网络图" style="background-image: url(占位图)"></div>; // 占位图在css中设置; 图片以背景图的形式展示
```  

##### 4. 至此mescroll的懒加载功能已经可以正常使用了,mescroll在列表滚动时会自动加载可视区域内的图片.另外,有时候您可能会动态添加或修改图片,希望手动触发一下懒加载, 那么只需调用 mescroll.lazyLoad() 或 mescroll.endByPage() 或 mescroll.endBySize() 或 mescroll.endSuccess() 即可.  
		
##### 5. mescroll的所有案例都开启了懒加载,您可参考体验. <a href="http://www.mescroll.com/preview.html?name=list-mescroll-lazy" target="_blank">当然这里还有专门介绍懒加载的案例~</a>


## vue-cli
在vue单文件中的使用步骤  (至少更新到1.3.5版本):
##### 1. 执行npm命令安装mescroll : &nbsp; &nbsp; **npm install --save mescroll.js**    //不要使用cnpm安装
##### 2. 引入mescroll.min.js : &nbsp; &nbsp; **import MeScroll from 'mescroll.js'**
##### 3. 引入mescroll.min.css : &nbsp; &nbsp; **import 'mescroll.js/mescroll.min.css'**
##### 4. vue单文件示例 :
```
<template>
  <div>
    <!--mescroll滚动区域的基本结构,为避免id重复导致的多次初始化,这里使用ref-->
    <div ref="mescroll" class="mescroll">
      <div>
        <!--内容...-->
      </div>
    </div>
  </div>
</template>

<script>
//引入mescroll.min.js和mescroll.min.css
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'

export default {
  name: 'xxx',
  data() {
    return {
      mescroll: null, //mescroll实例对象
      dataList:[] //列表数据
    }
  },
  mounted: function () {
    //创建MeScroll对象
    this.mescroll = new MeScroll(this.$refs.mescroll, { // 在vue的mounted生命周期初始化mescroll,确保此处配置的ref有值
    	// down:{}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则down可不用写了)
      up: {
        callback: this.upCallback,
        // 以下是一些常用的配置,当然不写也可以的.
	page: {
		num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
		size: 10, //每页数据条数,默认10
	},
	htmlNodata: '<p class="upwarp-nodata">亲,没有更多数据了~</p>',
	noMoreSize: 5, //如果列表已无数据,可设置列表总数大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
	toTop: {
		//回到顶部按钮
		src: "./static/mescroll/mescroll-totop.png", //图片路径,默认null,支持网络图
		offset: 1000, //列表滚动1000px才显示回到顶部按钮			
	},
	empty: {
		//列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
		warpId:	"xxid", //父布局的id (1.3.5版本支持传入dom元素)
		icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
		tip: "暂无相关数据~", //提示
	}
      }
    });
  },
  methods: {
    //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page) {
      //联网请求
      axios.get("xxxxxx", {
        params: {
          num: page.num, //页码
          size: page.size //每页长度
        }
      }).then((response)=> {
        //请求的列表数据
        let arr = response.data;
        //如果是第一页需手动制空列表
        if (page.num == 1) this.dataList = [];
        //把请求到的数据添加到列表
        this.dataList = this.dataList.concat(arr);
        //数据渲染成功后,隐藏下拉刷新的状态
        this.$nextTick(() => {
          this.mescroll.endSuccess(arr.length);
        })
      }).catch((e)=> {
        //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endErr();
      })
    }
  },
  // 进入路由时,恢复列表状态
  
  (to, from, next) {  // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      if (vm.mescroll) {
      	// 恢复到之前设置的isBounce状态
        if (vm.mescroll.lastBounce != null) vm.mescroll.setBounce(vm.mescroll.lastBounce)
        // 滚动到之前列表的位置 (注意:路由使用keep-alive才生效)
        if (vm.mescroll.lastScrollTop) {
          vm.mescroll.setScrollTop(vm.mescroll.lastScrollTop)
          setTimeout(() => { // 需延时,因为setScrollTop内部会触发onScroll,可能会渐显回到顶部按钮
            vm.mescroll.setTopBtnFadeDuration(0)// 设置回到顶部按钮显示时无渐显动画
          }, 16)
        }
      }
    })
  },
  // 离开路由时,记录列表状态
  beforeRouteLeave (to, from, next) {  // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    if (this.mescroll) {
      this.mescroll.lastBounce = this.mescroll.optUp.isBounce// 记录当前是否禁止ios回弹
      this.mescroll.setBounce(true) // 允许bounce
      this.mescroll.lastScrollTop = this.mescroll.getScrollTop()// 记录当前滚动条的位置
      this.mescroll.hideTopBtn(0)// 隐藏回到顶部按钮,无渐隐动画
    }
    next()
  }
}
</script>

<style scope>
  /*通过fixed固定mescroll的高度*/
  .mescroll {
    position: fixed;
    top: 44px;
    bottom: 0;
    height: auto;
  }
</style>

```

##### 以上写法有些繁琐,在vue中强烈建议使用mescroll组件,简单快捷:

## mescroll组件
mescroll组件使用步骤 (至少更新到1.3.5版本):
##### 1. 执行npm命令安装mescroll : &nbsp; &nbsp; **npm install --save mescroll.js**    //不要使用cnpm安装
##### 2. 引入mescroll组件 : &nbsp; &nbsp; **import MescrollVue from 'mescroll.js/mescroll.vue'**
##### 3. vue单文件示例 :
```
<template>
  <div>
    <!--mescroll滚动区域的基本结构-->
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <!--内容...-->
    </mescroll-vue>
  </div>
</template>

<script>
// 引入mescroll的vue组件
import MescrollVue from 'mescroll.js/mescroll.vue'

export default {
  name: 'xxx',
  components: {
    MescrollVue // 注册mescroll组件
  },
  data () {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown:{}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: { // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        //以下是一些常用的配置,当然不写也可以的.
	page: {
		num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
		size: 10 //每页数据条数,默认10
	},
	htmlNodata: '<p class="upwarp-nodata">亲,没有更多数据了~</p>',
	noMoreSize: 5, //如果列表已无数据,可设置列表总数大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
	toTop: {
		//回到顶部按钮
		src: "./static/mescroll/mescroll-totop.png", //图片路径,默认null,支持网络图
		offset: 1000 //列表滚动1000px才显示回到顶部按钮			
	},
	empty: {
		//列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
		warpId: "xxid", //父布局的id (1.3.5版本支持传入dom元素)
		icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
		tip: "暂无相关数据~" //提示
	}
      },
      dataList: [] // 列表数据
    }
  },
  beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    })
  },
  beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
  // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next()
  },
  methods: {
    // mescroll组件初始化的回调,可获取到mescroll对象 (如果this.mescroll并没有使用到,可不用写mescrollInit)
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback (page, mescroll) {
      // 联网请求
      axios.get('xxxxxx', {
        params: {
          num: page.num, // 页码
          size: page.size // 每页长度
        }
      }).then((response) => {
        // 请求的列表数据
        let arr = response.data
        // 如果是第一页需手动制空列表
        if (page.num === 1) this.dataList = []
        // 把请求到的数据添加到列表
        this.dataList = this.dataList.concat(arr)
        // 数据渲染成功后,隐藏下拉刷新的状态
        this.$nextTick(() => {
          mescroll.endSuccess(arr.length)
        })
      }).catch((e) => {
        // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        mescroll.endErr()
      })
    }
  }
}
</script>

<style scope>
  /*以fixed的方式固定mescroll的高度*/
  .mescroll {
    position: fixed;
    top: 44px;
    bottom: 0;
    height: auto;
  }
</style>
```	       		

## API文档 :   
#### <a href="http://www.mescroll.com/api.html?v=0201#options" target="_blank">前往官网查看 >> </a>

```
//创建mescroll对象
var mescroll = new MeScroll(id或dom对象, { down: {下拉刷新的配置参数}, up: {上拉加载的配置参数} });
```  

<table border="1" cellspacing="0">
	<tr align="center"><td colspan="3"><b>down 下拉刷新的配置参数</b></td></tr>
	<tr align="center">
		<td>参数名</td>
		<td>默认值</td>
		<td>说明</td>
	</tr>
	<tr align="center">
		<td>use</td>
		<td>true</td>
		<td>是否启用下拉刷新</td>
	</tr>
	<tr align="center">
		<td>auto</td>
		<td>true</td>
		<td>是否在初始化完毕之后自动执行下拉刷新的回调</td>
	</tr>
	<tr align="center">
		<td>autoShowLoading</td>
		<td>false</td>
		<td>当设置auto=true时(在初始化完毕之后自动执行下拉刷新的回调)<br/>是否显示下拉刷新的进度<br/>需配置down的callback才生效</td>
	</tr>
	<tr align="center">
		<td>isLock</td>
		<td>false</td>
		<td>是否锁定下拉刷新</td>
	</tr>
	<tr align="center">
		<td>isBoth</td>
		<td>false</td>
		<td>下拉刷新时,如果滑动到列表底部是否可以同时触发上拉加载</td>
	</tr>
	<tr align="center">
		<td>offset</td>
		<td>80</td>
		<td>在列表顶部,下拉大于80px,松手即可触发下拉刷新的回调</td>
	</tr>
	<tr align="center">
		<td>inOffsetRate (1.4.0新增)</td>
		<td>1</td>
		<td>在列表顶部,下拉的距离小于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉</td>
	</tr>
	<tr align="center">
		<td>outOffsetRate</td>
		<td>0.2</td>
		<td>在列表顶部,下拉的距离大于offset时,改变下拉区域高度比例;值越接近0,高度变化越小,表现为越往下越难拉</td>
	</tr>
	<tr align="center">
		<td>bottomOffset</td>
		<td>20</td>
		<td>当手指touchmove位置在距离body底部20px范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行<br/>这是1.2.1版本新增的配置,请检查最新版~</td>
	</tr>
	<tr align="center">
		<td>minAngle</td>
		<td>45</td>
		<td>触发下拉最少要偏移的角度(滑动的轨迹与水平线的锐角值),取值区间  [0,90];默认45度,即向下滑动的角度大于45度(方位角为45°~145°及225°~315°)则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;<br/>注意:没有必要配置超出[0,90]区间的值,否则角度限制无效; 因为假设配置60, 生效的方位角就已经是60°到120° 和 240°到300°的范围了;<br/>这是1.1.6版本新增的配置,请检查最新版~</td>
	</tr>
	<tr align="center">
		<td>hardwareClass</td>
		<td>"mescroll-hardware"</td>
		<td>硬件加速样式,解决iOS下拉因隐藏进度条而闪屏的问题,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>warpClass</td>
		<td>"mescroll-downwarp"</td>
		<td>下拉刷新的布局容器样式,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>mustToTop<br/>1.3.7版本新增</td>
		<td>false</td>
		<td>是否滚动条必须在顶部,才可以下拉刷新.默认false. 当您发现下拉刷新会闪白屏时,设置true即可修复.</td>
	</tr>
	<tr align="center">
		<td>warpId</td>
		<td>null</td>
		<td>可配置下拉刷新的布局添加到指定id的div <br/> 默认不配置,默认添加到mescrollId</td>
	</tr>
	<tr align="center">
		<td>resetClass</td>
		<td>"mescroll-downwarp-reset"</td>
		<td>下拉刷新高度重置的动画,参见mescroll.css</td>
	</tr>
    <tr align="center">
		<td>textInOffset<br/>1.3.7版本新增</td>
		<td>'下拉刷新'</td>
		<td>下拉的距离在offset范围内的提示文本</td>
	</tr>
    <tr align="center">
		<td>textOutOffset<br/>1.3.7版本新增</td>
		<td>'释放更新'</td>
		<td>下拉的距离大于offset范围的提示文本</td>
	</tr>
    <tr align="center">
		<td>textLoading<br/>1.3.7版本新增</td>
		<td>'加载中 ...'</td>
		<td>加载中的提示文本</td>
	</tr>
	<tr align="center">
		<td>htmlContent</td>
		<td>'&lt;p class="downwarp-progress"&gt;&lt;/p&gt;&lt;p class="downwarp-tip"&gt;&lt;/p&gt;'</td>
		<td>下拉刷新的布局内容</td>
	</tr>
	<tr align="center">
		<td>inited</td>
		<td>function(mescroll, downwarp) { ... }</td>
		<td>下拉刷新初始化完毕的回调(mescroll实例对象,下拉刷新容器dom对象)</td>
	</tr>
	<tr align="center">
		<td>inOffset</td>
		<td>function(mescroll) { ... }</td>
		<td>下拉的距离进入offset范围内那一刻的回调(mescroll实例对象)</td>
	</tr>
	<tr align="center">
		<td>outOffset</td>
		<td>function(mescroll) { ... }</td>
		<td>下拉的距离大于offset那一刻的回调(mescroll实例对象)</td>
	</tr>
	<tr align="center">
		<td>onMoving</td>
		<td>function(mescroll, rate, downHight) { ... }</td>
		<td>下拉过程中的回调,滑动过程一直在执行; rate下拉区域当前高度与指定距离的比值(inOffset: rate<1; outOffset: rate>=1); downHight当前下拉区域的高度</td>
	</tr>
	<tr align="center">
		<td>beforeLoading</td>
		<td>function(mescroll, downwarp) { return false; }</td>
		<td>准备触发下拉刷新的回调; 如果要完全自定义下拉刷新,那么return true,此时将不触发showLoading和callback回调; 参考案例【淘宝 v6.8.0】</td>
	</tr>
	<tr align="center">
		<td>showLoading</td>
		<td>function(mescroll) { ... }</td>
		<td>显示下拉刷新进度的回调</td>
	</tr>
	<tr align="center">
		<td>afterLoading</td>
		<td>function(mescroll) { return 0 }</td>
		<td>结束加载中,准备隐藏下拉的回调 <br/>返回结束下拉的延时执行时间,默认0ms<br/>常用于结束下拉之前再显示另外一小段动画,才去隐藏下拉刷新的场景, 参考案例【dotJump】</td>
	</tr>
	<tr align="center">
		<td>callback</td>
		<td>function(mescroll) { mescroll.resetUpScroll(); }</td>
		<td>下拉刷新的回调; 默认重置上拉加载列表为第一页</td>
	</tr>
</table>

<br/>

<table border="1" cellspacing="0">
	<tr align="center"><td colspan="3"><b>up 上拉加载的配置参数</b></td></tr>
	<tr align="center">
		<td>参数名</td>
		<td>默认值</td>
		<td>说明</td>
	</tr>
	<tr align="center">
		<td>use</td>
		<td>true</td>
		<td>是否启用上拉加载</td>
	</tr>
	<tr align="center">
		<td>auto</td>
		<td>false</td>
		<td>是否在初始化完毕之后自动执行上拉加载的回调</td>
	</tr>
	<tr align="center">
		<td>isLock</td>
		<td>false</td>
		<td>是否锁定上拉加载</td>
	</tr>
	<tr align="center">
		<td>isBoth</td>
		<td>false</td>
		<td>上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新</td>
	</tr>
	<tr align="center">
		<td>isBounce</td>
		<td>true</td>
		<td>是否允许ios的bounce回弹;默认true,允许回弹 (v 1.3.0新增)</td>
	</tr>
	<tr align="center">
		<td>offset</td>
		<td>100</td>
		<td>列表滚动到距离底部小于100px,即可触发上拉加载的回调</td>
	</tr>
	<tr align="center">
		<td>noMoreSize</td>
		<td>5</td>
		<td>如果列表已无数据,可设置列表的总数量要大于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看</td>
	</tr>
	<tr align="center">
		<td>toTop</td>
		<td align="left">{ <br/>
			warpId: null, <br/>
			src: null, <br/>
			html: null, <br/>
			offset: 1000, <br/>
			warpClass: "mescroll-totop", <br/>
			showClass: "mescroll-fade-in", <br/>
			hideClass: "mescroll-fade-out", <br/>
			duration: 300, <br/>
			supportTap: false <br/>
			btnClick : null <br/>
		}</td>
		<td align="left">回到顶部按钮的配置: <br/>
			warpId: 父布局的id; 默认添加在body中 (1.3.5版本支持传入dom元素)  <br/>
			src: 图片路径,必须配置src才会显示回到顶部按钮,不配置不显示 <br/>
			html: 标签内容,默认null; 如果同时设置了src,则优先取src (2017/12/10新增) <br/>
			offset: 列表滚动1000px显示回到顶部按钮 <br/>
			warpClass: 按钮样式,参见mescroll.css <br/>
			showClass: 显示样式,参见mescroll.css <br/>
			hideClass: 隐藏样式,参见mescroll.css <br/>
			duration: 回到顶部的动画时长,默认300ms <br/>
			supportTap: 如果您的运行环境支持tap,则可配置true,可减少点击延时,快速响应事件;默认false,通过onclick添加点击事件; (v 1.3.0 新增) (注:微信和PC无法响应tap事件) <br/>
			btnClick: 点击按钮的回调; 提示:如果在回调里return true,将不执行回到顶部的操作
		</td>
	</tr>
	<tr align="center">
		<td>loadFull</td>
		<td align="left">{ <br/>
			use: false, <br/>
			delay: 500 <br/>
		}</td>
		<td align="left">
			use: 列表数据过少,不足以滑动触发上拉加载,是否自动加载下一页,直到满屏或者无更多数据为止; 默认false,因为可通过调高page.size避免这个情况 <br/>
			delay: 延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载中区域动画已执行完毕;
		</td>
	</tr>
	<tr align="center">
		<td>empty</td>
		<td align="left">{ <br/>
			warpId: null, <br/>
			icon: null, <br/>
			tip: "暂无相关数据~", <br/>
			btntext: "", <br/>
			btnClick: null, <br/>
			supportTap: false <br/>
		}</td>
		<td align="left">列表第一页无任何数据时,显示的空提示布局; 需配置warpId或clearEmptyId才生效 <br/>
			warpId: 父布局的id; 如果此项有值,将不使用clearEmptyId的值; (1.3.5版本支持传入dom元素) <br/>
			icon: 空布局的图标路径 <br/>
			tip: 提示文本 <br/>
			btntext: 按钮文本 <br/>
			btnClick: 点击按钮的回调 <br/>
			supportTap: 如果您的运行环境支持tap,则可配置true,可减少点击延时,快速响应事件;默认false,通过onclick添加点击事件; (v 1.3.0 新增) (注:微信和PC无法响应tap事件) <br/>
		</td>
	</tr>
	<tr align="center">
		<td>clearId</td>
		<td>null</td>
		<td>加载第一页时需清空数据的列表id; 如果此项有值,将不使用clearEmptyId的值; 在vue中使用,则无需配置此项</td>
	</tr>
	<tr align="center">
		<td>clearEmptyId</td>
		<td>null</td>
		<td>相当于同时设置了clearId和empty.warpId; 简化写法; 在vue中使用,不能配置此项  (1.3.5版本支持传入dom元素)</td>
	</tr>
	<tr align="center">
		<td>hardwareClass</td>
		<td>"mescroll-hardware"</td>
		<td>硬件加速样式,使动画更流畅,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>warpClass</td>
		<td>"mescroll-upwarp"</td>
		<td>上拉加载的布局容器样式,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>warpId</td>
		<td>null</td>
		<td>可配置上拉加载的布局添加到指定id的div;默认不配置,默认添加到mescrollId</td>
	</tr>
	<tr align="center">
		<td>htmlLoading</td>
		<td>'&lt;p class="upwarp-progress mescroll-rotate"&gt;&lt;/p&gt;&lt;p class="upwarp-tip"&gt;加载中..&lt;/p&gt;'</td>
		<td>上拉加载中的布局,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>htmlNodata</td>
		<td>'&lt;p class="upwarp-nodata"&gt;-- END --&lt;/p&gt;'</td>
		<td>无数据的布局,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>inited</td>
		<td>function(mescroll, upwarp){}</td>
		<td>初始化完毕的回调; 回调(mescroll实例, upwarp上拉加载的布局Dom对象)</td>
	</tr>
	<tr align="center">
		<td>showLoading</td>
		<td>function(mescroll, upwarp){ ... }</td>
		<td>显示上拉加载中的回调; 回调(mescroll实例, upwarp上拉加载的布局Dom对象)</td>
	</tr>
	<tr align="center">
		<td>showNoMore</td>
		<td>function(mescroll, upwarp){ ... }</td>
		<td>显示无更多数据的回调; 回调(mescroll实例, upwarp上拉加载的布局Dom对象)</td>
	</tr>
	<tr align="center">
		<td>onScroll</td>
		<td>null</td>
		<td>列表滑动监听, 默认null<br/>例 onScroll : function(mescroll, y, isUp){ ... };<br/>y为列表当前滚动条的位置;<br/>isUp=true向上滑,isUp=false向下滑)<br/>isUp是1.2.1版本新增的配置,请检查最新版~</td>
	</tr>
	<tr align="center">
		<td>callback</td>
		<td>function(page,mescroll){}</td>
		<td>上拉加载的回调; 回调(page对象,mescroll实例), 其中page={num:页码, size:每页数据的数量, time:第一页数据的时间}</td>
	</tr>
	<tr align="center">
		<td>page</td>
		<td align="left">{ <br/>num:0, <br/> size:10, <br/> time:null <br/>}</td>
		<td align="left">num: 当前页码,默认0,回调之前会加1,即callback(page)会从1开始; <br/>size: 每页数据的数量; <br/>time: 加载第一页数据服务器返回的时间;防止用户翻页时,后台新增了数据从而导致下一页数据重复;</td>
	</tr>
	<tr>
		<td align="center">scrollbar</td>
		<td>{<br/>&nbsp; use : ... , <br/>&nbsp; barClass : "mescroll-bar" <br/>}</td>
		<td>use : 是否开启自定义滚动条; PC端默认true开启自定义滚动条; 移动端默认false不使用 <br/>barClass : 自定义滚动条的样式; 参见mescroll.css</td>
	</tr>
	<tr>
		<td align="center">lazyLoad<br/>（1.3.6新增）</td>
		<td>
			{<br/>
		        use: false,<br/>
		        attr: 'imgurl',<br/>
		        showClass: 'mescroll-lazy-in',<br/>
		        delay: 500,<br/>
		        offset: 200<br/>
		    }
		</td>
		<td>
			use: 是否开启懒加载,默认false<br/>
	        attr: 标签中网络图片地址的属性名,默认"imgurl"<br/>
	        showClass: 显示样式:渐变显示,参见mescroll.css<br/>
	        delay: 列表滚动的过程中检查一次图片是否在可视区域的时间间隔,默认500 (单位ms)<br/>
	        offset: 超出可视区域多少px的图片仍可触发懒加载 默认200
		</td>
	</tr>
</table>  

## 常用方法 :   
#### <a href="http://www.mescroll.com/api.html#methods" target="_blank">前往官网查看 >> </a>  

<table border="1" cellspacing="0">
	<tr align="center">
		<td>方法名</td>
		<td>说明</td>
	</tr>
	<tr align="center">
		<td align="left">mescroll.endByPage(dataSize, totalPage, systime);<br/>(v 1.2.1 新增)</td>
		<td align="left">隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用<br />
		dataSize : 当前页获取的数据总数(注意是当前页)<br />
		totalPage : 列表的总页数<br/>
		systime : 加载第一页数据的服务器时间 (可空);
		</td>
	</tr>
	<tr align="center">
		<td align="left">mescroll.endBySize(dataSize, totalSize, systime);<br/>(v 1.2.1 新增)</td>
		<td align="left">隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用<br />
		dataSize : 当前页获取的数据总数(注意是当前页)<br />
		totalSize : 列表的总数据量<br/>
		systime : 加载第一页数据的服务器时间 (可空);
		</td>
	</tr>
	<tr align="center">
		<td align="left">mescroll.endSuccess(dataSize, hasNext, systime);<br/>(v 1.2.1 调整)</td>
		<td align="left">隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用<br />
		dataSize : 当前页获取的数据量(注意是当前页)<br />
		hasNext : 是否有下一页数据true/false<br/>
		systime : 加载第一页数据的服务器时间 (可空);
		</td>
	</tr>
	<tr align="center">
		<td>mescroll.endErr();</td>
		<td>隐藏下拉刷新和上拉加载的状态, 在联网获取数据失败后调用;<br/>mescroll内部会自动恢复原来的页码,时间等变量;</td>
	</tr>
	<tr align="center">
		<td>mescroll.resetUpScroll( isShowLoading );</td>
		<td>重置列表为第一页 (常用于列表筛选条件变化或切换菜单时重新刷新列表数据)<br />内部实现: 把page.num=1,再主动触发up.callback<br />isShowLoading 是否显示进度布局; <br />1.默认null,不传参,则显示上拉加载的进度布局 <br />2.传参true, 则显示下拉刷新的进度布局<br />3.传参false,则不显示上拉和下拉的进度 (常用于静默更新列表数据)</td>
	</tr>
	<tr align="center">
		<td>mescroll.triggerDownScroll();</td>
		<td>主动触发下拉刷新</td>
	</tr>
	<tr align="center">
		<td>mescroll.triggerUpScroll();</td>
		<td>主动触发上拉加载</td>
	</tr>
	<tr align="center">
		<td>mescroll.setPageNum(num);<br/>(v 1.2.5 新增)</td>
		<td>设置当前page.num的值</td>
	</tr>
	<tr align="center">
		<td>mescroll.setPageSize(size);<br/>(v 1.2.5 新增)</td>
		<td>设置当前page.size的值</td>
	</tr>
	<tr align="center">
		<td>mescroll.scrollTo( y, t );</td>
		<td>滚动列表到指定位置 ( y=0回到列表顶部; 如需滚动到列表底部,可设置y很大的值,比如y=99999 ); t时长,单位ms,默认300</td>
	</tr>
	<tr align="center">
		<td>mescroll.optDown;</td>
		<td>获取下拉刷新的配置</td>
	</tr>
	<tr align="center">
		<td>mescroll.optUp;</td>
		<td>获取上拉加载的配置</td>
	</tr>
	<tr align="center">
		<td>mescroll.lockDownScroll( isLock );</td>
		<td>锁定下拉刷新 ( isLock=ture,null 锁定 ; isLock=false 解锁 )</td>
	</tr>
	<tr align="center">
		<td>mescroll.lockUpScroll( isLock );</td>
		<td>锁定上拉加载 ( isLock=ture,null 锁定 ; isLock=false 解锁 )</td>
	</tr>
	<tr align="center">
		<td>mescroll.os<br/>(v 1.2.5 新增)</td>
		<td>
			<b>mescroll.os.ios</b> 为true, 则是ios设备;<br/>
			<b>mescroll.os.android</b> 为true, 则是android设备;<br/>
			<b>mescroll.os.pc</b> 为true, 则是PC端;
		</td>
	</tr>
	<tr align="center">
		<td>mescroll.setBounce(boolean)<br/>(v 1.3.0 新增)</td>
		<td>
			<b>mescroll.setBounce(true)</b> 允许bounce;<br/>
			<b>mescroll.setBounce(false)</b> 禁止bounce
		</td>
	</tr>
	<tr align="center">
		<td>mescroll.lazyLoad(delay)<br/>(v 1.3.6 新增)</td>
		<td>
			主动触发懒加载: 自动加载可视区域的图片.<br />
			delay:延时加载图片的时间,默认500ms.目的是确保dom元素已渲染完成.
		</td>
	</tr>
</table>

## 其他方法 :  
#### <a href="http://www.mescroll.com/api.html#others" target="_blank">前往官网查看 >> </a>  

<table border="1" cellspacing="0">
	<tr align="center"><td colspan="2">以下方法不常用,您可灵活运用于更复杂的场景</tr>
	<tr align="center">
		<td width="288px">mescroll.showDownScroll();</td>
		<td width="600px">显示下拉刷新的进度布局<br/>
		mescroll.triggerDownScroll() 和 mescroll.resetUpScroll() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.endDownScroll();</td>
		<td>隐藏下拉刷新的进度布局<br/>
		mescroll.endSuccess() 和 mescroll.endErr() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.showUpScroll();</td>
		<td>显示上拉加载的进度布局<br/>
		mescroll.triggerDownScroll() 和 mescroll.resetUpScroll() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.showNoMore();</td>
		<td>显示上拉无更多数据的布局<br/>
		mescroll.endUpScroll() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.hideUpScroll(displayAble);</td>
		<td>隐藏上拉加载的布局<br/>
		mescroll.endUpScroll() 内部有调用<br/>
		1.3.5新增参数 displayAble: 是否通过display:none隐藏, 默认false通过visibility:hidden的方式隐藏
		</td>
	</tr>
	<tr align="center">
		<td>mescroll.clearDataList();</td>
		<td>清空上拉加载的数据列表<br/>
		mescroll.resetUpScroll() 和 mescroll.endSuccess() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.loadFull();</td>
		<td>检查如果加载的数据过少,无法触发上拉加载时,则自动加载下一页,直到满屏或无数据<br/>
		此方法最好在列表的图片数据加载完成之后调用,以便计算列表内容高度的准确性<br/>
		mescroll.endSuccess() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.showEmpty();</td>
		<td>显示无任何数据的空布局<br/>
		mescroll.endSuccess() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.removeEmpty();</td>
		<td>移除无任何数据的空布局<br/>
		mescroll.endSuccess() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.showTopBtn(time);</td>
		<td>显示回到顶部的按钮<br/>time: 显示的动画时长,默认0.5秒 (1.3.5版本新增参数)</td>
	</tr>
	<tr align="center">
		<td>mescroll.hideTopBtn(time);</td>
		<td>隐藏回到顶部的按钮 <br/>time: 隐藏的动画时长,默认0.5秒 (1.3.5版本新增参数)</td>
	</tr>
	<tr align="center">
		<td>mescroll.setTopBtnFadeDuration(time);<br/>(1.3.5版本新增)</td>
		<td>设置回到顶部按钮的显示和隐藏的动画时长 <br/>time: 显示隐藏动画时长,默认0.5秒</td>
	</tr>
	<tr align="center">
		<td>mescroll.getScrollTop();</td>
		<td>获取滚动条的位置y; 也可以在up配置onScroll监听滚动条的位置</td>
	</tr>
	<tr align="center">
		<td>mescroll.getBodyHeight();</td>
		<td>获取body的高度 </td>
	</tr>
	<tr align="center">
		<td>mescroll.getClientHeight();</td>
		<td>获取滚动容器的高度 </td>
	</tr>
	<tr align="center">
		<td>mescroll.getScrollHeight();</td>
		<td>获取滚动内容的高度 </td>
	</tr>
	<tr align="center">
		<td>mescroll.getToBottom();<br/>(v 1.3.0新增)</td>
		<td>获取当前滚动条到底部的距离 </td>
	</tr>
	<tr align="center">
		<td>mescroll.getStep(star, end, callback, t, rate);<br/>(v 1.2.8 新增) </td>
		<td align="left">
			star : 开始值; <br/>
		 	end : 结束值; <br/>
		 	callback(step,timer) :  回调 function(step,timer), <br/>
		 	t : 计步时长; 传0则直接回调end值; 不传则默认300ms ; <br/>
		 	rate : 周期; 不传则默认30ms计步一次 ; <br/>
		 	此方法相当于默认在300ms内,每30ms返回star到end之间的阶梯值step; 可用于模拟帧动画 <br/>
		 	比如mescroll的回到顶部缓冲动画,轮播导航案例的顶部菜单滚动都是通过getStep实现<br/>
		 	(注: 您可根据实际情况在 callback 通过 window.clearInterval(timer) 提前结束计步器)
	 	</td>
	</tr>
	<tr align="center">
		<td>mescroll.version;<br/>(v 1.3.0新增)</td>
		<td>mescroll的版本号</td>
	</tr>
	<tr align="center">
		<td>mescroll.destroy();</td>
		<td>销毁mescroll</td>
	</tr>
</table>

## 基础案例 base demos :  
#### <a href="http://www.mescroll.com/demo.html" target="_blank">前往官网查看 >> </a>  

#### 1. 【商品列表】演示下拉刷新重置列表数据
#### ---------- <a href="http://www.mescroll.com/preview.html?name=list-products" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/base/list-products.html) ---------- 
![](https://qn.xhjfx.com/mescroll/list-products.gif) 
<br/><br/>  

#### 2. 【新闻列表】演示下拉刷新添加新数据到列表顶部
#### ---------- <a href="http://www.mescroll.com/preview.html?name=list-news" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/base/list-news.html) ---------- 
![](https://qn.xhjfx.com/mescroll/list-news.gif) 
<br/><br/>  

#### 3. 【单mescroll】演示每次切换菜单都重置列表,不缓存数据
#### ---------- <a href="http://www.mescroll.com/preview.html?name=list-mescroll-one" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/base/list-mescroll-one.html) ---------- 
![](https://qn.xhjfx.com/mescroll/list-mescroll-one.gif) 
<br/><br/>  

#### 4. 【多mescroll】演示每个菜单列表仅初始化一次,切换菜单缓存数据
#### ---------- <a href="http://www.mescroll.com/preview.html?name=list-mescroll-more" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/base/list-mescroll-more.html) ---------- 
![](https://qn.xhjfx.com/mescroll/list-mescroll-more.gif) 
<br/><br/>  

#### 5. 【满屏加载与锁定滑动】演示自动满屏加载,可临时锁定上拉刷新和下拉加载
#### ---------- <a href="http://www.mescroll.com/preview.html?name=list-full-lock" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/base/list-full-lock.html) ---------- 
![](https://qn.xhjfx.com/mescroll/list-full-lock.gif) 
<br/><br/>  

#### 6. 【mescroll所有配置项】源码展示mescroll所有配置项, 快速理解与调试mescroll
#### ---------- <a href="http://www.mescroll.com/preview.html?name=mescroll-options" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/base/mescroll-options.html) ---------- 
![](https://qn.xhjfx.com/mescroll/mescroll-options.gif) 
<br/><br/>  

## 中级案例 intermediate demos :  
#### <a href="http://www.mescroll.com/demo.html#middle" target="_blank">前往官网查看 >> </a>  

#### 1. 【知乎 v3.53.0】APP的下拉刷新上拉加载
#### ---------- <a href="http://www.mescroll.com/preview.html?name=zhihu" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/zhihu/zhihu.html) ---------- 
![](https://qn.xhjfx.com/mescroll/zhihu.gif) 
<br/><br/>  

#### 2. 【新浪微博 v7.6.1】APP的下拉刷新上拉加载
#### ---------- <a href="http://www.mescroll.com/preview.html?name=xinlang" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/xinlang/xinlang.html) ---------- 
![](https://qn.xhjfx.com/mescroll/xinlang.gif) 
<br/><br/>  

#### 3. 【贝贝 v6.0.0】APP的下拉刷新上拉加载
#### ---------- <a href="http://www.mescroll.com/preview.html?name=beibei" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/beibei/beibei.html) ---------- 
![](https://qn.xhjfx.com/mescroll/beibei.gif) 
<br/><br/>  

#### 4. 【雅布力 v2.4.0】APP的下拉刷新上拉加载
#### ---------- <a href="http://www.mescroll.com/preview.html?name=yabuli" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/yabuli/yabuli.html) ---------- 
![](https://qn.xhjfx.com/mescroll/yabuli.gif) 
<br/><br/>  


#### 5. 【吸顶悬浮效果】
#### ---------- <a href="http://www.mescroll.com/preview.html?name=sticky" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/sticky/mescroll-sticky.html) ---------- 
![](https://qn.xhjfx.com/mescroll/mescroll-sticky.gif) 
<br/><br/>  


#### 6. 【关键词搜索】
#### ---------- <a href="http://www.mescroll.com/preview.html?name=search" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/search/mescroll-search.html) ---------- 
![](https://qn.xhjfx.com/mescroll/mescroll-search.gif) 
<br/><br/>  


#### 7. 【轮播切换效果】
#### ---------- <a href="http://www.mescroll.com/preview.html?name=swiper-tap" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/swiper/mescroll-swiper-tap.html) ---------- 
![](https://qn.xhjfx.com/mescroll/mescroll-swiper-tap.gif) 
<br/><br/>  


#### 8. 【轮播导航菜单】
#### ---------- <a href="http://www.mescroll.com/preview.html?name=swiper-nav" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/swiper/mescroll-swiper-nav.html) ---------- 
![](https://qn.xhjfx.com/mescroll/mescroll-swiper-tap.gif) 
<br/><br/>  

## 高级案例 senior demos :  
#### <a href="http://www.mescroll.com/demo.html#hight" target="_blank">前往官网查看 >> </a>  

#### 1. 【淘宝 v6.8.0】APP的下拉刷新上拉加载
![](https://qn.xhjfx.com/mescroll/taobao.gif) 
<br/><br/>  

#### 2. 【京东 v6.1.0】APP的下拉刷新上拉加载
![](https://qn.xhjfx.com/mescroll/jingdong.gif) 
<br/><br/>  

#### 3. 【美团 v8.2.3】APP的下拉刷新上拉加载
![](https://qn.xhjfx.com/mescroll/meituan.gif) 
<br/><br/>  

#### 4. 【美囤妈妈 v2.0.5】APP的下拉刷新上拉加载
![](https://qn.xhjfx.com/mescroll/meitunmama.gif) 
<br/><br/>  

## 下载基础中级案例源码 :  

<table border="1" cellspacing="0" width="100%">
	<tr align="center" height="80px">
		<td>mescroll.css</td>
		<td>mescroll.js</td>
		<td>mescroll所有基础案例源码</td>
		<td>mescroll所有中级案例源码</td>
	</tr>
	<tr align="center" height="80px">
		<td colspan="4"> <a href="https://codeload.github.com/mescroll/mescroll/zip/master" target="_blank">【立即下载】</a> </td>
	</tr>
</table>  


## 获取高级案例源码 :  

<table border="1" cellspacing="0" width="100%">
	<tr align="center">
		<td rowspan="4" width="400px">
		mescroll高级案例源码 -- 淘宝 v6.8.0<br/>
		mescroll高级案例源码 -- 京东 v6.1.0<br/>
		mescroll高级案例源码 -- 美团 v8.2.3<br/>
		mescroll高级案例源码 -- 美囤妈妈 v2.0.5
		</td>
	</tr>
	<tr align="center">
		<td width="480px">
		【 获取方法一 】<br/>
		我是大神 , 我为mescroll添砖加瓦<br/>
		在 GitHub 上 Star 和 Fork 了 mescroll<br/>
		并提出优化或改进建议,获得了采纳 ~
		</td>
	</tr>
	<tr align="center">
		<td width="480px">
		【 获取方法二 】<br/>
		我爱分享 , 编写mescroll相关案例<br/>
		联系 QQ 2260429223 投稿<br/>
		评审优化后,在mescroll官网展示<br/>
		源码指向您的GitHub
		</td>
	</tr>
	<tr align="center">
		<td width="480px">
		【 获取方法三 】<br/>
		我不做伸手党, 打赏任意金额<br/>
		联系 QQ 2260429223 获取高级案例源码<br/>
		<a href="http://www.mescroll.com/reward.html#tagRank">打赏排行 榜上有名</a>
		</td>
	</tr>
</table>  

![](http://www.mescroll.com/img/pay-wx.jpg)  

![](http://www.mescroll.com/img/pay-zfb.jpg) 
