import * as types from './mutation-types'
const mutations = {
  [types.SET_SINGER] (state, payload) {
    state.singer = payload
  },
  [types.SET_PLAYING] (state, payload) {
    state.playing = payload
  },
  [types.SET_FULLSCREEN] (state, payload) {
    state.fullScreen = payload
  },
  [types.SET_PLAYLIST] (state, payload) {
    state.playList = payload
  },
  [types.SET_SEQUENCELIST] (state, payload) {
    state.sequenceList = payload
  },
  [types.SET_MODE] (state, payload) {
    state.mode = payload
  },
  [types.SET_CURRENTINDEX] (state, payload) {
    state.currentIndex = payload
  }
}

export default mutations
