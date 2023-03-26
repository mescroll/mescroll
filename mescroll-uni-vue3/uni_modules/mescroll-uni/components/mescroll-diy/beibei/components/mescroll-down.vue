<!-- 下拉刷新区域 -->
<template>
	<view v-if="mOption.use" class="mescroll-downwarp" :style="{'background':mOption.bgColor,'color':mOption.textColor}">
		<view class="downwarp-content">
			<image class="downwarp-slogan" src="https://www.mescroll.com/img/beibei/mescroll-slogan.jpg?v=1" mode="widthFix"/>
			<view v-if="isDownLoading" class="downwarp-loading mescroll-rotate"></view>
			<view v-else class="downwarp-progress" :style="{'transform':downRotate}"></view>
			<view class="downwarp-mascot"></view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		option: Object , // down的配置项
		type: Number // 下拉状态（inOffset：1， outOffset：2， showLoading：3， endDownScroll：4）
	},
	computed: {
		// 支付宝小程序需写成计算属性,prop定义default仍报错
		mOption(){
			return this.option || {}
		},
		// 是否在加载中
		isDownLoading(){
			return this.type === 3
		},
		// 旋转的角度
		downRotate(){
			return this.type === 2 ? 'rotate(180deg)' : 'rotate(0deg)'
		}
	}
};
</script>

<style>
@import "../../../mescroll-uni/components/mescroll-down.css";
@import "./mescroll-down.css";
</style>
