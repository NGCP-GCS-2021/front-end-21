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
          @mapMounted="mapMounted"
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
    Search_Area: [],
    firstGetMAC: true,
    firstGetERU: true,
    firstGetHiker: true,
    firstGetHome: true,
    firstGetEvac: true,
    firstGetERUDrop: true,
    MACHomePointExists: false,
    ERUDropPointExists: false,
    evacPointExists: false,
    current_mac_lng: -117.6316988,
    current_mac_lat: 33.9336,
    current_mac_yaw: null,
    current_eru_lng: -117.6316988,
    current_eru_lat: 33.9336,
    current_yaw: 42,
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
      this.getCurrentTravelTo();
      this.getCurrentDropLocation();
      this.getMACSearchArea();
      this.getCurrentEvac()
      this.interval = setInterval(() => this.updateLoop(), 500);
    },
    updateLoop() {
      if (!this.firstGetERU && !this.firstGetHiker && !this.firstGetMAC) {
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
          this.current_mac_lat = this.mac_data[i].value;
        } else if (this.mac_data[i].title == "Longitude") {
          this.current_mac_lng = this.mac_data[i].value;
        } else if (this.mac_data[i].title == "Yaw") {
          this.current_mac_yaw = this.mac_data[i].value;
        }
      }
      let coord = [this.current_mac_lng, this.current_mac_lat]; //array for editPointSource
      let pointExists = this.$refs.Map.editPointSource("mac", coord);
      if (pointExists) {
        console.log("edited MAC point");
      } else {
        console.log("added MAC point");
        this.$refs.Map.addCoord(
          "mac",
          "mac",
          this.current_mac_lng,
          this.current_mac_lat
        );
      }
      this.$refs.Map.setRotation("mac", this.current_mac_yaw);
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
          this.current_eru_lat = this.eru_data[i].value;
        } else if (this.eru_data[i].title == "Longitude") {
          this.current_eru_lng = this.eru_data[i].value;
        } else if (this.eru_data[i].title == "Yaw") {
          this.current_eru_yaw = this.eru_data[i].value;
        }
      }
      let coord = [this.current_eru_lng, this.current_eru_lat]; //array for editPointSource
      let pointExists = this.$refs.Map.editPointSource("eru", coord);
      if (pointExists) {
        console.log("edited point");
      } else {
        console.log("added point");
        this.$refs.Map.addCoord(
          "eru",
          "eru",
          this.current_eru_lng,
          this.current_eru_lat
        );
      }
      this.$refs.Map.setRotation("eru", this.current_eru_yaw);
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
    getCurrentTravelTo() {
      const path = "http://127.0.0.1:5000/MAC_INPUT";
      axios
        .get(path)
        .then((res) => {
          if (this.firstGetHome) {
            if (
              res.data.Travel_to_lng == 0 &&
              res.data.Travel_to_lat == 0 &&
              res.data.Travel_to_alt == 0
            ) {
            } else {
              this.setHomePosition(
                res.data.Travel_to_lng,
                res.data.Travel_to_lat
              );
            }
          } else {
            this.setHomePosition(
              res.data.Travel_to_lng,
              res.data.Travel_to_lat
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setHomePosition(lng, lat) {
      let coord = [lng, lat]; //array for editPointSource
      this.editMACHome(coord);
      if (this.MACHomePointExists) {
        console.log("edited MACHome point");
      } else {
        console.log("added MACHome point");
        this.addMACHome(lng, lat);
      }
      this.firstGetHome = false;
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
    getCurrentDropLocation() {
      const path = "http://127.0.0.1:5000/MAC_INPUT";
      axios
        .get(path)
        .then((res) => {
          if (this.firstGetERUDrop) {
            if (res.data.Drop_Loc_lng == 0 && res.data.Drop_Loc_lng == 0) {
            } else {
              this.setDropLocationPosition(
                res.data.Drop_Loc_lng,
                res.data.Drop_Loc_lat
              );
            }
          } else {
            this.setDropLocationPosition(
              res.data.Drop_Loc_lng,
              res.data.Drop_Loc_lat
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setDropLocationPosition(lng, lat) {
      let coord = [lng, lat]; //array for editPointSource
      this.editERUDrop(coord);
      if (this.pointExists) {
        console.log("edited ERUDrop point");
      } else {
        console.log("added ERUDrop point");
        this.addERUDrop(lng, lat);
      }
      this.firstGetERUDrop = false;
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
    getCurrentEvac() {
      const path = "http://127.0.0.1:5000/ERU_INPUT";
      axios
        .get(path)
        .then((res) => {
          if (this.firstGetEvac) {
            if (res.data.EZ_lng == 0 && res.data.EZ_lat == 0) {
            } else {
              this.setEvacPosition(res.data.EZ_lng, res.data.EZ_lat);
            }
          } else {
            this.setEvacPosition(res.data.EZ_lng, res.data.EZ_lat);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setEvacPosition(lng, lat) {
      let coord = [lng, lat]; //array for editPointSource
      this.editEvac(coord);
      if (this.evacPointExists) {
        console.log("edited point");
      } else {
        console.log("added point");
        this.addEvac(lng, lat);
      }
      this.firstGetEvac = false;
    },
    editEvac(coord) {
      this.evacPointExists = this.$refs.Map.editPointSource("evac_zone", coord);
    },
    addEvac(lng, lat) {
      this.$refs.Map.addCoord("evac_zone", "evac-point", lng, lat);
    },
    getMACSearchArea() {
      const path = "http://127.0.0.1:5000/MAC_INPUT";
      axios
        .get(path)
        .then((res) => {
          this.Search_Area = res.data.Search_Area;
          // console.log(this.Search_Area)
          this.setSearchArea();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setSearchArea() {
      console.log("length: " + this.Search_Area.Coordinates.length);
      if (this.Search_Area.Coordinates.length > 0) {
        if (this.Search_Area.Circle_inputs.rad == null) {
          //Polygon
          this.setPolygonCoordinates();
        }
      }
      if (this.Search_Area.Circle_inputs.rad != null) {
        //Circle
        this.setCircleCoordinates();
      }
    },
    setPolygonCoordinates() {
      if (this.Search_Area.Coordinates.length > 0) {
        let tempCoordinates = new Array(this.Search_Area.Coordinates.length);
        let temp = [];
        for (let i = 0; i < this.Search_Area.Coordinates.length; i++) {
          temp = new Array(2);
          temp[0] = this.Search_Area.Coordinates[i].lng;
          temp[1] = this.Search_Area.Coordinates[i].lat;
          tempCoordinates[i] = temp;
        }
        this.addPolygon(tempCoordinates);
        // console.log(this.$refs.PolygonForm.Coordinates);
      }
    },
    setCircleCoordinates() {
      // console.log(this.Search_Area.Circle_inputs.lat);
      if (this.Search_Area.Circle_inputs.rad != null) {
        this.addCircle(
          this.Search_Area.Circle_inputs.lng,
          this.Search_Area.Circle_inputs.lat,
          this.Search_Area.Circle_inputs.rad
        );
      }
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
