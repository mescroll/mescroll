<template>
	<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :fixed="true" @emptyclick="emptyClick" @topclick="topClick" @scroll="scroll" @init="mescrollInit">
		<!--轮播-->
		<swiper autoplay="true" interval="3000" duration="300" circular="true">
            <swiper-item>
                <image style="width: 100%" src="http://www.mescroll.com/img/swiper1.jpg" mode="widthFix"/>
            </swiper-item>
			<swiper-item>
                <image style="width: 100%" src="http://www.mescroll.com/img/swiper2.jpg" mode="widthFix"/>
            </swiper-item>
        </swiper>
		<!--筛选条件; 模拟列表的重置和演示空布局-->
		<view class="nav">
			<view :class="{active:tabType==0}" @click="changeTab(0)">全部</view>
			<view :class="{active:tabType==1}" @click="changeTab(1)">奶粉</view>
			<view :class="{active:tabType==2}" @click="changeTab(2)">图书</view>
		</view>
		<!-- 数据列表 -->
		<pd-list :list="pdList"></pd-list>
	</mescroll-uni>
</template>

<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import PdList from "@/components/other/pd-list.vue";
	import mockData from "@/common/pdlist.js"; // 模拟数据
	
	export default {
		components: {
			MescrollUni,
			PdList
		},
		data() {
			return {
				mescroll: null, //mescroll实例对象
				downOption: {
					use: true, // 是否启用下拉刷新; 默认true
					auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
					autoShowLoading: true, // 如果设置auto=true(在初始化完毕之后自动执行下拉刷新的回调),那么是否显示下拉刷新的进度; 默认false
					isLock: false, // 是否锁定下拉刷新,默认false;
					isBoth: true, // 下拉刷新时,如果滑动到列表底部是否可以同时触发上拉加载;默认true,两者可同时触发;
					offset: 80, // 在列表顶部,下拉大于80upx,松手即可触发下拉刷新的回调
					fps: 40, // 下拉节流 (值越大每秒刷新频率越高)
					inOffsetRate: 1, // 在列表顶部,下拉的距离小于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
					outOffsetRate: 0.2, // 在列表顶部,下拉的距离大于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
					bottomOffset: 20, // 当手指touchmove位置在距离body底部20upx范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行
					minAngle: 45, // 向下滑动最少偏移的角度,取值区间  [0,90];默认45度,即向下滑动的角度大于45度则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;
					textInOffset: '下拉刷新', // 下拉的距离在offset范围内的提示文本
					textOutOffset: '释放更新', // 下拉的距离大于offset范围的提示文本
					textLoading: '加载中 ...' // 加载中的提示文本
				},
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					isLock: false, // 是否锁定上拉加载,默认false;
					isBoth: true, // 上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认true,两者可同时触发;
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10, // 每页数据的数量
						time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
					},
					fps: 40, // 上拉节流 (值越大每秒刷新频率越高)
					noMoreSize: 3, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
					offset: 80, // 距底部多远时,触发upCallback
					textLoading: '加载中 ...', // 加载中的提示文本
					textNoMore: '-- END --', // 没有更多数据的提示文本
					toTop: {
						// 回到顶部按钮,需配置src才显示
						src: "http://www.mescroll.com/img/mescroll-totop.png", // 图片路径
						offset: 1000, // 列表滚动多少距离才显示回到顶部按钮,默认1000
						duration: 300 // 回到顶部的动画时长,默认300ms
					},
					empty: {
						use: true, // 是否显示空布局
						icon: "http://www.mescroll.com/img/mescroll-empty.png", // 图标路径
						tip: '~ 暂无相关数据 ~', // 提示
						btnText: '去逛逛 >', // 按钮
						fixed: false, // 是否使用fixed定位,默认false; 配置fixed为true,以下的top和zIndex才生效
						top: "35%", // fixed定位的top值 (完整的单位值,如 "35%"; "300upx")
						zIndex: 99 // fixed定位z-index值
					},
					onScroll: true // 是否监听滚动事件, 默认false (配置为true时,可@scroll="scroll"获取到滚动条位置和方向)
				},
				pdList: [], //列表数据
				tabType: 0, // 菜单
			}
		},
		methods: {
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
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
			// 点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:"点击了按钮"
				})
			},
			// 点击回到顶部按钮的回调
			topClick(){
				console.log('点击了回到顶部按钮');
			},
			// 滚动事件 (需在up配置onScroll:true才生效)
			scroll(mescroll){
				console.log('当前滚动条的位置:' + mescroll.scrollTop + ', 是否向上滑:'+mescroll.isScrollUp)
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
						let listData = []
						// tabType 全部商品0; 奶粉1; 图书2;
						if (this.tabType === 0) {
							// 全部商品 (模拟分页数据)
							for (let i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
								if (i === mockData.length) break
								listData.push(mockData[i])
							}
						} else if (this.tabType === 1) {
							// 奶粉
							for (let j = 0; j < mockData.length; j++) {
								if (mockData[j].pdName.indexOf('奶粉') !== -1) {
									listData.push(mockData[j])
								}
							}
						} else if (this.tabType === 2) {
							// 图书
							for (let k = 0; k < mockData.length; k++) {
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
	/*菜单*/
	.nav{
		font-size: 28upx;
		text-align: center;
		border-bottom: 1upx solid #ddd;
	}
	.nav view{
		display: inline-block;
		width: 30%;
		padding: 16upx 0;
	}
	.nav .active{
		border-bottom: 2upx solid #FF6990;
		color: #FF6990;
	}
</style>
