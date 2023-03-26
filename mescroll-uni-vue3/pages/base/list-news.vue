<template>
	<mescroll-body @init="mescrollInit" :down="downOption" @down="downCallback" @up="upCallback">
		<view class="notice">本Demo的下拉刷新: 添加新数据到列表顶部</view>
		<view class="news-li" v-for="news in dataList" :key="news.id">
			<view>{{news.title}}</view>
			<view class="new-content">{{news.content}}</view>
		</view>
	</mescroll-body>
</template>

<script setup>
	import { ref } from 'vue';
	import { onPageScroll, onReachBottom } from '@dcloudio/uni-app';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiNewList} from "@/api/mock.js"
	
	const dataList = ref([]) // 数据列表
	const { mescrollInit } = useMescroll(onPageScroll, onReachBottom) // 调用mescroll的hook
	const downOption = {
		auto: false //是否在初始化后,自动执行downCallback; 默认true
	}
	
	/* 自定义下拉刷新的回调,不使用useMescroll的downCallback */
	const downCallback = (mescroll)=> {
		apiNewList().then(data => {
			mescroll.endSuccess(); // 请求成功, 结束下拉刷新的状态 (无参)
			dataList.value.unshift(data[0]); // 追加数据在前面
		}).catch(()=>{
			mescroll.endErr(); // 请求失败, 结束加载
		})
	}
	
	/*上拉加载的回调: 其中mescroll.num:当前页 从1开始, mescroll.size:每页数据条数,默认10 */
	const upCallback = (mescroll)=> {
		apiNewList(mescroll.num, mescroll.size).then(curPageData=>{
			dataList.value = dataList.value.concat(curPageData); // 追加数据
			mescroll.endSuccess(curPageData.length); // 请求成功, 结束加载
		}).catch(()=>{
			mescroll.endErr(); // 请求失败, 结束加载
		})
	}
</script>

<style>
	/*说明*/
	.notice{
		font-size: 30upx;
		padding: 40upx 0;
		border-bottom: 1upx solid #eee;
		text-align: center;
	}
	/*展示上拉加载的数据列表*/
	.news-li{
		font-size: 32upx;
		padding: 32upx;
		border-bottom: 1upx solid #eee;
	}
	.news-li .new-content{
		font-size: 28upx;
		margin-top: 10upx;
		margin-left: 20upx;
		color: #666;
	}
</style>
