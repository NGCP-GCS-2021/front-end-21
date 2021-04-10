<template>
  <div>
    <v-container>
      <div class="controller" style="justify-content: center">
        <!-- <img
          src="../../../../assets/lt.png"
          style="width: 50px; height: 50px; top: 100px; left: 100px"
        /> -->
        <!-- <img src="../../../../assets/rt.png" /> -->
        <svg style="width: 100%; height: 100%">
          <circle
            :cx="joystick_pos"
            cy="123"
            r="16"
            stroke="black"
            stroke-width="3"
            fill="black"
          />
          <circle
            cx="551"
            cy="155"
            r="15"
            stroke="black"
            stroke-width="3"
            :opacity="a_pressed ? '0.5' : '0'"
            fill="black"
          />
          <circle
            cx="586"
            cy="124"
            r="15"
            stroke="black"
            stroke-width="3"
            :opacity="b_pressed ? '0.5' : '0.0'"
            fill="black"
          />
          <!-- <rect width="23" height="23" x="357px" y="187px" /> -->
          <rect width="23" height="23" x="334px" y="189px" />
          <rect width="23" height="23" x="380px" y="189px"/>
          <rect width="23" height="23" x="357px" y="166px" fill="black" :opacity="dpad_up ? '0.5' : '1'" />
          <rect width="23" height="23" x="357px" y="212px" fill="black" :opacity="dpad_down ? '0.5' : '1'"/>
        </svg>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    x_axis: 0,
    a_pressed: false,
    b_pressed: false,
    right_trigger: 0,
    left_trigger: 0,
    dpad_up: false,
    dpad_down: false,
    joystick_pos: 309,
    image: "../../../../assets/xbox.png",
  }),
  methods: {
    getControllerState() {
      var gamepads = navigator.getGamepads();
      let gamepad = gamepads[0];
      //console.log(gamepad);

      this.x_axis = gamepad.axes[0];
      this.a_pressed = gamepad.buttons[0].pressed;
      this.b_pressed = gamepad.buttons[1].pressed;
      this.right_trigger = gamepad.buttons[7].value;
      this.left_trigger = gamepad.buttons[6].value;
      this.dpad_up = gamepad.buttons[12].pressed;
      this.dpad_down = gamepad.buttons[13].pressed;

      this.moveJoystickIcon(gamepad.axes[0]);
    },
    moveJoystickIcon(axis) {
      if (this.joystick_pos) {
        if (axis > 0.1) {
          this.joystick_pos = Math.min(axis * 10 + this.joystick_pos, 319);
        } else if (axis < -0.1) {
          this.joystick_pos = Math.max(axis * 10 + this.joystick_pos, 299);
        } else {
          this.joystick_pos = 309;
        }
      }
    },
  },

  mounted() {
    //console.log(navigator.getGamepads()[0]);
    this.interval = setInterval(() => this.getControllerState(), 50);
  },
  beforeDestroy() {
    this.clearInterval();
  },
};
</script>

<style scoped>
.controller {
  align-content: center;
  height: 350px;
  width: 875px;
  /* background-color: aqua; */
  background-image: url("../../../../assets/xbox.png");
  background-position: center;
}
</style>