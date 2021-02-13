<template>
<div class="home">
  <v-container fill-height fluid class="pa-2 mt-1">
    <v-row align="auto">
      <Map cols="col col-8" center_lat="33.932116" center_long="-117.630109" zoom="9"
           SW_bound_lat="33.93154919990249" SW_bound_long="-117.63616828159178"
           NE_bound_lat="33.93569086311143" NE_bound_long="-117.6263621141112" />
      <v-col :cols="4">
        <v-container>
          <v-row class="pa-2 mb-3" >
            <GeneralStage />
          </v-row>
          <div class="scrollable" style=" height: 740px !important; overflow-y: hidden; overflow-x: hidden;">
            <v-row class="pa-2" >
              <v-card class="pa-2" width="100%">
                <v-container>
                  <v-row justify="center" class="pb-2">
                    <h1 class="font-weight-regular text-center display-2 green--text pr-4">MAC</h1>
                    <v-icon large color="green">mdi-airplane</v-icon>
                  </v-row>
                  <MACStatus />
                  <v-row justify="center">
                    <v-col :cols="5" class="mx-2 px-0">
                      <MACMainControl />
                    </v-col>
                    <v-col :cols="5" class="mx-2 px-0">
                      <Emergency />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-row>
            <v-row class="pa-2">
              <v-card class="pa-2" width="100%">
                <v-container>
                  <v-row fluid flex justify="center" class="pb-2">
                    <h1 class="font-weight-regular text-center display-2 orange--text pr-4">ERU</h1>
                    <v-icon large color="orange">mdi-car-lifted-pickup</v-icon>
                  </v-row>
                  <ERUStatus />
                  <v-row justify="center">
                    <v-col :cols="5" class="mx-2 px-0">
                      <ERUMainControl />
                    </v-col>
                    <v-col :cols="5" class="mx-2 px-0">
                      <Emergency />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-row>
            <v-row class="pa-2">
              <v-card class="pa-2" width="100%">
                <v-container>
                  <v-row justify="center" class="pb-2">
                    <h1 class="font-weight-regular text-center display-2 purple--text pr-4">MEA</h1>
                    <v-icon large color="purple">mdi-quadcopter</v-icon>
                  </v-row>
                  <MEAStatus />
                  <v-row justify="center">
                    <v-col :cols="5" class="mx-2 px-0">
                      <MEAMainControl />
                    </v-col>
                    <v-col :cols="5" class="mx-2 px-0">
                      <Emergency />
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
import Emergency from '@/components/Emergency.vue'
import MACMainControl from '@/components/MAC/MACMainControl.vue'
import ERUMainControl from '@/components/ERU/ERUMainControl.vue'
import MEAMainControl from '@/components/MEA/MEAMainControl.vue'
import MEAStatus from '@/components/MEA/MEAStatus.vue'
import ERUStatus from '@/components/ERU/ERUStatus.vue'
import MACStatus from '@/components/MAC/MACStatus.vue'
import GeneralStage from '@/components/GeneralStage.vue'
import Map from '@/components/Map.vue'

export default {   
    name: '',
    components: {
        Emergency,
        MACMainControl,
        ERUMainControl,
        MEAMainControl,
        MEAStatus,
        ERUStatus,
        MACStatus,
        GeneralStage,
        Map
    }
}
</script>

<style>
.scrollable:hover, .scrollable:active, .scrollable:focus {
    overflow-y: auto !important;
}
</style>
