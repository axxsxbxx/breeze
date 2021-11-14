<template>
  <div class="mode1-items">
    <button @click="modeUpdate(0)" :style="[selectedMode == 0 ? {color:'#4F5B9A'} : {color:'#FFFFFF'}]">완벽한중간</button>
    <button @click="modeUpdate(1)" :style="[selectedMode == 1 ? {color:'#4F5B9A'} : {color:'#FFFFFF'}]">핫플레이스</button>
    <button @click="modeUpdate(2)" :style="[selectedMode == 2 ? {color:'#4F5B9A'} : {color:'#FFFFFF'}]">코로나멈춰</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MiddlePlaceMode',
  methods: {
    ...mapActions([
      'setMode1',
      'setMiddleLists',
    ]),
    modeUpdate: function (idx) {
      console.log('111111111111111111111111111111111111111')
      // this.setMiddleLists([])
      this.setMode1(idx)
    }
  },
  computed: {
   ...mapState({
      selectedMode: state => state.mode.mode1,
    })
  }
}
</script>

<style scoped>
  .mode1-items button {
    width: 30%;
    height: 100%;
    background-color: rgba(256, 256, 256, 0);
    border: none;
    font-weight: 600;
    font-size: 15px;
  }
</style>