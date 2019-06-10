<template>
  <div class="song-list">
    <div @click="selectItem" class="item">
      <div class="content">
        <h2 class="name">{{song.name}}</h2>
        <p class="desc">{{song.singer.name}} - {{song.album.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    song: {
      type: Object,
      default () {
        return null
      }
    },
    index: {
      type: Number,
      default: -1
    }
  },
  methods: {
    selectItem () {
      this.$emit('selectSong', {
        song: this.song,
        index: this.index
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable'
@import '../../assets/styles/mixin'
.song-list
  .item
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-medium
    .content
      flex 1
      line-height 20px
      overflow hidden
      .name
        no-wrap()
        color $color-text
      .desc
        no-wrap()
        margin-top 4px
        color $color-text-d
        font-size $font-size-small
</style>
