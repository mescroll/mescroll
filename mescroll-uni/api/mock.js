/*
本地模拟接口请求, 仅demo演示用.
实际项目以您服务器接口返回的数据为准,无需本地处理分页.
请参考官方写法: https://www.mescroll.com/uni.html?v=20200210#tagUpCallback
* */

// 模拟数据
import goods from "./goods.js";

// 获取新闻列表
export function apiNewList(pageNum, pageSize) {
	return new Promise((resolute, reject)=>{
		//延时一秒,模拟联网
		setTimeout(function() {
			try {
				let list = [];
				if (!pageNum) {
					//模拟下拉刷新返回的数据
					let id=new Date().getTime();
					let newObj = {
						id:id,
						title: "【新增新闻" + id + "】 标题",
						content: "新增新闻的内容"
					};
					list.push(newObj);
				} else {
					//模拟上拉加载返回的数据
					for (let i = 0; i < pageSize; i++) {
						let upIndex = (pageNum - 1) * pageSize + i + 1;
						let newObj = {
							id:upIndex,
							title: "【新闻" + upIndex + "】 标题标题标题标题标题",
							content: "内容内容内容内容内容内容内容内容内容"
						};
						list.push(newObj);
					}
					console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				}
				//模拟接口请求成功
				resolute(list);
			} catch (e) {
				//模拟接口请求失败
				reject(e);
			}
		}, 1000)
	})
}

// 搜索商品
export function apiGoods(pageNum, pageSize, keyword) {
	return new Promise((resolute, reject)=>{
		//延时一秒,模拟联网
		setTimeout(()=> {
			try{
				let data = {
					list: [], // 数据列表
					totalCount: 0, // 总数量
					totalPage: 0, // 总页数
					hasNext: false // 是否有下一页
				}
				
				// 符合关键词的记录
				let keywordList = [];
				if (!keyword || keyword == "全部") {
					// 搜索全部商品
					keywordList = goods;
				}else{
					// 关键词搜索
					if(keyword=="母婴") keyword="婴"; // 为这个关键词展示多几条数据
					for (let i = 0; i < goods.length; i++) {
						let good = goods[i]
						if (good.goodName.indexOf(keyword) !== -1) {
							keywordList.push(good)
						}
					}
				}
				
				// 分页
				for (let i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
					if (i >= keywordList.length) break
					data.list.push(keywordList[i])
				}
				
				// 汇总数据
				data.totalCount = keywordList.length;
				data.totalPage = Math.ceil(data.totalCount/pageSize);
				data.hasNext = pageNum < data.totalPage
				
				//模拟接口请求成功
				console.log("pageNum=" + pageNum + ", pageSize=" + pageSize + ", data.list.length=" + data.list.length + ", totalCount=" + data.totalCount + ", totalPage=" + data.totalPage + ", hasNext=" + data.hasNext + (keyword ? ", keyword=" + keyword : ""));
				resolute(data);
			} catch (e) {
				//模拟接口请求失败
				reject(e);
			}
		},1000)
	})
}

// 获取微博列表
export function apiWeiboList(pageNum, pageSize) {
	return new Promise((resolute, reject)=>{
		//延时2秒,模拟联网
		setTimeout(function() {
			try {
				let list = [];
				if(!pageNum){
					//此处模拟下拉刷新返回的数据
					let id=new Date().getTime();
					let newObj={id:id, title:"【新增微博"+id+"】 新增微博", content:"新增微博的内容,新增微博的内容"};
					list.push(newObj);
				}else{
					//此处模拟上拉加载返回的数据
					for (let i = 0; i < pageSize; i++) {
						let upIndex=(pageNum-1)*pageSize+i+1;
						let newObj={id:upIndex, title:"【微博"+upIndex+"】 标题标题标题标题标题标题", content:"内容内容内容内容内容内容内容内容内容内容"};
						list.push(newObj);
					}
					console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				}
				//模拟接口请求成功
				resolute(list);
			} catch (e) {
				//模拟接口请求失败
				reject(e);
			}
		}, 2000)
	})
}


// 获取消息列表(共5页消息)
export function apiMsgList(pageNum, pageSize) {
	return new Promise((resolute, reject)=>{
		//延时一秒,模拟联网
		setTimeout(function() {
			try {
				let list = [];
				//模拟下拉加载更多记录
				for (let i = 0; i < pageSize; i++) {
					let msgId = (pageNum - 1) * pageSize + i + 1;
					let newObj = {
						id: msgId,
						title: "【消息" + msgId + "】",
						content: "内容: 下拉获取聊天记录"
					};
					// 此处模拟只有5页的消息 (第5页只有3条)
					if(pageNum>=5 && i>=3){}else{
						list.unshift(newObj);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				//模拟接口请求成功
				resolute(list);
			} catch (e) {
				//模拟接口请求失败
				reject(e);
			}
		}, 1000)
	})
}

// 获取tabs类目
export function apiGetTabs() {
	return new Promise((resolute, reject)=>{
		//延时,模拟联网
		setTimeout(function() {
			try {
				let tabs = ['全部', '奶粉', '面膜', '图书', '果汁', '奶瓶', '美素', '花王', '韩蜜', '口红', '毛巾', '玩具', '衣服'];
				//模拟接口请求成功
				resolute(tabs);
			} catch (e) {
				//模拟接口请求失败
				reject(e);
			}
		}, 10)
	})
}