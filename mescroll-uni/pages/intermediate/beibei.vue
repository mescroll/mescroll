<template>
	<view>
		<!-- 模拟的标题 -->
		<image class="header" src="http://www.mescroll.com/img/beibei/header.jpg" mode="aspectFit"/>
		
		<mescroll-body-diy ref="mescrollRef" @init="mescrollInit" top="180" bottom="100" @down="downCallback" @up="upCallback">
			<!-- 模拟的内容 -->
			<image src="http://www.mescroll.com/img/beibei/beibei1.jpg" mode="widthFix"/>
			<image src="http://www.mescroll.com/img/beibei/beibei2.jpg" mode="widthFix"/>
			<!-- 分页的数据列表 -->
			<good-list :list="goods"></good-list>
		</mescroll-body-diy>
		
		<!-- 模拟的底部 -->
		<image class="footer" src="http://www.mescroll.com/img/beibei/footer.jpg" mode="aspectFit"/>
	</view>
</template>

<script>
	import MescrollBodyDiy from "@/components/mescroll-diy/beibei/mescroll-body.vue";
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {apiGoods} from "@/api/mock.js"
	
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		components: {
			MescrollBodyDiy // 避免与main.js注册的全局组件名称相同,否则注册组件失效(iOS真机 APP HBuilderX2.7.9)
		},
		data() {
			return {
				goods: [] // 数据列表
			}
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll()
			},
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

<style>
	image{width: 100%;vertical-align: bottom;height:auto}
	.header{z-index: 9900;position: fixed;top: --window-top;left: 0;height: 180upx;background: white;}
	.footer{z-index: 9900;position: fixed;bottom: 0;left: 0;height: 100upx;background: white;}
</style>
