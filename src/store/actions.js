import * as types from './mutation-types'
import { shuffle } from '@/utils/utils'
import { playMode } from '@/utils/config'
const findIndex = (randomList, song) => {
  return randomList.findIndex(item => {
    return item.id === song.id
  })
}
const actions = {
  setSinger ({ commit }, payload) {
    commit(types.SET_SINGER, payload)
  },
  selectPlay ({ commit, state }, payload) {
    if (state.mode === playMode.random) {
      const randomList = shuffle(payload.songs)
      commit(types.SET_PLAYLIST, randomList)
      commit(types.SET_CURRENTINDEX, findIndex(randomList, payload.songs[payload.index]))
    } else {
      commit(types.SET_PLAYLIST, payload.songs)
      commit(types.SET_CURRENTINDEX, payload.index)
    }
    commit(types.SET_PLAYING, true)
    commit(types.SET_FULLSCREEN, true)
    commit(types.SET_SEQUENCELIST, payload.songs)
  },
  setSongs ({ commit }, payload) {
    commit(types.SET_PLAYLIST, payload.songs)
    commit(types.SET_SEQUENCELIST, payload.songs)
  },
  randomPlay ({ commit }, payload) {
    commit(types.SET_PLAYING, true)
    commit(types.SET_FULLSCREEN, true)
    const randomSongs = shuffle(payload.songs)
    commit(types.SET_PLAYLIST, randomSongs)
    commit(types.SET_SEQUENCELIST, payload.songs)
    commit(types.SET_CURRENTINDEX, 0)
    commit(types.SET_MODE, playMode.random)
  }
}

export default actions
