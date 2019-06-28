<template>
	<view>
		<!-- 菜单 -->
		<view class="top-warp">
			<view class="tip">每个菜单列表仅初始化一次,切换菜单缓存数据</view>
			<view class="nav">
				<view v-for="(tab, i) in tabs" :key="i" :class="{'active':curIndex===i}" @click="changeTab(i)">{{tab}}</view>
			</view>
		</view>
		
		<!--全部 -->
		<mescroll-item :i="0" :index="curIndex"></mescroll-item>
		
		<!-- 奶粉 -->
		<mescroll-item :i="1" :index="curIndex"></mescroll-item>
		
		<!-- 面膜 -->
		<mescroll-item :i="2" :index="curIndex"></mescroll-item>
		
		<!-- 图书 -->
		<mescroll-item :i="3" :index="curIndex"></mescroll-item>
	</view>
</template>

<script>
	import MescrollItem from "./list-mescroll-more-item.vue";
	
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
			// 切换菜单
			changeTab (i) {
				this.curIndex = i
			}
		}
	}
</script>

<style>
	.top-warp{
		z-index: 9990;
		position: fixed;
		top: --window-top; /* css变量 */
		left: 0;
		width: 100%;
		height: 120upx;
		background-color: white;
	}
	.top-warp .tip{
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
	}
	.top-warp .nav{
		text-align: center;
		height: 60upx;
		border-bottom: 1upx solid #ddd;
	}
	.top-warp .nav view{
		display: inline-block;
		width: 22%;
		line-height: 60upx;
		font-size: 28upx;
	}
	.top-warp .nav .active{
		border-bottom: 2upx solid #FF6990;
		color: #FF6990;
	}
</style>
