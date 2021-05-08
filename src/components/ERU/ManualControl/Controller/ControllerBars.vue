<template>
  <div>
    <v-row style="padding-top: 2%">
      <v-col cols="1">
        <h1 class="font-weight-light text-center">X</h1>
      </v-col>
      <v-col cols="5" style="padding-right: 0px">
        <v-progress-linear
          v-model="left_power"
          color="primary"
          height="50"
          reverse
        >
        </v-progress-linear>
      </v-col>
      <v-col cols="5" style="padding-left: 0px">
        <v-progress-linear v-model="right_power" color="primary" height="50">
        </v-progress-linear>
      </v-col>
    </v-row>
    <v-row style="padding-top: 2%">
      <v-col cols="1">
        <h1 class="font-weight-light text-center">Y</h1>
      </v-col>
      <v-col cols="5" style="padding-right: 0px">
        <v-progress-linear
          v-model="left_trigger_power"
          background-color="grey"
          color="light-green"
          height="50"
          reverse
        >
        </v-progress-linear>
      </v-col>
      <v-col cols="5" style="padding-left: 0px">
        <v-progress-linear
          v-model="right_trigger_power"
          background-color="grey"
          color="green"
          height="50"
        >
        </v-progress-linear>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data: () => ({
    left_trigger_power: 0,
    right_trigger_power: 0,
    left_power: 0,
    right_power: 0,
  }),
  methods: {
    getControllerState() {
      var gamepads = navigator.getGamepads();
      let gamepad = gamepads[0];

      let x_axis = gamepad.axes[0];

      if (x_axis > 0.1) {
        this.right_power = x_axis * 100;
        this.left_power = 0;
      } else if (x_axis < -0.1) {
        this.left_power = x_axis * -100;
        this.right_power = 0;
      } else {
        this.right_power = 0;
        this.left_power = 0;
      }

      let right_trigger = gamepad.buttons[7].value;
      this.right_trigger_power = right_trigger * 100;

      let left_trigger = gamepad.buttons[6].value;
      this.left_trigger_power = left_trigger * 100;
    },
  },
  mounted() {
    this.interval = setInterval(() => this.getControllerState(), 50);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>