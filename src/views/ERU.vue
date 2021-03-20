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
        <template v-if="!manualControlView">
          <v-col :cols="6">
            <v-container fluid flex>
              <v-row class="pb-3">
                <!-- <GeneralStage
                  :stage="stage"
                  :vehicle="vehicle"
                  :updatedStage="updatedStage"
                  :updatedVehicle="updatedVehicle"
                /> -->
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
          <v-col :cols="6">
            <v-row>
              <v-card width="100%">
                <v-container fluid-flex>
                  <v-row>
                    <v-col col="1">
                      <BackButton
                        @back="setManualControlView"
                        @deactivate="setButtonsActivated"
                      />
                    </v-col>
                    <v-col>
                      <InputToggle
                        :keyboardSelected="keyboardSelected"
                        :buttonsActivated="buttonsActivated"
                        :controllerSelected="controllerSelected"
                        @inputSelected="setInput"
                      />
                    </v-col>
                    <v-col>
                      <CheckController />
                    </v-col>
                    <v-col>
                      <PowerButton @activate="setButtonsActivated" />
                    </v-col>
                  </v-row>
                  <MaxSpeed />
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
import CheckController from "@/components/ERU/ManualControl/CheckController.vue";

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
    CheckController,
  },
  data: () => ({
    updatedStage: null,
    updatedVehicle: null,
    manualControlView: false,
    keyboardSelected: true,
    controllerSelected: false,
    input: null,
    buttonsActivated: false,
  }),
  methods: {
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