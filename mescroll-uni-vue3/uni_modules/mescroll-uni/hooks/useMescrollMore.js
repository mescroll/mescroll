import { ref  } from 'vue';

// 小程序无法在hook中使用页面级别生命周期,需单独传入: https://ask.dcloud.net.cn/question/161173
// import { onPageScroll, onReachBottom, onPullDownRefresh} from '@dcloudio/uni-app';

/** mescroll-more示例写在子组件时,需通过useMescrollMore补充子组件缺少的生命周期, 相当于vue2的mescroll-more.js文件 */ 
function useMescrollMore(mescrollItems, onPageScroll, onReachBottom, onPullDownRefresh){
	// 当前tab下标
	const tabIndex = ref(0) 
	
	// 因为子组件无onPageScroll和onReachBottom的页面生命周期，需在页面传递进到子组件
	onPageScroll && onPageScroll(e=>{
		handlePageScroll(e)
	})
	
	onReachBottom && onReachBottom(()=>{
		handleReachBottom()
	})
	
	// 当down的native: true时, 还需传递此方法进到子组件
	onPullDownRefresh && onPullDownRefresh(()=>{
		handlePullDownRefresh()
	})
	
	const handlePageScroll = (e)=>{
		let mescroll = getMescroll(tabIndex.value);
		mescroll && mescroll.onPageScroll(e);
	}
	const handleReachBottom = ()=>{
		let mescroll = getMescroll(tabIndex.value);
		mescroll && mescroll.onReachBottom();
	}
		
	const handlePullDownRefresh = ()=>{
		let mescroll = getMescroll(tabIndex.value);
		mescroll && mescroll.onPullDownRefresh();
	}
	
	// 根据下标获取对应子组件的mescroll
	const getMescroll = (i)=>{
		if (mescrollItems && mescrollItems[i]) {
			return mescrollItems[i].value.getMescroll()
		} else{
			return null
		}
	}
	
	// 切换tab,恢复滚动条位置
	const scrollToLastY = ()=>{
		let mescroll = getMescroll(tabIndex.value);
		if(mescroll){
			// 恢复上次滚动条的位置
			let y = mescroll.getScrollTop()
			mescroll.scrollTo(y, 0)
			// 再次恢复上次滚动条的位置, 确保元素已渲染
			setTimeout(()=>{
				mescroll.scrollTo(y, 0)
			},20)
		}
	}
	
	return {
		tabIndex,
		getMescroll,
		scrollToLastY
	}
}

export default useMescrollMore