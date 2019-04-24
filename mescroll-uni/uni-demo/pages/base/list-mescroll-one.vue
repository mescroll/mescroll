<template>
	<view>
		<!-- 菜单 -->
		<view class="top-warp">
			<view class="tip">每次切换菜单及时刷新列表,不缓存数据</view>
			<view class="nav">
				<view :class="{active:tabType==0}" @click="changeTab(0)">全部</view>
				<view :class="{active:tabType==1}" @click="changeTab(1)">奶粉</view>
				<view :class="{active:tabType==2}" @click="changeTab(2)">面膜</view>
				<view :class="{active:tabType==3}" @click="changeTab(3)">图书</view>
			</view>
		</view>
		
		<!-- top是指mescroll的padding-top的数值,单位upx. 目的是使下拉布局往下偏移,不然会被悬浮菜单遮住 -->
		<mescroll-uni top="120" :up="upOption" @up="upCallback" @down="downCallback" @init="mescrollInit" @emptyclick="emptyClick">
			<!-- 数据列表 -->
			<view class="data-li" v-for="pd in pdList" :key="pd.id">
				<image class="pd-img" :src="pd.pdImg" mode="widthFix"/>
				<view class="pd-name">{{pd.pdName}}</view>
				<text class="pd-price">{{pd.pdPrice}} 元</text>
				<text class="pd-sold">已售{{pd.pdSold}}件</text>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollUni from "../../components/mescroll-uni/mescroll-uni.vue";
	import mockData from "../../common/pdlist.js"; // 模拟数据
	
	export default {
		components: {
			MescrollUni
		},
		data() {
			return {
				mescroll: null, //mescroll实例对象
				upOption:{
					// page: {
					// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					// 	size: 10 // 每页数据的数量
					// },
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty:{
						tip: '~ 搜索无数据 ~', // 提示
						btnText: '去看看'
					}
				},
				pdList: [], //列表数据
				tabType: 0 // 菜单
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
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					mescroll.endSuccess(curPageData.length);
					//设置列表数据
					if(mescroll.num == 1) this.pdList = []; //如果是第一页需手动制空列表
					this.pdList=this.pdList.concat(curPageData); //追加新数据
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			},
			
			// 切换菜单
			changeTab (type) {
				if (this.tabType !== type) {
					this.tabType = type
					this.pdList = []// 在这里手动置空列表,可显示加载中的请求进度
					this.mescroll.resetUpScroll()// 刷新列表数据
				}
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
						var listData = []
						// tabType 全部商品0; 奶粉1; 面膜2; 图书3;
						if (this.tabType === 0) {
							// 全部商品 (模拟分页数据)
							for (var i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
								if (i === mockData.length) break
								listData.push(mockData[i])
							}
						} else if (this.tabType === 1) {
							// 奶粉
							for (var n = 0; n < mockData.length; n++) {
								if (mockData[n].pdName.indexOf('奶粉') !== -1) {
									listData.push(mockData[n])
								}
							}
						}else if (this.tabType === 2) {
							// 面膜
							for (var j = 0; j < mockData.length; j++) {
								if (mockData[j].pdName.indexOf('面膜') !== -1) {
									listData.push(mockData[j])
								}
							}
						} else if (this.tabType === 2) {
							// 图书
							for (var k = 0; k < mockData.length; k++) {
								if (mockData[k].pdName.indexOf('图书') !== -1) {
									listData.push(mockData[k])
								}
							}
						}
						// 回调
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
	.top-warp{
		z-index: 9990;
		position: fixed;
		top: --window-top; /* css变量 */
		left: 0;
		width: 100%;
		height: 120upx;
		background-color: white;
	}
	.top-warp .tip{
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
	}
	.top-warp .nav{
		text-align: center;
		height: 60upx;
		border-bottom: 1upx solid #ddd;
	}
	.top-warp .nav view{
		display: inline-block;
		width: 22%;
		line-height: 60upx;
		font-size: 28upx;
	}
	.top-warp .nav .active{
		border-bottom: 2upx solid #FF6990;
		color: #FF6990;
	}
	
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
