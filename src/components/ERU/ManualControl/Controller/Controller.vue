<template>
  <div>
    <v-container>
      <div class="controller" style="justify-content: center">
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
            cx="491"
            cy="195"
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
          <path id="dpad_left"
            d="M150.335 226.113C147.21 222.989 141.997 222.966 140.014 226.914C139.743 227.455 139.491 228.006 139.258 228.566C138.002 231.6 137.355 234.85 137.355 238.134C137.355 241.417 138.002 244.667 139.258 247.701C139.491 248.261 139.743 248.812 140.014 249.353C141.997 253.301 147.21 253.279 150.335 250.154L156.698 243.79C159.823 240.666 159.823 235.601 156.698 232.477L150.335 226.113Z"
            transform="translate(186,-60) scale(1.1)"
          />
          <path id="dpad_up"
            d="M177.669 222.335C180.793 219.21 180.816 213.997 176.868 212.014C176.327 211.743 175.776 211.491 175.215 211.258C172.182 210.002 168.931 209.355 165.648 209.355C162.365 209.355 159.114 210.002 156.081 211.258C155.521 211.491 154.969 211.743 154.429 212.014C150.48 213.997 150.503 219.21 153.627 222.335L159.991 228.698C163.116 231.823 168.181 231.823 171.305 228.698L177.669 222.335Z"
            transform="translate(186,-60) scale(1.1)"
            :opacity="dpad_up ? '0.5' : '1'"
          />
          <path id="dpad_right"
            d="M181.447 249.669C184.571 252.793 189.785 252.816 191.768 248.868C192.039 248.327 192.291 247.776 192.523 247.215C193.78 244.182 194.426 240.931 194.426 237.648C194.426 234.365 193.78 231.114 192.523 228.081C192.291 227.521 192.039 226.969 191.768 226.429C189.785 222.48 184.571 222.503 181.447 225.627L175.083 231.991C171.959 235.116 171.959 240.181 175.083 243.305L181.447 249.669Z"
            transform="translate(186,-60) scale(1.1)"
          />
          <path id="dpad_down"
            d="M154.113 253.447C150.989 256.571 150.966 261.785 154.914 263.767C155.455 264.039 156.006 264.291 156.566 264.523C159.6 265.78 162.85 266.426 166.134 266.426C169.417 266.426 172.667 265.78 175.701 264.523C176.261 264.291 176.812 264.039 177.353 263.767C181.301 261.785 181.279 256.571 178.154 253.447L171.79 247.083C168.666 243.959 163.601 243.959 160.477 247.083L154.113 253.447Z"
            transform="translate(186,-60) scale(1.1)"
            :opacity="dpad_down ? '0.5' : '1'"
          />

          <path id="left_trigger"
            d="M152.5 37C152.5 41.1421 149.142 44.5 145 44.5H132C127.858 44.5 124.5 41.1421 124.5 37V16.5C124.5 8.76801 130.768 2.5 138.5 2.5C146.232 2.5 152.5 8.76801 152.5 16.5V37Z"
            transform="translate(180,0) scale(0.8)"
            :opacity="left_trigger != 0 ? '0.5' : ''"
          />
          <path id="right_trigger"
            d="M152.5 37C152.5 41.1421 149.142 44.5 145 44.5H132C127.858 44.5 124.5 41.1421 124.5 37V16.5C124.5 8.76801 130.768 2.5 138.5 2.5C146.232 2.5 152.5 8.76801 152.5 16.5V37Z"
            transform="translate(455,0) scale(0.8)"
            :opacity="right_trigger != 0 ? '0.5' : ''"
          />
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
    clearInterval(this.interval);
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