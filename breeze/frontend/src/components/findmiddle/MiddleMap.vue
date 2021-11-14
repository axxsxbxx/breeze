<template>
  <div>
    <!-- <div id="map" style="width:360px;height:300px;"></div> -->
    <div id="map" style="width:100%;height:100%;"></div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import mapApi from '@/api/map.js'

export default {
  name: 'Map',
  data() {
    return {
      //전체 중간 장소 리스트
      // middleList: [],
      //모드에 따라 분류된 중간 장소 리스트
      modeList: [],
      //중간장소 정해진 후, 참여자들의 정보 리스트
      partInfo: [],
      // modeAvgTime: [],
      modeIdx: 0,
      middleIdx: 0,
      latitude: 0,
      longitude: 0,
      map: null,
      color: ['#f39bab', '#f3cb9b', '#f3e3b3', '#bbd3ab', '#a3d3fb', '#ab9be3'],
    }
  },
  methods: {
    ...mapActions([
      'setMiddleLists',
    ]),

    // filterList(modeIdx) {
    //   this.modeList = []
    //   for (let i = 0; i < this.middleList.length; i++) {
    //     if (this.middleList[i].middle_place_type === modeIdx) {
    //       this.modeList.push(this.middleList[i])         
    //     }
    //   }
    //   return this.modeList
    // },
    concateArray(arr) {
      this.partInfo = []
      const selectedMiddle = arr[this.middleIdx]
      for (let i = 0; i < selectedMiddle.participants.length; i++) {
        for (let j = 0; j < this.participants.length; j++) {
          if (selectedMiddle.participants[i].barami_type === this.participants[j].baramiType) {
            this.partInfo.push({
              "partLatitude": this.participants[j].partLatitude,
              "partLongitude": this.participants[j].partLongitude,
              "baramiType": this.participants[j].baramiType,
              "partName": this.participants[j].partName,
              "time": selectedMiddle.participants[i].time,
              "route": selectedMiddle.participants[i].route,
            })
          }
        }
      }
      // console.log(this.partInfo, '참여자 정보')

    },
    partAverageTime(data) {
      let temp = []
      let newData = data
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
        // this.modeAvgTime.push(avg)
        // console.log(this.modeAvgTime, '장소별 평균 시간')
        newData[i]['avgTime'] = avg
        temp = []
      }
      return newData
    },

    //신기하게도 처음 페이지에 들어왔을 때, (created된 후에) 
    //바로 initMap이란 함수를 찾아서 작동되는 듯
    //함수명을 바꾸면 렌더링이 안되버림... 하... :)
    async initMap() {
      console.log('initMap1')

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
      console.log(data, '내가 axios에 data로 담아 보내는 정보. 맵')
      const response = await mapApi.middle(data)
      console.log(response.middle_data, '중간 장소 관련 data들이 넘어온다. 맵')
      // this.modeList = response.middle_data
      this.modeList = this.partAverageTime(response.middle_data)



      //스토어 저장
      this.setMiddleLists(this.modeList)
      // console.log('**************************')

      // const modes = this.filterList(this.modeIdx)
      // this.concateArray(modes)
      console.log('init함수 안 렌더링 중 확인하기', this.modeList)
      this.concateArray(this.modeList)

      const selectedMiddle = this.modeList[this.middleIdx]
      // console.log(selectedMiddle, '중간장소 확인')
      this.latitude = selectedMiddle.latitude
      this.longitude = selectedMiddle.longitude
      

      var container = document.getElementById('map');
      var options = {
        center: new kakao.maps.LatLng(this.latitude, this.longitude),
        level: 3,
        // draggable: true
      };

      var map = new kakao.maps.Map(container, options);
      
      var bounds = new kakao.maps.LatLngBounds()
      var points = []
      
      var middleMarkerSrc = require('@/assets/map/middle.png')
      var middelMarkerSize = new kakao.maps.Size(30, 30)
      var middleMarkerImage = new kakao.maps.MarkerImage(middleMarkerSrc, middelMarkerSize)
      var middleMarkerPosition  = options.center
      var marker = new kakao.maps.Marker({
        map: map,
        image: middleMarkerImage,
        position: middleMarkerPosition,
      })
      points.push(middleMarkerPosition)
      marker.setMap(map)


      for (var i = 0; i < this.partInfo.length; i++) {
        // console.log(this.partInfo[i], '참여자 정보')

        // var partMarkerSrc = require("@/assets/barami/m" + this.partInfo[i].baramiType + ".png")
        var partMarkerSrc = require(`@/assets/barami/m${this.partInfo[i].baramiType}.png`)
        var partMarkerSize = new kakao.maps.Size(45, 45)
        var partMarkerImage = new kakao.maps.MarkerImage(partMarkerSrc, partMarkerSize)
        var partMarkerPosition = new kakao.maps.LatLng(this.partInfo[i].partLatitude, this.partInfo[i].partLongitude)

        var partMarker = new kakao.maps.Marker({
            // map: map,
            image : partMarkerImage,
            position: partMarkerPosition,
        })
        points.push(partMarkerPosition)
        partMarker.setMap(map)

        var content = `<div class="find-middle-overlay">`;
            content +=  `<div class="desc">`
            content +=    `<div class="name">${this.partInfo[i].partName}</div>`;
            content +=    `<div class="time">${this.partInfo[i].time}분</div>`;
            content +=  `</div>`;
            content += `</div>`;
        
        var customOverlay = new kakao.maps.CustomOverlay({
          map: map,
          position: partMarkerPosition,
          content: content,
          xAnchor: 0.55,
          yAnchor: -0.03,
        })
        customOverlay.setMap(map)

        var linePath = []
        const routesList = this.partInfo[i].route

        for (var j = 0; j < routesList.length; j++) {
          var routesLat = routesList[j][0]
          var routesLng = routesList[j][1]
          linePath.push(new kakao.maps.LatLng(routesLat, routesLng))
        }
        // console.log(linePath, '내가 찍을 좌표들')
        var polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 7, 
          strokeColor: this.color[this.partInfo[i].baramiType], 
          strokeOpacity: 1, 
          strokeStyle: 'solid'
        })
        polyline.setMap(map);
      }

      for (var k = 0; k < points.length; k++) {
        bounds.extend(points[k])
      }
      map.setBounds(bounds)
    },

    async initMap2() {
      console.log('initMap2')
    
      console.log('init함수 안 렌더링 중 확인하기', this.modeList)
      this.concateArray(this.modeList)

      const selectedMiddle = this.modeList[this.middleIdx]
      // console.log(selectedMiddle, '중간장소 확인')
      this.latitude = selectedMiddle.latitude
      this.longitude = selectedMiddle.longitude
      

      var container = document.getElementById('map');
      var options = {
        center: new kakao.maps.LatLng(this.latitude, this.longitude),
        level: 3,
        // draggable: true
      };

      var map = new kakao.maps.Map(container, options);
      
      var bounds = new kakao.maps.LatLngBounds()
      var points = []
      
      var middleMarkerSrc = require('@/assets/map/middle.png')
      var middelMarkerSize = new kakao.maps.Size(30, 30)
      var middleMarkerImage = new kakao.maps.MarkerImage(middleMarkerSrc, middelMarkerSize)
      var middleMarkerPosition  = options.center
      var marker = new kakao.maps.Marker({
        map: map,
        image: middleMarkerImage,
        position: middleMarkerPosition,
      })
      points.push(middleMarkerPosition)
      marker.setMap(map)


      for (var i = 0; i < this.partInfo.length; i++) {
        // console.log(this.partInfo[i], '참여자 정보')

        // var partMarkerSrc = require("@/assets/barami/m" + this.partInfo[i].baramiType + ".png")
        var partMarkerSrc = require(`@/assets/barami/m${this.partInfo[i].baramiType}.png`)
        var partMarkerSize = new kakao.maps.Size(45, 45)
        var partMarkerImage = new kakao.maps.MarkerImage(partMarkerSrc, partMarkerSize)
        var partMarkerPosition = new kakao.maps.LatLng(this.partInfo[i].partLatitude, this.partInfo[i].partLongitude)

        var partMarker = new kakao.maps.Marker({
            // map: map,
            image : partMarkerImage,
            position: partMarkerPosition,
        })
        points.push(partMarkerPosition)
        partMarker.setMap(map)

        var content = `<div class="find-middle-overlay">`;
            content +=  `<div class="desc">`
            content +=    `<div class="name">${this.partInfo[i].partName}</div>`;
            content +=    `<div class="time">${this.partInfo[i].time}분</div>`;
            content +=  `</div>`;
            content += `</div>`;
        
        var customOverlay = new kakao.maps.CustomOverlay({
          map: map,
          position: partMarkerPosition,
          content: content,
          xAnchor: 0.55,
          yAnchor: -0.03,
        })
        customOverlay.setMap(map)

        var linePath = []
        const routesList = this.partInfo[i].route

        for (var j = 0; j < routesList.length; j++) {
          var routesLat = routesList[j][0]
          var routesLng = routesList[j][1]
          linePath.push(new kakao.maps.LatLng(routesLat, routesLng))
        }
        // console.log(linePath, '내가 찍을 좌표들')
        var polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 7, 
          strokeColor: this.color[this.partInfo[i].baramiType], 
          strokeOpacity: 1, 
          strokeStyle: 'solid'
        })
        polyline.setMap(map);
      }

      for (var k = 0; k < points.length; k++) {
        bounds.extend(points[k])
      }
      map.setBounds(bounds)
    },
    async initMap3() {
      console.log('initMap3')
      // console.log('%%%%%%%%%%%%%%%%%%%%%%%')
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
      console.log(data, '내가 axios에 data로 담아 보내는 정보. 맵')
      const response = await mapApi.middle(data)
      console.log(response.middle_data, '중간 장소 관련 data들이 넘어온다. 맵')
      // this.modeList = response.middle_data
      this.modeList = this.partAverageTime(response.middle_data)



      //스토어 저장
      this.setMiddleLists(this.modeList)
      // console.log('**************************')

      // const modes = this.filterList(this.modeIdx)
      // this.concateArray(modes)
      console.log('init함수 안 렌더링 중 확인하기', this.modeList)
      this.concateArray(this.modeList)

      const selectedMiddle = this.modeList[this.middleIdx]
      // console.log(selectedMiddle, '중간장소 확인')
      this.latitude = selectedMiddle.latitude
      this.longitude = selectedMiddle.longitude
      

      var container = document.getElementById('map');
      var options = {
        center: new kakao.maps.LatLng(this.latitude, this.longitude),
        level: 3,
        // draggable: true
      };

      var map = new kakao.maps.Map(container, options);
      
      var bounds = new kakao.maps.LatLngBounds()
      var points = []
      
      var middleMarkerSrc = require('@/assets/map/middle.png')
      var middelMarkerSize = new kakao.maps.Size(30, 30)
      var middleMarkerImage = new kakao.maps.MarkerImage(middleMarkerSrc, middelMarkerSize)
      var middleMarkerPosition  = options.center
      var marker = new kakao.maps.Marker({
        map: map,
        image: middleMarkerImage,
        position: middleMarkerPosition,
      })
      points.push(middleMarkerPosition)
      marker.setMap(map)


      for (var i = 0; i < this.partInfo.length; i++) {
        // console.log(this.partInfo[i], '참여자 정보')

        // var partMarkerSrc = require("@/assets/barami/m" + this.partInfo[i].baramiType + ".png")
        var partMarkerSrc = require(`@/assets/barami/m${this.partInfo[i].baramiType}.png`)
        var partMarkerSize = new kakao.maps.Size(45, 45)
        var partMarkerImage = new kakao.maps.MarkerImage(partMarkerSrc, partMarkerSize)
        var partMarkerPosition = new kakao.maps.LatLng(this.partInfo[i].partLatitude, this.partInfo[i].partLongitude)

        var partMarker = new kakao.maps.Marker({
            // map: map,
            image : partMarkerImage,
            position: partMarkerPosition,
        })
        points.push(partMarkerPosition)
        partMarker.setMap(map)

        var content = `<div class="find-middle-overlay">`;
            content +=  `<div class="desc">`
            content +=    `<div class="name">${this.partInfo[i].partName}</div>`;
            content +=    `<div class="time">${this.partInfo[i].time}분</div>`;
            content +=  `</div>`;
            content += `</div>`;
        
        var customOverlay = new kakao.maps.CustomOverlay({
          map: map,
          position: partMarkerPosition,
          content: content,
          xAnchor: 0.55,
          yAnchor: -0.03,
        })
        customOverlay.setMap(map)

        var linePath = []
        const routesList = this.partInfo[i].route

        for (var j = 0; j < routesList.length; j++) {
          var routesLat = routesList[j][0]
          var routesLng = routesList[j][1]
          linePath.push(new kakao.maps.LatLng(routesLat, routesLng))
        }
        // console.log(linePath, '내가 찍을 좌표들')
        var polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 7, 
          strokeColor: this.color[this.partInfo[i].baramiType], 
          strokeOpacity: 1, 
          strokeStyle: 'solid'
        })
        polyline.setMap(map);
      }

      for (var k = 0; k < points.length; k++) {
        bounds.extend(points[k])
      }
      map.setBounds(bounds)
    },



    async sendAxios () {
      // this.setMiddleLists([])
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
      console.log(data, '내가 axios에 data로 담아 보내는 정보. 맵')
      console.log('5555555555555555555555555555555')
      const response = await mapApi.middle(data)
      // console.log(response.middle_data, '중간 장소 관련 data들이 넘어온다. 맵')
      // this.modeList = response.middle_data
      console.log('66666666666666666666666666666666666666666666')
      this.modeList = this.partAverageTime(response.middle_data)
      //스토어 저장
      this.setMiddleLists(this.modeList)
    },


    async waitAndRun() {
      await this.sendAxios()
      //65에서 85까지 주석처리한 후 테스트해봐야
      console.log('777777777777777777777777777777')
      console.log(this.middleLists, '잘 들어가냐고*****************')
      this.initMap()
      console.log('8888888888888888888888888888888888')
    }


  },
  created() {
    this.modeIdx = this.mode
    this.middleIdx = this.middle
    this.modeList = this.middleLists
    console.log(this.mode, this.middle, this.middleLists)
    console.log('created')
  },
  mounted() {
  if (window.kakao && window.kakao.maps) {
    console.log('새로고침 된 경우로 추정')
    this.initMap();
  } else {
    const script = document.createElement('script');
    /* global kakao */
    script.onload = () => kakao.maps.load(this.initMap);
    const apiKey = process.env.VUE_APP_KAKAO_MAP_API_KEY
		script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${apiKey}`
    document.head.appendChild(script);
  }
},
computed: {
    ...mapState({
    mode: state => state.mode.mode1,
    middle: state => state.mode.middle,
  }),
  ...mapGetters([
    'participants',
    'middleLists',
  ])
},
watch: {
    mode : function (newVal, ) {
      // this.setMiddleLists([])
      console.log('222222222222222222222222')
      // console.log(newVal, this.middle, '모드랑 중간값 확인')
      this.modeIdx = newVal
      // this.waitAndRun()
      this.initMap()
    },
    middle : function (newVal, ) {
      // console.log(this.mode, newVal, '모드랑 중간값 확인')
      this.middleIdx = newVal
      console.log('444444444444444444444444444444444')
      this.initMap2()
      console.log('9999999999999999999999999999999')
    }
  }

}
</script>

<style>
.find-middle-overlay {
  background-color: #B8D2FA;
  width: 120%;
  border-radius: 10px;
}
.find-middle-overlay .desc div {
  font-weight: 900;
  color: #767373;
}
.find-middle-overlay .desc .name {
  padding-top: 4px;
  font-size: 12px;
}
.find-middle-overlay .desc .time {
  font-size: 10px;
}


</style>