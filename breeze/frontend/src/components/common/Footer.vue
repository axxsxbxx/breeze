<template>
  <div class="footer-items">
    <router-link to="/home">
      <img
        src="@/assets/footer/home.png"
        alt="home-button"
        @click="menuUpdate(0)"
        :style="[selectedMenu == 0 ? {opacity:1} : {opacity:0.5}]"
      />
    </router-link>
    <router-link to="/enterinfo">
      <img
        src="@/assets/footer/new.png"
        alt="new-button"
        @click="menuUpdate(1)"
        :style="[selectedMenu == 1 ? {opacity:1} : {opacity:0.5}]"
      />
    </router-link>
    <router-link to="/oneclick">
      <img
        src="@/assets/footer/oneclick.png"
        alt="oneclick-button"
        @click="menuUpdate(2)"
        :style="[selectedMenu == 2 ? {opacity:1} : {opacity:0.5}]"
      />
    </router-link>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: "Footer",
  methods: {
    ...mapActions([
      'setDate',
      'setParticipants',
      'setPartMidTime',
      'setMiddleName',
      'setMiddleLat',
      'setMiddleLong',
      'setGroupName',
      'setGroupId',
      'setMode1',
      'setMode2',
      'setFilter',
      'setMiddle',
      'setMenu',
      'setWishPlace',
      'setMiddleLists',
    ]),
    menuUpdate: function (idx) {
      //메뉴 업데이트
      this.setMenu(idx)
      //홈이나 원클릭으로 이동 시, 약속/모드 스토어 초기화
      if (idx !== 1) {
        this.setDate('')
        this.setParticipants([])
        this.setPartMidTime([])
        this.setMiddleName('')
        this.setMiddleLat(0)
        this.setMiddleLong(0)
        this.setGroupName('')
        this.setGroupId(null)
        this.setMode1(0)
        this.setMode2(0)
        this.setFilter(0)
        this.setMiddle(0)
        this.setWishPlace([])
        this.setMiddleLists([])
      }     
    },
  },
  computed: {
    ...mapState({
      selectedMenu: state => state.mode.menu,
    }),
  }
};
</script>

<style scoped>
  .footer-items {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .footer-items img {
    height: 100%;
    width: 20%;
    flex:1;
  }
  .deactivate {
    filter: opacity(0.5) drop-shadow(0 0 0 white);
  }
</style>