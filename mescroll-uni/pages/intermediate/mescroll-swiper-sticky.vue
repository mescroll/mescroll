<!-- 吸顶轮播菜单导航 -->
<template>
	<view>
		<!-- 需设置:sticky="true", 此时应避免在mescroll-body标签前面加其他非定位的元素, 否则下拉区域会被挤出, 无法会隐藏.-->
		<mescroll-body :sticky="true" @init="mescrollInit" @down="downCallback" :up="upOption">
			<!-- 顶部内容 -->
			<view :style="{height: topHeight+'px', overflow:'hidden'}">
				<image style="width: 100%;height: 340rpx;" src="https://www.mescroll.com/img/swiper1.jpg"/>
				<image style="width: 100%;height: 245rpx;border-bottom: 15rpx solid #f2f2f2" src="https://www.mescroll.com/img/beibei/beibei2.jpg"/>
			</view>
			
			<!-- sticky吸顶悬浮的菜单, 父元素必须是 mescroll -->
			<view class="sticky-tabs">
				<!-- 当设置tab-width,指定每个tab宽度时,则不使用flex布局,改用水平滑动 -->
				<me-tabs v-model="tabIndex" :tabs="tabs" :tab-width="130"></me-tabs>
			</view>
			
			<!-- 数据列表 -->
			<swiper :style="{height: swiperHeight}" :current="tabIndex" @change="swiperChange">
				<swiper-item v-for="(tab,i) in tabs" :key="i">
					<mescroll-item ref="mescrollItem" :i="i" :index="tabIndex" :tabs="tabs" :height="swiperHeight" :disable-scroll="disableScroll"></mescroll-item>
				</swiper-item>
			</swiper>
		</mescroll-body>
		
		<!-- 此处可以写其他fixed定位元素 -->
		<!-- <view></view> -->
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import MescrollItem from "./mescroll-swiper-sticky-item.vue";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			MescrollItem
		},
		data() {
			return {
				upOption:{
					use: false // 主体框架只启用下拉刷新
				},
				topHeight: uni.upx2px(600), // 顶部内容的高度 (单位px)
				swiperHeight: "", // 需要固定swiper的高度 (单位px)
				tabs: [{name:'全部'}, {name:'奶粉'}, {name:'面膜'}, {name:'图书'}, {name:'果汁'}, {name:'奶瓶'}, {name:'美素'}, {name:'花王'}, {name:'韩蜜'}],
				tabIndex: 0, // 当前菜单下标
				disableScroll: true // swiper列表是否禁止滚动
			}
		},
		watch: {
			tabIndex(i) {
				// 当列表禁止滚动时,需把列表滚动条置顶 (解决问题: "全部"tab翻到第二页,切换到其他tab,滚动到顶部,再切回"全部"tab,此时的列表数据应该重头开始)
				if(this.disableScroll){
					this.disableScroll = false // 当disableScroll=true时,scroll-view的scrollTo会失效,需先开启,再置顶
					this.$nextTick(()=>{
						let mescroll = this.getMescroll(i)
						mescroll && mescroll.scrollTo(0,0)
						setTimeout(()=>{ // 经测试android真机需延时300ms才能恢复禁止滚动,否则scrollTo有可能无效
							this.disableScroll = true
						},300)
					})
				}
			}
		},
		onLoad() {
			// 需要固定swiper的高度 (需减去悬浮tabs的高度64rpx)
			this.swiperHeight = uni.getSystemInfoSync().windowHeight - uni.upx2px(64) + 'px'
		},
		mounted() {
			// #ifdef H5
			uni.pageScrollTo({scrollTop: 0,duration: 0}) // 刷新浏览器,重置滚动条
			// #endif
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				this.mescroll.endSuccess()
			},
			// 轮播菜单
			swiperChange(e){
				this.tabIndex = e.detail.current
			},
			// 获取指定下标的mescroll对象
			getMescroll(i){
				let mescrollItems = this.$refs.mescrollItem;
				if(mescrollItems){
					let item = mescrollItems[i]
					if(item) return item.mescroll
				}
				return null
			},
			// 页面的滚动事件
			onPageScroll(e){
				this.disableScroll = Math.ceil(e.scrollTop) < this.topHeight
			}
		}
	}
</script>

<style lang="scss">
	/*
	sticky生效条件：
	1、父元素不能overflow:hidden或者overflow:auto属性。(mescroll-body设置:sticky="true"即可, mescroll-uni本身没有设置overflow)
	2、必须指定top、bottom、left、right4个值之一，否则只会处于相对定位
	3、父元素的高度不能低于sticky元素的高度
	4、sticky元素仅在其父元素内生效,所以父元素必须是 mescroll
	*/
	.sticky-tabs{
		z-index: 990;
		position: sticky;
		top: var(--window-top);
		background-color: #fff;
	}
</style>