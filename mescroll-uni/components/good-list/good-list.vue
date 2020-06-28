<!-- 商品列表组件 <pd-list :list="xx"></pd-list> -->
<template>
	<view class="pd-list">
		<view class="pd-li" v-for="pd in list" :key="pd.id">
			<image class="pd-img" :src="pd.pdImg" mode="widthFix"/>
			<view class="pd-name">{{pd.pdName}}</view>
			<text class="pd-price">{{pd.pdPrice}} 元</text>
			<text class="pd-sold">已售{{pd.pdSold}}件</text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			list: { // 数据列表
				type: Array,
				default(){
					return []
				}
			}
		}
	}
</script>

<style>
	/*数据列表*/
	.pd-list{
		background-color: #fff;
	}
	.pd-li{
		position: relative;
		height: 160upx;
		padding: 20upx 16upx 20upx 240upx;
		border-bottom: 1upx solid #eee;
	}
	.pd-li .pd-img{
		position: absolute !important; /*编译到H5,在mescroll-more的案例中需加上!important,解决tab切换过快定位失效的问题*/
		left: 36upx;
		top: 20upx;
		width: 160upx;
		height: 160upx;
	}
	.pd-li .pd-name{
		font-size: 26upx;
		line-height: 40upx;
		height: 80upx;
		margin-bottom: 20upx;
		overflow: hidden;
	}
	.pd-li .pd-price{
		font-size: 26upx;
		color: red;
	}
	.pd-li .pd-sold{
		font-size: 24upx;
		margin-left: 16upx;
		color: gray;
	}
</style>
