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
		<mescroll-body ref="mescrollRef" top="88" bottom="100" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<good-list :list="goods"></good-list>
		</mescroll-body>
		
		<!-- 底部 fixed定位 -->
		<view class="bottom-warp"> 底部区域 </view>
	</view>
</template>


<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {apiSearch} from "@/api/mock.js"
	
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				goods: [], // 数据列表
				tabs: ['全部', '奶粉', '面膜', '图书', '果汁', '奶瓶', '美素', '花王', '韩蜜', '口红', '毛巾', '玩具', '衣服'],
				tabIndex: 0 // tab下标
			}
		},
		methods: {
			upCallback(page) {
				//联网加载数据
				let keyword = this.tabs[this.tabIndex]
				apiSearch(page.num, page.size, keyword).then(curPageData=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(curPageData.length);
					//设置列表数据
					if(page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					this.goods=this.goods.concat(curPageData); //追加新数据
				}).catch(()=>{
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			// 切换菜单
			tabChange(i){
				if(this.tabIndex != i){
					this.tabIndex = i
					this.goods = []; // 先置空列表,显示加载进度条
					this.mescroll.resetUpScroll(); // 重置列表数据
				}
			}
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
	.mescroll-body,
	/deep/.mescroll-body{
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