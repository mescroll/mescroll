<template>
	<view class="page-warp">
		<view class="top-warp">
			<view v-for="(tab, i) in tabs" :key="i" :class="{'active':curIndex===i}" @click="changeTab(i)">{{tab}}</view>
		</view>
		
		<swiper class="swiper" :current="curIndex" @change="swiperChange">
			<!--全部 -->
			<swiper-item>
				<mescroll-item :i="0" :index="curIndex"></mescroll-item>
			</swiper-item>
			
			<!-- 奶粉 -->
			<swiper-item>
				<mescroll-item :i="1" :index="curIndex"></mescroll-item>
			</swiper-item>
			
			<!-- 面膜 -->
			<swiper-item>
				<mescroll-item :i="2" :index="curIndex"></mescroll-item>
			</swiper-item>
			
			<!-- 图书 -->
			<swiper-item>
				<mescroll-item :i="3" :index="curIndex"></mescroll-item>
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
				tabs: ['全部', '奶粉', '面膜', '图书'],
				curIndex: 0 // 当前tab的下标
			}
		},
		methods: {
			// 轮播菜单
			swiperChange(e){
				this.changeTab(e.detail.current)
			},
			// 切换菜单
			changeTab(i){
				this.curIndex = i
			}
		}
	}
</script>

<style>
	/* 需固定高度 */
	page,
	.page-warp,
	.swiper{
		height: 100%;
	}
	
	.top-warp{
		z-index: 9990;
		position: fixed;
		top: --window-top; /* css变量 */
		left: 0;
		width: 100%;
		height: 60upx;
		background-color: white;
		text-align: center;
		border-bottom: 1upx solid #ddd;
	}
	.top-warp view{
		display: inline-block;
		width: 22%;
		line-height: 60upx;
		font-size: 28upx;
	}
	.top-warp .active{
		border-bottom: 2upx solid #FF6990;
		color: #FF6990;
	}
</style>
