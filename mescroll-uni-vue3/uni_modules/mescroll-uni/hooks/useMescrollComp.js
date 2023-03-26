import { ref } from 'vue';

// 小程序无法在hook中使用页面级别生命周期,需单独传入: https://ask.dcloud.net.cn/question/161173
// import { onPageScroll, onReachBottom, onPullDownRefresh} from '@dcloudio/uni-app';

/** 
 * mescroll-body写在子组件时,需通过useMescrollComp补充子组件缺少的生命周期, 相当于vue2的mescroll-comp.js文件
 * 必须传入onPageScroll, onReachBottom
 * 当down.native为true时,需传入onPullDownRefresh
 */ 
function useMescrollComp(onPageScroll, onReachBottom, onPullDownRefresh){
	// 因为子组件无onPageScroll和onReachBottom的页面生命周期，需在页面传递进到子组件
	onPageScroll(e=>{
		handlePageScroll(e)
	})
	
	onReachBottom(()=>{
		handleReachBottom()
	})
	
	// 当down的native: true时, 还需传递此方法进到子组件
	onPullDownRefresh && onPullDownRefresh(()=>{
		handlePullDownRefresh()
	})
	
	const mescrollItem = ref(null)
	
	const handlePageScroll = (e)=>{
		const mescroll = getMescroll()
		mescroll && mescroll.onPageScroll(e);
	}
	
	const handleReachBottom = ()=>{
		const mescroll = getMescroll()
		mescroll && mescroll.onReachBottom();
	}
	
	const handlePullDownRefresh = ()=>{
		const mescroll = getMescroll()
		mescroll && mescroll.onPullDownRefresh();
	}
	
	const getMescroll = ()=>{
		if(mescrollItem.value && mescrollItem.value.getMescroll){
			return mescrollItem.value.getMescroll()
		}
		return null
	}
	
	return {
		mescrollItem,
		getMescroll
	}
}

export default useMescrollComp