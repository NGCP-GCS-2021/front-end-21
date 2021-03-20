<template>
  <div>
    <h1 class="font-weight-light text-center">Select an Input:</h1>
    <v-card-actions class="justify-center">
      <v-btn-toggle v-model="inputSelect">
        <v-btn
          value="keyboard"
          :color="inputSelect == 'keyboard' ? 'primary' : ''"
          :disabled="buttonsActivated"
          @click="selectKeyboard"
        >
          <h1 class="font-weight-light">Keyboard</h1>
          <v-icon color="purple">mdi-keyboard-outline</v-icon>
        </v-btn>
        <v-btn
          value="controller"
          :color="inputSelect == 'controller' ? 'primary' : ''"
          :disabled="controllerDisabled || buttonsActivated"
          @click="selectController"
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
  props: ["keyboardSelected", "controllerDisabled", "buttonsActivated"],
  data: () => ({
    inputSelect: 0,
  }),
  methods: {
    selectedKeyboard() {
      this.$emit("inputSelected", "keyboard");
    },
    selectedController() {
      this.$emit("inputSelected", "controller");
    }
  }
};
</script>