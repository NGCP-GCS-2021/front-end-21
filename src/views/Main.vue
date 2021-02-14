<template>
  <div class="home">
    <v-container fill-height fluid class="pa-2 mt-1">
      <v-row align="auto">
        <Map cols="col col-8" center_lat="33.932116" center_long="-117.630109" zoom="9"
           SW_bound_lat="33.93154919990249" SW_bound_long="-117.63616828159178"
           NE_bound_lat="33.93569086311143" NE_bound_long="-117.6263621141112" />
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
                      <v-icon large color="orange"
                        >mdi-car-lifted-pickup</v-icon
                      >
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
import Map from '@/components/Map.vue'

export default {
  data () {
      return {
        value: 0,
        query: false,
        show: true,
        interval: 0,
      }
    },

    mounted () {
      this.queryAndIndeterminate()
    },

    beforeDestroy () {
      clearInterval(this.interval)
    },

    methods: {
      queryAndIndeterminate () {
        this.query = true
        this.show = true
        this.value = 0
      },
    },
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
    Map
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
.scrollable:hover, .scrollable:active, .scrollable:focus {
    overflow-y: auto !important;
}
</style>
