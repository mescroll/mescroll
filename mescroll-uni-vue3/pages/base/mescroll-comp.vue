<template>
	<!-- 
		mescroll-body写在一层子组件时, 需引入useMescrollComp, 给子组件添加ref="mescrollItem",
		当mescroll-body写在子子..子组件时, 需每层子组件都引入useMescrollComp, 添加ref="mescrollItem",
		嵌套太多层,建议直接使用mescroll-uni最简单 
	-->
	 <view>
		<view class="notice-warp">
			<view class="notice">mescroll-body是原生页面的滚动,子组件无页面生命周期</view>
			<view class="notice">需使用useMescrollComp给子组件补充页面生命周期</view>
		</view>
		
		<!-- 第一步: 给含有mescroll-body的组件添加: ref="mescrollItem" (固定的,不可改)-->
		<mescroll-item ref="mescrollItem"></mescroll-item>
	</view>
</template>

<script setup>
	import { onPageScroll, onReachBottom} from '@dcloudio/uni-app';
	import MescrollItem from "./mescroll-comp-item.vue"; // 一个mescroll-body写在一层子组件的情况
	// import MescrollItem from "./mescroll-comp-center.vue"; // 一个mescroll-body写在多层子组件的情况
	// import MescrollItem from "./mescroll-more.vue"; // 多个mescroll-body写在子组件的情况
	
	// 第二步: useMescrollComp解构出ref的"mescrollItem"
	import useMescrollComp from "@/uni_modules/mescroll-uni/hooks/useMescrollComp.js";
	const { mescrollItem } = useMescrollComp(onPageScroll, onReachBottom)
</script>

<style>
	/*说明*/
	.notice-warp{
		z-index: 9;
		position: fixed;
		top: var(--window-top);
		left: 0;
		width: 100%;
		height: 100rpx;/*对应mescroll-body的top值*/
		font-size: 26upx;
		padding-top: 10upx;
		border-bottom: 1upx solid #eee;
		text-align: center;
		background-color: #fff;
	}
	.notice-warp .notice{
		color:#555;
	}
	.notice-warp .btn-change{
		display: inline-block;
		margin-top: 28upx;
		padding: 6upx 16upx;
		border: 1upx solid #FF6990;
		border-radius: 40upx;
		color: #FF6990;
	}
	.notice-warp .btn-change:active{
		opacity: .5;
	}
</style>
