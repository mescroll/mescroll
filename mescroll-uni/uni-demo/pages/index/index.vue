<template>
	<view>
		
		<view class="group-title">base demos 基础案例</view>
		
		<navigator url="/pages/base/list-news">
			<view class="demo-li">list-news 新闻列表 <text class="demo-tip">下拉刷新添加数据到列表顶部</text></view>
		</navigator>
		
		<navigator url="/pages/base/list-products">
			<view class="demo-li">list-products 商品列表 <text class="demo-tip">下拉刷新重置列表数据</text></view>
		</navigator>
		
		<navigator url="/pages/base/mescroll-options">
			<view class="demo-li">mescroll-options 所有配置项 <text class="demo-tip">快速熟悉mescroll</text></view>
		</navigator>
		
		<navigator url="/pages/base/list-mescroll-one">
			<view class="demo-li">list-mescroll-one 单mescroll<text class="demo-tip">切换菜单,及时刷新数据</text></view>
		</navigator>
		
		<navigator url="/pages/base/list-mescroll-more">
			<view class="demo-li">list-mescroll-more 多mescroll<text class="demo-tip">列表仅初始化一次,缓存数据</text></view>
		</navigator>
		
		<navigator url="/pages/base/list-search">
			<view class="demo-li">list-search 商品搜索<text class="demo-tip">mescroll.resetUpscroll()的使用</text></view>
		</navigator>
		
		
		<view class="group-title">intermediate demos 中级案例</view>
		
		<navigator url="/pages/intermediate/beibei">
			<view class="demo-li">仿【贝贝】下拉刷新上拉加载<text class="demo-tip">自定义mescroll组件</text></view>
		</navigator>
		
		<navigator url="/pages/intermediate/xinlang">
			<view class="demo-li">仿【新浪微博】下拉刷新上拉加载<text class="demo-tip">自定义mescroll组件</text></view>
		</navigator>
		
		
		<view class="group-title">senior demos 高级案例</view>
		
		<navigator url="/pages/senior/meitunmama">
			<view class="demo-li">仿【美囤妈妈】下拉刷新上拉加载<text class="demo-tip">自定义mescroll组件</text></view>
		</navigator>
		
		<navigator url="/pages/senior/meituan">
			<view class="demo-li">仿【美团】下拉刷新上拉加载<text class="demo-tip">自定义mescroll组件</text></view>
		</navigator>
		
		<view class="demo-li" style="color: #666">仿【京东】下拉刷新上拉加载<text class="demo-tip">整理中...</text></view>
		<view class="demo-li" style="color: #666">仿【淘宝】下拉刷新上拉加载<text class="demo-tip">整理中...</text></view>
	</view>
</template>

<script>
	export default {
		
	}
</script>

<style>
	.group-title {
		font-size: 30upx;
		padding: 24upx;
		border-bottom: 1upx solid #eee;
		color: red;
	}

	.demo-li {
		font-size: 28upx;
		padding: 24upx;
		border-bottom: 1upx solid #eee;
		color: #18B4FE;
	}
	
	.demo-li .demo-tip {
		float: right;
		margin-top: 4upx;
		font-size: 24upx;
		color: gray;
	}
</style>
