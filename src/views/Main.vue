<template>
  <div class="home">
    <v-container fill-height fluid class="pa-2 mt-1">
      <v-row align="auto">
        <Map
          cols="col col-8"
          center_lat="33.932116"
          center_long="-117.630109"
          zoom="9"
          SW_bound_lat="33.93154919990249"
          SW_bound_long="-117.63616828159178"
          NE_bound_lat="33.93569086311143"
          NE_bound_long="-117.6263621141112"
          ref="Map"
        />

        <v-col :cols="4">
          <v-container>
            <v-row class="pa-2 mb-3">
              <GeneralStage
                :stage="stage"
                :vehicle="vehicle"
                :updatedStage="updatedStage"
                :updatedVehicle="updatedVehicle"
              />
            </v-row>
            <div
              class="scrollable"
              style="
                height: 800px !important;
                overflow-y: hidden;
                overflow-x: hidden;
              "
            >
              <v-row class="pa-2">
                <v-card class="pa-2" width="100%">
                  <v-container>
                    <v-row justify="center" class="pb-2">
                      <h1
                        class="font-weight-regular text-center display-2 green--text pr-4"
                      >
                        MAC
                      </h1>
                      <v-icon large color="green">mdi-airplane</v-icon>
                    </v-row>
                    <MACStatus />
                    <v-row justify="center">
                      <v-col :cols="5" class="mx-2 px-0">
                        <MACMainControl @setGeneralStage="setGeneralStage" />
                      </v-col>
                      <v-col :cols="5" class="mx-2 px-0">
                        <MACEmergency />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-row>
              <v-row class="pa-2">
                <v-card class="pa-2" width="100%">
                  <v-container>
                    <v-row fluid flex justify="center" class="pb-2">
                      <h1
                        class="font-weight-regular text-center display-2 orange--text pr-4"
                      >
                        ERU
                      </h1>
                      <v-icon large color="orange">mdi-car</v-icon>
                    </v-row>
                    <ERUStatus />
                    <v-row justify="center">
                      <v-col :cols="5" class="mx-2 px-0">
                        <ERUMainControl @setGeneralStage="setGeneralStage" />
                      </v-col>
                      <v-col :cols="5" class="mx-2 px-0">
                        <ERUEmergency />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-row>
              <v-row class="pa-2">
                <v-card class="pa-2" width="100%">
                  <v-container>
                    <v-row justify="center" class="pb-2">
                      <h1
                        class="font-weight-regular text-center display-2 purple--text pr-4"
                      >
                        MEA
                      </h1>
                      <v-icon large color="purple">mdi-quadcopter</v-icon>
                    </v-row>
                    <MEAStatus />
                    <v-row justify="center">
                      <v-col :cols="5" class="mx-2 px-0">
                        <MEAMainControl @setGeneralStage="setGeneralStage" />
                      </v-col>
                      <v-col :cols="5" class="mx-2 px-0">
                        <MEAEmergency />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-row>
            </div>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import MACEmergency from "@/components/Main/MACEmergency.vue";
import ERUEmergency from "@/components/Main/ERUEmergency.vue";
import MEAEmergency from "@/components/Main/MEAEmergency.vue";
import MACMainControl from "@/components/Main/MACMainControl.vue";
import ERUMainControl from "@/components/Main/ERUMainControl.vue";
import MEAMainControl from "@/components/Main/MEAMainControl.vue";
import MEAStatus from "@/components/MEA/MEAStatus.vue";
import ERUStatus from "@/components/ERU/ERUStatus.vue";
import MACStatus from "@/components/MAC/MACStatus.vue";
import GeneralStage from "@/components/GeneralStage.vue";
import Map from "@/components/Map.vue";
import axios from "axios";

export default {
  name: "",
  props: ["stage", "vehicle"],
  components: {
    MACEmergency,
    ERUEmergency,
    MEAEmergency,
    MACMainControl,
    ERUMainControl,
    MEAMainControl,
    MEAStatus,
    ERUStatus,
    MACStatus,
    GeneralStage,
    Map,
  },
  data: () => ({
    updatedStage: null,
    updatedVehicle: null,
    mac_data: [],
    hiker_data: [],
    eru_data: [],
    firstGetMAC: true,
    firstGetERU: true,
    firstGetHiker: true,
  }),
  // mounted() {
  //   this.getMACCurrentData();
  //   this.getERUCurrentData();
  //   this.getHikerCurrentData();
  // },
  // updated() {
  //   this.getMACCurrentData();
  //   this.getERUCurrentData();
  //   this.getHikerCurrentData();
  // },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    mapMounted() {
      this.getMACCurrentData();
      this.getERUCurrentData();
      this.getHikerCurrentData();
      this.interval = setInterval(() => this.updateLoop(), 500);
    },
    updateLoop() {
      if (!this.firstGetERU && !this.firstGetHiker && !this.firstGetMAC) {
        this.getCurrentData();
        this.getMACCurrentData();
        this.getERUCurrentData();
        this.getHikerCurrentData();
      }
    },
    setGeneralStage(stage, vehicle) {
      this.$emit("setGeneralStage", stage, vehicle);
      this.updatedStage = stage;
      this.updatedVehicle = vehicle;
    },
    getMACCurrentData() {
      //MAC information
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
    },
    setMACPosition() {
      for (let i = 0; i < this.mac_data.length; i++) {
        if (this.mac_data[i].title == "Latitude") {
          this.current_lat = this.mac_data[i].value;
        } else if (this.mac_data[i].title == "Longitude") {
          this.current_lng = this.mac_data[i].value;
        }
      }
      let coord = [this.current_lng, this.current_lat]; //array for editPointSource
      let pointExists = this.$refs.Map.editPointSource("mac", coord);
      if (pointExists) {
        console.log("edited MAC point");
      } else {
        console.log("added MAC point");
        this.$refs.Map.addCoord(
          "mac",
          "mac",
          this.current_lng,
          this.current_lat
        );
      }
      this.firstGetMAC = false;
    },
    getERUCurrentData() {
      //ERU information
      let path = "http://127.0.0.1:5000/ERU_XBEE";
      axios
        .get(path)
        .then((res) => {
          this.eru_data = res.data.ERU;
          this.setERUPosition();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setERUPosition() {
      for (let i = 0; i < this.eru_data.length; i++) {
        if (this.eru_data[i].title == "Latitude") {
          this.current_lat = this.eru_data[i].value;
        } else if (this.eru_data[i].title == "Longitude") {
          this.current_lng = this.eru_data[i].value;
        }
      }
      let coord = [this.current_lng, this.current_lat]; //array for editPointSource
      let pointExists = this.$refs.Map.editPointSource("eru", coord);
      if (pointExists) {
        console.log("edited point");
      } else {
        console.log("added point");
        this.$refs.Map.addCoord(
          "eru",
          "eru",
          this.current_lng,
          this.current_lat
        );
      }
      this.firstGetERU = false;
    },
    getHikerCurrentData() {
      //Hiker information
      let path = "http://127.0.0.1:5000/Hiker";
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

<style>
.scrollable:hover,
.scrollable:active,
.scrollable:focus {
  overflow-y: auto !important;
}
</style>
