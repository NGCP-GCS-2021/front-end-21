<template>
  <div class="mea">
    <v-container fill-height fluid flex class="pa-2 mt-3 d-flex">
      <v-row align="auto">
        <Map
          cols="col col-6"
          center_lat="33.932116"
          center_long="-117.630109"
          zoom="9"
          SW_bound_lat="33.93154919990249"
          SW_bound_long="-117.63616828159178"
          NE_bound_lat="33.93569086311143"
          NE_bound_long="-117.6263621141112"
          @mapMounted="mapMounted"
          ref="Map"
        />
        <v-col :cols="6">
          <v-container fluid flex>
            <v-row class="pb-3 px-5">
              <GeneralStage
                :stage="stage"
                :vehicle="vehicle"
                :updatedStage="updatedStage"
                :updatedVehicle="updatedVehicle"
              />
            </v-row>
            <v-row class="px-5">
              <v-card class="pa-1" style="width: 100%">
                <v-container fluid flex>
                  <MACStatus />
                </v-container>
              </v-card>
            </v-row>
            <v-container
              class="mt-5 pt-1 scrollable"
              style="height: 515px; overflow-y: hidden"
            >
              <v-row class="d-flex" align="auto">
                <v-col cols="6" class="ml-0 pl-3">
                  <v-card class="pa-1" style="width: 100%; height: 260px">
                    <MACSearchArea
                      @addPolygon="addPolygon"
                      @addCircle="addCircle"
                      :circleCoords="circleCoords"
                      ref="MACSearchArea"
                    />
                  </v-card>
                </v-col>
                <v-col cols="6" class="d-flex">
                  <v-card class="pa-1" style="width: 100%">
                    <ERUDrop
                      @editERUDrop="editERUDrop"
                      @addERUDrop="addERUDrop"
                      :ERUDropPointExists="ERUDropPointExists"
                      ref="ERUDrop"
                    />
                  </v-card>
                </v-col>
              </v-row>
              <v-row align="auto">
                <v-col class="d-flex">
                  <v-card class="pa-1" style="width: 100%">
                    <MACControl @setGeneralStage="setGeneralStage" />
                  </v-card>
                </v-col>
                <v-col class="d-flex">
                  <v-card class="pa-1">
                    <MACHome
                      @editMACHome="editMACHome"
                      @addMACHome="addMACHome"
                      :MACHomePointExists="MACHomePointExists"
                      ref="MACHome"
                    />
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MACStatus from "@/components/MAC/MACStatus.vue";
import MACControl from "@/components/MAC/MACControl.vue";
import GeneralStage from "@/components/GeneralStage.vue";
import MACHome from "@/components/MAC/MACHome.vue";
import EvacuationZone from "@/components/EvacuationZone.vue";
import ERUDrop from "@/components/MAC/ERUDrop.vue";
import MACSearchArea from "@/components/MAC/MACSearchArea.vue";
import Map from "@/components/Map.vue";
import axios from "axios";

