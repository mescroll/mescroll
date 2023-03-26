<template>
	<view>
		<!-- 模拟的标题 -->
		<image class="header" src="https://www.mescroll.com/img/xinlang/header.jpg" mode="aspectFit"/>
		<view :style="{'top':top}" class="download-tip">1条新微博</view>
		
		<mescroll-body-diy @init="mescrollInit" top="100" bottom="100" :down="downOption" @down="downCallback" @up="upCallback">
			<!-- 新增的微博 -->
			<view class="news-li" v-for="news in addList" :key="news.id">
				<view>{{news.title}}</view>
				<view class="new-content">{{news.content}}</view>
			</view>
			<!-- 模拟的内容 -->
			<image src="https://www.mescroll.com/img/xinlang/xinlang1.jpg" mode="widthFix"/>
			<!-- 分页的数据 -->
			<view class="news-li" v-for="news in dataList" :key="news.id">
				<view>{{news.title}}</view>
				<view class="new-content">{{news.content}}</view>
			</view>
		</mescroll-body-diy>
		
		<!-- 模拟的底部 -->
		<image class="footer" src="https://www.mescroll.com/img/xinlang/footer.jpg" mode="aspectFit"/>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onPageScroll, onReachBottom } from '@dcloudio/uni-app';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import MescrollBodyDiy from "@/uni_modules/mescroll-uni/components/mescroll-diy/xinlang/mescroll-body.vue";
	import {apiWeiboList} from "@/api/mock.js"
	
	const { mescrollInit, getMescroll } = useMescroll(onPageScroll, onReachBottom) // 调用mescroll的hook
	const downOption = {
				auto:false, // 是否在初始化完毕之后自动执行下拉回调callback; 默认true
			}
	const addList = ref([]) // 新增微博
	const dataList = ref([]) // 数据列表
	const top = ref(0) // 提示,到顶部的距离
	
	/* 自定义下拉刷新的回调, 不用useMescroll的downCallback */
	const downCallback = (mescroll)=>{
		//加载轮播数据..
		//...
		//加载列表数据
		apiWeiboList().then(curPageData=>{
			//联网成功的回调,隐藏下拉刷新的状态
			mescroll.endSuccess();
			//添加新数据到顶部
			addList.value.unshift(curPageData[0]);
			//显示提示
			// #ifdef H5
			top.value = uni.upx2px(100+88)+"px"; // H5的高度需加上 88的标题栏
			// #endif
			
			// #ifndef H5
			top.value = uni.upx2px(100)+"px"; // 非H5不必加
			// #endif
			setTimeout(()=> {
				top.value = 0;
			},2000);
		}).catch(()=>{
			//联网失败, 结束加载
			mescroll.endErr();
		})
	}
	
	/*上拉加载的回调: 其中mescroll.num:当前页 从1开始, mescroll.size:每页数据条数,默认10 */
	const upCallback = (mescroll)=> {
		//联网加载数据
		apiWeiboList(mescroll.num, mescroll.size).then(curPageData=>{
			//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
			mescroll.endSuccess(curPageData.length);
	
			//追加新数据
			dataList.value = dataList.value.concat(curPageData);
		}).catch(()=>{
			//联网失败, 结束加载
			mescroll.endErr();
		})
	}
</script>

<style>
	image{width: 100%;vertical-align: bottom;height:auto}
	.header{z-index: 9900;position: fixed;top: --window-top;left: 0;height: 100upx;background: #fff;}
	.footer{z-index: 9900;position: fixed;bottom: 0;left: 0;height: 100upx;background: white;}
	
	.download-tip{
		z-index: 900;
		position: fixed;
		top: calc(var(--window-top) + 20upx);
		left: 0;
		width: 100%;
		height: 60upx;
		line-height: 60upx;
		font-size: 24upx;
		text-align: center;
		background-color: rgba(255,130,1,.7);
		color: white;
		-webkit-transition: top 300ms;
		transition: top 300ms;
	}
	
	/*展示上拉加载的数据列表*/
	.news-li{
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
