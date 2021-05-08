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
          @mapMounted="mapMounted"
          ref="Map"
        />
        <template v-if="!manualControlView">
          <v-col :cols="6">
            <v-container fluid flex>
              <v-row class="pb-3 px-5">
                <GeneralStage
                  :stage="stage"
                  :vehicle="vehicle"
                  :updatedStage="updatedStage"
                  :updatedVehicle="updatedVehicle"
                />
              </v-row>
              <v-row class="px-5">
                <v-card class="pa-1" style="width: 100%">
                  <v-container fluid flex>
                    <ERUStatus />
                  </v-container>
                </v-card>
              </v-row>
              <v-row class="pt-0 px-3" align="auto">
                <v-col cols="6" class="ml-0 pl-3">
                  <v-card class="pa-1" style="width: 100%">
                    <EvacuationZone
                      @editEvac="editEvac"
                      :evacPointExists="evacPointExists"
                      @addEvac="addEvac"
                      ref="EvacuationZone"
                    />
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card class="pa-1">
                    <ERUHome
                      @editERUHome="editERUHome"
                      @addERUHome="addERUHome"
                      :pointExists="pointExists"
                      ref="ERUHome"
                    />
                  </v-card>
                </v-col>
              </v-row>
              <v-row class="pt-0 px-3" align="auto">
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
                    <v-col col="1" style="flex-grow: 0.5">
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
              <v-card width="100%">
                <v-container fluid-flex>
                  <h1 class="font-weight-light">Controls:</h1>
                  <div style="padding-top: 1%">
                    <v-row>
                      <v-col>
                        <h1 class="font-weight-regular">
                          Left Trigger: Move backwards
                        </h1>
                        <h1 class="font-weight-regular">
                          "A" button: Squeeze scooper
                        </h1>
                        <h1 class="font-weight-regular">
                          Joystick (left side): Move left and right
                        </h1>
                      </v-col>
                      <v-col>
                        <h1 class="font-weight-regular">
                          Right Trigger: Move forward
                        </h1>
                        <h1 class="font-weight-regular">
                          "B" button: Release scooper
                        </h1>
                        <h1 class="font-weight-regular">
                          D-Pad: Lower (down) and raise (up) scooper
                        </h1>
                      </v-col>
                    </v-row>
                  </div>
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
            </v-row>
            <v-row v-if="input === 'keyboard'" style="padding-top: 1%">
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
import axios from "axios";

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
    buttonsActivated: true,
    firstGetERU: true,
    eru_data: null,
    current_lng: -117.6316988,
    current_lat: 33.9336,
    current_yaw: 42,
    firstGetHiker: true,
    hiker_data: null,
    hiker_lng: -117.6318437,
    hiker_lat: 33.933729,
    pointExists: false,
    evacPointExists: false,
    counter: 0,
  }),
  // mounted() {
  //   // setTimeout(this.getCurrentData, 5000);
  // },
  // updated() {
  //   // this.counter += 1
  //   if (!this.firstGetERU && !this.firstGetHiker) {
  //     // this.counter += 1;
  //     this.getCurrentData();
  //   }
  // },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    mapMounted() {
      this.getCurrentData();
      this.$refs.EvacuationZone.getCurrentEvac();
      this.$refs.ERUHome.getCurrentTravelTo();
      this.interval = setInterval(() => this.updateERULoop(), 500);
    },
    updateERULoop() {
      if (!this.firstGetERU && !this.firstGetHiker) {
        this.getCurrentData();
      }
    },
    getCurrentData() {
      //ERU information
      let path = "http://127.0.0.1:5000/ERU_XBEE";
      axios
        .get(path)
        .then((res) => {
          this.eru_data = res.data.ERU;
          this.setERUPosition();
        })
        .catch((error) => {
          console.error(error);
        });

      //Hiker Information
      path = "http://127.0.0.1:5000/Hiker";
      axios
        .get(path)
        .then((res) => {
          this.hiker_data = res.data.Hiker;
          this.setHikerPosition();
        })
        .catch((error) => {
          console.error(error);
        });
    },

    setERUPosition() {
      for (let i = 0; i < this.eru_data.length; i++) {
        if (this.eru_data[i].title == "Latitude") {
          this.current_lat = this.eru_data[i].value;
        } else if (this.eru_data[i].title == "Longitude") {
          this.current_lng = this.eru_data[i].value;
        } else if (this.eru_data[i].title == "Yaw") {
          this.current_yaw = this.eru_data[i].value;
        }
      }

      let coord = [this.current_lng, this.current_lat]; //array for editPointSource
      let pointExists = this.$refs.Map.editPointSource("eru", coord);
      if (pointExists) {
        // console.log("edited ERU point");
      } else {
        // console.log("added ERU point");
        this.$refs.Map.addCoord(
          "eru",
          "eru",
          this.current_lng,
          this.current_lat
        );
      }
      this.$refs.Map.setRotation("eru", this.current_yaw);
      this.firstGetERU = false;
      let booltest = !this.firstGetERU && !this.firstGetHiker;
      // console.log("booltest: " + booltest);
    },
    setHikerPosition() {
      for (let i = 0; i < this.hiker_data.length; i++) {
        if (this.hiker_data[i].title == "Hiker_lat") {
          this.hiker_lat = this.hiker_data[i].value;
        } else if (this.hiker_data[i].title == "Hiker_lng") {
          this.hiker_lng = this.hiker_data[i].value;
        }
      }

      let coord = [this.hiker_lng, this.hiker_lat]; //array for editPointSource
      let pointExists = this.$refs.Map.editPointSource("hiker", coord);
      if (pointExists) {
        // console.log("edited Hiker point");
      } else {
        // console.log("added Hiker point");
        this.$refs.Map.addCoord(
          "hiker",
          "hiker",
          this.hiker_lng,
          this.hiker_lat
        );
      }
      this.firstGetHiker = false;
      // console.log("firstGetHiker: " + this.firstGetHiker);
      let booltest = !this.firstGetERU && !this.firstGetHiker;
      // console.log("booltest: " + booltest);
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
    editERUHome(coord) {
      this.pointExists = this.$refs.Map.editPointSource("eru_home", coord);
    },
    addERUHome(lng, lat) {
      this.$refs.Map.addCoord("eru_home", "home", lng, lat);
    },
    editEvac(coord) {
      this.evacPointExists = this.$refs.Map.editPointSource("evac_zone", coord);
    },
    addEvac(lng, lat) {
      this.$refs.Map.addCoord("evac_zone", "evac-point", lng, lat);
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
</style