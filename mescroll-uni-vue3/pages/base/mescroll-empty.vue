<!-- mescroll-empty遵循easycom, 可直接单独使用 -->
<template>
	<view>
		<!-- 列表内容 -->
		<view v-if="list.length">
			<!-- ... -->
		</view>
		<!-- 空布局简单使用: 就这一行代码 -->
		<!-- <mescroll-empty v-else></mescroll-empty> -->
		
		<!-- 空布局完整配置 -->
		<mescroll-empty v-else :option="emptyOption" @emptyclick="emptyClick"></mescroll-empty>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	const list = ref([])
	
	// 非国际化配置
	// const emptyOption = ref({
	// 	icon: "https://www.mescroll.com/img/mescroll-empty.png", // 图标路径
	// 	tip: '~ 暂无相关数据 ~', // 提示
	// 	btnText: '去逛逛 >'// 按钮
	// })
	
	// 非国际化配置 - 动态修改
	// setTimeout(()=>{
	// 	emptyOption.value.tip = "空的"
	// 	emptyOption.value.btnText = ""
	// }, 1000)
	
	// 国际化配置
	const emptyOption = ref({
		i18n: {
			zh: {
				icon: "https://www.mescroll.com/img/mescroll-empty.png", // 图标路径
				tip: '~ 暂无相关数据 ~', // 提示
				btnText: '去逛逛 >'// 按钮
			},
			en: {
				icon: "https://www.mescroll.com/img/mescroll-empty-en.png", // 图标路径
				tip: '~ empty ~',
				btnText: 'go shopping'
			}
		}
	})
	
	// 国际化配置 - 动态修改
	// setTimeout(()=>{
	// 	emptyOption.value.i18n.zh.tip = "空的"
	// 	emptyOption.value.i18n.zh.btnText = ""
	// }, 1000)
	
	// 点击事件
	const emptyClick = ()=>{
		uni.showToast({title: "点击了去逛逛"})
	}
</script>