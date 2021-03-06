<template>
  <div class="mea">
    <v-container fill-height fluid flex class="pa-2 mt-3 d-flex">
      <v-row align="auto">
        <v-col :cols="6" class="d-flex">
          <v-card>
            <v-img src="../assets/map.png" style="height: 950px;"></v-img>
            <!---Needs to be replaced by map component--->
          </v-card>
        </v-col>
        <v-col :cols="6">
          <v-container fluid flex>
            <v-row class="pb-3">
              <GeofenceVehicleSelect @selected="setVehicle"/>
            </v-row>
            <v-row class="d-flex" align="auto" v-if="vehicle">
              <v-col cols="6" class="ml-0 pl-3">
                <v-card class="pa-1" style="width: 100%">
                  <GeofenceKeepIn :vehicle="vehicle"/>
                </v-card>
              </v-col>
              <v-col cols="6" class="d-flex">
                <v-card class="pa-1" style="width: 100%">
                  <GeofenceKeepOut :vehicle="vehicle"/>
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
import GeofenceVehicleSelect from "@/components/Geofence/GeofenceVehicleSelect.vue";
import GeofenceKeepIn from "@/components/Geofence/GeofenceKeepIn.vue";
import GeofenceKeepOut from "@/components/Geofence/GeofenceKeepOut.vue";

export default {
  name: "",

  components: {
    GeofenceVehicleSelect,
    GeofenceKeepIn,
    GeofenceKeepOut,
  },

  data: () => ({
    vehicle: null,
  }),
  methods: {
    setVehicle(vehicle) {
      this.vehicle = vehicle;
    }
  }
};
</script>
