<template>
  <div id="app" class="row">
    <h1>{{msg}}</h1>
    <address-list :buildings='buildings'></address-list>
    <my-map v-show="!mapToggle" :buildings='buildings' ref="myMap" class="col-8 map-div"></my-map>
    <my-plan v-show="mapToggle" :buildings='buildings' ref="myPlan" class="col-8 map-div"></my-plan>
    <button @click.prevent="changeMap">change map</button>
  </div>
</template>

<script>
import AddressList from './components/AddressList.vue'
import MyMap from './components/MyMap.vue';
import MyPlan from './components/MyPlan.vue';

export default {
  name: 'App',
  components: {
    'address-list': AddressList,
    'my-map': MyMap,
    'my-plan': MyPlan
  },
  methods: {
    changeMap(){
      if (this.mapToggle) {
        setTimeout(() => { this.$refs.myMap.map.invalidateSize(); }, 10);
      } else {
        setTimeout(() => { this.$refs.myPlan.plan.invalidateSize(); }, 10);
      }
      this.mapToggle = !this.mapToggle;
      this.msg = (this.mapToggle?'Plan':'Map') + ' using Vue2';
    },
  },
  data(){
    return {
      mapToggle: false,
      msg: 'Map using Vue2',
      buildings : [
        { 'name' : "SN1", 'layer' : null },
        { 'name' : "SN2", 'layer' : null },
        { 'name' : "SN3", 'layer' : null },
        { 'name' : "A3", 'layer' : null },
        { 'name' : "M1", 'layer' : null },
        { 'name' : "M5", 'layer' : null }
      ]
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
.map-div {
  padding-left: 0px;
  height: 95vh;
}
</style>
