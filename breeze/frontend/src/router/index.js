import Vue from 'vue'
import VueRouter from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Home from '../views/Home.vue'
import EnterInfo from '../views/EnterInfo.vue'
import FindMiddle from '../views/FindMiddle.vue'
import FindPlace from '../views/FindPlace.vue'
import MakeAppointment from '../views/MakeAppointment.vue'
import OneClick from '../views/OneClick.vue'
import LoginRedirect from '../views/LoginRedirect.vue'
import NotFound from '@/views/NotFound.vue'
import authApi from '@/api/auth.js'
import store from "@/store"
import Swal from 'sweetalert2'


Vue.use(VueRouter)

const checkLoginToken =  () => async (to, from, next) => {
  const isLoggedIn = store.getters.getUserId
  //로그인 상태 처리
  if (isLoggedIn) {
    //토큰 만료 여부 체크 (약속 만드는 과정 제외)
    if (to.name == 'EnterInfo' || to.name == 'OneClick' || (to.name =='Home' && from.name !== 'LoginRedirect')) {
      const isExpired = await authApi.check(isLoggedIn)
      if(isExpired) {
        const response = await authApi.logout(isLoggedIn)
        if (response == 'success') {
          await store.dispatch('removeUser')
          sessionStorage.clear()
          next('/')
        }
      } else {
        return next()
      }
    } else {
      return next()
    }
  // 비로그인 상태 처리
  } else {
    Swal.fire({
      html: '<b>로그인이 필요한 서비스입니다!</b>',
      imageUrl: 'https://ifh.cc/g/bYAc4j.png',
      imageWidth: 170,
      imageHeight: 170,
      imageAlt: 'Logo image',
      showConfirmButton: false,
      showCloseButton: true,
    })
    next('/')
  }
}

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter: checkLoginToken()
  },
  {
    path: '/enterinfo',
    name: 'EnterInfo',
    component: EnterInfo,
    beforeEnter: checkLoginToken()
  },
  {
    path: '/findmiddle',
    name: 'FindMiddle',
    component: FindMiddle,
    beforeEnter: checkLoginToken()
  },
  {
    path: '/findplace',
    name: 'FindPlace',
    component: FindPlace,
    beforeEnter: checkLoginToken()
  },
  {
    path: '/makeappointment/:secretCode',
    name: 'MakeAppointment',
    component: MakeAppointment,
  },
  {
    path: '/oneclick',
    name: 'OneClick',
    component: OneClick,
    beforeEnter: checkLoginToken()
  },
  {
    path: '/oauth/kakao/callback',
    name: 'LoginRedirect',
    component: LoginRedirect
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    beforeEnter: checkLoginToken()
  },
  { path: '*',
    name: 'NotFound',
    component: NotFound,
    beforeEnter: checkLoginToken()
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
