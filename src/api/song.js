import { request } from '@/utils/http'

// 获取歌曲地址
export const getSong = id => (request({ url: `/song/url?id=${id}` }))

// 获取歌曲歌词
export const getLyric = id => (request({ url: `/lyric?id=${id}` }))
