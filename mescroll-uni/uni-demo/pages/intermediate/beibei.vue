<template>
	<view>
		<!-- 模拟的标题 -->
		<image class="header" src="http://www.mescroll.com/img/beibei/header.jpg" mode="aspectFit"/>
		
		<mescroll-uni top="180" bottom="100" @down="downCallback" @up="upCallback">
			<!-- 模拟的内容 -->
			<image src="http://www.mescroll.com/img/beibei/beibei1.jpg" mode="widthFix"/>
			<image src="http://www.mescroll.com/img/beibei/beibei2.jpg" mode="widthFix"/>
			<!-- 分页的数据列表 -->
			<pd-list :list="pdList"></pd-list>
		</mescroll-uni>
		
		<!-- 模拟的底部 -->
		<image class="footer" src="http://www.mescroll.com/img/beibei/footer.jpg" mode="aspectFit"/>
	</view>
</template>

<script>
	// 自定义的mescroll-beibei.vue
	import MescrollUni from "@/components/mescroll-diy/mescroll-beibei.vue";
	import PdList from "@/components/other/pd-list.vue";
	// 模拟数据
	import mockData from "@/common/pdlist.js";
	
	export default {
		components: {
			MescrollUni,
			PdList
		},
		data() {
			return {
				pdList: [] // 数据列表
			}
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback(mescroll) {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
				mescroll.resetUpScroll()
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				//联网加载数据
				this.getListDataFromNet(mescroll.num, mescroll.size, (curPageData)=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					console.log("mescroll.num=" + mescroll.num + ", mescroll.size=" + mescroll.size + ", curPageData.length=" + curPageData.length);
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
						let listData=[];
						for (let i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
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
</style>
