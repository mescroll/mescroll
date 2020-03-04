<template>
	<view>
		<app-tabs v-model="tabIndex" :tabs="tabs" :fixed="true"></app-tabs>
		<swiper :style="{height: height}" :current="tabIndex" @change="swiperChange">
			<!--全部 -->
			<swiper-item>
				<mescroll-item :i="0" :index="tabIndex" :tabs="tabs"></mescroll-item>
			</swiper-item>
			
			<!-- 奶粉 -->
			<swiper-item>
				<mescroll-item :i="1" :index="tabIndex" :tabs="tabs"></mescroll-item>
			</swiper-item>
			
			<!-- 面膜 -->
			<swiper-item>
				<mescroll-item :i="2" :index="tabIndex" :tabs="tabs"></mescroll-item>
			</swiper-item>
			
			<!-- 图书 -->
			<swiper-item>
				<mescroll-item :i="3" :index="tabIndex" :tabs="tabs"></mescroll-item>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import MescrollItem from "./mescroll-swiper-item.vue";
	import AppTabs from "@/components/other/app-tabs.vue";
	
	export default {
		components: {
			MescrollItem,
			AppTabs
		},
		data() {
			return {
				height: "400px", // 需要固定swiper的高度
				tabs: ['全部', '奶粉', '面膜', '图书'],
				tabIndex: 0 // 当前tab的下标
			}
		},
		methods: {
			// 轮播菜单
			swiperChange(e){
				this.tabIndex = e.detail.current
			}
		},
		onLoad() {
			// 需要固定swiper的高度
			this.height = uni.getSystemInfoSync().windowHeight + 'px'
		}
	}
</script>

<style>
</style>
