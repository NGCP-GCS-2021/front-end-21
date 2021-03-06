<template>
  <div class="mea">
    <v-container fill-height fluid flex class="pa-2 mt-3 d-flex">
      <v-row align="auto">
        <v-col :cols="6">
          <v-card>
            <v-img src="../assets/map.png" style="height: 825px"></v-img>
            <!---Needs to be replaced by map component--->
          </v-card>
        </v-col>
        <v-col :cols="6">
          <v-container fluid flex>
            <v-row class="pb-3">
              <GeofenceVehicleSelect @selected="setVehicle" />
            </v-row>

            <v-container
              class="mt-2 scrollable"
              style="height: 700px"
              v-if="vehicle"
            >
              <v-row class="d-flex" align="auto">
                <v-col cols="6" class="ml-0 pl-3">
                  <!-- Possible Default to always have n >= 1 cards -->
                  <!-- <v-container>
                    <v-card class="pa-1" style="width: 100%">
                      <GeofenceKeepIn :vehicle="vehicle" />
                    </v-card>
                  </v-container> -->
                  <v-container v-for="(keepIn, k) in keepInArray" :key="k">
                    <v-card class="pa-1" style="width: 100%">
                      <GeofenceKeepIn
                        :vehicle="vehicle"
                        :keepIn="keepIn"
                        @deleteKeepIn="deleteKeepIn"
                      />
                    </v-card>
                  </v-container>
                  <v-col align="center">
                    <GeofenceAddKeepIn @addKeepIn="addKeepIn" />
                  </v-col>
                </v-col>
                <v-col cols="6" class="ml-0 pl-3">
                  <v-container v-for="(keepOut, k) in keepOutArray" :key="k">
                    <v-card class="pa-1" style="width: 100%">
                      <GeofenceKeepOut
                        :vehicle="vehicle"
                        :keepOut="keepOut"
                        @deleteKeepOut="deleteKeepOut"
                      />
                    </v-card>
                  </v-container>
                  <v-col align="center">
                    <GeofenceAddKeepOut @addKeepOut="addKeepOut" />
                  </v-col>
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
import GeofenceVehicleSelect from "@/components/Geofence/GeofenceVehicleSelect.vue";
import GeofenceKeepIn from "@/components/Geofence/GeofenceKeepIn.vue";
import GeofenceKeepOut from "@/components/Geofence/GeofenceKeepOut.vue";
import GeofenceAddKeepIn from "@/components/Geofence/GeofenceAddKeepIn.vue";
import GeofenceAddKeepOut from "@/components/Geofence/GeofenceAddKeepOut.vue";

export default {
  name: "",

  components: {
    GeofenceVehicleSelect,
    GeofenceKeepIn,
    GeofenceKeepOut,
    GeofenceAddKeepIn,
    GeofenceAddKeepOut,
  },

  data: () => ({
    vehicle: null,
    keepInArray: [1],
    keepOutArray: [1],
  }),
  methods: {
    setVehicle(vehicle) {
      if (vehicle != null) {
        this.vehicle = vehicle;
      } else {
        this.resetKeepIn();
        this.resetKeepOut();
      }
    },
    deleteKeepIn(keepIn) {
      //console.log(this.keepInArray);
      const index = this.keepInArray.indexOf(keepIn);
      if (index > -1) {
        this.keepInArray.splice(index, 1);
      }
      //console.log(this.keepInArray);
    },
    deleteKeepOut(keepOut) {
      //console.log(this.keepOutArray);
      const index = this.keepOutArray.indexOf(keepOut);
      if (index > -1) {
        this.keepOutArray.splice(index, 1);
      }
      //console.log(this.keepOutArray);
    },
    addKeepIn() {
      if (this.keepInArray.length > 0) {
        const index = this.keepInArray.length - 1;
        const last = this.keepInArray[index];
        this.keepInArray.push(last + 1);
      } else {
        this.resetKeepIn();
      }
    },
    addKeepOut() {
      if (this.keepOutArray.length > 0) {
        const index = this.keepOutArray.length - 1;
        const last = this.keepOutArray[index];
        this.keepOutArray.push(last + 1);
      } else {
        this.resetKeepOut();
      }
    },
    resetKeepIn() {
      this.keepInArray = [1];
    },
    resetKeepOut() {
      this.keepOutArray = [1];
    }
  },
};
</script>
