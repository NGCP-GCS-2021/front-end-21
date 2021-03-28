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
            <v-row class="pb-3">
              <VehicleSelect @selected="setVehicle" />
              <!-- setVehicle("MAC") -->
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
                  <v-card class="pa-1" style="width: 100%">
                    <KeepOut :vehicle="vehicle" @addToKeepOut="addToKeepOut" />
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
                        ref="KeepInCart"
                      />
                    </v-col>
                    <v-col cols="6" class="ml-0 pl-3">
                      <KeepOutCart
                        :keepOutEmpty="keepOutEmpty"
                        @setKeepOutEmpty="setKeepOutEmpty"
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
    vehicle: null, //"MAC", "ERU", "MEA"
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
  }),
  methods: {
    setVehicle(vehicle) {
      this.vehicle = vehicle;
      if (vehicle != null) {
        this.getCurrentGeofence(vehicle);
      } else {
        this.keepInEmpty = true;
        this.keepInEmpty = true;
        this.$refs.KeepInCart.CoordinatesArray = [];
        this.$refs.KeepOutCart.CoordinatesArray = [];
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
        if (area.Keep_in == true) {
          this.$refs.KeepInCart.CoordinatesArray.push(area);
        } else if (area.Keep_in == false) {
          this.$refs.KeepOutCart.CoordinatesArray.push(area);
        }
      }
    },
    addToKeepIn(coordinates, lng, lat, rad) {
      this.$refs.KeepInCart.CoordinatesArray.push(coordinates);
      let circleInputs = { lng: lng, lat: lat, rad: rad };
      console.log(circleInputs);
      this.$refs.KeepInCart.CircleInputsArray.push(circleInputs);
      this.submitDisabled = false;
      this.deleteDisabled = false;
      this.keepInEmpty = false;
      this.keepInCount++;
    },
    addToKeepOut(coordinates) {
      this.$refs.KeepOutCart.CoordinatesArray.push(coordinates);
      this.submitDisabled = false;
      this.deleteDisabled = false;
      this.keepOutEmpty = false;
      this.keepOutCount++;
    },
    deleteAll() {
      this.dialog = false;
      this.$refs.KeepInCart.CoordinatesArray = [];
      this.$refs.KeepOutCart.CoordinatesArray = [];
      this.deleteDisabled = true;
      this.submitDisabled = true;
      this.keepInEmpty = true;
      this.keepOutEmpty = true;
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
      for (let i = 0; i < keepOutAreas.length; i++) {
        let keepOutArea = keepOutAreas[i];
        for (let j = 0; j < keepOutArea.length; j++) {
          keepOutArea[j].lat = parseFloat(keepOutArea[j].lat);
          keepOutArea[j].lng = parseFloat(keepOutArea[j].lng);
        }
        this.Geofence.Geofence.push({
          Coordinates: keepOutArea,
          Keep_in: false,
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
      this.$refs.Map.removeLayer(layerName);
      this.$refs.Map.addPoly(coordinates, layerName, "green", 0.8);
    },
    addKeepInCircle(lng, lat, rad) {
      let layerName = "Keep In " + this.keepInCount;
      this.$refs.Map.removeLayer(layerName);
      this.keepInCircleCoords = this.$refs.Map.addCircle(
        lng,
        lat,
        rad,
        16,
        layerName,
        "black",
        0.8
      );
    },
  },
};
</script>
