<template>
  <div id="app" class="row">
    <h1>{{msg}}</h1>
    <address-list :buildings='buildings'></address-list>
    <my-map :buildings='buildings'></my-map>
  </div>
</template>

<script>
import AddressList from './components/AddressList.vue'
import MyMap from './components/MyMap.vue';

export default {
  name: 'App',
  components: {
    'address-list': AddressList,
    'my-map': MyMap
  },
  data(){
    return {
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
</style>
