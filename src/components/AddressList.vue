<template>
  <div class="card address-list col-4">
    <ul class="list-group list-group-flush">
      <li
        id="buildingsList"
        v-bind:key="index"
        v-for="(building, index) in buildings"
        class="list-group-item"
        v-on:mouseover="changeLayerColor($event,index)"
        v-on:mouseout="changeLayerColorBack($event,index)"
      >
        {{ building.name }}<template v-if="building.layer">, {{ building.layer._leaflet_id }}</template>
      </li>
    </ul>
    <div class='add-to-list'>
      <input type="text" v-model="elementToAdd" @keyup.enter="addToList(elementToAdd)">
      <button @click="addToList(elementToAdd)">Ajouter</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddressList",
  props: ["buildings"],
  data() {
    return {
      elementToAdd: ''
    };
  },
  methods: {
    addToList(element){
      if (this.elementToAdd != '') {
        this.buildings.push({name: element, layer: null});
        this.elementToAdd=''
      }
    },
    changeLayerColor(e,i) {
      var layer = this.buildings[i].layer;
      if (layer != null && layer._latlngs != undefined) {
        layer.setStyle({ fillColor: "red" });
      }
    },
    changeLayerColorBack(e,i) {
      var layer = this.buildings[i].layer;
      if (layer != null && layer._latlngs != undefined) {
        layer.setStyle({ fillColor: "blue" });
      }
    },
  },
};
</script>

<style lang="css" scoped>
li {
  background-color: lightgray;
}
li:hover {
  background-color: darkgray;
}
</style>