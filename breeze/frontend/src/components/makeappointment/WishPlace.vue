<template>
  <div 
    class="wish-place-item"
    :style="{background: this.placeTypeColor[place.category]}">
    <div class="item-info">
      <div class="img-box">
        <img :src="require('@/assets/map/' + place.category + '.png')" alt="" class="place-img">
      </div>
      <div class="desc">
        <div>{{ place.name | word }}</div>
        <a :href="place.url" class="arrow-box">
          <img src="@/assets/common/arrow.png" alt="" class="arrow-img">
        </a>
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  name: 'WishPlace',
  props: {
    place: Object,
  },
  data() {
    return {
      placeTypeColor: ["#ADA6AD", "#EBECCA", "#BFD5F8"],
    }
  },
  filters: {
    word: function (value) {
      if (value.length > 10) {
        return value.substr(0, 10) + ".."
      } else {
        return value 
      }
    }
  }
}
</script>

<style scoped>
.wish-place-item {
  height: 14%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 4.3%;
  border-radius: 10px;
}
.item-info {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.img-box {
  width: 3.8vh;
  height: 3.8vh;
  margin-left: 5%;
  margin-right: 5%;
}
.place-img {
  width: 100%;
  height: 100%;
}
.desc {
  width: 75%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.desc div {
  padding-top: 1%;
  font-weight: 600;
  color:rgb(82, 81, 81)
}
.arrow-box {
  width: 4vh;
  height: 4vh;
}
.arrow-img {
  width: 100%;
  height: 100%;
}
</style>