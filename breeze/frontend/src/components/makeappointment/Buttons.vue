<template>
  <div class="container">
    <div v-if="isLoggedIn">
      <div v-if="first" class="background">
        <button
          class="remember-btn"
          data-bs-toggle="modal" 
          data-bs-target="#rememberModal"
          id="remember-first-btn"
        >이멤버리멤버
        </button>
        <button class="share-btn-1" @click="sendLink">공유하기</button>
      </div>
      <div v-else>
        <button class="share-btn-2" @click="sendLink">공유하기</button>
      </div>
    </div>
    <div v-else>
      <button 
        class="share-btn-2" 
        @click="goToWelcome()">
        Welcome
      </button>
    </div>
  </div>
</template>

<script >
import { mapGetters } from 'vuex'
const KAKAO_KEY = process.env.VUE_APP_KAKAO_MAP_API_KEY

export default {
  name: 'Buttons',
  props: {
    isFirst: Boolean,
    noteInfo: Object,
  },
  data() {
    return {
      first: this.isFirst,
    }
  },
  methods: {
    disableBtn() {
      if (document.getElementById('remember-first-btn')) {
        var rememberBtn = document.getElementById('remember-first-btn')
        if (this.isGroupSaved == true) {
          rememberBtn.disabled = true
          rememberBtn.style.color = '#B3B3B3'
          rememberBtn.style.textDecoration = 'underline'
        } else {
          rememberBtn.disabled = false
          rememberBtn.style.textDecoration = null
          }
      }
    },
    goToWelcome() {
      this.$router.push({ name: 'Welcome' })
    },
    sendLink() {
      console.log(this.noteInfo)
      /* global Kakao */
      if (!Kakao.isInitialized()){
        Kakao.init(KAKAO_KEY)
      }
      Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '약속 쪽지가 바람에 날아왔어요~!!',
          description: this.noteInfo.datetime + '에 ' + this.noteInfo.middle_place + '에서 만나요 :)',
          imageUrl: 'https://ifh.cc/g/bYAc4j.png',
          // imageUrl: 'https://ifh.cc/g/xVTZzF.jpg',
          link: {
            mobileWebUrl: 'https://k5a202.p.ssafy.io/makeappointment/' + this.$route.params.secretCode,
            webUrl: 'https://k5a202.p.ssafy.io/makeappointment/' + this.$route.params.secretCode,
          }
        },
        buttons: [
          {
            title: '자세히 보기',
            link: {
              mobileWebUrl: 'https://k5a202.p.ssafy.io/makeappointment/' + this.$route.params.secretCode,
              webUrl: 'https://k5a202.p.ssafy.io/makeappointment/' + this.$route.params.secretCode,
            }
          }
        ]
      })
    }
  },
  mounted() {
    this.disableBtn()
  },
  computed: {
   ...mapGetters([
      'isGroupSaved',
      'isLoggedIn'
   ])
  },
  watch: {
    first(val) {
      this.first = val
    },
    isGroupSaved() {
      this.disableBtn()
    }
  }

}
</script>

<style scoped>
.container{
  position: relative;
}
.background {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 65%;
  height: 65%;
  /* padding: 3%; */
  background: rgb(234 228 228);
  box-shadow: 1px 1px 5px 0px rgb(179, 178, 178);
  border: none;
  border-radius: 20px;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.remember-btn { 
  width: 54%;
  height: 100%;
  background: none;
  border: none;
  border-radius: 20px;
  color: rgb(136, 134, 134);
  font-weight: 600;
  padding-top: 2%;
}
.share-btn-1 {
  width: 46%;
  height: 100%;
  border: none;
  border-radius: 20px;
  background: linear-gradient(to left, #92a3fd, #9dceff);
  box-shadow: 1px 1px 5px 0px gray;
  color: white;
  font-weight: 600;
  padding-top: 2%;

}
.share-btn-2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 65%;
  height: 65%;
  padding: 3%;
  background: linear-gradient(to left, #92a3fd, #9dceff);
  box-shadow: 1px 1px 5px 0px gray;
  border: none;
  border-radius: 20px;
  color: white;
  font-weight: 600;
}
</style>