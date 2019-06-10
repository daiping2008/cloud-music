<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
  </div>
</template>

<script>
export default { }
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable'
@import '../../assets/styles/mixin'
.m-header
  position relative
  height 44px
  text-align center
  font-size 0
  color $color-theme
  .icon
    display inline-block
    width 30px
    height 32px
    margin-top 6px
    margin-right 9px
    bg-image('logo')
    background-size 30px 32px
    vertical-align top
  .text
    display inline-block
    line-height 44px
    font-size $font-size-large
    vertical-align top
</style>