export default {
  name: "",
  props: ["vehicle", "stage"],
  components: {
    MACStatus,
    MACControl,
    GeneralStage,
    MACHome,
    EvacuationZone,
    ERUDrop,
    MACSearchArea,
    Map,
  },

  data: () => ({
    updatedStage: null,
    updatedVehicle: null,
    circleCoords: null,
    current_lng: -117.6316988,
    current_lat: 33.9336,
    current_yaw: null,
    mac_data: null,
    map_mounted: false,
    firstGetMAC: true,
    firstGetHiker: true,
    hiker_data: null,
    hiker_lng: -117.6318437,
    hiker_lat: 33.933729,
    MACHomePointExists: false,
    ERUDropPointExists: false,
    value: 0,
    query: false,
    show: true,
    interval: 0,
  }),

  // mounted() {
  //   // setTimeout(this.getCurrentData, 5000);
  // },
  // updated() {
  //   if (!this.firstGetMAC && !this.firstGetHiker) {
  //     this.getCurrentData();
  //   }
  // },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    mapMounted() {
      this.getCurrentData();
      this.$refs.MACSearchArea.getMACSearchArea();
      this.$refs.ERUDrop.getCurrentDropLocation();
      this.$refs.MACHome.getCurrentTravelTo();
      this.interval = setInterval(() => this.updateMACLoop(), 500);
    },
    updateMACLoop() {
      if (!this.firstGetMAC && !this.firstGetHiker) {
        this.getCurrentData();
      }
    },
    setGeneralStage(stage, vehicle) {
      this.$emit("setGeneralStage", stage, vehicle);
      this.updatedStage = stage;
      this.updatedVehicle = vehicle;
    },
    addPolygon(coordinates) {
      this.$refs.Map.removeLayer("Search Area");
      // console.log(coordinates);
      this.$refs.Map.addPoly(coordinates, "Search Area", "#00ff6a", 0.3);
      console.log("added Search Area from endpoint");
    },
    addCircle(lng, lat, rad) {
      this.$refs.Map.removeLayer("Search Area");
      this.circleCoords = this.$refs.Map.addCircle(
        lng,
        lat,
        rad,
        16,
        "Search Area",
        "#00ff6a",
        0.3
      );
    },
    getCurrentData() {
      let path = "http://127.0.0.1:5000/MAC_XBEE";
      axios
        .get(path)
        .then((res) => {
          this.mac_data = res.data.MAC;
          this.setMACPosition();
        })
        .catch((error) => {
          console.error(error.response);
        });
      path = "http://127.0.0.1:5000/Hiker";
      axios
        .get(path)
        .then((res) => {
          this.hiker_data = res.data.Hiker;
          this.setHikerPosition();
        })
        .catch((error) => {
          console.error(error.response);
        });
    },
    setMACPosition() {
      for (let i = 0; i < this.mac_data.length; i++) {
        if (this.mac_data[i].title == "Latitude") {
          this.current_lat = this.mac_data[i].value;
        } else if (this.mac_data[i].title == "Longitude") {
          this.current_lng = this.mac_data[i].value;
        } else if (this.mac_data[i].title == "Yaw") {
          this.current_yaw = this.mac_data[i].value;
        }
      }

      let coord = [this.current_lng, this.current_lat]; //array for editPointSource
      let pointExists = this.$refs.Map.editPointSource("mac", coord);
      if (pointExists) {
        // console.log("edited MAC point");
      } else {
        // console.log("added MAC point");
        this.$refs.Map.addCoord(
          "mac",
          "mac",
          this.current_lng,
          this.current_lat
        );
      }
      this.$refs.Map.setRotation("mac", this.current_yaw);
      this.firstGetMAC = false;
    },
    setHikerPosition() {
      for (let i = 0; i < this.hiker_data.length; i++) {
        if (this.hiker_data[i].title == "Hiker_lat") {
          this.hiker_lat = this.hiker_data[i].value;
        } else if (this.hiker_data[i].title == "Hiker_lng") {
          this.hiker_lng = this.hiker_data[i].value;
        }
      }
      let coord = [this.hiker_lng, this.hiker_lat]; //array for editPointSource
      let pointExists = this.$refs.Map.editPointSource("hiker", coord);
      if (pointExists) {
        // console.log("edited Hiker point");
      } else {
        // console.log("added Hiker point");
        this.$refs.Map.addCoord(
          "hiker",
          "hiker",
          this.hiker_lng,
          this.hiker_lat
        );
      }
      this.firstGetHiker = false;
    },
    editMACHome(coord) {
      this.MACHomePointExists = this.$refs.Map.editPointSource(
        "mac_home",
        coord
      );
    },
    addMACHome(lng, lat) {
      this.$refs.Map.addCoord("mac_home", "home", lng, lat);
    },
    editERUDrop(coord) {
      this.ERUDropPointExists = this.$refs.Map.editPointSource(
        "eru_drop_loc",
        coord
      );
    },
    addERUDrop(lng, lat) {
      this.$refs.Map.addCoord("eru_drop_loc", "drop-location", lng, lat); //not sure if naming is correct
    },
    queryAndIndeterminate() {
      this.query = true;
      this.show = true;
      this.value = 0;

      setTimeout(() => {
        this.query = false;

        this.interval = setInterval(() => {
          if (this.value === 100) {
            clearInterval(this.interval);
            this.show = false;
            return setTimeout(this.queryAndIndeterminate, 2000);
          }
          this.value += 25;
        }, 1000);
      }, 2500);
    },
  },
};
</script>

<style>
.scrollable:hover,
.scrollable:active,
.scrollable:focus {
  overflow-y: auto !important;
}
</style>
