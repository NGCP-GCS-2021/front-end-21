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
            <v-row >
              <v-col :cols="12">
                <v-progress-linear 
                  color="green"
                  class="px-1"
                  v-model="value"
                  :active="show"
                  :indeterminate="query"
                  :query="true"
                  >
                </v-progress-linear>
              </v-col>
            </v-row>
            <v-row class="px-3 pb-1">
                <h4>Data Updated {{ }} ago</h4>
            </v-row>
          </v-container>
          <v-container fluid flex>
            <v-row class="pb-3">
              <GeneralStage />
            </v-row>
            <v-row>
              <v-card class="pa-1" style="width: 100%">
                <v-container fluid flex>
                  <MEAStatus />
                </v-container>
              </v-card>
            </v-row>
            <v-row class="pt-0" align="auto">
              <v-col cols="6" class="ml-0 pl-3">
                <v-card class="pa-1" style="width: 100%">
                  <EvacuationZone />
                </v-card>
              </v-col>
              <v-col cols="6" class="ml-0 pl-3">
                <v-card class="pa-1" style="width: 100%">
                  <MEAHome />
                </v-card>
              </v-col>
            </v-row>
            <v-row class="mt-3" align="auto">
              <v-col class="d-flex">
                <v-card class="pa-1" style="width: 100%">
                  <MEAControl />
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
import MEAStatus from "@/components/MEA/MEAStatus.vue";
import MEAControl from "@/components/MEA/MEAControl.vue";
import GeneralStage from "@/components/GeneralStage.vue";
import MEAHome from "@/components/MEA/MEAHome.vue";
import EvacuationZone from "@/components/EvacuationZone.vue";

export default {
  data () {
      return {
        value: 0,
        query: false,
        show: true,
        interval: 0,
      }
  },

  /*mounted () {
    this.queryAndIndeterminate()
  },*/

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

  components: {
    MEAStatus,
    MEAControl,
    GeneralStage,
    MEAHome,
    EvacuationZone,
  },
};
</script>
