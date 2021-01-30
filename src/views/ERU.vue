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
                  <Status/>
                </v-container>
              </v-card>
            </v-row>
            <v-container class="mt-5 pt-5 scrollable" style="height: 515px; overflow-y: hidden;">
            <v-row class="px-3 pt-0" justify="center" align="auto">
              <v-col cols="3" class="mx-5">
                <v-btn dark color="secondary">Video Feed<v-icon>mdi-video</v-icon></v-btn>
              </v-col>
              <v-col cols="3" class="mx-5">
                <ManualControl />
              </v-col>
            </v-row>
            <v-row align="auto">
              <v-col class="d-flex">
                <v-card class="pa-1" style="width: 100%;" >
                  <ControlForm />
                </v-card>
              </v-col>
              <v-col>
                <v-card class="pa-1">
                    <GeofenceForm />
                </v-card>
              </v-col>
            </v-row>
            <v-row class="pt-0" align="auto"> 
              <v-col cols="6" class="ml-0 pl-3">
                <v-card class="pa-1" style="width: 100%;" >
                  <EvacuationZone />
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="pa-1" style="width: 100%;"  >
                  <EmergencyCoords />
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

import Status from '@/components/Status.vue'
import ControlForm from '@/components/ControlForm.vue'
import GeofenceForm from '@/components/GeofenceForm.vue'
import GeneralStage from '@/components/GeneralStage.vue'
import EmergencyCoords from '@/components/EmergencyCoords.vue'
import EvacuationZone from '@/components/EvacuationZone.vue'
import ManualControl from '@/components/ManualControl.vue'

export default {
  name: '',

  components: {
    Status,
    ControlForm,
    GeofenceForm,
    GeneralStage,
    EmergencyCoords,
    EvacuationZone,
    ManualControl
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