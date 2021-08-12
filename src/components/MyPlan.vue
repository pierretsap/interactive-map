<template>
  <div>
    <l-map id="plan" ref="myPlan" :zoom="zoom" :center="center" :crs="crs" @ready="onMapReady">
      <l-image-overlay :url="imgUrl" :bounds="bounds" />
      <!-- Controls -->
      <l-control-fullscreen position="topright" :options="{ title: { 'false': 'Open full screen', 'true': 'Close full screen' } }"/>
      <!-- Free draw -->
      <l-freedraw ref="freeDraw" :mode="mode" v-on:markers="clearFreeDraw($event)"/>
    </l-map>
  </div>
</template>

<script>
// Leaflet
import L from "leaflet";

import { LMap, LImageOverlay } from "vue2-leaflet";

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

import mapMethods from '../mixins/mapMethods';

export default {
  name: "MyPlan",
  mixins: [mapMethods],
  props: {
    buildings: {
      type: Array,
    },
  },
  components: {
    LMap,
    "l-freedraw": LFreeDraw,
    LImageOverlay,
    LControlFullscreen
  },
  data() {
    return {
      zoom: -1,
      center: L.latLng(-556/2, 689/2),
      imgUrl: "https://e7.pngegg.com/pngimages/314/132/png-clipart-floor-plan-architecture-facade-design-angle-building.png",
      bounds: [[0, 0], [-556, 689]],
      crs: L.CRS.Simple,

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
  },
  computed: {
  },
  mounted() {
    this.map = this.$refs.myPlan.mapObject;
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
          var leafletTooltipPane = this.$el.getElementsByClassName('leaflet-tooltip-pane')[0].childNodes;
          this.toggleHidden()
            leafletTooltipPane.forEach(element => {
              element.style.visibility = this.hidden
            });
          this.toolTipsControl.toggle();
          var leafletToolTipControl = this.$el.getElementsByClassName('leaflet-tooltip-control-hide-show')[0];
          leafletToolTipControl.className = 'control-icon leaflet-tooltip-control-hide-show leaflet-tooltip-control-'+this.buttonHideShowText();
        },
      });
    });
  },
};
</script>

<style>
.leaflet-pm-icon-freedraw {
  background-image: url("../assets/pencil.png");
}
.leaflet-tooltip-control-hide {
  background-image: url("../assets/private.png");
}
.leaflet-tooltip-control-show {
  background-image: url("../assets/view.png");
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
div.layout-label{
  background-color: lightgreen;
  border-color: blue;
}
</style>