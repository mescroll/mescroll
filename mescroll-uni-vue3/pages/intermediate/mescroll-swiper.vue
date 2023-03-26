<template>
	<view>
		<!-- 当设置tab-width,指定每个tab宽度时,则不使用flex布局,改用水平滑动 -->
		<me-tabs v-model="tabIndex" :tabs="tabs" :tab-width="130"></me-tabs>
		<swiper :style="{height: height}" :current="tabIndex" @change="swiperChange">
			<swiper-item v-for="(tab,i) in tabs" :key="i">
				<mescroll-item :ref="setRef" :i="i" :index="tabIndex" :tabs="tabs" :height="height"></mescroll-item>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import MescrollItem from "./mescroll-swiper-item.vue";
	
	const height = uni.getSystemInfoSync().windowHeight - uni.upx2px(64) + 'px' // 需要固定swiper的高度 (需减去悬浮tabs的高度64rpx)
	const tabs = [{name:'全部'}, {name:'奶粉'}, {name:'面膜'}, {name:'图书'}, {name:'果汁'}, {name:'奶瓶'}, {name:'美素'}, {name:'花王'}, {name:'韩蜜'}]
	const tabIndex = ref(0) // 当前tab的下标
	// 轮播菜单
	const swiperChange = (e)=>{
		tabIndex.value = e.detail.current
	}
	
	// 获取指定下标的mescroll对象
	const mescrollItems = []
	const setRef = (e)=>{
		e && mescrollItems.push(e)
	}
	const getMescroll = (i)=>{
		if(mescrollItems){
			let item = mescrollItems[i]
			if(item) return item.getMescroll()
		}
		return null
	}
	
	// 返回刷新: https://www.mescroll.com/uni.html#note 第二点
	// const canReset = false
	// onShow(()=>{
	// 	if(canReset){ // 过滤第一次onShow
	// 		const curMescroll = getMescroll(tabIndex.value)
	// 		curMescroll && curMescroll.resetUpScroll()
	// 	}
	// 	canReset = true
	// })
</script>

<style>
</style>
