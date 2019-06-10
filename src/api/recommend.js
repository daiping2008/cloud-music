import { request } from '../utils/http'

// 轮播
export const getBanner = () => {
  return request({
    url: '/banner'
  })
}

// 热门歌单推荐
export const getPersonal = () => {
  return request({
    url: '/personalized'
  })
}
