<!-- 悬浮菜单 <tabs-sticky v-model="index" :fixed="false" @change="changeTab"></tabs-sticky> -->
<template>
	<view class="tabs-sticky" :class="{'tabs-fixed': fixed}">
		<view class="tab" v-for="(tab, i) in tabs" :key="i" :class="{active: value==i}" @click="changeTab(i)">{{tab.name}}</view>
	</view>
</template>

<script>
	export default {
		props:{
			tabs: Array, // 菜单 [{name:'全部'},{name:'母婴'},{name:'图书'}]
			value: { // 当前菜单下标 (使用v-model语法糖: 1.props需为value; 2.需回调input事件)
				type: Number,
				default(){
					return 0
				}
			},
			fixed: Boolean // 是否悬浮
		},
		methods: {
			// 切换tab
			changeTab(i) {
				if(this.value != i){
					this.$emit('input', i);
					this.$emit('change', i);
				}
			}
		},
	}
</script>

<style>
	/*菜单*/
	.tabs-sticky{
		display: flex;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28upx;
		text-align: center;
		background: #fff;
		border-bottom: 1upx solid #ddd;
	}
	.tabs-sticky .tab{
		flex: 1;
	}
	/* tab选中的样式 */
	.tabs-sticky .active{
		border-bottom: 2upx solid #FF6990;
		color: #FF6990;
	}
	/*悬浮样式*/
	.tabs-sticky.tabs-fixed{
		z-index: 9999;
		position: fixed;
		top: var(--window-top);
		left: 0;
		width: 100%;
	}
</style>
