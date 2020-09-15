<!-- 菜单悬浮的原理: 通过给菜单添加position:sticky实现, 用法超简单, 仅APP端的低端机不兼容 https://caniuse.com/#feat=css-sticky -->
<template>
	<view>
		<!-- 对于mescroll-body: 需设置:sticky="true", 此应避免在mescroll-body标签前面加其他非定位的元素, 否则下拉区域会被挤出, 无法会隐藏.-->
		<!-- 对于mescroll-uni: 则无需设置:sticky="true", 无其他限制和要求 -->
		<mescroll-body :sticky="true" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<swiper style="min-height: 300rpx" autoplay="true" interval="3000" duration="300" circular="true">
				<swiper-item>
					<image style="width: 100%;height: auto;" src="https://www.mescroll.com/img/swiper1.jpg" mode="widthFix"/>
				</swiper-item>
				<swiper-item>
					<image style="width: 100%;height: auto;" src="https://www.mescroll.com/img/swiper2.jpg" mode="widthFix"/>
				</swiper-item>
			</swiper>
			
			<view class="demo-tip">
				<view>每次切换菜单,都刷新列表数据</view>
				<view>吸顶通过给菜单加position:sticky实现, 用法简单</view>
				<view>小程序和微信h5端: 低端机sticky也可生效, 可放心使用</view>
				<view>APP端: 仅部分低端机无效,若要兼容则参考sticky-scroll</view>
			</view>
			
			<!-- sticky吸顶悬浮的菜单, 父元素必须是 mescroll -->
			<view class="sticky-tabs">
				<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs>
			</view>
			
			<!-- 数据列表 -->
			<good-list :list="goods"></good-list>
		</mescroll-body>
		
		<!-- 此处可以写其他fixed定位元素 -->
		<!-- <view></view> -->
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {apiSearch} from "@/api/mock.js"
	
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				goods: [], // 数据列表
				tabs: ['全部', '母婴', '图书'],
				tabIndex: 0 // tab下标
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
				let keyword = this.tabs[this.tabIndex]
				apiSearch(page.num, page.size, keyword).then(curPageData=>{
					if(page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					this.goods=this.goods.concat(curPageData); //追加新数据
					this.mescroll.endSuccess(curPageData.length); // 隐藏加载状态栏
				}).catch(()=>{
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			// 切换菜单
			tabChange () {
				this.goods = []; // 置空列表,显示加载进度条
				this.mescroll.resetUpScroll()
			}
		}
	}
</script>

<style lang="scss">
	/*
	sticky生效条件：
	1、父元素不能overflow:hidden或者overflow:auto属性。(mescroll-body设置:sticky="true"即可, mescroll-uni本身没有设置overflow)
	2、必须指定top、bottom、left、right4个值之一，否则只会处于相对定位
	3、父元素的高度不能低于sticky元素的高度
	4、sticky元素仅在其父元素内生效,所以父元素必须是 mescroll
	*/
	.sticky-tabs{
		z-index: 990;
		position: sticky;
		top: var(--window-top);
		background-color: #fff;
	}
	
	// 使用mescroll-uni,则top为0
	.mescroll-uni,
	/deep/.mescroll-uni{
		.sticky-tabs{
			top: 0;
		}
	}
	
	.demo-tip{
		padding: 18rpx;
		font-size: 24rpx;
		text-align: center;
	}
</style>
