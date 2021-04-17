<template>
  <div>
    <h1 class="font-weight-light text-center">Select an Input:</h1>
    <h5 class="font-weight-light text-center">
      To connect a controller, press any button.
    </h5>
    <v-card-actions class="justify-center">
      <v-btn-toggle v-model="inputSelect">
        <v-btn
          value="keyboard"
          :disabled="!buttonsActivated"
          @click="selectedKeyboard"
        >
          <h1 class="font-weight-light">Keyboard</h1>
          <v-icon color="purple">mdi-keyboard-outline</v-icon>
        </v-btn>
        <v-btn
          value="controller"
          :disabled="controllerDisabled || !buttonsActivated"
          @click="selectedController"
        >
          <h1 class="font-weight-light">Controller</h1>
          <v-icon color="blue">mdi-controller-classic-outline</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-card-actions>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["buttonsActivated"],
  data: () => ({
    controllerDisabled: true,
    keyboardSelected: false,
    controllerSelected: false,
  }),
  methods: {
    selectedKeyboard() {
      this.keyboardSelected = !this.keyboardSelected;
      this.controllerSelected = false;

      if (this.keyboardSelected) {
        this.postManualListener(1);
        this.$emit("inputSelected", "keyboard");
      } else {
        this.postManualListener(0);
        this.$emit("inputSelected", null);
      }
    },
    selectedController() {
      this.controllerSelected = !this.controllerSelected;
      this.keyboardSelected = false;
      if (this.controllerSelected) {
        this.postManualListener(2);
        this.$emit("inputSelected", "controller");
      } else {
        this.postManualListener(0);
        this.$emit("inputSelected", null);
      }
    },
    postManualListener(input) {
      let manualListener;
      if (input == 0) {
        manualListener = JSON.stringify({
          Manual_listener: parseFloat(input),
          Manual_control: false,
        });
      } else if (input == 1 || input == 2) {
        manualListener = JSON.stringify({
          Manual_listener: parseFloat(input),
          Manual_control: true,
        });
      }
      const path = "http://127.0.0.1:5000/ERU_INPUT";
      axios
        .post(path, manualListener)
        .then(() => {
          console.log("Posted Manual Control/Listener to ERU_INPUT");
          console.log(manualListener);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
  beforeDestroy() {
    let manualListener = JSON.stringify({
      Manual_listener: 0,
      Manual_control: false,
    });
    const path = "http://127.0.0.1:5000/ERU_INPUT";
    axios
      .post(path, manualListener)
      .then(() => {
        console.log("Posted Manual Control/Listener to ERU_INPUT");
        console.log(manualListener);
      })
      .catch((error) => {
        console.log(error.response);
      });
  },

  mounted() {
    const el = this;

    var gamepadAPI = {
      controller: {},
      turbo: false,
      connect: function (evt) {
        gamepadAPI.controller = evt.gamepad;
        el.controllerDisabled = false;
        console.log("Gamepad connected.");
      },
      disconnect: function (evt) {
        el.controllerDisabled = true;
        delete gamepadAPI.controller;
        console.log("Gamepad disconnected.");
      },
    };

    //Gamepad Connected
    window.addEventListener("gamepadconnected", gamepadAPI.connect);

    //Gamepad Disconnected
    window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);
  },
};
</script>