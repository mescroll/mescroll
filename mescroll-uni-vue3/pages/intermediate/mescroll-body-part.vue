<template>
	<!-- mescroll-body本质是原生page的滚动,无法像mescroll-uni那样用flex布局嵌在某个view中使用局部区域滚动, 但是可以通过fixed定位其他元素来实现"局部区域滚动"-->
	<view>
		<!-- 顶部 fixed定位 -->
		<view class="top-warp"> 
			<view>顶部区域</view>
			<view style="font-size: 24rpx;">mescroll-body 通过fixed定位其他元素,实现"局部区域滚动"</view>
		</view>
		
		<!-- 左边 fixed定位 -->
		<scroll-view class="left-warp" :scroll-y="true">
			<view class="tab" :class="{active:i==tabIndex}" v-for="(tab,i) in tabs" :key="i" @click="tabChange(i)">{{tab}}</view>
		</scroll-view>
		
		<!-- mescroll-body跟随page滚动, 不可fixed定位, 可设置 top, bottom, topbar, bottombar, safearea的偏移量-->
		<mescroll-body top="88" bottom="100" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<good-list :list="goods"></good-list>
		</mescroll-body>
		
		<!-- 底部 fixed定位 -->
		<view class="bottom-warp"> 底部区域 </view>
	</view>
</template>


<script setup>
	import { ref } from 'vue';
	import { onPageScroll, onReachBottom } from '@dcloudio/uni-app';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiGoods, apiGetTabs} from "@/api/mock.js"
	
	const { mescrollInit, downCallback, getMescroll } = useMescroll(onPageScroll, onReachBottom) // 调用mescroll的hook
	const goods = ref([]) // 数据列表
	const tabs = ref([]) // tabs异步获取
	// const tabs = ref(['全部', '奶粉', '面膜', '图书', '果汁', '奶瓶', '美素', '花王', '韩蜜', '口红', '毛巾', '玩具', '衣服'])
	const tabIndex = ref(0) // tab下标
	
	/*上拉加载的回调: 其中mescroll.num:当前页 从1开始, mescroll.size:每页数据条数,默认10 */
	const upCallback = (mescroll)=>{
		// tabs异步获取
		if(tabs.value.length == 0){
			apiGetTabs().then(res=>{
				tabs.value = res
				mescroll.resetUpScroll() // 重新触发upCallback
			}).catch(()=>{
				mescroll.endErr()
			})
			return // 此处return,先获取tabs
		}
		
		//联网加载数据
		let keyword = tabs.value[tabIndex.value]
		apiGoods(mescroll.num, mescroll.size, keyword).then(res=>{
			const list = res.list || [] // 当前页数据
			if(mescroll.num == 1) goods.value = []; //如果是第一页需手动制空列表
			goods.value = goods.value.concat(list); //追加新数据
			mescroll.endSuccess(list.length); // 请求成功, 结束加载
		}).catch(()=>{
			//联网失败, 结束加载
			mescroll.endErr();
		})
	}
	
	// 切换菜单
	const tabChange = (i)=>{
		if(tabIndex.value != i){
			tabIndex.value = i
			goods.value = []; // 先置空列表,显示加载进度条
			getMescroll().resetUpScroll(); // 重置列表数据
		}
	}
</script>


<style lang="scss">
	/* 顶部 fixed定位*/
	.top-warp{
		z-index: 200;
		position: fixed;
		top: var(--window-top);
		left: 0;
		width: 100%;
		height: 88rpx;
		padding-top: 10rpx;
		font-size: 28rpx;
		text-align: center;
		background-color: #CFE0DA;
	}
	
	/* 左边 fixed定位*/
	.left-warp{
		z-index: 100;
		position: fixed;
		top: var(--window-top);
		left: 0;
		bottom: 100rpx;
		width: 180rpx;
		padding-top: 88rpx;
		background-color: #eee;
		.tab{
			font-size: 28rpx;
			padding: 28rpx;
			&.active{
				background-color: #fff;
			}
		}
	}
	
	// 设置padding
	.mescroll-body{
		padding-left: 180rpx;
	}
	
	/* 底部 fixed定位*/
	.bottom-warp{
		z-index: 200;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background-color: #FF6990;
	}
</style>