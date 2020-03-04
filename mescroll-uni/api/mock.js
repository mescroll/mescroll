/*
本地模拟接口请求, 仅demo演示用.
实际项目以您服务器接口返回的数据为准,无需本地处理分页.
请参考官方写法: http://www.mescroll.com/uni.html?v=20200210#tagUpCallback
* */

// 模拟数据
import goods from "./goods.js";
import goodsEdit from "./goods-edit.js";

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

// 获取商品列表数据
export function apiGoods(pageNum, pageSize, isGoodsEdit) {
	return new Promise((resolute, reject)=>{
		//延时一秒,模拟联网
		setTimeout(()=> {
			try{
				let data = isGoodsEdit ? goodsEdit : goods;
				//模拟分页数据
				let list=[];
				for (let i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
					if(i==data.length) break;
					list.push(data[i]);
				}
				//模拟接口请求成功
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			} catch (e) {
				//模拟接口请求失败
				reject(e);
			}
		},1000)
	})
}

// 搜索商品
export function apiSearch(pageNum, pageSize, keyword) {
	return new Promise((resolute, reject)=>{
		//延时一秒,模拟联网
		setTimeout(()=> {
			try{
				// 模拟搜索
				let list = []
				if (!keyword || keyword == "全部") {
					// 模拟搜索全部商品
					for (let i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
						if (i === goods.length) break
						list.push(goods[i])
					}
				} else{
					// 模拟关键词搜索
					if(keyword=="母婴") keyword="婴"; // 为这个关键词展示多几条数据
					for (let i = 0; i < goods.length; i++) {
						if (goods[i].pdName.indexOf(keyword) !== -1) {
							list.push(goods[i])
						}
					}
				}
				//模拟接口请求成功
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length+", keyword="+keyword);
				resolute(list);
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