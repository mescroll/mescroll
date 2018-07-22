<template>
  <div id="app">
    <MeScroll @up="meUp" @down="meDown" :down="downconfig" :up="upconfig" @init="meInit" >
      <div class="some" v-for="item in list">{{item}}</div>
    </MeScroll>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'App',
    components: {
    },
    data(){
      return {
        list: [],
        mescroll:{},
        downconfig:{
          use:false
        },
        upconfig:{
          use:true
        }
      }
    },
    methods: {
      meUp: function (page) {
        setTimeout(()=> {
          for (var i = 0; i < page.size; i++) {
            this.list.push(page.num * i)
          }
          this.mescroll.endSuccess(page.size)
        }, 1000)
      },
      meInit(mescroll){
        this.mescroll = mescroll
      },
      meDown(){
        setTimeout(()=>{
          this.list = [100,111,212,344,556,777,888,444,666,111]
          this.mescroll.endSuccess()
        },100)
      }
    }
  }
</script>

<style>
  body, html {
    margin: 0;
  }

  .some {
    position: relative;
    width: 100%;
    height: 105px;
    border-bottom:1px solid cornflowerblue;

  }
</style>
