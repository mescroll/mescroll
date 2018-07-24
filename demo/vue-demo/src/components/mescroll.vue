<template>
  <div :id="meid" class="mescroll" v-bind:style="mescrollCss">
    <div style="position: relative;">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../static/mescroll'
  export default {
    name: 'MeScroll',
    data: function () {
      return {
        _me: {},
        mescrollCss: {
          position: 'fixed',
          top: 0,
          bottom: 0,
          height: 'auto',
          width: '100%'
        }
      }
    },
    props: {
      meid: {
        type: String,
        default: 'mescroll'
      },
      up: {
        type: Object
      },
      down: {
        type: Object
      }
    },
    mounted: function () {
      var up = null
      var down = null
      if (this.up) {
        up = Object.assign({}, this.up)
        up.callback = this.callUp
      } else {
        up = {}
        up.callback = this.callUp
      }
      if (this.down) {
        down = Object.assign({}, this.down)
        down.callback = this.callDown
      } else {
        down = {}
        down.callback = this.callDown
      }

      var _me = new MeScroll(this.meid, {
        up: up,
        down: down
      });
      this._me = _me
      this.$emit('init', _me)
    },
    methods: {
      callUp: function (page, mescroll) {
        this.$emit('up', page, mescroll)
      },
      callDown: function (mescroll) {
        this.$emit('down', mescroll)
      }
    }
  }
</script>

<style>
  .data-list {

  }

</style>
