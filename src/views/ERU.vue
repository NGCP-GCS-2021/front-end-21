<template>
  <div class="mea">
    <v-container fill-height fluid flex class="pa-2 mt-3 d-flex" >
      <v-row align="auto">
        <Map cols="col col-6" />
        <v-col :cols="6">
          <v-container fluid flex>
            <v-row class="pb-3">
              <GeneralStage />
            </v-row>
            <v-row>
              <v-card class="pa-1" style="width: 100%;">
                <v-container fluid flex>
                  <ERUStatus/>
                </v-container>
              </v-card>
            </v-row>
            <v-row class="pt-0" align="auto"> 
              <v-col cols="6" class="ml-0 pl-3">
                <v-card class="pa-1" style="width: 100%;" >
                  <EvacuationZone />
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="pa-1"  >
                  <ERUHome />
                </v-card>
              </v-col>
            </v-row>
            <v-row class="mt-3" align="auto">
              <v-col class="d-flex">
                <v-card class="pa-1" style="width: 100%;" >
                  <ERUControl />
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

import ERUStatus from '@/components/ERU/ERUStatus.vue'
import ERUControl from '@/components/ERU/ERUControl.vue'
import GeneralStage from '@/components/GeneralStage.vue'
import ERUHome from '@/components/ERU/ERUHome.vue'
import EvacuationZone from '@/components/EvacuationZone.vue'
import Map from '@/components/Map.vue'

export default {
  name: '',

  components: {
    ERUStatus,
    ERUControl,
    GeneralStage,
    ERUHome,
    EvacuationZone,
    Map
  },

  data: () => ({
    //
  }),
};
</script>

<style>
.scrollable:hover, .scrollable:active, .scrollable:focus {
  overflow-y: auto !important;
}
</style>
