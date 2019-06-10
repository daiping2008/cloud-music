<template>
  <div class="singer">
    <scroll
      ref="scroll"
      class="listview"
      :data="artists"
      :listen-scroll="listenScroll"
      :probe-type="probeType"
      @scroll="scroll"
    >
      <ul>
        <li ref="listGroup" class="list-group" v-for="v in artists" :key="v.title">
          <h2 class="list-group-title">{{v.title}}</h2>
          <ul>
            <li @click="selectItem(e)" class="list-group-item" v-for="e in v.items" :key="e.id">
              <img class="avatar" v-lazy="e.picUrl" alt="">
              <span class="name">{{e.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      </scroll>
      <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
        <ul>
          <li class="item" :class="{current: currentIndex === i}" v-for="(v, i) in artists" :key="v.title" :data-index="i">{{v.title.slice(0,1)}}</li>
        </ul>
      </div>
      <div v-show="fixedTitle" ref='fixed' class="list-fixed">
        <div class="fixed-title">{{fixedTitle}}</div>
      </div>
      <div v-if="!artists.length" class="loading-wrapper">
        <loading />
      </div>
      <transition name="slide">
      <router-view></router-view>
       </transition>
  </div>
</template>
<script>
import Scroll from '@/components/scroll'
import Loading from '@/components/loading'
import { getArtist } from '@/api/singer'
import { getData } from '@/utils/dom'
import { mapActions } from 'vuex'
import pinyin from 'pinyin'

const HOT_NAME = '热门'
const HOT_SINGERS = 10
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  data () {
    return {
      artists: [],
      scrollY: -1,
      currentIndex: 0,
      listHeight: [],
      diff: -1
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.probeType = 3
  },
  mounted () {
    this._getArtist()
  },
  computed: {
    fixedTitle () {
      if (this.scrollY > 0) return ''
      return this.artists[this.currentIndex] ? this.artists[this.currentIndex].title : ''
    }
  },
  watch: {
    artists () {
      this.$nextTick(() => {
        this._calculateHeight()
      })
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        const height1 = listHeight[i]
        const height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = newY + height2
          return
        }
      }
      this.currentIndex = listHeight.length - 2
    },
    diff (newY) {
      const fixedTop = (newY > 0 && newY < TITLE_HEIGHT) ? TITLE_HEIGHT - newY : 0
      if (this.fixedTop === fixedTop) return
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate(0,-${fixedTop}px)`
    }
  },
  methods: {
    ...mapActions(['setSinger']),
    selectItem (artist) {
      this.$router.push(`/singer/${artist.id}`)
      this.setSinger(artist)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    onShortcutTouchMove (e) {
      const firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      const delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      const anchorIndex = Number(this.touch.anchorIndex) + delta
      this._scrollToElement(anchorIndex)
    },
    onShortcutTouchStart (e) {
      const anchorIndex = getData(e.target, 'index')
      const firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollToElement(anchorIndex)
    },
    _calculateHeight () {
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < this.artists.length; i++) {
        const listGroup = this.$refs.listGroup[i]
        height += listGroup.clientHeight
        this.listHeight.push(height)
      }
    },
    _scrollToElement (index) {
      if (!index) return
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 100)
    },
    _getArtist () {
      getArtist().then(res => (this.artists = this._normalizeArtists(res.list.artists)))
    },
    _normalizeArtists (artists) {
      const map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      for (let i = 0; i < HOT_SINGERS; i++) {
        map.hot.items.push(artists[i])
      }

      for (let i = 0; i < artists.length; i++) {
        const key = pinyin(artists[i].name)[0][0].charAt(0).toUpperCase()
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(artists[i])
      }

      const hot = []
      const res = []
      for (let key in map) {
        let v = map[key]
        if (v.title.match(/[a-zA-Z]/)) {
          res.push(v)
        } else if (v.title === HOT_NAME) {
          hot.push(v)
        }
      }

      res.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(res)
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable'
.singer
  position fixed
  width 100%
  top 88px
  bottom 0
  overflow hidden
  .listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background-color $color-background
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background-color $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position absolute
    top 0
    left 0
    right 0
    .fixed-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background-color $color-highlight-background
  .loading-wrapper
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
