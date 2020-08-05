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
		
		<navigator url="/pages/base/mescroll-comp">
			<view class="demo-li">mescroll-body写在子组件中 <text class="demo-tip">需引mescroll-comp.js</text></view>
		</navigator>
		
		<navigator url="/pages/base/mescroll-one">
			<view class="demo-li">mescroll-one 单mescroll<text class="demo-tip">切换菜单,及时刷新数据</text></view>
		</navigator>
		
		<navigator url="/pages/base/mescroll-more">
			<view class="demo-li">mescroll-more 多mescroll<text class="demo-tip">列表仅初始化一次,缓存数据</text></view>
		</navigator>
		
		<navigator url="/pages/base/list-search">
			<view class="demo-li">list-search 商品搜索<text class="demo-tip">this.mescroll.resetUpScroll()的使用</text></view>
		</navigator>
		
		<navigator url="/pages/base/list-msg">
			<view class="demo-li">list-msg 聊天记录 <text class="demo-tip">保持当前内容的位置</text></view>
		</navigator>
		
		<navigator url="/pages/base/mescroll-native">
			<view class="demo-li">mescroll-native<text class="demo-tip">系统自带的下拉刷新,性能最好</text></view>
		</navigator>
		
		<navigator url="/pages/base/mescroll-uni">
			<view class="demo-li">mescroll-uni<text class="demo-tip">基于scroll-view,常用在浮窗弹层等局部区域</text></view>
		</navigator>
		
		<navigator url="/pages/base/mescroll-uni-part">
			<view class="demo-li">mescroll-uni-part<text class="demo-tip">mescroll-uni用flex实现局部区域滚动</text></view>
		</navigator>
		
		<navigator url="/pages/base/mescroll-body-part">
			<view class="demo-li">mescroll-body-part<text class="demo-tip">mescroll-body实现"局部区域"滚动</text></view>
		</navigator>
		
		<view class="group-title">intermediate demos 中级案例</view>
		
		<navigator url="/pages/base/sticky">
			<view class="demo-li">sticky吸顶悬浮<text class="demo-tip">切换菜单刷新列表, 原生css实现</text></view>
		</navigator>
		
		<navigator url="/pages/base/sticky-data">
			<view class="demo-li">sticky-data吸顶悬浮<text class="demo-tip">切换菜单缓存数据, 原生css实现</text></view>
		</navigator>
		
		<navigator url="/pages/base/sticky-scroll">
			<view class="demo-li">sticky-scroll吸顶悬浮<text class="demo-tip">切换tab刷新列表,监听滚动实现</text></view>
		</navigator>
		
		<navigator url="/pages/base/sticky-scroll-data">
			<view class="demo-li">sticky-scroll-data吸顶悬浮<text class="demo-tip">切换tab缓存数据,监听滚动实现</text></view>
		</navigator>
		
		<navigator url="/pages/base/sticky-uni">
			<view class="demo-li">sticky-uni吸顶悬浮<text class="demo-tip">测试mescroll-uni使用sticky</text></view>
		</navigator>
		
		<navigator url="/pages/intermediate/mescroll-swiper">
			<view class="demo-li">mescroll-swiper<text class="demo-tip">轮播菜单导航</text></view>
		</navigator>
		
		<navigator url="/pages/intermediate/beibei">
			<view class="demo-li">仿【贝贝】下拉刷新上拉加载<text class="demo-tip">自定义mescroll组件</text></view>
		</navigator>
		
		<navigator url="/pages/intermediate/xinlang">
			<view class="demo-li">仿【新浪微博】下拉刷新上拉加载<text class="demo-tip">自定义mescroll组件</text></view>
		</navigator>
		
		
		<view class="group-title">senior demos 高级案例</view>
		<view class="demo-li disable">仿【美囤妈妈】下拉刷新上拉加载<text class="demo-tip">请到官网获取</text></view>
		<view class="demo-li disable">仿【美团】下拉刷新上拉加载<text class="demo-tip">请到官网获取</text></view>
		<view class="demo-li disable">仿【京东】下拉刷新上拉加载<text class="demo-tip">请到官网获取</text></view>
		<view class="demo-li disable">仿【淘宝】下拉刷新上拉加载<text class="demo-tip">请到官网获取</text></view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			uni.setNavigationBarTitle({
				title: 'mescroll ('+ uni.getSystemInfoSync().platform + ')'
			})
		}
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
	
	.demo-li.disable{
		color: gray;
	}
	
	.demo-li .demo-tip {
		float: right;
		margin-top: 4upx;
		font-size: 24upx;
		color: gray;
	}
</style>
