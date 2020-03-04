<template>
	 <view>
		<view class="notice-warp">
			<view class="notice">mescroll-body是原生页面的滚动,子组件无页面生命周期</view>
			<view class="notice">需通过mescroll-comp.js给子组件补充页面生命周期</view>
		</view>
		
		<!-- 子组件 ( ref固定值: mescrollItem)-->
		<mescroll-item ref="mescrollItem"></mescroll-item>
	</view>
</template>

<script>
	import MescrollItem from "./mescroll-comp-item.vue";
	import MescrollCompMixin from "@/components/mescroll-uni/mixins/mescroll-comp.js";
	
	export default {
		mixins: [MescrollCompMixin], // 当一个页面只有一个mescroll-body写在子组件时, 则使用mescroll-comp.js; 多个则参考mescroll-more案例
		components: {
			MescrollItem
		}
	}
</script>

<style>
	/*说明*/
	.notice-warp{
		font-size: 26upx;
		padding: 40upx 0;
		border-bottom: 1upx solid #eee;
		text-align: center;
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
