<template>
	<!-- 当mescroll-body写在子组件时,父页面需引入mescroll-comp.js的mixins -->
	<mescroll-body ref="mescrollRef" top="100" @init="mescrollInit" @down="downCallback" @up="upCallback">
		<!-- 数据列表 -->
		<good-list :list="goods"></good-list>
	</mescroll-body>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {apiGoods} from "@/api/mock.js"
	
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				goods: []
			}
		},
		methods: {
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				apiGoods(page.num, page.size).then(curPageData=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(curPageData.length);
					//设置列表数据
					if(page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					this.goods=this.goods.concat(curPageData); //追加新数据
				}).catch(()=>{
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			}
		}
	}
</script>
