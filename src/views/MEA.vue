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
            <v-row class="pb-3 px-3">
              <GeneralStage
                :stage="stage"
                :vehicle="vehicle"
                :updatedStage="updatedStage"
                :updatedVehicle="updatedVehicle"
              />
            </v-row>
            <v-row class="px-3">
              <v-card class="pa-1" style="width: 100%">
                <v-container fluid flex>
                  <MEAStatus />
                </v-container>
              </v-card>
            </v-row>
            <v-row class="pt-0" align="auto">
              <v-col cols="6" class="ml-0 pl-3">
                <v-card class="pa-1" style="width: 100%">
                  <EvacuationZone />
                </v-card>
              </v-col>
              <v-col cols="6" class="ml-0 pl-3">
                <v-card class="pa-1" style="width: 100%">
                  <MEAHome />
                </v-card>
              </v-col>
            </v-row>
            <v-row class="mt-1" align="auto">
              <v-col class="d-flex">
                <v-card class="pa-1" style="width: 100%">
                  <MEAControl @setGeneralStage="setGeneralStage" />
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MEAStatus from "@/components/MEA/MEAStatus.vue";
import MEAControl from "@/components/MEA/MEAControl.vue";
import GeneralStage from "@/components/GeneralStage.vue";
import MEAHome from "@/components/MEA/MEAHome.vue";
import EvacuationZone from "@/components/EvacuationZone.vue";
import Map from "@/components/Map.vue";

export default {

  mounted() {
    setTimeout(this.getCurrentData, 5000);
  },
  updated() {
    if (!firstGet) {
      this.getCurrentData();
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  name: "",
  props: ["stage", "vehicle"],
  components: {
    MEAStatus,
    MEAControl,
    GeneralStage,
    MEAHome,
    EvacuationZone,
    Map,
  },

  data: () => ({
    updatedStage: null,
    updatedVehicle: null,
    map_mounted: false,
    firstGetMEA: true,
    mea_data: [],
    current_lng: -117.6316988,
    current_lat: 33.9336,
    firstGetHiker: true,
    hiker_data: [],
    hiker_lng: -117.6318437,
    hiker_lat: 33.933729,
  }),
  mounted() {
    setTimeout(this.getCurrentData, 5000);
  },
  updated() {
    if (!this.firstGetMEA && !this.firstGetHiker) {
      this.getCurrentData();
    }
  },
  methods: {
    setGeneralStage(stage, vehicle) {
      this.$emit("setGeneralStage", stage, vehicle);
      this.updatedStage = stage;
      this.updatedVehicle = vehicle;
    },
    getCurrentData() {
      const path = "http://127.0.0.1:5000/MEA_XBEE";
      axios
        .get(path)
        .then((res) => {
          this.mea_data = res.data.MEA;
          this.setMEAPosition();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setMEAPosition() {
      for (let i = 0; i < this.mea_data.length; i++) {
        if (this.mea_data[i].title == "Latitude") {
          this.current_lat = this.mea_data[i].value;
        } else if (this.mea_data[i].title == "Longitude") {
          this.current_lng = this.mea_data[i].value;
        }
      }

      let coord = [this.current_lng, this.current_lat]; //array for editPointSource
      let pointExists = this.$refs.Map.editPointSource("mea", coord);
      if (pointExists) {
        console.log("edited point");
      } else {
        console.log("added point");
        this.$refs.Map.addCoord(
          "mea",
          "mea",
          this.current_lng,
          this.current_lat
        );
      }
      this.firstGetMEA = false;
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
        console.log("edited point");
      } else {
        console.log("added point");
        this.$refs.Map.addCoord(
          "hiker",
          "hiker",
          this.hiker_lng,
          this.hiker_lat
        );
      }
      this.firstGetHiker = false;
    },
  },
};
</script>
