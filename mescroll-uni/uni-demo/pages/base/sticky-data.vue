<!-- 菜单悬浮的原理: 监听滚动条的位置大于某个值时,控制顶部菜单的显示和隐藏 -->
<template>
	<view>
		<!-- 菜单 (悬浮,预先隐藏)-->
		<tabs-sticky v-if="isShowSticky" v-model="tabIndex" :fixed="true" :tabs="tabs" @change="changeTab"></tabs-sticky>
		
		<mescroll-uni @down="downCallback" @up="upCallback" :up="upOption" @scroll="scroll" @init="mescrollInit" @topclick="topClick">
			<!--轮播-->
			<swiper autoplay="true" interval="3000" duration="300" circular="true">
		        <swiper-item>
		            <image style="width: 100%" src="http://www.mescroll.com/img/swiper1.jpg" mode="widthFix"/>
		        </swiper-item>
				<swiper-item>
		            <image style="width: 100%" src="http://www.mescroll.com/img/swiper2.jpg" mode="widthFix"/>
		        </swiper-item>
		    </swiper>
			
			<view class="demo-tip">列表只初始化一次,切换菜单缓存数据</view>
			
			<!-- 菜单 (在mescroll-uni中不能使用fixed,否则iOS滚动时会抖动, 所以需在mescroll-uni之外存在一个一样的菜单) -->
			<view id="tabInList">
				<tabs-sticky v-model="tabIndex" :tabs="tabs" @change="changeTab"></tabs-sticky>
			</view>
			
			<!-- 数据列表 -->
			<pd-list :list="pdList"></pd-list>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import TabsSticky from "@/components/other/tabs-sticky.vue";
	import PdList from "@/components/other/pd-list.vue";
	import mockData from "@/common/pdlist.js"; // 模拟数据
	
	export default {
		components: {
			MescrollUni,
			TabsSticky,
			PdList
		},
		data() {
			return {
				mescroll: null, //mescroll实例对象
				upOption: {
					onScroll: true // 是否监听滚动事件, 默认false (配置为true时,可@scroll="scroll"获取到滚动条位置和方向)
				},
				tabs:[
					{name:'全部', pdList: null, num:1, y:0, curPageLen:0, hasNext:true},
					{name:'母婴', pdList: null, num:1, y:0, curPageLen:0, hasNext:true},
					{name:'图书', pdList: null, num:1, y:0, curPageLen:0, hasNext:true}
					],
				tabIndex: 0, // 当前菜单下标
				preIndex: 0, // 前一个菜单下标
				navTop: null, // nav距离到顶部的距离 (如计算不准确,可直接写死某个值)
				isShowSticky: false // 是否悬浮
			}
		},
		computed: {
			// 列表数据
			pdList() {
				return this.tabs[this.tabIndex].pdList
			}
		},
		methods: {
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调 */
			downCallback(mescroll) {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
				mescroll.resetUpScroll()
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				//联网加载数据
				if(this.isChangeTab){
					mescroll.hideUpScroll(); // 切换菜单,不显示mescroll进度, 显示系统进度条
					uni.showLoading();
				}
				this.getListDataFromNet(mescroll.num, mescroll.size, (curPageData)=>{
					//联网成功的回调
					console.log("mescroll.num=" + mescroll.num + ", mescroll.size=" + mescroll.size + ", curPageData.length=" + curPageData.length);
					
					// 当前tab数据
					let curTab = this.tabs[this.tabIndex]
					
					//设置列表数据
					if(mescroll.num == 1) curTab.pdList = []; //如果是第一页需手动制空列表
					curTab.pdList=curTab.pdList.concat(curPageData); //追加新数据
					
					// 数据渲染完毕再隐藏加载状态
					this.$nextTick(()=>{
						// 需先隐藏加载状态
						mescroll.endSuccess(curPageData.length);
						// 再记录当前页的数据
						curTab.num = mescroll.num; // 页码
						curTab.curPageLen = curPageData.length; // 当前页长
						curTab.hasNext = mescroll.optUp.hasNext; // 是否还有下一页
						
						// 设置nav到顶部的距离 (需根据自身的情况获取navTop的值, 这里放到列表数据渲染完毕之后)
						// 也可以放到onReady里面,或者菜单顶部的数据(轮播等)加载完毕之后..
						if(!this.navTop) this.setNavTop()
						// 保持tab悬浮,列表数据显示第一条
						if(this.isChangeTab){
							this.isChangeTab = false;
							uni.hideLoading();
							if(this.isShowSticky) mescroll.scrollTo(this.navTop, 0)
						}
					})
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			// 设置nav到顶部的距离 (滚动条为0, 菜单顶部的数据加载完毕获取到的navTop数值是最精确的)
			setNavTop(){
				let view = uni.createSelectorQuery().in(this).select('#tabInList');
				view.boundingClientRect(data => {
					console.log('tabInList基本信息 = ' + JSON.stringify(data));
					this.navTop = data.top // 到屏幕顶部的距离
				}).exec();
			},
			// 滚动事件 (需在up配置onScroll:true才生效)
			scroll(mescroll){
				console.log('滚动条位置 = ' + mescroll.getScrollTop() + ', navTop = ' + this.navTop);
				// 菜单悬浮的原理: 监听滚动条的位置大于某个值时,控制顶部菜单的显示和隐藏
				if (mescroll.getScrollTop() >= this.navTop) {
					this.isShowSticky = true // 显示悬浮菜单
				} else {
					this.isShowSticky = false // 隐藏悬浮菜单
				}
			},
			// 点击回到顶部按钮时,先隐藏悬浮菜单,避免闪动
			topClick(){
				this.isShowSticky = false
			},
			// 切换菜单
			changeTab (index) {
				// 记录前一个菜单的数据
				let preTab = this.tabs[this.preIndex]
				preTab.y = this.mescroll.getScrollTop(); // 滚动条位置
				this.preIndex = index;
				// 当前菜单的数据
				let curTab = this.tabs[index]
				if (!curTab.pdList) {
					// 没有初始化,则初始化
					this.isChangeTab = true;
					this.mescroll.resetUpScroll()
				} else{
					// 初始化过,则恢复之前的列表数据
					this.mescroll.setPageNum(curTab.num + 1); // 恢复当前页码
					this.mescroll.endSuccess(curTab.curPageLen, curTab.hasNext); // 恢复是否有下一页或显示空布局
					this.$nextTick(()=>{
						this.mescroll.scrollTo(curTab.y, 0) // 恢复滚动条的位置
					})
				}
			},
			
			/*联网加载列表数据
			在您的实际项目中,请参考官方写法: http://www.mescroll.com/uni.html#tagUpCallback
			请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
			实际项目以您服务器接口返回的数据为准,无需本地处理分页.
			* */
			getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
				//延时一秒,模拟联网
				setTimeout(()=> {
					try{
						let listData = []
						// tabIndex 全部商品0; 母婴1; 图书2;
						if (this.tabIndex === 0) {
							// 全部商品 (模拟分页数据)
							for (let i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
								if (i === mockData.length) break
								listData.push(mockData[i])
							}
						} else if (this.tabIndex === 1) {
							// 母婴
							for (let j = 0; j < mockData.length; j++) {
								if (mockData[j].pdName.indexOf('婴') !== -1) {
									listData.push(mockData[j])
								}
							}
						} else if (this.tabIndex === 2) {
							// 图书
							for (let k = 0; k < mockData.length; k++) {
								if (mockData[k].pdName.indexOf('图书') !== -1) {
									listData.push(mockData[k])
								}
							}
						}
						// 回调
						successCallback && successCallback(listData);
					} catch (e) {
						//联网失败的回调
						errorCallback && errorCallback();
					}
				},1000)
			}
		}
	}
</script>

<style>
	.demo-tip{
		padding: 18rpx;
		font-size: 28rpx;
		font-weight: bold;
		text-align: center;
		background: #CFE0DA;
	}
</style>
