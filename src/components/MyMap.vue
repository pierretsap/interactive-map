<template>
  <div class="row col-8 map-div">
    <l-map ref="myMap" :zoom="zoom" :center="center" @ready="onMapReady">
      <!-- Tile Layer -->
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <!-- Controls -->
      <l-control-fullscreen position="topright" :options="{ title: { 'false': 'Open full screen', 'true': 'Close full screen' } }"/>
      <l-control-scale position="bottomright" :imperial="false" :metric="true"></l-control-scale>
      <!-- Free draw -->
      <l-freedraw ref="freeDraw" :mode="mode" v-on:markers="clearFreeDraw($event)"/>
    </l-map>
  </div>
  <!-- /.row map -->
</template>

<script>
// Leaflet
import L from "leaflet";

import { LMap, LTileLayer, LControlScale } from "vue2-leaflet";

// Leaflet fullscreen
import LControlFullscreen from 'vue2-leaflet-fullscreen';

// Geoman
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

// Free Draw
import LFreeDraw from "vue2-leaflet-freedraw";
import { NONE, CREATE } from "leaflet-freedraw";

// Icons displayer fix
import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  name: "MyMap",
  props: {
    buildings: {
      type: Array,
    },
  },
  components: {
    LMap,
    LTileLayer,
    LControlScale,
    "l-freedraw": LFreeDraw,
    LControlFullscreen
  },
  data() {
    return {
      zoom: 17,
      center: L.latLng(50.60810645746167, 3.1448793411254887),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

      map: null,
      freeDraw: null,
      freeDrawControl: null,
      mode: NONE,
      tooltipOptions: { permanent: true },
      toolTipsControl: null,
      hidden: 'visible',
    };
  },
  methods: {
    indexOfBuildingName(name){
      for (let i = 0; i < this.buildings.length; i++) {
        const building = this.buildings[i];
        if (building.name == name) {
            return i;
        }
      }
      return -1;
    },
    updateBuildingsSelectors(selectAssocier) {
      var buildingsSelectors = selectAssocier.children;
      for (let i = 1; i < buildingsSelectors.length; i++) {
        if (this.buildings[this.indexOfBuildingName(buildingsSelectors[i].textContent)].layer == null) {
          buildingsSelectors[i].hidden = false;
        } else {
          buildingsSelectors[i].hidden = true;
        }
      }
    },
    initEvents(layer) {
      var selectAssocier = document.createElement("select");
      selectAssocier.className = "buildings-selector form-select-sm";
      var opt = document.createElement("option");
      opt.hidden = true;
      opt.appendChild(document.createTextNode("Associer"));
      selectAssocier.appendChild(opt);
      this.createBuildingsSelector(selectAssocier);

      selectAssocier.addEventListener("change", (event) => {
        var select = event.target, i=-1;
        for (const building of this.buildings) {
          if (building.layer == layer) {
            layer.unbindTooltip();
            building.layer = null;
          }
        }
        if ((i=this.indexOfBuildingName(select.options[select.selectedIndex].text))>=0) {
          layer.bindTooltip(this.buildings[i].name, {permanent: true, className: "layout-label", direction: 'center' ,style: 'visibility: '+ this.hidden});
          layer._tooltip._container.style.visibility = this.hidden;
          this.buildings[i].layer = layer;
          btnDesassocier.style.display = 'initial';
        }
      });

      selectAssocier.addEventListener("mouseenter", (event) => {
        this.updateBuildingsSelectors(event.target);
      });

      this.map.on("layerremove", (event) => {
        for (const building of this.buildings) {
          if (building.layer == event.layer) {
            building.layer = null;
          }
        }
      });

      var btnsDiv = document.createElement("div");
      btnsDiv.className = "popup-div";
      var btnEntrer = document.createElement("button");
      btnEntrer.className = "btn btn-outline-primary btn-sm";
      btnEntrer.appendChild(document.createTextNode("Entrer"));
      btnEntrer.addEventListener("click", function () {
        console.log("[TODO] entrer function");
      });

      var btnDesassocier = document.createElement("button");
      btnDesassocier.className = "btn btn-outline-danger btn-sm";
      btnDesassocier.appendChild(document.createTextNode("Désassocier"));
      btnDesassocier.style.display = 'none';
      btnDesassocier.addEventListener("click",() => {
        btnDesassocier.style.display = 'none';
        layer.unbindTooltip();
        for (const building of this.buildings) {
          if (building.layer == layer) {
            building.layer = null;
            document.getElementsByClassName(
              "buildings-selector"
            )[0].selectedIndex = 0;
          }
        }
      });

      btnsDiv.appendChild(document.createTextNode(layer._leaflet_id));
      btnsDiv.appendChild(btnEntrer);
      btnsDiv.appendChild(selectAssocier);
      btnsDiv.appendChild(btnDesassocier);
      layer.bindPopup(btnsDiv);
    },
    createBuildingsSelector(selectAssocier) {
      var opt;
      for (const building of this.buildings) {
        opt = document.createElement("option");
        opt.className = "buildings-option";
        opt.appendChild(document.createTextNode(building.name));
        selectAssocier.appendChild(opt);
      }
    },
    clearFreeDraw(event) {
      if (event.eventType == "create" && event.latLngs.length > 0) {
        var latLngs = event.latLngs[0];
        this.freeDraw.clear();
        var polygon = L.polygon(latLngs).addTo(this.$refs.myMap.mapObject);
        this.initEvents(polygon);
        if (this.freeDrawControl.toggled()) {
          this.freeDrawControl.toggle();
        }
        this.freeDraw.mode(NONE);
      }
    },
    onMapReady() {
      this.map.pm.addControls({
        position: "topleft",
        drawCircle: false,
        drawPolyline: false,
        drawCircleMarker: false,
        dragMode: false,
        rotateMode: false,
        cutPolygon: false,
      });
    },
    latLng: function (lat, lng) {
      return L.latLng(lat, lng);
    },
    toggleHidden(){
      this.hidden = (this.hidden == 'hidden'?'visible':'hidden');
    },
    toggleHidden2(){
      var leafletTooltipPane = document.getElementsByClassName('leaflet-tooltip-pane')[0].childNodes;
      this.hidden = (this.hidden == 'hidden'?'visible':'hidden');
      leafletTooltipPane.forEach(element => {
        element.style.visibility = this.hidden
      });
    },
    buttonHideShowText(){
      return this.hidden == 'hidden'?'show':'hide';
    }
  },
  computed: {
  },
  mounted() {
    this.map = this.$refs.myMap.mapObject;
    this.map.on('pm:create', e => this.initEvents(e.layer));
    this.$nextTick(() => {
      this.freeDraw = this.$refs.freeDraw.mapObject;
      this.freeDrawControl = this.map.pm.Toolbar.createCustomControl({
        name: "Draw Freely",
        title: "Draw Freely",
        className: "leaflet-pm-icon-freedraw",
        onClick: () => {
          this.freeDrawControl.toggled()
            ? this.freeDraw.mode(NONE)
            : this.freeDraw.mode(CREATE);
        },
        actions: [
          {
            text: "Cancel",
            title: "Free Draw",
            onClick: () => {
              this.freeDraw.mode(NONE);
              this.freeDrawControl.toggle();
            },
          },
        ],
      });
      this.toolTipsControl = this.map.pm.Toolbar.createCustomControl({
        name: "Hide Tooltips",
        title: "Hide/Show",
        block: 'custom',
        className: "leaflet-tooltip-control-hide-show leaflet-tooltip-control-hide",
        onClick: () => {
          var leafletTooltipPane = document.getElementsByClassName('leaflet-tooltip-pane')[0].childNodes;
          this.toggleHidden()
            leafletTooltipPane.forEach(element => {
              element.style.visibility = this.hidden
            });
          this.toolTipsControl.toggle();
          var leafletToolTipControl = document.getElementsByClassName('leaflet-tooltip-control-hide-show')[0];
          leafletToolTipControl.className = 'control-icon leaflet-tooltip-control-hide-show leaflet-tooltip-control-'+this.buttonHideShowText();
        },
      });
    });
  },
};
</script>

<style>
.map-div {
  height: 95vh;
}
.listContainer {
  width: 25%;
  float: left;
}
.map {
  float: left;
  height: 600px;
  width: 70%;
}
li:hover {
  background-color: grey;
}
.popup-div {
  margin: auto;
  text-align: center;
}
.popup-div > * {
  margin: auto;
  text-align: center;
  display: block;
  margin-top: 2px;
}
.leaflet-pm-icon-freedraw {
  background-image: url("../assets/pencil.png");
}
.leaflet-tooltip-control-hide {
  background-image: url("../assets/private.png");
}
.leaflet-tooltip-control-show {
  background-image: url("../assets/view.png");
}
div.layout-label{
  background-color: lightgreen;
  border-color: blue;
}
</style>