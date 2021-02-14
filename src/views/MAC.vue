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
                  <MACStatus/>
                </v-container>
              </v-card>
            </v-row>
            <v-container class="mt-5 pt-5 scrollable" style="height: 515px; overflow-y: hidden; ">
            <v-row class="d-flex" align="auto"> 
              <v-col cols="6" class="ml-0 pl-3">
                <v-card class="pa-1" style="width: 100%;" >
                  <MACSearchArea />
                </v-card>
              </v-col>
              <v-col cols="6" class="d-flex">
                <v-card class="pa-1" style="width: 100%;" >
                  <ERUDrop />
                </v-card>
              </v-col>
            </v-row>
            <v-row align="auto">
              <v-col class="d-flex">
                <v-card class="pa-1" style="width: 100%;" >
                  <MACControl />
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

import MACStatus from '@/components/MAC/MACStatus.vue'
import MACControl from '@/components/MAC/MACControl.vue'
import GeneralStage from '@/components/GeneralStage.vue'
import MACHome from '@/components/MAC/MACHome.vue'
import EvacuationZone from '@/components/EvacuationZone.vue'
import ERUDrop from '@/components/MAC/ERUDrop.vue'
import MACSearchArea from '@/components/MAC/MACSearchArea.vue'
import Map from '@/components/Map.vue'

export default {
  name: '',

  components: {
    MACStatus,
    MACControl,
    GeneralStage,
    MACHome,
    EvacuationZone,
    ERUDrop,
    MACSearchArea,
    Map
  },

  data(){
    return {
      mac_data: []
    }
  },
  // mounted() {
  //   fetch('http://localhost:3000/mac_data')
  //     .then(res => res.json())
  //     .then(data => this.mac_data = data)
  //     .catch(err => console.log(err.message))
  // }
};
</script>

<style>
.scrollable:hover, .scrollable:active, .scrollable:focus {
  overflow-y: auto !important;
}

</style>
