import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/views/recommend'
import Rank from '@/views/rank'
import Search from '@/views/search'
import Singer from '@/views/singer'
import SingerDetail from '@/views/singer-detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [
        {
          path: ':id',
          name: 'singerDetail',
          component: SingerDetail
        }
      ]
    }
  ]
})
