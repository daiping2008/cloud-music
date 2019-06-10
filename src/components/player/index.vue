<template>
  <div class="player" v-if="playList.length>0">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.image" width="100%" height="100%" alt="">
      </div>
      <div class="top">
        <div @click="back" class="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer.name"></h2>
      </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd" :class="cdCls">
              <img class="image" :src="currentSong.image" alt="">
            </div>
          </div>
        </div>
      </div><br/>
      <div class="bottom">
        <div class="progress-wrapper">
          <span class="time time-l">{{format(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar @percentChange="percentChange" :percent="percent"></progress-bar>
          </div>
          <span class="time time-r">{{format(duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i @click="changeMode" :class="modeIcon"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i @click="togglePlay" :class="playIcon"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next" :class="disableCls"></i>
          </div>
        </div>
      </div>
    </div>
    <div @click="open" class="mini-player" v-show="!fullScreen">
      <div class="icon">
        <img :class="cdCls" :src="currentSong.image" width="40" height="40" alt="">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer.name"></p>
      </div>
      <div class="control">
        <progress-circle :radius="radius" :percent="percent">
          <i @click.stop="togglePlay" class="icon-mini" :class="miniIcon"></i>
        </progress-circle>
      </div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
    <audio ref="audio" @ended="end" @timeupdate="updateTime" @canplay="ready" @error="error" :src="currentSong.url"></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { getSong, getLyric } from '@/api/song'
import ProgressBar from '@/components/progress-bar'
import ProgressCircle from '@/components/progress-circle'
import { playMode } from '@/utils/config'
import { shuffle } from '@/utils/utils'

export default {
  data () {
    return {
      songReady: false,
      currentTime: 0,
      duration: 0,
      radius: 32
    }
  },
  computed: {
    ...mapGetters(['fullScreen', 'playList', 'currentSong', 'playing', 'currentIndex', 'playList', 'mode', 'sequenceList']),
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.duration
    },
    modeIcon () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  watch: {
    currentSong () {
      if (!this.playList[this.currentIndex].url) {
        this._getSong()
      } else {
        this._audioPlaying()
      }
      this._getLyric()
    },
    playing (newPlaying) {
      this._audioPlaying()
    }
  },
  methods: {
    ...mapMutations(['SET_FULLSCREEN', 'SET_PLAYING', 'SET_CURRENTINDEX', 'SET_MODE', 'SET_PLAYLIST']),
    ...mapActions(['setSongs']),
    percentChange (percent) {
      this.$refs.audio.currentTime = percent * this.duration
      console.log(1)
      if (!this.playing) {
        this.togglePlay()
      }
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.SET_MODE(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      const index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.SET_CURRENTINDEX(index)
      this.SET_PLAYLIST(list)
    },
    prev () {
      if (!this.songReady) return
      let index = this.currentIndex - 1
      if (index <= -1) {
        index = this.playList.length - 1
      }
      this._setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
      this.songReady = false
    },
    next () {
      if (!this.songReady) return
      let index = this.currentIndex + 1
      if (index >= this.playList.length) {
        index = 0
      }
      this._setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
      this.songReady = false
    },
    togglePlay () {
      if (!this.songReady) return
      this.SET_PLAYING(!this.playing)
    },
    back () {
      this.SET_FULLSCREEN(false)
    },
    open () {
      this.SET_FULLSCREEN(true)
    },
    ready () {
      this.songReady = true
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    error () {
      this.songReady = false
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
      this.duration = e.target.duration
    },
    format (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = interval % 60
      return `${minute}:${second}`
    },
    _setCurrentIndex (index) {
      this.SET_CURRENTINDEX(index)
    },
    _getSong () {
      getSong(this.currentSong.id).then(res => {
        this.audioUrl = res.data[0].url
        this.playList[this.currentIndex].url = this.audioUrl
        this.setSongs({ songs: this.playList })
        this._audioPlaying()
      })
    },
    _audioPlaying () {
      this.$nextTick(() => {
        this.playing ? this.$refs.audio.play() : this.$refs.audio.pause()
      })
    },
    _getLyric () {
      getLyric(this.currentSong.id)
    }
  },
  components: {
    ProgressBar,
    ProgressCircle
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable'
@import '../../assets/styles/mixin'
.player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position absolute
          top 0
          left 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
