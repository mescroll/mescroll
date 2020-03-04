<template>
	 <mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
		<view class="item">
			<text class="tip">热门搜索:</text>
			<text class="hot-word" @click="curWord='奶粉'">奶粉</text>
			<text class="hot-word" @click="curWord='面霜'">面霜</text>
			<text class="hot-word" @click="curWord='图书'">图书</text>
		</view>
		<view class="item">
			<text class="tip">关键词:</text>
			<input class="word-input" placeholder="请输入搜索关键词" v-model="curWord"/>
		</view>
		<good-list :list="goods"></good-list>
	</mescroll-body>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import GoodList from "@/components/other/good-list.vue";
	import {apiSearch} from "@/api/mock.js"
	
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		components: {
			GoodList
		},
		data() {
			return {
				downOption: {
					// use: false // 不使用下拉刷新
				},
				upOption: {
					// auto: false, //是否在初始化后,自动执行上拉回调callback; 默认true
					// page: {
					// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					// 	size: 10 // 每页数据的数量
					// }
					noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
					empty: {
						tip: '~ 搜索无结果 ~' // 提示
					}
				},
				goods: [], // 数据列表
				curWord:"" //当前搜索关键词
			}
		},
		watch:{
			//关键词变化的时候,重置列表数据
			curWord(){
				// 重置列表数据 (tip:此处最好做节流,避免输入过快多次请求)
				this.mescroll.resetUpScroll();
			}
		},
		methods: {
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				// 先清空列表,显示加载进度
				if(page.num == 1) this.goods = []; //如果是第一页需手动制空列表
				
				//联网加载数据
				apiSearch(page.num, page.size, this.curWord).then(curPageData=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(curPageData.length);
					//追加新数据
					this.goods=this.goods.concat(curPageData);
				}).catch(()=>{
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			}
		}
	}
</script>

<style>
	/*关键词搜索*/
	.item{
		padding: 20upx;
	}
	.tip{
		font-size: 30upx;
		vertical-align: middle;
	}
	.hot-word{
		font-size: 24upx;
		margin-left: 30upx;
		padding: 6upx 40upx;
		border: 2upx solid #FF6990;
		border-radius: 100upx;
		vertical-align: middle;
		color: #FF6990;
	}
	.word-input{
		display: inline-block;
		width: 60%;
		padding:4upx;
		font-size: 24upx;
		margin-left: 30upx;
		border: 2upx solid #18B4FE;
		border-radius: 60upx;
		text-align: center;
		background-color: #fff;
		vertical-align: middle;
	}
</style>
