<template>
  <div>
    <p class="header">mescroll + vue 案例</p>
    <div class="content">
      <router-link to="listNews">list-news 新闻列表 <span class="tip">下拉刷新添加数据到列表顶部</span></router-link>
      <router-link to="listProducts">list-products 商品列表 <span class="tip">下拉刷新重置列表数据</span></router-link>
      <router-link to="mescrollComponent">mescroll-vue 组件 <span class="tip" style="color:red">强烈推荐以组件的方式使用</span></router-link>
      <router-link to="mescrollOptions">mescroll-options 所有配置项 <span class="tip">快速熟悉mescroll</span></router-link>
      <router-link to="mescrollMore">mescroll-more 多mescroll <span class="tip">列表仅初始化一次,缓存数据</span></router-link>
      <router-link to="mescrollSwiperNav">mescroll-swiper-nav <span class="tip">轮播菜单</span></router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style scoped>
  .header {
    z-index: 9990;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border-bottom: 1px solid #eee;
    background-color: white;
  }

  .content {
    padding-top: 44px;
  }

  .content a {
    display: block;
    padding: 15px 12px;
    border-bottom: 1px solid #eee;
  }

  .content .tip {
    float: right;
    margin-top: 2px;
    font-size: 12px;
    color: gray;
  }
</style>
