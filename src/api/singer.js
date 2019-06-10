import { request } from '../utils/http'

// 获取歌手信息
export const getArtist = () => {
  return request({
    url: '/toplist/artist'
  })
}
// 获取歌手详情
export const getArtistDesc = id => {
  return request({
    url: `/artist/desc?id=${id}`
  })
}
// 获取歌手歌单
export const getArtistSong = id => {
  return request({
    url: `/artists?id=${id}`
  })
}
