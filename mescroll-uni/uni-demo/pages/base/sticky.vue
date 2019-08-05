<!-- 菜单悬浮的原理: 监听滚动条的位置大于某个值时,控制顶部菜单的显示和隐藏 -->
<template>
	<view>
		<!-- 菜单 (悬浮,预先隐藏)-->
		<tabs-sticky v-if="isShowSticky" v-model="tabIndex" :fixed="true" @change="changeTab"></tabs-sticky>
		
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
			
			<!-- 菜单 (在mescroll-uni中不能使用fixed,否则iOS滚动时会抖动, 所以需在mescroll-uni之外存在一个一样的菜单) -->
			<view id="tabInList">
				<tabs-sticky v-model="tabIndex" @change="changeTab"></tabs-sticky>
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
				pdList: [], //列表数据
				upOption: {
					onScroll: true // 是否监听滚动事件, 默认false (配置为true时,可@scroll="scroll"获取到滚动条位置和方向)
				},
				tabIndex: 0, // 当前菜单下标
				navTop: null, // nav距离到顶部的距离 (如计算不准确,可直接写死某个值)
				isShowSticky: false // 是否悬浮
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
					uni.showLoading({title:'加载中...'});
				}
				this.getListDataFromNet(mescroll.num, mescroll.size, (curPageData)=>{
					//联网成功的回调
					console.log("mescroll.num=" + mescroll.num + ", mescroll.size=" + mescroll.size + ", curPageData.length=" + curPageData.length);

					//设置列表数据
					if(mescroll.num == 1) this.pdList = []; //如果是第一页需手动制空列表
					this.pdList=this.pdList.concat(curPageData); //追加新数据
					
					// 数据渲染完毕再隐藏加载状态
					this.$nextTick(()=>{
						mescroll.endSuccess(curPageData.length);
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
				// this.pdList = []// 在这里手动置空列表,可显示加载中的请求进度 (但是会使悬浮中的tab隐藏)
				this.isChangeTab = true; // 标记菜单切换
				this.mescroll.resetUpScroll()// 刷新列表数据
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
						// tabIndex 全部商品0; 奶粉1; 图书2;
						if (this.tabIndex === 0) {
							// 全部商品 (模拟分页数据)
							for (let i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
								if (i === mockData.length) break
								listData.push(mockData[i])
							}
						} else if (this.tabIndex === 1) {
							// 奶粉
							for (let j = 0; j < mockData.length; j++) {
								if (mockData[j].pdName.indexOf('奶') !== -1) {
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
	
</style>
