<template>
	 <mescroll-body @init="mescrollInit" @down="downCallback" :up="upOption" @up="upCallback">
		<view class="item">
			<text class="tip">热门搜索:</text>
			<text class="hot-word" @click="doSearch('奶粉')">奶粉</text>
			<text class="hot-word" @click="doSearch('面霜')">面霜</text>
			<text class="hot-word" @click="doSearch('图书')">图书</text>
		</view>
		<view class="item">
			<text class="tip">关键词:</text>
			<input class="word-input" placeholder="请输入搜索关键词" v-model="curWord" @input="inputWord"/>
		</view>
		<good-list :list="goods"></good-list>
	</mescroll-body>
</template>

<script setup>
	import { ref } from 'vue';
	import { onPageScroll, onReachBottom } from '@dcloudio/uni-app';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiGoods} from "@/api/mock.js"
	
	const { mescrollInit, downCallback, getMescroll } = useMescroll(onPageScroll, onReachBottom) // 调用mescroll的hook
	
	const upOption = {
		// auto: false, //是否在初始化后,自动执行上拉回调callback; 默认true
		// page: {
		// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
		// 	size: 10 // 每页数据的数量
		// }
		noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
		empty: {
			tip: '~ 搜索无结果 ~' // 提示
		}
	}
	const goods = ref([]) // 数据列表
	const curWord = ref("") //当前搜索关键词
	
	// 输入监听
	let searchTimer;
	const inputWord = (e)=>{
		// 节流,避免输入过快多次请求
		searchTimer && clearTimeout(searchTimer)
		searchTimer = setTimeout(()=>{
			doSearch(curWord.value)
		},300)
	}
	
	// 搜索
	const doSearch = (word)=>{
		curWord.value = word
		goods.value = []; // 先清空列表,显示加载进度
		getMescroll().resetUpScroll();
		// getMescroll().hideUpScroll() // 不显示进度条
	}
	
	/*上拉加载的回调: 其中mescroll.num:当前页 从1开始, mescroll.size:每页数据条数,默认10 */
	const upCallback = (mescroll)=> {
		apiGoods(mescroll.num, mescroll.size, curWord.value).then(res=>{
			const list = res.list || [] // 当前页数据
			if(mescroll.num == 1) goods.value = []; //如果是第一页需手动制空列表
			goods.value = goods.value.concat(list); //追加新数据
			mescroll.endSuccess(list.length); // 请求成功, 结束加载
		}).catch(()=>{
			mescroll.endErr(); // 请求失败, 结束加载
		})
	}
</script>

<style>
	/*关键词搜索*/
	.item{
		padding: 20rpx;
	}
	.tip{
		font-size: 30rpx;
		vertical-align: middle;
	}
	.hot-word{
		font-size: 24rpx;
		margin-left: 30rpx;
		padding: 6rpx 40rpx;
		border: 2rpx solid #FF6990;
		border-radius: 100rpx;
		vertical-align: middle;
		color: #FF6990;
	}
	.word-input{
		display: inline-block;
		width: 60%;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 24rpx;
		margin-left: 30rpx;
		border: 2rpx solid #18B4FE;
		border-radius: 60rpx;
		text-align: center;
		background-color: #fff;
		vertical-align: middle;
	}
</style>
