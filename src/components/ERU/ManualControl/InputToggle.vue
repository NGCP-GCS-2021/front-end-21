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
    const InputToggle = this;

    //Gamepad Connected
    window.addEventListener("gamepadconnected", function (e) {
      var gp = navigator.getGamepads()[e.gamepad.index];
      console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        gp.index,
        gp.id,
        gp.buttons.length,
        gp.axes.length
      );
      InputToggle.controllerDisabled = false;
    });

    //Gamepad Disconnected
    window.addEventListener("gamepaddisconnected", function (e) {
      var gp = navigator.getGamepads()[e.gamepad.index];
      console.log("Gamepad disconnected from index %d: %s", gp.index, gp.id);
      InputToggle.controllerDisabled = true;
    });
  },
};
</script>