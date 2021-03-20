<template>
  <div class="keyboardContainer">
    <div class="simple-keyboard-main"></div>

    <div class="controlArrows">
      <div class="simple-keyboard-control"></div>
      <div class="simple-keyboard-arrows"></div>
    </div>

    <!---<div class="numPad">
      <div class="simple-keyboard-numpad"></div>
      <div class="simple-keyboard-numpadEnd"></div>
    </div>--->
  </div>
</template>

<script>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);
//import "./Keyboard.css"
export default {
  name: "SimpleKeyboard",
  props: {
    input: String
  },
  data: () => ({
    keyboard: null,
    keyboardControlPad: null,
    keyboardArrows: null,
    //keyboardNumPad: null,
    //keyboardNumPadEnd: null
  }),
  mounted() {
    let commonKeyboardOptions = {
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      theme: "simple-keyboard hg-theme-default hg-layout-default",
      physicalKeyboardHighlight: true,
      syncInstanceInputs: true,
      mergeDisplay: true,
      debug: true
    };
    this.keyboard = new Keyboard(".simple-keyboard-main", {
      ...commonKeyboardOptions,
      /**
       * Layout by:
       * Sterling Butters (https://github.com/SterlingButters)
       */
      layout: {
        default: [
          "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
          "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
          "{tab} q w e r t y u i o p [ ] \\",
          "{capslock} a s d f g h j k l ; ' {enter}",
          "{shiftleft} z x c v b n m , . / {shiftright}",
          "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
        ],
        shift: [
          "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
          "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
          "{tab} Q W E R T Y U I O P { } |",
          '{capslock} A S D F G H J K L : " {enter}',
          "{shiftleft} Z X C V B N M < > ? {shiftright}",
          "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
        ]
      },
      display: {
        "{escape}": "esc ⎋",
        "{tab}": "tab ⇥",
        "{backspace}": "backspace ⌫",
        "{enter}": "enter ↵",
        "{capslock}": "caps lock ⇪",
        "{shiftleft}": "shift ⇧",
        "{shiftright}": "shift ⇧",
        "{controlleft}": "ctrl ⌃",
        "{controlright}": "ctrl ⌃",
        "{altleft}": "alt ⌥",
        "{altright}": "alt ⌥",
        "{metaleft}": "cmd ⌘",
        "{metaright}": "cmd ⌘"
      }
    });
    this.keyboardControlPad = new Keyboard(".simple-keyboard-control", {
      ...commonKeyboardOptions,
      layout: {
        default: [
          "{prtscr} {scrolllock} {pause}",
          "{insert} {home} {pageup}",
          "{delete} {end} {pagedown}"
        ]
      }
    });
    this.keyboardArrows = new Keyboard(".simple-keyboard-arrows", {
      ...commonKeyboardOptions,
      layout: {
        default: ["{arrowup}", "{arrowleft} {arrowdown} {arrowright}"]
      }
    });
    /*this.keyboardNumPad = new Keyboard(".simple-keyboard-numpad", {
      ...commonKeyboardOptions,
      layout: {
        default: [
          "{numlock} {numpaddivide} {numpadmultiply}",
          "{numpad7} {numpad8} {numpad9}",
          "{numpad4} {numpad5} {numpad6}",
          "{numpad1} {numpad2} {numpad3}",
          "{numpad0} {numpaddecimal}"
        ]
      }
    });
    this.keyboardNumPadEnd = new Keyboard(".simple-keyboard-numpadEnd", {
      ...commonKeyboardOptions,
      layout: {
        default: ["{numpadsubtract}", "{numpadadd}", "{numpadenter}"]
      }
    });*/
  },
  methods: {
    onChange(input) {
      this.$emit("onChange", input);
    },
    onKeyPress(button) {
      this.$emit("onKeyPress", button);
      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (
          button === "{shift}" ||
          button === "{shiftleft}" ||
          button === "{shiftright}" ||
          button === "{capslock}"
      )
        this.handleShift();
    },
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName;
      let shiftToggle = currentLayout === "default" ? "shift" : "default";
      this.keyboard.setOptions({
        layoutName: shiftToggle
      });
    }
  },
  watch: {
    input(input) {
      this.keyboard.setInput(input);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
    width: 0%;
    height: 0px;
    padding: 20px;
    font-size: 20px;
    border: none;
    box-sizing: border-box;
}

.keyboardContainer {
    display: flex;
    background-color:#e6e6e6;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    border-radius: 5px;
}

.simple-keyboard.hg-theme-default {
    display: inline-block;
}

.simple-keyboard-main.simple-keyboard {
    width: 640px;
    min-width: 640px;
    background-color: transparent;
}

.simple-keyboard-main.simple-keyboard .hg-row:first-child {
    margin-bottom: 10px;
}

.simple-keyboard-arrows.simple-keyboard {
    align-self: flex-end;
    background-color: transparent;
}

.simple-keyboard .hg-button.selectedButton {
    background-color: rgba(5, 25, 70, 0.53);
    color: white;
}

.simple-keyboard .hg-button.emptySpace {
    pointer-events: none;
    background-color: transparent;
    border: none;
    box-shadow: none;
}

.simple-keyboard-arrows .hg-row {
    justify-content: center;
}

.simple-keyboard-arrows .hg-button {
    width: 50px;
    flex-grow: 0;
    justify-content: center;
    display: flex;
    align-items: center;
}

.controlArrows {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-flow: column;
}

.simple-keyboard-control.simple-keyboard {
    background-color: transparent;
}

.simple-keyboard-control.simple-keyboard .hg-row:first-child {
    margin-bottom: 10px;
}

.simple-keyboard-control .hg-button {
    width: 50px;
    flex-grow: 0;
    justify-content: center;
    display: flex;
    align-items: center;
}

.numPad {
    display: flex;
    align-items: flex-end;
}

.simple-keyboard-numpad.simple-keyboard {
    background-color: transparent;
}

.simple-keyboard-numpad.simple-keyboard {
    width: 160px;
}

.simple-keyboard-numpad.simple-keyboard .hg-button {
    width: 50px;
    justify-content: center;
    display: flex;
    align-items: center;
}

.simple-keyboard-numpadEnd.simple-keyboard {
    width: 50px;
    background: transparent;
    margin: 0;
    padding: 5px 5px 5px 0;
}

.simple-keyboard-numpadEnd.simple-keyboard .hg-button {
    align-items: center;
    justify-content: center;
    display: flex;
}

.simple-keyboard-numpadEnd .hg-button.hg-standardBtn.hg-button-plus {
    height: 85px;
}

.simple-keyboard-numpadEnd.simple-keyboard .hg-button.hg-button-enter {
    height: 85px;
}

.simple-keyboard.hg-theme-default .hg-button.hg-selectedButton {
    background: rgba(5, 25, 70, 0.53);
    color: white;
}

.hg-button.hg-functionBtn.hg-button-space {
    width: 350px;
}
</style>
