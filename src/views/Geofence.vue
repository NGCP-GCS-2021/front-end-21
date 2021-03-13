<template>
  <div class="mea">
    <v-container fill-height fluid flex class="pa-2 mt-3 d-flex">
      <v-row align="auto">
        <v-col :cols="6">
          <v-card>
            <v-img src="../assets/map.png" style="height: 870px"></v-img>
            <!---Needs to be replaced by map component--->
          </v-card>
        </v-col>
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
                    <KeepIn :vehicle="vehicle" @addToKeepIn="addToKeepIn" />
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
                        :vehicle="vehicle"
                        :keepInEmpty="keepInEmpty"
                        ref="KeepInCart"
                      />
                    </v-col>
                    <v-col cols="6" class="ml-0 pl-3">
                      <KeepOutCart
                        :vehicle="vehicle"
                        :keepOutEmpty="keepOutEmpty"
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
import KeepIn from "@/components/Geofence/KeepIn.vue";
import KeepInCart from "@/components/Geofence/KeepInCart.vue";
import KeepOut from "@/components/Geofence/KeepOut.vue";
import KeepOutCart from "@/components/Geofence/KeepOutCart.vue";
import axios from "axios";

export default {
  name: "",

  components: {
    VehicleSelect,
    KeepIn,
    KeepInCart,
    KeepOut,
    KeepOutCart,
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
  }),
  methods: {
    setVehicle(vehicle) {
      this.vehicle = vehicle;
      if (vehicle != null) {
        this.getCurrentGeofence(vehicle);
      } else {
        this.keepInEmpty = true;
        this.keepInEmpty = true;
        this.$refs.KeepInCart.CoordinatesArray = []
        this.$refs.KeepOutCart.CoordinatesArray = []
      }
    },
    getCurrentGeofence(vehicle) {
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
    addToKeepIn(coordinates) {
      this.$refs.KeepInCart.CoordinatesArray.push(coordinates);
      this.submitDisabled = false;
      this.deleteDisabled = false;
      this.keepInEmpty = false;
    },
    addToKeepOut(coordinates) {
      this.$refs.KeepOutCart.CoordinatesArray.push(coordinates);
      this.submitDisabled = false;
      this.deleteDisabled = false;
      this.keepOutEmpty = false;
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
      for (let i = 0; i < keepInAreas.length; i++) {
        let keepInArea = keepInAreas[i];
        for (let j = 0; j < keepInArea.length; j++) {
          keepInArea[j].lat = parseFloat(keepInArea[j].lat);
          keepInArea[j].lng = parseFloat(keepInArea[j].lng);
        }
        this.Geofence.Geofence.push({
          Coordinates: keepInArea,
          Keep_in: true,
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
  },
};
</script>
