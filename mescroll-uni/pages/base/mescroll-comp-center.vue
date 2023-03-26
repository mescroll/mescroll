<template>
	<!-- 当mescroll-body写在子子..子组件时, 需每层子组件都引入mescroll-comp.js, 添加ref="mescrollItem" -->
	<view>
		<mescroll-item ref="mescrollItem"></mescroll-item>
	</view>
</template>

<script>
	import MescrollItem from "./mescroll-comp-item.vue"; // 一个mescroll-body写在多层子组件的情况
	// 第二步: 引入mescroll-comp.js
	import MescrollCompMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-comp.js";
	export default {
		mixins: [MescrollCompMixin],
		components: {
			MescrollItem
		}
	}
</script>

<style>
</style>
