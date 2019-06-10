
import { playMode } from '../utils/config'
const state = {
  singer: {},
  playing: false, // 播放
  fullScreen: false, // 全屏
  playList: [], // 歌单列表
  sequenceList: [], // 播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1 // 当前歌曲
}

export default state
