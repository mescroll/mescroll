<template>
	<view>
		<!-- 当设置tab-width,指定每个tab宽度时,则不使用flex布局,改用水平滑动 -->
		<me-tabs v-model="tabIndex" :tabs="tabs" :tab-width="130"></me-tabs>
		<swiper :style="{height: height}" :current="tabIndex" @change="swiperChange">
			<swiper-item v-for="(tab,i) in tabs" :key="i">
				<mescroll-item ref="mescrollItem" :i="i" :index="tabIndex" :tabs="tabs" :height="height"></mescroll-item>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import MescrollItem from "./mescroll-swiper-item.vue";
	
	export default {
		components: {
			MescrollItem
		},
		data() {
			return {
				height: "", // 需要固定swiper的高度
				tabs: [{name:'全部'}, {name:'奶粉'}, {name:'面膜'}, {name:'图书'}, {name:'果汁'}, {name:'奶瓶'}, {name:'美素'}, {name:'花王'}, {name:'韩蜜'}],
				tabIndex: 0 // 当前tab的下标
			}
		},
		onLoad() {
			// 需要固定swiper的高度 (需减去悬浮tabs的高度64rpx)
			this.height = uni.getSystemInfoSync().windowHeight - uni.upx2px(64) + 'px'
		},
		onShow() {
			// 返回刷新: https://www.mescroll.com/uni.html#note 第二点
			// if(this.canReset){
			// 	let curMescroll = this.getMescroll(this.tabIndex)
			// 	curMescroll && curMescroll.resetUpScroll()
			// }
			// this.canReset = true
		},
		methods: {
			// 轮播菜单
			swiperChange(e){
				this.tabIndex = e.detail.current
			},
			// 获取指定下标的mescroll对象
			// getMescroll(i){
			// 	let mescrollItems = this.$refs.mescrollItem;
			// 	if(mescrollItems){
			// 		let item = mescrollItems[i]
			// 		if(item) return item.mescroll
			// 	}
			// 	return null
			// }
		}
	}
</script>

<style>
</style>
