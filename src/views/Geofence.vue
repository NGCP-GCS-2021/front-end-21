<template>
  <div class="mea">
    <v-container fill-height fluid flex class="pa-2 mt-3 d-flex">
      <v-row align="auto">
        <v-col :cols="6" class="d-flex">
          <v-card>
            <v-img height="100%" src="../assets/map.png"></v-img>
            <!---Needs to be replaced by map component--->
          </v-card>
        </v-col>
        <v-col :cols="6">
          <v-container fluid flex>
            <v-row class="pb-3">
              <GeofenceVehicleSelect />
            </v-row>
            <v-row>
              <v-card class="pa-1" style="width: 100%">
                <v-container fluid flex>
                  <MACStatus />
                </v-container>
              </v-card>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import GeofenceVehicleSelect from "@/components/Geofence/GeofenceVehicleSelect.vue";
import MACStatus from "@/components/MAC/MACStatus.vue";
import GeneralStage from "@/components/GeneralStage.vue";
export default {
  name: "",

  components: {
    GeofenceVehicleSelect,
    MACStatus,
    GeneralStage,
  },

  data: () => ({
    //
  }),
};
</script>
