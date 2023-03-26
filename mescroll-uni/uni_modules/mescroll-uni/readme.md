## mescroll --【wxs+renderjs实现】高性能的下拉刷新上拉加载组件
1. mescroll的uni版本 是专门用在uni-app的下拉刷新和上拉加载的组件  

2. mescroll的uni版本 继承了mescroll.js的实用功能: 自动处理分页, 自动控制无数据, 空布局提示, 回到顶部按钮 ..

3. mescroll的uni版本 丰富的案例, 自由灵活的api, 超详细的注释, 可让您快速自定义真正属于自己的下拉上拉组件

<br/>


## 最新文档(1.3.8版本): <a href="https://www.mescroll.com/uni.html">https://www.mescroll.com/uni.html</a>
2023-03-26 by 小瑾同学 (文档可能会有缓存,建议打开时刷新一下)


## 1.3.5版本已调整为[uni_modules](https://uniapp.dcloud.io/uni_modules)
uni_modules版本的mescroll-body 和 mescroll-empty 支持 [easycom规范](https://uniapp.dcloud.io/collocation/pages?id=easycom)  
所以 main.js 无需再为mescroll-body注册全局组件  
所以个别页面要单独使用 mescroll-empty , 也无需手动注册
#### 1.3.5以前的用户升级为uni_modules版本:
```
1. 删除原来的 @/components/mescroll-uni 组件
2. 删除 main.js 注册的 mescroll 组件
3. 从插件市场导入最新mescroll组件 (1.3.5+uni_modules版本)
4. 全局搜索 '@/components/mescroll-uni/' 替换为 '@/uni_modules/mescroll-uni/components/mescroll-uni/'
5. mescroll-empty遵循easycom规范, 若某些页面单独使用 'mescroll-empty.vue', 可删除手动导入的代码
```

## 近期已更新优化的内容:
1. 新增vue3 script setup的示例  
2. 新增`入门极简`示例, 国际化`mescroll-i18n.vue`示例, 轮播吸顶菜单`mescroll-swiper-sticky.vue`示例  
3. 新增 "局部区域滚动" 的案例: mescroll-body-part.vue 和 mescroll-uni-part.vue  
4. 新增 me-video 视频组件, 解决APP端视频下拉悬浮错位的问题, 参考 mescroll-options.vue 示例  
5. 新增 me-tabs 组件,tabs支持水平滑动; 优化mescroll-more和mescroll-swiper的案例, 顶部tab支持水平滑动  
6. 吸顶悬浮提供了原生sticky和监听滚动条实现的示例: sticky.vue 和 sticky-scroll.vue (推荐使用sticky样式实现)  
7. mescroll.scrollTo(y)的y支持css选择器, 包括跨自定义组件的后代选择器, 支持滚动到子组件的view (参考 mescroll-options.vue)  
8. topbar 顶部是否预留状态栏的高度, 默认false; 还可支持设置状态栏背景: 如 '#ffff00', 'url(xxx) 0 0/100% 100%', 'linear-gradient(xx)'  
9. down.bgColor 和 up.bgColor 加载区域的背景,不仅支持色值, 而且还是支持背景图和渐变: 如 'url(xxx) 0 0/100% 100%', 'linear-gradient(xx)'  
10. topbar,bgColor支持一行代码定义background: [https://www.runoob.com/cssref/css3-pr-background.html](https://www.runoob.com/cssref/css3-pr-background.html)
<br/>
<br/>
<a href="https://ext.dcloud.net.cn/plugin?id=343&update_log">查看更多 ... </a>

<br/>

#### mescroll不支持nvue,也暂无支持的计划哈,so sorry~