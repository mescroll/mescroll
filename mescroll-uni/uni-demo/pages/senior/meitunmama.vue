<template>
	<view>
		<!-- 模拟的标题 -->
		<image class="header" src="http://www.mescroll.com/img/meitun/header.jpg" mode="aspectFit"/>
		
		<mescroll-uni top="180" bottom="100" @down="downCallback" @up="upCallback" @init="mescrollInit">
			<!-- 模拟的内容 -->
			<image src="http://www.mescroll.com/img/meitun/meitun1.jpg" mode="widthFix"/>
			<image src="http://www.mescroll.com/img/meitun/meitun2.jpg" mode="widthFix"/>
			<!-- 分页的数据列表 -->
			<view class="data-li" v-for="pd in pdList" :key="pd.id">
				<image class="pd-img" :src="pd.pdImg" mode="widthFix"/>
				<view class="pd-name">{{pd.pdName}}</view>
				<text class="pd-price">{{pd.pdPrice}} 元</text>
				<text class="pd-sold">已售{{pd.pdSold}}件</text>
			</view>
		</mescroll-uni>
		
		<!-- 模拟的底部 -->
		<image class="footer" src="http://www.mescroll.com/img/meitun/footer.jpg" mode="aspectFit"/>
	</view>
</template>

<script>
	// 自定义的mescroll-meitun.vue
	import MescrollUni from "../../components/mescroll-diy/mescroll-meitun.vue";
	// 模拟数据
	import mockData from "../../common/pdlist.js";
	
	export default {
		components: {
			MescrollUni
		},
		data() {
			return {
				mescroll: null, //mescroll实例对象
				pdList: [] // 数据列表
			}
		},
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			this.mescroll && this.mescroll.onPageScroll(e);
		},
		methods: {
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			// 下拉刷新的回调
			downCallback(mescroll){
				mescroll.resetUpScroll() // 重置列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				//联网加载数据
				this.getListDataFromNet(mescroll.num, mescroll.size, (curPageData)=>{
					//curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置
					
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
					console.log("mescroll.num=" + mescroll.num + ", mescroll.size=" + mescroll.size + ", curPageData.length=" + curPageData.length);

					//方法一(推荐): 后台接口有返回列表的总页数 totalPage
					//mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					//mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

					//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
					//mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

					//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
					mescroll.endSuccess(curPageData.length);

					//设置列表数据
					if(mescroll.num == 1) this.pdList = []; //如果是第一页需手动制空列表
					this.pdList=this.pdList.concat(curPageData); //追加新数据
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			/*联网加载列表数据
			在您的实际项目中,请参考官方写法: http://www.mescroll.com/uni.html#tagUpCallback
			请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
			实际项目以您服务器接口返回的数据为准,无需本地处理分页.
			* */
			getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
				//延时一秒,模拟联网
				setTimeout(()=> {
					try{
						//模拟分页数据
						var listData=[];
						for (var i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
							if(i==mockData.length) break;
							listData.push(mockData[i]);
						}
						//联网成功的回调
						successCallback && successCallback(listData);
					} catch (e) {
						//联网失败的回调
						errorCallback && errorCallback();
					}
				},1000)
			}
		}
	}
</script>

<style>
	image{width: 100%;}
	.header{z-index: 9900;position: fixed;top: --window-top;left: 0;height: 180upx;background: white;}
	.footer{z-index: 9900;position: fixed;bottom: 0;left: 0;height: 100upx;background: white;}
	
	/*展示上拉加载的数据列表*/
	.data-li{
		position: relative;
		height: 160upx;
		padding: 20upx 16upx 20upx 240upx;
		border-bottom: 1upx solid #eee;
	}
	.data-li .pd-img{
		position: absolute;
		left: 36upx;
		top: 20upx;
		width: 160upx;
		height: 160upx;
	}
	.data-li .pd-name{
		font-size: 26upx;
		line-height: 40upx;
		height: 80upx;
		margin-bottom: 20upx;
		overflow: hidden;
	}
	.data-li .pd-price{
		font-size: 26upx;
		color: red;
	}
	.data-li .pd-sold{
		font-size: 24upx;
		margin-left: 16upx;
		color: gray;
	}
</style>
