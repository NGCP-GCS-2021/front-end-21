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
                    <KeepIn
                      :vehicle="vehicle"
                      @addToKeepIn="addToKeepIn"
                    />
                  </v-card>
                  <v-card class="mt-2 pa-1" style="height: 300px">
                    <KeepInCart
                      :vehicle="vehicle"
                      ref="KeepInCart"
                    />
                  </v-card>
                </v-col>
                <v-col cols="6" class="ml-0 pl-3">
                  <v-card class="pa-1" style="width: 100%">
                    <KeepOut
                      :vehicle="vehicle"
                      @addToKeepOut="addToKeepOut"
                    />
                  </v-card>
                  <v-card class="mt-2 pa-1" style="width: 100%">
                    <KeepOutCart :vehicle="vehicle" ref="KeepOutCart"/>
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
import VehicleSelect from "@/components/Geofence/VehicleSelect.vue";
import KeepIn from "@/components/Geofence/KeepIn.vue";
import KeepInCart from "@/components/Geofence/KeepInCart.vue";
import KeepOut from "@/components/Geofence/KeepOut.vue";
import KeepOutCart from "@/components/Geofence/KeepOutCart.vue";

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
    vehicle: null,

  }),
  methods: {
    setVehicle(vehicle) {
      this.vehicle = vehicle;
    },
    addToKeepIn(coordinates) {
      this.$refs.KeepInCart.addCoordinates(coordinates);
    },
    addToKeepOut(coordinates) {
      this.$refs.KeepOutCart.addCoordinates(coordinates);
    },
  },
};
</script>
