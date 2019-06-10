<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="disc">
      <div>
        <div v-if="banners.length" class="slider-wrapper">
          <slider>
            <div v-for="v in banners" :key="v.targetId">
              <img :src="v.imageUrl" @load="loadImage" alt="">
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <div class="list-title">热门歌单推荐</div>
          <ul>
            <li v-for="v in disc" :key="v.id" class="item">
              <div class="icon">
                <img v-lazy="v.picUrl" alt="">
              </div>
              <div class="text">
                <h2 class="">{{v.name}}</h2>
                <p class="desc">{{v.copywriter}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="!disc.length" class="loading-wrapper">
        <loading />
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from '@/components/scroll'
import Slider from '@/components/slider'
import Loading from '@/components/loading'
import { getBanner, getPersonal } from '@/api/recommend'
export default {
  data () {
    return {
      banners: [],
      disc: []
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    loadImage () {
      if (!this.checkLoaded) {
        this.checkLoaded = true
        this.$refs.scroll.refresh()
      }
    },
    _getRecommend () {
      getBanner().then(res => (this.banners = res.banners))
    },
    _getDiscList () {
      getPersonal().then(res => (this.disc = res.result))
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable'
.recommend
  position fixed
  width 100%
  top 88px
  bottom 0
  .recommend-content
    height 100%
    overflow hidden
    .slider-wrapper
      position relative
      width 100%
      overflow hidden
    .recommend-list
      .list-title
        height 65px
        line-height 65px
        text-align center
        font-size $font-size-medium
        color $color-theme
      .item
        display flex
        box-sizing border-box
        align-items center
        padding 0 20px 20px 20px
        .icon
          flex 0 0 60px
          width 60px;
          padding-right 20px
          img
            width 100%
        .text
          display flex
          flex-direction column
          justify-content center
          flex 1
          overflow hidden
          line-height 20px
          font-size $font-size-medium
          .name
            margin-bottom 10px
            color $color-text
          .desc
            color $color-text-d
    .loading-wrapper
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
