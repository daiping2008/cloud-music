<template>
  <div class="singer-detail">
    <music-list @selectItem='selectItem' :songs="songs" :title="title" :bg-image="bgImage"></music-list>
    <div v-show="!songs.length" class="loading-wrapper">
      <loading/>
    </div>
  </div>
</template>

<script>
import MusicList from '@/components/music-list'
import Loading from '@/components/loading'
import Song from '@/utils/song'
import { getArtistSong } from '@/api/singer'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['singer']),
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.picUrl
    }
  },
  mounted () {
    getArtistSong(this.singer.id).then(res => {
      this._normalizeSongs(res.hotSongs)
    })
  },
  methods: {
    ...mapActions(['selectPlay']),
    selectItem ({ song, index }) {
      this.selectPlay({ songs: this.songs, index })
    },
    _normalizeSongs (songs) {
      songs.forEach(e => {
        const song = new Song({
          id: e.id,
          name: e.name,
          singer: e.ar[0],
          album: e.al,
          duration: e.dt,
          image: e.al.picUrl
        })
        this.songs.push(song)
      })
    }
  },
  components: {
    MusicList,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable'
.singer-detail
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 40
  background-color $color-background
  .loading-wrapper
    position absolute
    width 100%
    top 50%
    z-index 100
    transform translateY(-50%)
</style>
