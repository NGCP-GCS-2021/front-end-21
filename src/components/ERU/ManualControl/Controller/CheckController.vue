<template>
  <v-card-actions class="justify-center">
    <v-btn
      @click="checkConnected"
      :disabled="isConnected"
      :color="!isConnected ? 'primary' : ''"
      height="50px"
    >
      Detect Controller
    </v-btn>
    <p v-if="isConnected">Contoller Detected!</p>
  </v-card-actions>
</template>

<script>
export default {
  data: () => ({
    isConnected: false,
  }),
  methods: {
    checkConnected() {
      console.log(navigator.getGamepads());
      if (navigator.getGamepads()[0] != null) {
        this.isConnected = true;
        this.$emit("controllerConnected")
      }
    },
  },
};
</script>