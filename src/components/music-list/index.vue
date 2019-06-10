<template>
  <div class="music-list">
    <div class="back">
      <i @click="goBack" class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter"></div>
      <div ref="playBtn" class="play-wrapper">
        <div @click="random" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div ref="layer" class="bg-layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" ref="list" :data="songs" class="list">
      <div>
        <song-list @selectSong="selectSong" class="song-list-wrapper" v-for="(e, i) in songs" :key="e.id" :song="e" :index="i"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from '@/components/song-list'
import Scroll from '@/components/scroll'
import { mapActions } from 'vuex'
const REVERSE_HEIGHT = 40
export default {
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scrollY: -1
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  created () {
    this.listenScroll = true
    this.probeType = 3
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + REVERSE_HEIGHT
    this.$refs.list.$el.style.top = this.imageHeight + 'px'
  },
  watch: {
    scrollY (newY) {
      const translateY = Math.max(this.minTranslateY, newY)
      this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
      let zIndex = 0
      let scale = 1
      const bgImage = this.$refs.bgImage
      const playBtn = this.$refs.playBtn
      const precent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        zIndex = 10
        scale += precent
        bgImage.style.transform = `scale(${scale})`
      }
      if (newY < this.minTranslateY) {
        zIndex = 10
        bgImage.style.paddingBottom = 0
        bgImage.style.height = `${REVERSE_HEIGHT}px`
        playBtn.style.display = 'none'
      } else {
        bgImage.style.paddingBottom = '70%'
        bgImage.style.height = 0
        playBtn.style.display = ''
      }
      bgImage.style.zIndex = zIndex
    }
  },
  methods: {
    ...mapActions(['randomPlay']),
    selectSong ({ song, index }) {
      this.$emit('selectItem', { song, index })
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    goBack () {
      this.$router.back()
    },
    random () {
      this.randomPlay({
        songs: this.songs
      })
    }
  },
  components: {
    SongList,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable'
@import '../../assets/styles/mixin'
.music-list
  position fixed
  z-index 100
  top 0
  left 0
  bottom 0
  right 0
  background-color $color-background
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .title
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align center
    line-height 40px
    font-size $font-size-large
    color $color-text
  .bg-image
    position relative
    width 100%
    height 0
    padding-bottom 70%
    transform-origin top
    background-size cover
    .filter
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background-color rgba(7, 17, 27, 0.4)
    .play-wrapper
      position absolute
      bottom 20px
      z-index 50
      width 100%
      .play
        box-sizing border-box
        width 135px
        padding 7px 0
        margin 0 auto
        text-align center
        border 1px solid $color-theme
        color $color-theme
        border-radius 100px
        font-size 0
        .icon-play
          display inline-block
          vertical-align middle
          margin-right 6px
          font-size $font-size-medium-x
        .text
          display inline-block
          vertical-align middle
          font-size $font-size-small
  .bg-layer
    position relative
    height 100%
    background-color $color-background
  .list
    position fixed
    top 0
    bottom 0
    width 100%
    background-color $color-background
    .song-list-wrapper
      padding 0px 30px
</style>
