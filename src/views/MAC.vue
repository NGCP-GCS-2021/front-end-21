<template>
  <div class="mea">
    <v-container fill-height fluid flex class="pa-2 mt-3 d-flex">
      <v-row align="auto">
        <v-col :cols="6" class="d-flex">
          <v-card>
            <v-img height="900px" src="../assets/map.png"></v-img>
            <!---Needs to be replaced by map component--->
          </v-card>
        </v-col>
        <v-col :cols="6">
          <v-container fluid flex>
            <v-row class="pb-3">
              <GeneralStage
                :stage="stage"
                :vehicle="vehicle"
                :updatedStage="updatedStage"
                :updatedVehicle="updatedVehicle"
              />
            </v-row>
            <v-row>
              <v-card class="pa-1" style="width: 100%">
                <v-container fluid flex>
                  <MACStatus />
                </v-container>
              </v-card>
            </v-row>
            <v-container
              class="mt-5 pt-5 scrollable"
              style="height: 515px; overflow-y: hidden"
            >
              <v-row class="d-flex" align="auto">
                <v-col cols="6" class="ml-0 pl-3">
                  <v-card class="pa-1" style="width: 100%; height: 260px">
                    <MACSearchArea />
                  </v-card>
                </v-col>
                <v-col cols="6" class="d-flex">
                  <v-card class="pa-1" style="width: 100%">
                    <ERUDrop />
                  </v-card>
                </v-col>
              </v-row>
              <v-row align="auto">
                <v-col class="d-flex">
                  <v-card class="pa-1" style="width: 100%">
                    <MACControl @setGeneralStage="setGeneralStage" />
                  </v-card>
                </v-col>
                <v-col class="d-flex">
                  <v-card class="pa-1">
                    <MACHome />
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
import MACStatus from "@/components/MAC/MACStatus.vue";
import MACControl from "@/components/MAC/MACControl.vue";
import GeneralStage from "@/components/GeneralStage.vue";
import MACHome from "@/components/MAC/MACHome.vue";
import EvacuationZone from "@/components/EvacuationZone.vue";
import ERUDrop from "@/components/MAC/ERUDrop.vue";
import MACSearchArea from "@/components/MAC/MACSearchArea.vue";

export default {
  name: "",
  props: ["vehicle", "stage"],
  components: {
    MACStatus,
    MACControl,
    GeneralStage,
    MACHome,
    EvacuationZone,
    ERUDrop,
    MACSearchArea,
  },

  data: () => ({
    updatedStage: null,
    updatedVehicle: null,
  }),
  methods: {
    setGeneralStage(stage, vehicle) {
      this.$emit("setGeneralStage", stage, vehicle);
      this.updatedStage = stage;
      this.updatedVehicle = vehicle;
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