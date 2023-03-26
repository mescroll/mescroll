<template>
	<view>
		<!-- 菜单 -->
		<view class="top-warp">
			<view class="tip">每个菜单列表仅初始化一次,切换菜单缓存数据</view>
			<!-- 当设置tab-width,指定每个tab宽度时,则不使用flex布局,改用水平滑动 -->
			<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange" :tab-width="130"></me-tabs>
		</view>
		
		<!-- 子组件 (i: 每个tab页的专属下标;  index: 当前tab的下标) -->
		
		<!-- 如果每个子组件布局不一样, 可拆开写 (注意ref只能为 "mescrollItem下标" 的格式, 另外 :i="下标" :index="tabIndex"也是固定写法) : -->
		<!-- <home ref="mescrollItem0" :i="0" :index="tabIndex"></home>
		<shopcart ref="mescrollItem1" :i="1" :index="tabIndex"></shopcart>
		<user ref="mescrollItem2" :i="2" :index="tabIndex"></user> -->
		
		<mescroll-item ref="mescrollItem0" :i="0" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem1" :i="1" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem2" :i="2" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem3" :i="3" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem4" :i="4" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem5" :i="5" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem6" :i="6" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem7" :i="7" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem8" :i="8" :index="tabIndex" :tabs="tabs"></mescroll-item>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onPageScroll, onReachBottom, onShow} from '@dcloudio/uni-app';
	import useMescrollMore from "@/uni_modules/mescroll-uni/hooks/useMescrollMore.js";
	import MescrollItem from "./mescroll-more-item.vue";
	
	const tabs = [{name:'全部'}, {name:'母婴'}, {name:'面膜'}, {name:'图书'}, {name:'果汁'}, {name:'奶瓶'}, {name:'美素'}, {name:'花王'}, {name:'韩蜜'}]
	
	const mescrollItem0 = ref(null);
	const mescrollItem1 = ref(null);
	const mescrollItem2 = ref(null);
	const mescrollItem3 = ref(null);
	const mescrollItem4 = ref(null);
	const mescrollItem5 = ref(null);
	const mescrollItem6 = ref(null);
	const mescrollItem7 = ref(null);
	const mescrollItem8 = ref(null);
	
	// 使用useMescrollMore,完善每个子组件的页面级生命周期
	const mescrollItems = [mescrollItem0, mescrollItem1, mescrollItem2, mescrollItem3, mescrollItem4, mescrollItem5, mescrollItem6, mescrollItem7, mescrollItem8]
	const { tabIndex, getMescroll, scrollToLastY } = useMescrollMore(mescrollItems, onPageScroll, onReachBottom)	
	
	// tab切换的时候恢复滚动条
	const tabChange = ()=>{
		scrollToLastY()
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
