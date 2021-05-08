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
              <VehicleSelect @selected="setVehicle" />
            </v-row>

            <v-container class="" style="height: 720px" v-if="vehicle">
              <v-row class="d-flex" align="auto">
                <v-col cols="6" class="ml-0 pl-3">
                  <v-card class="pa-1" style="width: 100%; height: 420px">
                    <KeepIn
                      :vehicle="vehicle"
                      @addToKeepIn="addToKeepIn"
                      @addKeepInPolygon="addKeepInPolygon"
                      @addKeepInCircle="addKeepInCircle"
                      :circleCoords="keepInCircleCoords"
                    />
                  </v-card>
                </v-col>
                <v-col cols="6" class="ml-0 pl-3">
                  <v-card class="pa-1" style="width: 100%; height: 420px">
                    <KeepOut
                      :vehicle="vehicle"
                      @addToKeepOut="addToKeepOut"
                      @addKeepOutPolygon="addKeepOutPolygon"
                      @addKeepOutCircle="addKeepOutCircle"
                      :circleCoords="keepOutCircleCoords"
                    />
                  </v-card>
                </v-col>
              </v-row>
              <v-row class="d-flex" align="auto">
                <v-card class="mt-2 pa-1" style="width: 100%; height: 290px">
                  <v-row class="d-flex" align="auto">
                    <v-col cols="6" class="ml-0 pl-3">
                      <KeepInCart
                        :keepInEmpty="keepInEmpty"
                        @setKeepInEmpty="setKeepInEmpty"
                        @removeKeepInArea="removeKeepInArea"
                        ref="KeepInCart"
                      />
                    </v-col>
                    <v-col cols="6" class="ml-0 pl-3">
                      <KeepOutCart
                        :keepOutEmpty="keepOutEmpty"
                        @setKeepOutEmpty="setKeepOutEmpty"
                        @removeKeepOutArea="removeKeepOutArea"
                        ref="KeepOutCart"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-row>
                      <v-col align="end">
                        <v-btn
                          color="green"
                          :disabled="submitDisabled"
                          @click="postGeofence"
                        >
                          Submit All
                        </v-btn>
                      </v-col>
                      <v-col align="begin">
                        <v-btn
                          color="red"
                          :disabled="deleteDisabled"
                          @click="dialog = true"
                        >
                          Delete All
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-row>
                </v-card>
              </v-row>
            </v-container>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">
          <v-icon large color="red" class="pr-3">mdi-alert</v-icon>
          <h3 class="font-weight-light text-center red--text" justify="center">
            Delete All Geofences?
          </h3>
        </v-card-title>
        <v-card-text justify="center">
          Warning: Current {{ vehicle }} Geofences will be deleted.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="secondary" text @click="dialog = false"> Cancel </v-btn>

          <v-btn color="primary" text @click="deleteAll"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VehicleSelect from "@/components/Geofence/VehicleSelect.vue";
import KeepIn from "@/components/Geofence/KeepIn/KeepIn.vue";
import KeepInCart from "@/components/Geofence/KeepIn/KeepInCart.vue";
import KeepOut from "@/components/Geofence/KeepOut/KeepOut.vue";
import KeepOutCart from "@/components/Geofence/KeepOut/KeepOutCart.vue";
import axios from "axios";
import Map from "@/components/Map.vue";

