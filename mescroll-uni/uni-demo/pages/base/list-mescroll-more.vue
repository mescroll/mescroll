<template>
	<view>
		<!-- 菜单 -->
		<view class="top-warp">
			<view class="tip">每个菜单列表仅初始化一次,切换菜单缓存数据</view>
			<view class="nav">
				<view :class="{'active':tabType==0}" @click="changeTab(0)">全部</view>
				<view :class="{'active':tabType==1}" @click="changeTab(1)">奶粉</view>
				<view :class="{'active':tabType==2}" @click="changeTab(2)">面膜</view>
				<view :class="{'active':tabType==3}" @click="changeTab(3)">图书</view>
			</view>
		</view>
		
		<!--全部 -->
		<!--注意: 不能写成 <template v-if="tabType==0">, 不能用template和v-if  -->
		<view v-show="tabType==0">
			<!-- top是指mescroll的padding-top的数值,单位upx. 目的是使下拉布局往下偏移,不然会被悬浮菜单遮住 -->
			<mescroll-uni top="120" :down="getDownOption(0)" :up="getUpOption()" @down="downCallback" @up="upCallback" @init="mescrollInit0">
				<swiper autoplay="true" interval="3000" duration="300" circular="true">
					<swiper-item>
						<image style="width: 100%" src="http://www.mescroll.com/img/swiper1.jpg" mode="widthFix"/>
					</swiper-item>
					<swiper-item>
						<image style="width: 100%" src="http://www.mescroll.com/img/swiper2.jpg" mode="widthFix"/>
					</swiper-item>
				</swiper>
				<view class="data-li" v-for="pd in tab0.list" :key="pd.id">
					<image class="pd-img" :src="pd.pdImg" mode="widthFix"/>
					<view class="pd-name">{{pd.pdName}}</view>
					<text class="pd-price">{{pd.pdPrice}} 元</text>
					<text class="pd-sold">已售{{pd.pdSold}}件</text>
				</view>
			</mescroll-uni>
		</view>	
		
		<!-- 奶粉 -->
		<!--注意: 不能写成 <template v-if="tabType==1">, 不能用template和v-if  -->
		<view v-show="tabType==1">
			<mescroll-uni top="120" :down="getDownOption(1)" :up="getUpOption()" @down="downCallback" @up="upCallback" @init="mescrollInit1">
				<view class="data-li" v-for="pd in tab1.list" :key="pd.id">
					<image class="pd-img" :src="pd.pdImg" mode="widthFix"/>
					<view class="pd-name">{{pd.pdName}}</view>
					<text class="pd-price">{{pd.pdPrice}} 元</text>
					<text class="pd-sold">已售{{pd.pdSold}}件</text>
				</view>
			</mescroll-uni>
		</view>	
		
		<!-- 面膜 -->
		<!--注意: 不能写成 <template v-if="tabType==2">, 不能用template和v-if  -->
		<view v-show="tabType==2">
			<mescroll-uni top="120" :down="getDownOption(2)" :up="getUpOption()" @down="downCallback" @up="upCallback" @init="mescrollInit2">
				<view class="data-li" v-for="pd in tab2.list" :key="pd.id">
					<image class="pd-img" :src="pd.pdImg" mode="widthFix"/>
					<view class="pd-name">{{pd.pdName}}</view>
					<text class="pd-price">{{pd.pdPrice}} 元</text>
					<text class="pd-sold">已售{{pd.pdSold}}件</text>
				</view>
			</mescroll-uni>
		</view>
		
		<!-- 图书 -->
		<!--注意: 不能写成 <template v-if="tabType==3"> , 不能用template和v-if -->
		<view v-show="tabType==3">
			<mescroll-uni top="120" :down="getDownOption(3)" :up="getUpOption()" @down="downCallback" @up="upCallback" @init="mescrollInit3" @emptyclick="emptyClick">
				<view class="data-li" v-for="pd in tab3.list" :key="pd.id">
					<image class="pd-img" :src="pd.pdImg" mode="widthFix"/>
					<view class="pd-name">{{pd.pdName}}</view>
					<text class="pd-price">{{pd.pdPrice}} 元</text>
					<text class="pd-sold">已售{{pd.pdSold}}件</text>
				</view>
			</mescroll-uni>
		</view>	
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
				tab0:{mescroll:null, isListInit:false, scrollY:0, list:[]},//全部
				tab1:{mescroll:null, isListInit:false, scrollY:0, list:[]},//奶粉
				tab2:{mescroll:null, isListInit:false, scrollY:0, list:[]},//面膜
				tab3:{mescroll:null, isListInit:false, scrollY:0, list:[]},//图书
				tabType: 0 //菜单类型
			}
		},
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			this.tab0.mescroll && this.tab0.mescroll.onReachBottom();
			this.tab1.mescroll && this.tab1.mescroll.onReachBottom();
			this.tab2.mescroll && this.tab2.mescroll.onReachBottom();
			this.tab3.mescroll && this.tab3.mescroll.onReachBottom();
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			this.tab0.mescroll && this.tab0.mescroll.onPageScroll(e);
			this.tab1.mescroll && this.tab1.mescroll.onPageScroll(e);
			this.tab2.mescroll && this.tab2.mescroll.onPageScroll(e);
			this.tab3.mescroll && this.tab3.mescroll.onPageScroll(e);
		},
		methods: {
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit0(mescroll) {
				mescroll.tabType=0; // 加入标记,便于在回调中取到对应的list
				this.tab0.mescroll = mescroll;
			},
			mescrollInit1(mescroll) {
				mescroll.tabType=1;
				this.tab1.mescroll = mescroll;
			},
			mescrollInit2(mescroll) {
				mescroll.tabType=2;
				this.tab2.mescroll = mescroll;
			},
			mescrollInit3(mescroll) {
				mescroll.tabType=3;
				this.tab3.mescroll = mescroll;
			},
			// 多mescroll的配置,需通过方法获取,保证每个配置是单例
			getDownOption(tabType){
				return {
					auto:tabType==0, // 第一个mescroll传入true,列表自动加载
				}
			},
			getUpOption(){
				return  {
					auto:false,
					// page: {
					// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					// 	size: 10 // 每页数据的数量
					// },
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						btnText: "去逛逛 >" //按钮,默认""
					}
				}
			},
			/*下拉刷新的回调*/
			downCallback(mescroll){
				// 这里加载你想下拉刷新的数据, 比如刷新tab1的轮播数据
				if (mescroll.tabType==0) {
					// loadSwiper();
				}else if (mescroll.tabType==2) {
					// ....
				}else if (mescroll.tabType==3) {
					// ....
				}
				mescroll.resetUpScroll();// 触发下拉刷新的回调,加载第一页的数据
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				if(this.tabType!=mescroll.tabType){
					mescroll.endSuccess(); // 只处理当前页的回调,避免tab切换过快,触发的回调和当前页不一致的问题
					return;
				}
				if (mescroll.tabType==0) {
					//全部
					this.tab0.isListInit=true;//标记列表已初始化,保证列表只初始化一次
					this.getListDataFromNet(mescroll.tabType, mescroll.num, mescroll.size, (curPageData)=>{
						mescroll.endSuccess(curPageData.length);//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						if(mescroll.num == 1) this.tab0.list = []; //如果是第一页需手动制空列表
						this.tab0.list=this.tab0.list.concat(curPageData); //追加新数据
					}, () => {
						if(mescroll.num==1) this.tab0.isListInit=false;
						mescroll.endErr();//联网失败的回调,隐藏下拉刷新的状态
					})
					
				} else if (mescroll.tabType==1) {
					//奶粉
					this.tab1.isListInit=true;//标记列表已初始化,保证列表只初始化一次
					this.getListDataFromNet(mescroll.tabType, mescroll.num, mescroll.size, (curPageData)=>{
						mescroll.endSuccess(curPageData.length);//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						if(mescroll.num == 1) this.tab1.list = []; //如果是第一页需手动制空列表
						this.tab1.list=this.tab1.list.concat(curPageData); //追加新数据
					}, () => {
						if(mescroll.num==1) this.tab1.isListInit=false;
						mescroll.endErr();//联网失败的回调,隐藏下拉刷新的状态
					})
					
				} else if (mescroll.tabType==2) {
					//面膜
					this.tab2.isListInit=true;//标记列表已初始化,保证列表只初始化一次
					this.getListDataFromNet(mescroll.tabType, mescroll.num, mescroll.size, (curPageData)=>{
						mescroll.endSuccess(curPageData.length);//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						if(mescroll.num == 1) this.tab2.list = []; //如果是第一页需手动制空列表
						this.tab2.list=this.tab2.list.concat(curPageData); //追加新数据
					}, () => {
						if(mescroll.num==1) this.tab2.isListInit=false;
						mescroll.endErr();//联网失败的回调,隐藏下拉刷新的状态
					})
					
				} else if (mescroll.tabType==3) {
					//图书
					this.tab3.isListInit=true;//标记列表已初始化,保证列表只初始化一次
					this.getListDataFromNet(mescroll.tabType, mescroll.num, mescroll.size, (curPageData)=>{
						mescroll.endSuccess(curPageData.length);//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						if(mescroll.num == 1) this.tab3.list = []; //如果是第一页需手动制空列表
						this.tab3.list=this.tab3.list.concat(curPageData); //追加新数据
					}, () => {
						if(mescroll.num==1) this.tab3.isListInit=false;
						mescroll.endErr();//联网失败的回调,隐藏下拉刷新的状态
					})
					
				}
				
			},
			// 空布局按钮点击的回调
			emptyClick: function(mescroll){
				// 可区分每个mescroll执行不同的逻辑
				// if (mescroll.tabType==0) {
				// 	// ....
				// }else if (mescroll.tabType==2) {
				// 	// ....
				// }else if (mescroll.tabType==3) {
				// 	// ....
				// }
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			},
			// 切换菜单
			changeTab (type) {
				if (this.tabType !== type) {
					var curTab=this.getTabData(this.tabType);//当前tab
					var newTab=this.getTabData(type);//准备切换过去的tab
					this.tabType = type;//切换菜单
					if (!newTab.isListInit) {
						// 如果列表没有初始化过,则初始化
						newTab.mescroll.resetUpScroll();
					} else{
						//记录当前滚动条的位置
						curTab.scrollY=curTab.mescroll.getScrollTop();
						//延时,待界面更新后,滚动到指定位置
						setTimeout(()=>{
							uni.pageScrollTo({
								scrollTop: this.getTabData(type).scrollY,
								duration: 0
							});
						},30)
					}
				}
			},
			
			// 获取菜单对应的数据
			getTabData(tabType){
				if (tabType==0) {
					return this.tab0;
				} else if (tabType==1) {
					return this.tab1;
				} else if (tabType==2) {
					return this.tab2;
				} else if (tabType==3) {
					return this.tab3;
				}
			},
			
			/*联网加载列表数据
			在您的实际项目中,请参考官方写法: http://www.mescroll.com/uni.html#tagUpCallback
			请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
			实际项目以您服务器接口返回的数据为准,无需本地处理分页.
			* */
			getListDataFromNet(tabType,pageNum,pageSize,successCallback,errorCallback) {
				//延时一秒,模拟联网
				setTimeout(()=> {
					try{
						var listData = []
						// tabType 全部商品0; 奶粉1; 面膜2; 图书3;
						if (tabType === 0) {
							// 全部商品 (模拟分页数据)
							for (var i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
								if (i === mockData.length) break
								listData.push(mockData[i])
							}
						} else if (tabType === 1) {
							// 奶粉
							for (var n = 0; n < mockData.length; n++) {
								if (mockData[n].pdName.indexOf('奶粉') !== -1) {
									listData.push(mockData[n])
								}
							}
						}else if (tabType === 2) {
							// 面膜
							for (var j = 0; j < mockData.length; j++) {
								if (mockData[j].pdName.indexOf('面膜') !== -1) {
									listData.push(mockData[j])
								}
							}
						} else if (tabType === 2) {
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
