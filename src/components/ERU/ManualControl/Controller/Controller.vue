<template>
  <div>
    <h1>X-axis: {{ x_axis }}</h1>
    <h1>A pressed: {{ a_pressed }}</h1>
    <h1>B pressed: {{ b_pressed }}</h1>
    <h1>Right Trigger: {{ right_trigger }}</h1>
    <h1>Left Trigger: {{ left_trigger }}</h1>
    <h1>D-pad Up: {{ dpad_up }}</h1>
    <h1>D-pad Down: {{ dpad_down }}</h1>
    <svg>
      <circle
        :cx="joystick_pos"
        cy="50"
        r="15"
        stroke="black"
        stroke-width="3"
        fill="black"
      />
    </svg>
    <svg>
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="black"
        stroke-width="3"
        :fill="a_pressed ? 'yellow' : 'black'"
      />
    </svg>
    <svg>
      <rect
        width="50"
        height="100"
        :style="
          dpad_up
            ? 'fill: rgb(0, 0, 255); stroke-width: 3; stroke: rgb(0, 0, 0)'
            : 'fill: rgb(225, 0, 0); stroke-width: 3; stroke: rgb(0, 0, 0)'
        "
      />
    </svg>
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
    joystick_pos: 150,
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
          this.joystick_pos = Math.min(axis * 10 + this.joystick_pos, 160);
        } else if (axis < -0.1) {
          this.joystick_pos = Math.max(axis * 10 + this.joystick_pos, 140);
        } else {
          this.joystick_pos = 150;
        }
      }
    },
  },

  mounted() {
    //console.log(navigator.getGamepads()[0]);
    this.interval = setInterval(() => this.getControllerState(), 50);
  },
};
</script>