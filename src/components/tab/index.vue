<template>
  <div class="tab">
    <router-link
      v-for="v in tabs"
      :key="v.name"
      :to="v.path"
      tag="div"
      class="tab-item">
      <span class="tab-link">{{v.name}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabs: [
        {
          path: '/recommend',
          name: '推荐'
        },
        {
          path: '/singer',
          name: '歌手'
        },
        {
          path: '/rank',
          name: '排行'
        },
        {
          path: '/search',
          name: '搜索'
        }
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable'
.tab
  display: flex
  height: 44px
  line-height: 44px
  font-size: $font-size-medium
  .tab-item
    flex: 1
    text-align: center
    .tab-link
      padding-bottom: 5px
      color: $color-text-l
    &.router-link-active
      .tab-link
        color: $color-theme
        border-bottom: 2px solid $color-theme
</style>
