<template>
	<view>
		<!-- 菜单 -->
		<view class="top-warp">
			<view class="tip">每个菜单列表仅初始化一次,切换菜单缓存数据</view>
			<app-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></app-tabs>
		</view>
		
		<!-- 子组件 (i: 每个tab页的专属下标;  index: 当前tab的下标) -->
		
		<!-- 如果每个子组件布局不一样, 可拆开写 (注意ref不可重复) : -->
		<mescroll-item ref="mescrollItem0" :i="0" :index="tabIndex"></mescroll-item>
		<mescroll-item ref="mescrollItem1" :i="1" :index="tabIndex"></mescroll-item>
		<mescroll-item ref="mescrollItem2" :i="2" :index="tabIndex"></mescroll-item>
		<mescroll-item ref="mescrollItem3" :i="3" :index="tabIndex"></mescroll-item>
		
		<!-- 如果每个子组件布局一样, 则可使用v-for (注意v-for的ref="mescrollItem"必须是固定值, 支付宝小程序不支持此写法)-->
		<!-- <mescroll-item ref="mescrollItem" v-for="(tab,i) in tabs" :key="i" :i="i" :index="tabIndex"></mescroll-item> -->
	</view>
</template>

<script>
	import MescrollItem from "./mescroll-more-item.vue";
	import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
	import AppTabs from "@/components/other/app-tabs.vue";
	
	export default {
		mixins: [MescrollMoreMixin], // 多个mescroll-body写在子组件时, 则使用mescroll-more.js补充子组件的页面生命周期
		components: {
			MescrollItem,
			AppTabs
		},
		data() {
			return {
				tabs: ['全部', '奶粉', '面膜', '图书'],
				tabIndex: 0 // 当前tab下标
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
</style>
