<template>
	<view>
		<!-- 菜单 -->
		<view class="top-warp">
			<view class="tip">每个菜单列表仅初始化一次,切换菜单缓存数据</view>
			<!-- 当设置tab-width,指定每个tab宽度时,则不使用flex布局,改用水平滑动 -->
			<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange" :tab-width="130"></me-tabs>
		</view>
		
		<!-- 子组件 (i: 每个tab页的专属下标;  index: 当前tab的下标) -->
		
		<!-- 如果每个子组件布局不一样, 可拆开写 (注意ref只能为 "mescrollItem下标" 的格式, 另外 :i="下标" :index="tabIndex"也是固定写法) : -->
		<!-- <home ref="mescrollItem0" :i="0" :index="tabIndex"></home>
		<shopcart ref="mescrollItem1" :i="1" :index="tabIndex"></shopcart>
		<user ref="mescrollItem2" :i="2" :index="tabIndex"></user> -->
		
		<mescroll-item ref="mescrollItem0" :i="0" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem1" :i="1" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem2" :i="2" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem3" :i="3" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem4" :i="4" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem5" :i="5" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem6" :i="6" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem7" :i="7" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem8" :i="8" :index="tabIndex" :tabs="tabs"></mescroll-item>
		<mescroll-item ref="mescrollItem9" :i="9" :index="tabIndex" :tabs="tabs"></mescroll-item>
		
		
		<!-- 如果每个子组件布局一样, 则可使用v-for (注意v-for的ref="mescrollItem"必须是固定值; 另外支付宝小程序不支持此v-for的写法)-->
		<!-- <mescroll-item ref="mescrollItem" v-for="(tab,i) in tabs" :key="i" :i="i" :index="tabIndex" :tabs="tabs"></mescroll-item> -->
	</view>
</template>

<script>
	import MescrollItem from "./mescroll-more-item.vue";
	import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
	
	export default {
		mixins: [MescrollMoreMixin], // 多个mescroll-body写在子组件时, 则使用mescroll-more.js补充子组件的页面生命周期
		components: {
			MescrollItem
		},
		data() {
			return {
				tabs: [{name:'全部'}, {name:'奶粉'}, {name:'面膜'}, {name:'图书'}, {name:'果汁'}, {name:'奶瓶'}, {name:'美素'}, {name:'花王'}, {name:'韩蜜'}],
				tabIndex: 0 // 当前tab下标,必须与mescroll-more.js对应,所以tabIndex是固定变量,不可以改为其他的名字
			}
		}
	}
</script>

<style>
	.top-warp{
		z-index: 9990;
		position: fixed;
		top: --window-top; /* css变量 */
		left: 0;
		width: 100%;
		height: 120upx;
		background-color: white;
	}
	.top-warp .tip{
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
	}
</style>
