<template>
  <div class="mea">
    <v-container fill-height fluid flex class="pa-2 mt-3 d-flex">
      <v-row align="auto">
        <Map
          cols="col col-6"
          center_lat="33.932116"
          center_long="-117.630109"
          zoom="9"
          SW_bound_lat="33.93154919990249"
          SW_bound_long="-117.63616828159178"
          NE_bound_lat="33.93569086311143"
          NE_bound_long="-117.6263621141112"
          ref="Map"
        />
        <template v-if="!manualControlView">
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
                    <!-- <ERUStatus /> -->
                  </v-container>
                </v-card>
              </v-row>
              <v-row class="pt-0" align="auto">
                <v-col cols="6" class="ml-0 pl-3">
                  <v-card class="pa-1" style="width: 100%">
                    <EvacuationZone />
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card class="pa-1">
                    <ERUHome />
                  </v-card>
                </v-col>
              </v-row>
              <v-row class="pt-0" align="auto">
                <v-col cols="6">
                  <v-card class="pa-1" style="width: 100%">
                    <ERUControl @setGeneralStage="setGeneralStage" />
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card class="pa-1" style="width: 100%; height: 100%">
                    <ManualControl @goToManual="setManualControlView" />
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </template>
        <template v-if="manualControlView">
          <v-col :cols="6" style="padding: 1.5%">
            <v-row>
              <v-card width="100%">
                <v-container fluid-flex>
                  <v-row>
                    <v-col col="1">
                      <BackButton
                        @back="setManualControlView"
                        @deactivate="setButtonsActivated"
                        @inputSelected="setInput"
                      />
                    </v-col>
                    <v-col cols="8">
                      <InputToggle
                        :buttonsActivated="buttonsActivated"
                        @inputSelected="setInput"
                      />
                    </v-col>
                    <v-col>
                      <PowerButton @activate="setButtonsActivated" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col col="6">
                      <MaxSpeed />
                    </v-col>
                    <v-col v-if="input === 'keyboard'" col="6">
                      <KeyboardBars />
                    </v-col>
                    <v-col v-if="input === 'controller'" col="6">
                      <ControllerBars />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-row>
            <v-row v-if="input === 'controller'" style="padding-top: 1%">
              <v-card width="100%" height="500px">
                <v-container fluid-flex>
                  <Controller />
                </v-container>
              </v-card>
            </v-row>
            <v-row v-if="input === 'keyboard'" style="padding-top: 1%">
              <v-card width="100%">
                <v-container fluid-flex>
                  <SimpleKeyboard
                    @onChange="onChange"
                    @onKeyPress="onKeyPress"
                    :input="input"
                  />
                </v-container>
              </v-card>
              <v-card width="100%">
                <v-container fluid-flex>
                  <h1 class="font-weight-light">Controls:</h1>
                  <v-row style="padding-top: 1%">
                    <v-col cols="6">
                      <img
                        src="../assets/KeysLegendWASD.png"
                        style="width: 100%"
                      />
                    </v-col>
                    <v-col cols="6">
                      <img
                        src="../assets/KeysLegendArrows.png"
                        style="width: 100%"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-row>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ERUStatus from "@/components/ERU/ERUStatus.vue";
import ERUControl from "@/components/ERU/ERUControl.vue";
import GeneralStage from "@/components/GeneralStage.vue";
import ERUHome from "@/components/ERU/ERUHome.vue";
import EvacuationZone from "@/components/EvacuationZone.vue";
import ManualControl from "@/components/ERU/ManualControl.vue";
import PowerButton from "@/components/ERU/ManualControl/PowerButton.vue";
import InputToggle from "@/components/ERU/ManualControl/InputToggle.vue";
import BackButton from "@/components/ERU/ManualControl/BackButton.vue";
import MaxSpeed from "@/components/ERU/ManualControl/MaxSpeed.vue";
import SimpleKeyboard from "@/components/ERU/ManualControl/Keyboard/SimpleKeyboard";
import Controller from "@/components/ERU/ManualControl/Controller/Controller.vue";
import ControllerBars from "@/components/ERU/ManualControl/Controller/ControllerBars.vue";

import KeyboardBars from "@/components/ERU/ManualControl/Keyboard/KeyboardBars";
import Map from "@/components/Map.vue";

export default {
  name: "",
  props: ["stage", "vehicle"],
  components: {
    ERUStatus,
    ERUControl,
    GeneralStage,
    ERUHome,
    EvacuationZone,
    ManualControl,
    PowerButton,
    InputToggle,
    BackButton,
    MaxSpeed,
    SimpleKeyboard,
    Map,
    KeyboardBars,
    Controller,
    ControllerBars,
  },
  data: () => ({
    updatedStage: null,
    updatedVehicle: null,
    manualControlView: false,
    input: null,
    buttonsActivated: false,
    current_lng: -117,
    current_lat: 34,
    eru_data: null,
  }),
  mounted() {
    //this.getERUData();
    this.interval = setInterval(() => this.setMapPosition(), 5000);
  },
  updated() {
    //this.getERUData();
  },
  methods: {
    getERUData() {
      const path = "http://127.0.0.1:5000/ERU_XBEE";
      axios
        .get(path)
        .then((res) => {
          this.eru_data = res.data.ERU;
          this.setMapPosition();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setMapPosition() {
      // for (let i = 0; i < this.eru_data.length; i++) {
      //   if (this.eru_data.title == "Latitude") {
      //     this.current_lat = this.eru_data.value;
      //   } else if (this.eru_data.title == "Longitude") {
      //     this.current_lng == this.eru_data.value;
      //   }
      // }
      let coord =[-117.6311926970484, 33.93459532438122];
      let pointExists = this.$refs.Map.editPointSource("eru", coord);
      console.log(pointExists);
      if (pointExists) {
      } else {
        console.log("we are jere");
        this.$refs.Map.addCoord(
          "eru",
          "eru",
          this.current_lng,
          this.current_lat
        );
      }
    },
    setGeneralStage(stage, vehicle) {
      this.$emit("setGeneralStage", stage, vehicle);
      this.updatedStage = stage;
      this.updatedVehicle = vehicle;
    },
    setManualControlView(value) {
      this.manualControlView = value;
    },
    setInput(input) {
      this.input = input;
      console.log(this.input);
    },
    setButtonsActivated(value) {
      this.buttonsActivated = value;
    },
    // controllerConnected() {
    //   this.controllerConnected = true;
    // }
  },
};
</script>

<style>
.scrollable:hover,
.scrollable:active,
.scrollable:focus {
  overflow-y: auto !important;
}
</style
