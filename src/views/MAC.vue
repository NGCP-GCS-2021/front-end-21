<template>
  <div class="mea">
    <v-container fill-height fluid flex class="pa-2 mt-3 d-flex" >
      <v-row align="auto">
        <v-col :cols="6" class="d-flex">
          <v-card>
              <v-img height=100% src="../assets/map.png"></v-img> <!---Needs to be replaced by map component--->
          </v-card>
        </v-col>
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
                  <SearchArea />
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
                  <ControlForm />
                </v-card>
              </v-col>
              <v-col class="d-flex">
                <v-card class="pa-1">
                    <EmergencyCoords />
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-card class="pa-1 ml-3 mr-3" style="width: 100%;">
              <GeofenceForm />
              </v-card>
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
import ControlForm from '@/components/ControlForm.vue'
import GeofenceForm from '@/components/GeofenceForm.vue'
import GeneralStage from '@/components/GeneralStage.vue'
import EmergencyCoords from '@/components/EmergencyCoords.vue'
import EvacuationZone from '@/components/EvacuationZone.vue'
import ERUDrop from '@/components/MAC/ERUDrop.vue'
import SearchArea from '@/components/MAC/SearchArea.vue'

export default {
  name: '',

  components: {
    MACStatus,
    ControlForm,
    GeofenceForm,
    GeneralStage,
    EmergencyCoords,
    EvacuationZone,
    ERUDrop,
    SearchArea
  },

  data(){
    return {
      mac_data: []
    }
  },
  mounted() {
    fetch('http://localhost:3000/mac_data')
      .then(res => res.json())
      .then(data => this.mac_data = data)
      .catch(err => console.log(err.message))
  }
};
</script>

<style>
.scrollable:hover, .scrollable:active, .scrollable:focus {
  overflow-y: auto !important;
}

</style>