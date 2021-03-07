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
              <GeofenceVehicleSelect @selected="setVehicle" />
              <!-- setVehicle("MAC") -->
            </v-row>

            <v-container class="" style="height: 720px" v-if="vehicle">
              <v-row class="d-flex" align="auto">
                <v-col cols="6" class="ml-0 pl-3">
                  <v-card class="pa-1" style="width: 100%; height: 420px">
                    <GeofenceKeepIn
                      :vehicle="vehicle"
                      @addToKeepIn="addToKeepIn"
                    />
                  </v-card>
                  <v-card class="mt-2 pa-1" style="height: 300px">
                    <GeofenceKeepInCart
                      :vehicle="vehicle"
                      ref="GeofenceKeepInCart"
                    />
                  </v-card>
                </v-col>
                <v-col cols="6" class="ml-0 pl-3">
                  <v-card class="pa-1" style="width: 100%">
                    <GeofenceKeepOut
                      :vehicle="vehicle"
                      @addToKeepOut="addToKeepOut"
                    />
                  </v-card>
                  <v-card class="mt-2 pa-1" style="width: 100%">
                    <GeofenceKeepOutCart :vehicle="vehicle" ref="GeofenceKeepOutCart"/>
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
import GeofenceVehicleSelect from "@/components/Geofence/GeofenceVehicleSelect.vue";
import GeofenceKeepIn from "@/components/Geofence/GeofenceKeepIn.vue";
import GeofenceKeepInCart from "@/components/Geofence/GeofenceKeepInCart.vue";
import GeofenceKeepOut from "@/components/Geofence/GeofenceKeepOut.vue";
import GeofenceKeepOutCart from "@/components/Geofence/GeofenceKeepOutCart.vue";

export default {
  name: "",

  components: {
    GeofenceVehicleSelect,
    GeofenceKeepIn,
    GeofenceKeepInCart,
    GeofenceKeepOut,
    GeofenceKeepOutCart,
  },

  data: () => ({
    vehicle: null,

  }),
  methods: {
    setVehicle(vehicle) {
      this.vehicle = vehicle;
    },
    addToKeepIn(coordinates) {
      this.$refs.GeofenceKeepInCart.addCoordinates(coordinates);
    },
    addToKeepOut(coordinates) {
      this.$refs.GeofenceKeepOutCart.addCoordinates(coordinates);
    },
  },
};
</script>
