<template>
  <div class="home">
    <v-container fill-height fluid class="pa-2 mt-1">
      <v-row align="auto">
        <v-col :cols="8" class="d-flex">
          <v-card>
            <v-img height="100%" src="../assets/map.png"></v-img>
            <!---Needs to be replaced by map component--->
          </v-card>
        </v-col>
        <v-col :cols="4">
          <v-row class="px-2" >
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
          <v-row class="px-5 pb-1">
            <h4>Data Updated {{ }} ago</h4>
          </v-row>
            <v-container>
              <v-row class="pa-2 mb-3" >
                <GeneralStage />
              </v-row>
              <div class="scrollable" style=" height: 800px !important; overflow-y: hidden; overflow-x: hidden;">
              <v-row class="pa-2" >
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
                        <MACMainControl />
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
                        <ERUMainControl />
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
                        <MEAMainControl />
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