export default {
  name: "",

  components: {
    VehicleSelect,
    KeepIn,
    KeepInCart,
    KeepOut,
    KeepOutCart,
    Map,
  },

  data: () => ({
    vehicle: "MAC", //"MAC", "ERU", "MEA"
    submitDisabled: true,
    deleteDisabled: true,
    Geofence: {
      Geofence: [],
    },
    dialog: false,
    keepInEmpty: true,
    keepOutEmpty: true,
    currentGeofence: [],
    keepInCount: 0,
    keepOutCount: 0,
    keepInCircleCoords: null,
    keepOutCircleCoords: null,
    mapMountedCheck: false,
  }),
  beforeDestroy() {
    try {
      clearInterval(this.interval);
    } catch (error) {}
  },
  methods: {
    mapMounted() {
      this.mapMountedCheck = true;
    },
    setVehicle(vehicle) {
      this.vehicle = vehicle;
      if (this.mapMountedCheck == false) {
        setTimeout(this.setVehicle, 500, vehicle);
      } else {
        try {
          this.clearKeepInLayers();
          this.clearKeepOutLayers();
          this.$refs.KeepInCart.CoordinatesArray = [];
          this.$refs.KeepOutCart.CoordinatesArray = [];
          this.deleteDisabled = true;
          this.submitDisabled = true;
          this.keepInEmpty = true;
          this.keepOutEmpty = true;
        } catch (error) {}
        if (vehicle != null) {
          this.getCurrentGeofence();
        }
      }
    },
    getCurrentGeofence() {
      let path = "";
      if (this.vehicle == "MAC") {
        path = "http://127.0.0.1:5000/MAC_INPUT";
      } else if (this.vehicle == "ERU") {
        path = "http://127.0.0.1:5000/ERU_INPUT";
      } else if (this.vehicle == "MEA") {
        path = "http://127.0.0.1:5000/MEA_INPUT";
      }
      axios
        .get(path)
        .then((res) => {
          this.currentGeofence = res.data.Geofence;
          this.setGeofenceCarts();
        })
        .catch((error) => {
          console.error(error.response);
        });
    },
    setGeofenceCarts() {
      for (let i = 0; i < this.currentGeofence.length; i++) {
        let area = this.currentGeofence[i];
        let tempCoordinates = new Array(area.Coordinates.length);
        let temp = [];
        for (let i = 0; i < area.Coordinates.length; i++) {
          temp = new Array(2);
          temp[0] = parseFloat(area.Coordinates[i].lng);
          temp[1] = parseFloat(area.Coordinates[i].lat);
          tempCoordinates[i] = temp;
        }
        if (area.Keep_in == true) {
          this.addKeepInPolygon(tempCoordinates);
          this.addToKeepIn(
            area.Coordinates,
            area.Circle_inputs.lng,
            area.Circle_inputs.lat,
            area.Circle_inputs.rad
          );
        } else if (area.Keep_in == false) {
          this.addKeepOutPolygon(tempCoordinates);
          this.addToKeepOut(
            area.Coordinates,
            area.Circle_inputs.lng,
            area.Circle_inputs.lat,
            area.Circle_inputs.rad
          );
        }
      }
    },
    addToKeepIn(coordinates, lng, lat, rad) {
      this.$refs.KeepInCart.CoordinatesArray.push(coordinates);
      let circleInputs = { lng: lng, lat: lat, rad: rad };
      // console.log(circleInputs);
      this.$refs.KeepInCart.CircleInputsArray.push(circleInputs);
      this.submitDisabled = false;
      this.deleteDisabled = false;
      this.keepInEmpty = false;
      this.keepInCount++;
    },
    addToKeepOut(coordinates, lng, lat, rad) {
      console.log(coordinates);
      this.$refs.KeepOutCart.CoordinatesArray.push(coordinates);
      let circleInputs = { lng: lng, lat: lat, rad: rad };
      // console.log(circleInputs);
      this.$refs.KeepOutCart.CircleInputsArray.push(circleInputs);
      this.submitDisabled = false;
      this.deleteDisabled = false;
      this.keepOutEmpty = false;
      this.keepOutCount++;
    },
    deleteAll() {
      this.dialog = false;
      this.clearKeepInLayers();
      this.clearKeepOutLayers();
      this.$refs.KeepInCart.CoordinatesArray = [];
      this.$refs.KeepOutCart.CoordinatesArray = [];
      this.deleteDisabled = true;
      this.submitDisabled = true;
      this.keepInEmpty = true;
      this.keepOutEmpty = true;
      this.postGeofence();
    },
    postGeofence() {
      this.Geofence.Geofence = [];
      let keepInAreas = this.$refs.KeepInCart.CoordinatesArray;
      let keepInCircleInputs = this.$refs.KeepInCart.CircleInputsArray;
      for (let i = 0; i < keepInAreas.length; i++) {
        let keepInArea = keepInAreas[i];
        for (let j = 0; j < keepInArea.length; j++) {
          keepInArea[j].lat = parseFloat(keepInArea[j].lat);
          keepInArea[j].lng = parseFloat(keepInArea[j].lng);
        }
        keepInCircleInputs.lng = parseFloat(keepInCircleInputs.lng);
        keepInCircleInputs.lat = parseFloat(keepInCircleInputs.lat);
        keepInCircleInputs.rad = parseFloat(keepInCircleInputs.rad);
        this.Geofence.Geofence.push({
          Coordinates: keepInArea,
          Keep_in: true,
          Circle_inputs: {
            lng: keepInCircleInputs.lng,
            lat: keepInCircleInputs.lat,
            rad: keepInCircleInputs.rad,
          },
        });
      }
      let keepOutAreas = this.$refs.KeepOutCart.CoordinatesArray;
      let keepOutCircleInputs = this.$refs.KeepOutCart.CircleInputsArray;
      for (let i = 0; i < keepOutAreas.length; i++) {
        let keepOutArea = keepOutAreas[i];
        for (let j = 0; j < keepOutArea.length; j++) {
          keepOutArea[j].lat = parseFloat(keepOutArea[j].lat);
          keepOutArea[j].lng = parseFloat(keepOutArea[j].lng);
        }
        keepOutCircleInputs.lng = parseFloat(keepOutCircleInputs.lng);
        keepOutCircleInputs.lat = parseFloat(keepOutCircleInputs.lat);
        keepOutCircleInputs.rad = parseFloat(keepOutCircleInputs.rad);
        this.Geofence.Geofence.push({
          Coordinates: keepOutArea,
          Keep_in: false,
          Circle_inputs: {
            lng: keepOutCircleInputs.lng,
            lat: keepOutCircleInputs.lat,
            rad: keepOutCircleInputs.rad,
          },
        });
      }

      const geofenceStringify = JSON.stringify(this.Geofence);
      let path = "";
      if (this.vehicle == "MAC") {
        path = "http://127.0.0.1:5000/MAC_INPUT";
      } else if (this.vehicle == "ERU") {
        path = "http://127.0.0.1:5000/ERU_INPUT";
      } else if (this.vehicle == "MEA") {
        path = "http://127.0.0.1:5000/ERU_INPUT";
      }
      axios
        .post(path, geofenceStringify)
        .then(() => {
          if (this.vehicle == "MAC") {
            console.log("Posted Geofence coordinates to MAC_INPUT");
          } else if (this.vehicle == "ERU") {
            console.log("Posted Geofence coordinates to ERU_INPUT");
          } else if (this.vehicle == "MEA") {
            console.log("Posted Geofence coordinates to MEA_INPUT");
          }
          console.log(geofenceStringify);
        })
        .catch((error) => {
          console.log(geofenceStringify);
          console.log(error.response);
        });
    },
    setKeepInEmpty(value) {
      this.keepInEmpty = value;
    },
    setKeepOutEmpty(value) {
      this.keepOutEmpty = value;
    },
    addKeepInPolygon(coordinates) {
      let layerName = "Keep In " + this.keepInCount;
      // console.log(layerName);
      this.$refs.Map.removeLayer(layerName);
      let coords = this.$refs.Map.addPoly(coordinates, layerName, "green", 0.4);
      // console.log(coords);
    },
    addKeepInCircle(lng, lat, rad) {
      let layerName = "Keep In " + this.keepInCount;
      this.$refs.Map.removeLayer(layerName);
      let tempCoords = this.$refs.Map.addCircle(
        lng,
        lat,
        rad,
        16,
        layerName,
        "green",
        0.4
      );
      for (let i = 0; i < tempCoords.length; i++) {
        tempCoords[i] = { lng: tempCoords[i][0], lat: tempCoords[i][1] };
      }
      this.keepInCircleCoords = tempCoords;
    },
    addKeepOutPolygon(coordinates) {
      let layerName = "Keep Out " + this.keepOutCount;
      this.$refs.Map.removeLayer(layerName);
      this.$refs.Map.addPoly(coordinates, layerName, "red", 0.4);
    },
    addKeepOutCircle(lng, lat, rad) {
      let layerName = "Keep Out " + this.keepOutCount;
      this.$refs.Map.removeLayer(layerName);
      let tempCoords = this.$refs.Map.addCircle(
        lng,
        lat,
        rad,
        16,
        layerName,
        "red",
        0.4
      );
      for (let i = 0; i < tempCoords.length; i++) {
        tempCoords[i] = { lng: tempCoords[i][0], lat: tempCoords[i][1] };
      }
      this.keepOutCircleCoords = tempCoords;
    },
    removeKeepInArea() {
      this.clearKeepInLayers();
      this.keepInCount = 0;
      for (let i = 0; i < this.$refs.KeepInCart.CoordinatesArray.length; i++) {
        let area = this.$refs.KeepInCart.CoordinatesArray[i];
        let tempCoordinates = new Array(area.length);
        let temp = [];
        for (let i = 0; i < area.length; i++) {
          temp = new Array(2);
          temp[0] = parseFloat(area[i].lng);
          temp[1] = parseFloat(area[i].lat);
          tempCoordinates[i] = temp;
        }
        this.addKeepInPolygon(tempCoordinates);
        this.keepInCount++;
      }
    },
    removeKeepOutArea() {
      this.clearKeepOutLayers();
      this.keepOutCount = 0;
      for (let i = 0; i < this.$refs.KeepOutCart.CoordinatesArray.length; i++) {
        let area = this.$refs.KeepOutCart.CoordinatesArray[i];
        let tempCoordinates = new Array(area.length);
        let temp = [];
        for (let i = 0; i < area.length; i++) {
          temp = new Array(2);
          temp[0] = parseFloat(area[i].lng);
          temp[1] = parseFloat(area[i].lat);
          tempCoordinates[i] = temp;
        }
        this.addKeepOutPolygon(tempCoordinates);
        this.keepOutCount++;
      }
    },
    clearKeepInLayers() {
      for (let x = 0; x < this.keepInCount; x++) {
        let layerName = "Keep In " + x;
        this.$refs.Map.removeLayer(layerName);
      }
    },
    clearKeepOutLayers() {
      for (let x = 0; x < this.keepOutCount; x++) {
        let layerName = "Keep Out " + x;
        this.$refs.Map.removeLayer(layerName);
      }
    },
  },
};
</script>
