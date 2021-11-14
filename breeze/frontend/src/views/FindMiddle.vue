<template>
  <div>
    <MiddleMap class="find-middle"/>
    <MiddleList class="middle-lists"/>
    <FindPlaceBtn class="find-place-btn"/>
  </div>
</template>

<script>
import MiddleMap from '@/components/findmiddle/MiddleMap.vue'
import MiddleList from '@/components/findmiddle/MiddleList.vue'
import FindPlaceBtn from '@/components/findmiddle/FindPlaceBtn.vue'
import store from "@/store"

export default {
  name: 'FindMiddle',
  components: {
    MiddleMap,
    MiddleList,
    FindPlaceBtn,
  },
  data() {
    return {
      // middlePlaces : [
      //   {
      //     middle_place_type: 0,
      //     name: '강남역',
      //     latitude: '37.497926',
      //     longitude: '127.027553',
      //     participants: [
      //       {
      //         barami_type: 0,
      //         time: 10,
      //         route: [
      //           [37.508814600184664, 127.06301120399313], 
      //           [37.507522678409956, 127.063717307467], 
      //           [37.50719025792823, 127.06270349715716], 
      //           [37.50841054524737, 127.06205483025848], 
      //           [37.50866035919646, 127.06287740102542], 
      //           [37.49806771206318, 127.02766823190767], 
      //           [37.49791371130111, 127.02756844538644]
      //           ]
      //       },
      //       {
      //         barami_type: 4,
      //         time: 30,
      //         route: [
      //           [37.55514699555886, 126.9225650989563], 
      //           [37.55511126853652, 126.9225995667675], 
      //           [37.55472823387278, 126.92209578288471], 
      //           [37.555272214772096, 126.92147678452466], 
      //           [37.5487658740574, 126.91156645732462], 
      //           [37.5485372334122, 126.91022308307215], 
      //           [37.54860117384146, 126.90836619580922], 
      //           [37.54692484792207, 126.90734952012768], 
      //           [37.546337464565205, 126.90813893000723], 
      //           [37.54400298933907, 126.92573559567396], 
      //           [37.540367608062624, 126.93822358468135], 
      //           [37.53723772862473, 126.94087044353893], 
      //           [37.53372573676146, 126.94512914097487], 
      //           [37.53189470228072, 126.94895654145692], 
      //           [37.52640885887791, 126.95318556787154], 
      //           [37.516913158812436, 126.9738722620937], 
      //           [37.51605015222777, 126.97930250401853], 
      //           [37.51706284046979, 126.9901935864654], 
      //           [37.50759257487751, 126.99969773615172], 
      //           [37.503058340412764, 127.00266490765729], 
      //           [37.4917744039156, 127.0076888509853], 
      //           [37.49788668253048, 127.02756879588483]
      //           ]
      //       },
      //       // {
      //       //   barami_type: 2,
      //       //   time: 20
      //       // },
      //       // {
      //       //   barami_type: 3,
      //       //   time: 70
      //       // },
      //     ]
      //   },
      //   {
      //     middle_place_type: 0,
      //     name: '신촌역',
      //     latitude: 37.559830, 
      //     longitude: 126.942633,
      //     participants: [
      //       {
      //         barami_type: 0,
      //         time: 40,
      //         route: []
      //       },
      //       {
      //         barami_type: 1,
      //         time: 30,
      //         route: []
      //       },
      //       // {
      //       //   barami_type: 2,
      //       //   time: 20
      //       // },
      //       // {
      //       //   barami_type: 3,
      //       //   time: 40
      //       // },
      //     ]
      //   },
      //   {
      //     middle_place_type: 0,
      //     name: '신림역',
      //     latitude: 37.484232,
      //     longitude: 126.929814,
      //     participants: [
      //       {
      //         barami_type: 0,
      //         time: 60,
      //         route: []
      //       },
      //       {
      //         barami_type: 1,
      //         time: 30,
      //         route: []
      //       },
      //       // {
      //       //   barami_type: 2,
      //       //   time: 20
      //       // },
      //       // {
      //       //   barami_type: 3,
      //       //   time: 50
      //       // },
      //     ]
      //   },
      //   {
      //     middle_place_type: 1,
      //     name: '광화문역',
      //     latitude: 37.571603, 
      //     longitude: 126.976592,
      //     participants: [
      //       {
      //         barami_type: 0,
      //         time: 90,
      //         route: []
      //       },
      //       {
      //         barami_type: 1,
      //         time: 30,
      //         route: []
      //       },
      //       // {
      //       //   barami_type: 2,
      //       //   time: 20
      //       // },
      //       // {
      //       //   barami_type: 3,
      //       //   time: 20
      //       // },
      //     ]
      //   },
      //   {
      //     middle_place_type: 1,
      //     name: '신촌역',
      //     latitude: 37.559830, 
      //     longitude: 126.942633,
      //     participants: [
      //       {
      //         barami_type: 0,
      //         time: 10,
      //         route: []
      //       },
      //       {
      //         barami_type: 1,
      //         time: 30,
      //         route: []
      //       },
      //       // {
      //       //   barami_type: 2,
      //       //   time: 20
      //       // },
      //       // {
      //       //   barami_type: 3,
      //       //   time: 25
      //       // },
      //     ]
      //   },
      //   {
      //     middle_place_type: 1,
      //     name: '강남역',
      //     latitude: 37.497926,
      //     longitude: 127.027553,
      //     participants: [
      //       {
      //         barami_type: 0,
      //         time: 50,
      //         route: []
      //       },
      //       {
      //         barami_type: 1,
      //         time: 30,
      //         route: []
      //       },
      //       // {
      //       //   barami_type: 2,
      //       //   time: 20
      //       // },
      //       // {
      //       //   barami_type: 3,
      //       //   time: 21
      //       // },
      //     ]
      //   },
      //   {
      //     middle_place_type: 2,
      //     name: '석촌역',
      //     latitude: 37.505288, 
      //     longitude: 127.107069,
      //     participants: [
      //       {
      //         barami_type: 0,
      //         time: 10,
      //         route: []
      //       },
      //       {
      //         barami_type: 1,
      //         time: 30,
      //         route: []
      //       },
      //       // {
      //       //   barami_type: 2,
      //       //   time: 20
      //       // },
      //       // {
      //       //   barami_type: 3,
      //       //   time: 22
      //       // },
      //     ]
      //   },
      //   {
      //     middle_place_type: 2,
      //     name: '강남역',
      //     latitude: 37.497926,
      //     longitude: 127.027553,
      //     participants: [
      //       {
      //         barami_type: 0,
      //         time: 70,
      //         route: []
      //       },
      //       {
      //         barami_type: 1,
      //         time: 30,
      //         route: []
      //       },
      //       // {
      //       //   barami_type: 2,
      //       //   time: 20
      //       // },
      //       // {
      //       //   barami_type: 3,
      //       //   time: 29
      //       // },
      //     ]
      //   },
      //   {
      //     middle_place_type: 2,
      //     name: '신촌역',
      //     latitude: 37.559830, 
      //     longitude: 126.942633,
      //     participants: [
      //       {
      //         barami_type: 0,
      //         time: 0,
      //         route: []
      //       },
      //       {
      //         barami_type: 1,
      //         time: 30,
      //         route: []
      //       },
      //       // {
      //       //   barami_type: 2,
      //       //   time: 20
      //       // },
      //       // {
      //       //   barami_type: 3,
      //       //   time: 19
      //       // },
      //     ]
      //   }
      // ]
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'EnterInfo' || from.name == 'OneClick') {
      console.log('oneclick 또는 enterinfo에서 온다')
      store.dispatch('setMode1', 0)
      store.dispatch('setMiddle', 0)
      store.dispatch('setMiddleLists', [])
      next()
    }  else {
      console.log('비정상적 진입 또는 새로고침한 경우')
      next()
    }
   },
}
</script>

<style scoped>
.find-middle {
  /* height: 65%; */
  height: 57%;
}
.middle-lists {
  /* height: 21%; */
  height: 29%;
}
.find-place-btn {
  height: 14%;
}
</style>