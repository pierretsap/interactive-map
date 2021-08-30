export default {
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
    createBuildingsSelector(selectAssocier) {
      var opt;
      for (const building of this.buildings) {
        opt = document.createElement("option");
        opt.className = "buildings-option";
        opt.appendChild(document.createTextNode(building.name));
        selectAssocier.appendChild(opt);
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
            this.$el.getElementsByClassName(
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
    clearFreeDraw(event) {
      if (event.eventType == "create" && event.latLngs.length > 0) {
        var latLngs = event.latLngs[0];
        this.freeDraw.clear();
        var polygon = this.l.polygon(latLngs).addTo(this.map);
        this.initEvents(polygon);
        if (this.freeDrawControl.toggled()) {
          this.freeDrawControl.toggle();
        }
        this.freeDraw.mode(this.none);
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
    toggleHidden(){
      this.hidden = (this.hidden == 'hidden'?'visible':'hidden');
    },
    buttonHideShowText(){
      return this.hidden == 'hidden'?'show':'hide';
    }

  }
}