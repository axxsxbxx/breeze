<template>
  <div class="middle-list-container">
    <div class="middle-list-items">
      <div 
        v-for="(place, idx) in middleLists" 
        :key="idx"
      >
        <label class="middle-select-label">
          <input 
            type="radio" 
            class="circle-input" 
            name="circle" 
            :value="idx" 
            v-model="selectedMiddle">
          <div class="circle-design"></div>
          <div class="desc-text">
            <div class="select-text name">{{ place.name }}</div>
            <!-- <div class="select-text time">평균 이동 시간 {{ modeAvgTime[idx]}} 분</div> -->
            <div class="select-text time">평균 이동 시간 {{ place.avgTime}} 분</div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import mapApi from '@/api/map.js'

export default {
  name: 'MiddleList',
  data() {
    return {
      selectedMiddle: 0,
      //전체 중간 장소 리스트
      // middleList: [],
      //헤더 모드에 따라 분류된 장소 리스트
      modeList: [],
      //헤더 모드에 따라 소요되는 장소별 평균 시간
      modeAvgTime: [],
    }
  },
  methods: {
    ...mapActions([
      'setMiddle'
    ]),
    // filterList(idx) {
    //   this.modeList = []
    //   for (let i = 0; i < this.middleList.length; i++) {
    //     if (this.middleList[i].middle_place_type === idx) {
    //       this.modeList.push(this.middleList[i])
    //     }
    //   } 
    // },
    middleUpdate(idx) {
      this.setMiddle(idx)
      this.selectedMiddle = idx
    },
    partAverageTime(data) {
      let temp = []
      this.modeAvgTime = []
      const placeCnt = data.length
      for (let i = 0; i < placeCnt; i++) {
        const partCnt = data[i].participants.length
        for (let j = 0; j < partCnt; j++) {
          temp.push(data[i].participants[j].time)
        }
        // console.log(temp, '장소별 각 참가자의 소요 시간')
        const result = temp.reduce(function add(sum, currVal) {
          return sum + currVal
        }, 0)
        const avg = Math.round(result / temp.length)
        this.modeAvgTime.push(avg)
        // console.log(this.modeAvgTime, '장소별 평균 시간')
        temp = []
      }
    },
    // async setInfo() {
    //   // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
    //   const cnt = this.participants.length
    //   const data = []
    //   for (let i = 0; i < cnt; i++) {
    //     const part = {
    //       baramiType: this.participants[i].baramiType,
    //       partLatitude: this.participants[i].partLatitude,
    //       partLongitude: this.participants[i].partLongitude
    //     }
    //   data.push(part)
    //   }
    //   // console.log(data, '내가 axios에 data로 담아 보내는 정보. 리스트')
    //   const response = await mapApi.middle(data)
    //   // console.log(response.middle_data, '중간 장소 관련 data들이 넘어온다. 리스트')
    //   this.middleList = response.middle_data
    //   // console.log(this.middleList, '마지막 확인')
    //   // console.log('**************************')
      
    //   this.filterList(this.mode)
    //   this.partAverageTime(this.modeList)
    //   this.selectedMiddle = this.middle
    // }
    async sendAxios () {
      const cnt = this.participants.length
      const partBox = []
      for (let i = 0; i < cnt; i++) {
        const part = {
          baramiType: this.participants[i].baramiType,
          partLatitude: this.participants[i].partLatitude,
          partLongitude: this.participants[i].partLongitude
        }
      partBox.push(part)
      }
      const data = {
        'participants' : partBox,
        'middle_place_type' : this.mode
      }
      console.log(data, '내가 axios에 data로 담아 보내는 정보. 리스트')
      const response = await mapApi.middle(data)
      // console.log(response.middle_data, '중간 장소 관련 data들이 넘어온다. 맵')
      this.modeList = response.middle_data
      this.partAverageTime(this.modeList)
      //스토어 저장
      // this.setMiddleLists(this.modeList)
    },
    async wait() {
      await this.sendAxios()
      console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
      console.log(this.modeList, '다 잘 들어오니')
      this.middleUpdate(0)
    }
  },
  created() {
    this.modeList = this.middleLists
    //아래 안되면 this.middleLists로 바꿔보기
    // this.partAverageTime(this.middleLists)
    this.selectedMiddle = this.middle
    // this.sendAxios()
  //  this.setInfo()
  },
  computed: {
    ...mapState({
      mode: state => state.mode.mode1,
      middle: state => state.mode.middle
    }), 
    ...mapGetters([
      'participants',
      'middleLists',
    ]) 
  },
  watch: {
    selectedMiddle : function (newVal, ) {
      this.middleUpdate(newVal)
    },
    mode : function () {
      // console.log('바뀐 값--->' + newVal, '이전 값--->' + oldVal)
      // this.filterList(newVal)
      // this.partAverageTime(this.modeList)
      // this.partAverageTime(this.middleLists)
      // this.wait()
      // console.log('33333333333333333333333333333333333')
      // this.middleUpdate(0)
    },
    // middleLists: function () {
    //   console.log('중간장소리스트들이 바뀌면... 여길 와라?? 리스트를 판단할 수 있을까?')
      // this.middleUpdate(0)
    // }
  }
}
</script>

<style scoped>
.middle-list-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.middle-list-container .middle-list-items {
  width: 70%;
  height: 90%;
  padding-top: 5%;
}

.middle-select-label {
  display: flex;
  align-items: center;
  border-radius: 25px;
  padding: 10px;
  transition: .3s;
}

.middle-select-label:hover,
.middle-select-label:focus-within {
  background: hsla(0, 0%, 80%, .14);
}

.circle-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  z-index: -1;
}

.circle-design {
  width: 18px;
  height: 18px;
  border-radius: 100px;
  background: linear-gradient(to right bottom, #92a3fd, #9dceff);
  position: relative;
}

.circle-design::before {
  content: '';
  display: inline-block;
  width: inherit;
  height: inherit;
  border-radius: inherit;
  background: hsl(0, 0%, 90%);
  transition: .3s;
}

.circle-input:checked+.circle-design::before {
  transform: scale(0);
}

.desc-text {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.desc-text .select-text {
  color: hsl(0, 0%, 60%);
  margin-left: 14px;
  letter-spacing: 2px;
  font-weight: 900;
  transition: .3s;
}

.desc-text .name {
  font-size: 12px;
}

.desc-text .time {
  font-size: 10px;
}

.circle-input:checked~.select-text {
  color: hsl(0, 0%, 40%);
}

</style>