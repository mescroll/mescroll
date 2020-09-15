<template>
	<!-- 注: 本示例仅演示mescroll-body写在一层子组件的情况, 其实同样适用mescroll-body写在子子..子组件的情况, 只需每一层都要写上第一步和第二步的代码即可 -->
	 <view>
		<view class="notice-warp">
			<view class="notice">mescroll-body是原生页面的滚动,子组件无页面生命周期</view>
			<view class="notice">需通过mescroll-comp.js给子组件补充页面生命周期</view>
		</view>
		
		<!-- 第一步: 给mescroll-body的组件添加: ref="mescrollItem" (固定的,不可改,与mescroll-comp.js对应)-->
		<mescroll-item ref="mescrollItem"></mescroll-item>
	</view>
</template>

<script>
	import MescrollItem from "./mescroll-comp-item.vue"; // 一个mescroll-body写在子组件的情况
	// import MescrollItem from "./mescroll-more.vue"; // 多个mescroll-body写在子组件的情况
	
	// 第二步: 引入mescroll-comp.js
	import MescrollCompMixin from "@/components/mescroll-uni/mixins/mescroll-comp.js";
	export default {
		mixins: [MescrollCompMixin],
		components: {
			MescrollItem
		}
	}
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
