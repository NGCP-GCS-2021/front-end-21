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
          :color="inputSelect == 'keyboard' ? 'primary' : ''"
          :disabled="!buttonsActivated"
          @click="selectedKeyboard"
        >
          <h1 class="font-weight-light">Keyboard</h1>
          <v-icon color="purple">mdi-keyboard-outline</v-icon>
        </v-btn>
        <v-btn
          value="controller"
          :color="inputSelect == 'controller' ? 'primary' : ''"
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
export default {
  props: ["buttonsActivated"],
  data: () => ({
    controllerDisabled: true,
  }),
  methods: {
    selectedKeyboard() {
      this.$emit("inputSelected", "keyboard");
    },
    selectedController() {
      this.$emit("inputSelected", "controller");
    },
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
      update: function () {},
      buttonPressed: function () {
        console.log("good job u did something");
      },
      buttons: [],
      buttonsCache: [],
      buttonsStatus: [],
      axesStatus: [],
    };

    //Gamepad Connected
    window.addEventListener("gamepadconnected", gamepadAPI.connect);

    //Gamepad Disconnected
    window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);
  },
};
</script>