<template>
	<mescroll-uni @down="downCallback" @up="upCallback">
		<view class="notice-warp">
			<view class="notice">商品的名称价格销量随时会变动,也可能会下架删除</view>
			<view class="notice">所以本Demo的下拉刷新会重置列表数据</view>
			<view class="btn-change" @click="dataTag=2">{{dataTag==2 ? "已模拟后台修改信息, 请下拉刷新" : "点击模拟后台修改商品信息"}}</view>
		</view>
		<pd-list :list="pdList"></pd-list>
	</mescroll-uni>
</template>

<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import PdList from "@/components/other/pd-list.vue";
	// 模拟数据
	import pdlistNor from "@/common/pdlist.js";
	import pdlistEdit from "@/common/pdlist-edit.js";
	
	export default {
		components: {
			MescrollUni,
			PdList
		},
		data() {
			return {
				pdList: [], // 数据列表
				dataTag: 1  // dataTag=2,模拟加载编辑后的数据
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

					//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据
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
						let data = this.dataTag==1 ? pdlistNor : pdlistEdit;
						//模拟分页数据
						let listData=[];
						for (let i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
							if(i==data.length) break;
							listData.push(data[i]);
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
	/*说明*/
	.notice-warp{
		font-size: 26upx;
		padding: 40upx 0;
		border-bottom: 1upx solid #eee;
		text-align: center;
	}
	.notice-warp .notice{
		color:#555;
	}
	.notice-warp .btn-change{
		display: inline-block;
		margin-top: 28upx;
		padding: 6upx 16upx;
		border: 1upx solid #FF6990;
		border-radius: 40upx;
		color: #FF6990;
	}
	.notice-warp .btn-change:active{
		opacity: .5;
	}
</style>
