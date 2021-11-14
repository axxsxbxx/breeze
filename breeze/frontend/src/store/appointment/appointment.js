import _ from 'lodash'

export default {
  state: {
    date: '',
    timezone: 'Asia/Seoul',
    participants: [],
    barami: [],
    wishPlaces: [],
    //약속쪽지에서 필요한 참여자 정보 리스트(타입, 이름, 시간)
    partMiddleTime: [],
    //중간장소 후보지들
    middleLists: [],
    middleName: '',
    middleLatitude: 0,
    middleLongitude: 0,
    groupName: '',
    groupId: null,
    isFirst: false,
    isGroupSaved: false,
    isAppointmentDeleted: false,
  },
  getters: {
    date: state => state.date,
    participants: state => state.participants,
    partMiddleTime: state => state.partMiddleTime,
    //isFirst, getIsFirst 둘 다 필요
    isFirst: state => state.isFirst,
    getIsFirst(state) {
      return state.isFirst
    },
    getGroupId(state) {
      return state.groupId
    },
    isGroupSaved: state => state.isGroupSaved,
    getIsGroupSaved(state) {
      return state.isGroupSaved
    },
    isAppointmentDeleted: state => state.isAppointmentDeleted,
    groupId: state => state.groupId,
    wishPlaces: state => state.wishPlaces,
    middleLists: state => state.middleLists,
    middleName: state => state.middleName,
    middleLatitude: state => state.middleLatitude,
    middleLongitude: state => state.middleLongitude,
  },
  mutations: {
    SETDATE (state, data) {
      state.date = data
    },
    //enterinfo에서 참여자 추가할 때마다 사용
    ADDPARTICIPANT (state, data) {
      if (state.barami.length != 0) {
        data['baramiType'] = state.barami.shift()
      }
      state.participants.push(data)
    },
    DELETEPARTICIPANT (state, data) {
      state.barami.push(data[1])
      state.participants.splice(data[0], 1)
    },
    //전체 참여자 초기화 or 그룹 참여자 세팅 시 사용
    SETPARTICIPANTS (state, data) {
      state.participants = data
    },
    SET_WISH_PLACE (state, data) {
      state.wishPlaces = data
    },
    ADD_WISH_PLACE (state, data) {
      state.wishPlaces.push(data)
      state.wishPlaces = _.uniqBy(state.wishPlaces, 'placeName')
    },
    DELETE_WISH_PLACE (state, data) {
      state.wishPlaces.splice(data, 1)
    },  
    SETPARTMIDTIME (state, data) {
      state.partMiddleTime = data
    },
    SETMIDDLELISTS (state, data) {
      state.middleLists = data
    },
    SETMIDDLENAME (state, data) {
      state.middleName = data
    },
    SETMIDDLELAT (state, data) {
      state.middleLatitude = data
    },
    SETMIDDLELONG (state, data) {
      state.middleLongitude = data
    },
    SETGROUPNAME (state, data) {
      state.groupName = data
    },
    SETGROUPID (state, data) {
      state.groupId = data
    },
    SETISFIRST (state, data) {
      state.isFirst = data
    },
    SETISGROUPSAVED (state, data) {
      state.isGroupSaved = data
    },
    SET_IS_APPOINTMENT_DELETED (state, data) {
      state.isAppointmentDeleted = data
    },
  },
  actions: {
    setDate ({ commit }, data) {
      commit('SETDATE', data)
    },
    addParticipant ({ commit }, data) {
      commit('ADDPARTICIPANT', data)
    },
    deleteParticipant ({ commit }, data) {
      commit('DELETEPARTICIPANT', data)
    },
    addGroupParticipants ({ commit }, data) {
      commit('ADDGROUPPARTICIPANTS', data)
    },
    setWishPlace ( {commit}, data) {
      commit('SET_WISH_PLACE', data)
    },
    addWishPlace ({ commit }, data) {
      commit('ADD_WISH_PLACE', data)
    },
    deleteWishPlace ({ commit }, data) {
      commit('DELETE_WISH_PLACE', data)
    },
    setParticipants ({ commit }, data) {
      commit('SETPARTICIPANTS', data)
    },
    setPartMidTime ({ commit }, data) {
      commit('SETPARTMIDTIME', data)
    },
    setMiddleLists ({ commit }, data) {
      commit('SETMIDDLELISTS', data)
    },
    setMiddleName ({ commit }, data) {
      commit('SETMIDDLENAME', data)
    },
    setMiddleLat ({ commit }, data) {
      commit('SETMIDDLELAT', data)
    },
    setMiddleLong ({ commit }, data) {
      commit('SETMIDDLELONG', data)
    },
    setGroupName ({ commit }, data) {
      commit('SETGROUPNAME', data)
    },
    setGroupId ({ commit }, data) {
      commit('SETGROUPID', data)
    },
    setIsFirst ({ commit }, data) {
      commit('SETISFIRST', data)
    },
    setIsGroupSaved ({ commit }, data) {
      commit('SETISGROUPSAVED', data)
    },
    setIsAppointmentDeleted ({ commit }, data) {
      commit('SET_IS_APPOINTMENT_DELETED', data)
    },
  },
}