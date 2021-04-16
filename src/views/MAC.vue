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
          ref="Map"
        />
        <v-col :cols="6">
          <v-container fluid flex>
            <v-row>
              <v-col :cols="12">
                <v-progress-linear
                  color="green"
                  class="px-1"
                  v-model="value"
                  :active="show"
                  :indeterminate="query"
                  :query="true"
                >
                </v-progress-linear>
              </v-col>
            </v-row>
            <v-row class="px-3 pb-1">
              <h4>Data Updated ago</h4>
            </v-row>
          </v-container>
          <v-container fluid flex>
            <v-row class="pb-3">
              <GeneralStage
                :stage="stage"
                :vehicle="vehicle"
                :updatedStage="updatedStage"
                :updatedVehicle="updatedVehicle"
              />
            </v-row>
            <v-row>
              <v-card class="pa-1" style="width: 100%">
                <v-container fluid flex>
                  <MACStatus />
                </v-container>
              </v-card>
            </v-row>
            <v-container
              class="mt-5 pt-5 scrollable"
              style="height: 515px; overflow-y: hidden"
            >
              <v-row class="d-flex" align="auto">
                <v-col cols="6" class="ml-0 pl-3">
                  <v-card class="pa-1" style="width: 100%; height: 260px">
                    <MACSearchArea
                      @addPolygon="addPolygon"
                      @addCircle="addCircle"
                      :circleCoords="circleCoords"
                    />
                  </v-card>
                </v-col>
                <v-col cols="6" class="d-flex">
                  <v-card class="pa-1" style="width: 100%">
                    <ERUDrop />
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
                    <MACHome />
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
    current_lng: -117,
    current_lat: 34,
    mac_data: null,
  }),
  mounted() {
    this.interval = setInterval(() => this.setMapPosition(), 500)
  },
  updated() {

  },
  methods: {
    setGeneralStage(stage, vehicle) {
      this.$emit("setGeneralStage", stage, vehicle);
      this.updatedStage = stage;
      this.updatedVehicle = vehicle;
    },
    addPolygon(coordinates) {
      this.$refs.Map.removeLayer("Search Area");
      this.$refs.Map.addPoly(coordinates, "Search Area", "#00ff6a", 0.3);
      console.log("herhehehere")
    },
    addCircle(lng, lat, rad) {
      this.circleCoords = this.$refs.Map.addCircle(
        lng,
        lat,
        rad,
        16,
        "SearchAreaCircle",
        "#00ff6a",
        0.3 
      );
    },
    getEruData() {
      const path = "http://127.0.0.1:5000/MAC_XBEE";
      axios
        .get(path)
        .then((res) => {
          this.mac_data = res.data.MAC;
          this.setMapPosition();
        })
        .catch((error) => {
          console.error(error);
      });
    },
    setMapPosition() {
      // for (let i = 0; i < this.eru_data.length; i++) {
      //   if (this.eru_data.title == "Latitude") {
      //     this.current_lat = this.eru_data.value;
      //   } else if (this.eru_data.title == "Longitude") {
      //     this.current_lng == this.eru_data.value;
      //   }
      // }
      let coord = [this.current_lng, this.current_lat];
      let pointExists = this.$refs.Map.editPointSource("mac", coord);
      console.log(pointExists);
      if ((this.current_lat == null || this.current_lng == null)) {
      } else {
        if (pointExists) {
        } else {
          console.log("we are jere_mac");
          this.$refs.Map.addCoord(
              "mac",
              "mac",
              this.current_lng,
              this.current_lat
          );
        }
      }
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
