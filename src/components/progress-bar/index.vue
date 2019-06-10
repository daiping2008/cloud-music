<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div @touchstart.prevent="touchStart" @touchmove.prevent="touchMove" @touchend="touchEnd" class="progress-btn-wrapper" ref="btn">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  watch: {
    percent (newPercent) {
      if (!this.touch.init && newPercent > 0) {
        const width = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * width
        this._offset(offsetWidth)
      }
    }
  },
  methods: {
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offset = e.pageX - rect.left
      this._offset(offset)
      this._triggerPercent()
    },
    touchStart (e) {
      this.touch.init = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    touchMove (e) {
      if (!this.touch.init) return
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offset = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offset)
    },
    touchEnd () {
      this.touch.init = false
      this._triggerPercent()
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.btn.style.transform = `translate3d(${offsetWidth}px,0,0)`
    },
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable'
.progress-bar
  height 30px
  .bar-inner
    position relative
    top 13px
    height 4px
    background-color rgba(0,0,0,0.3)
    .progress
      position absolute
      height 100%
      background-color $color-theme
    .progress-btn-wrapper
      position absolute
      width 30px
      height 30px
      left -8px
      top -13px
      .progress-btn
        position relative
        top 7px
        left 7px
        box-sizing border-box
        width 16px
        height 16px
        border 3px solid $color-text
        border-radius 50%
        background-color $color-theme
</style>
