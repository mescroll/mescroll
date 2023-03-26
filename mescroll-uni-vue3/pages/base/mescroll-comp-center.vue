<template>
	<!-- 当mescroll-body写在子子..子组件时, 需每层子组件都引入useMescrollComp, 添加ref="mescrollItem" -->
	<view>
		<mescroll-item ref="mescrollItem"></mescroll-item>
	</view>
</template>

<script setup>
	import { onPageScroll, onReachBottom} from '@dcloudio/uni-app';
	import MescrollItem from "./mescroll-comp-item.vue";
	import useMescrollComp from "@/uni_modules/mescroll-uni/hooks/useMescrollComp.js";
	const { mescrollItem, getMescroll } = useMescrollComp(onPageScroll, onReachBottom)
	
	// 使父组件可以通过ref调用到getMescroll方法 (必须)
	defineExpose({ getMescroll })
</script>

<style>
</style>
