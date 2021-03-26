<template>
  <div>
    <!-- <p v-gamepad:left-analog-left.repeat="left"></p>
    <div v-gamepad:button-a.repeat="pressed"></div> -->
  </div>
</template>

<script>
export default {
  data: () => ({}),
  methods: {
    buttonPressed(b) {
      if (typeof b == "object") {
        return b.pressed;
      }
      return b == 1.0;
    },
    gameLoop() {
      var gamepads = navigator.getGamepads
        ? navigator.getGamepads()
        : navigator.webkitGetGamepads
        ? navigator.webkitGetGamepads
        : [];
      if (!gamepads) {
        return;
      }

      var gp = gamepads[0];
      if (this.buttonPressed(gp.buttons[0])) {
        console.log("A");
      } else if (this.buttonPressed(gp.buttons[2])) {
        console.log("X");
      } else if (this.buttonPressed(gp.buttons[1])) {
        console.log("B");
      } else if (this.buttonPressed(gp.buttons[3])) {
        console.log("Y");
      }
      return window.requestAnimationFrame(this.gameLoop);
    },
  },

  mounted() {
    const el = this;
    var start;

    //Gamepad Connected
    // window.addEventListener("gamepadisconnected", function (e) {
    //   var gp = navigator.getGamepads()[e.gamepad.index];
    //   console.log(
    //     "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    //     gp.index,
    //     gp.id,
    //     gp.buttons.length,
    //     gp.axes.length
    //   );
    start = el.gameLoop(window);
    // });

    //Gamepad Disconnected
    window.addEventListener("gamepaddisconnected", function (e) {
      var gp = navigator.getGamepads()[e.gamepad.index];
      console.log("Gamepad disconnected from index %d: %s", gp.index, gp.id);
      el.cancelAnimationFrame(start); //Check this one, might be this/window or just cancel
    });
  },
};
</script>