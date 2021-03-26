<template>
  <v-container>
    <v-row>
      <h1 class="font-weight-light">Manual Control</h1>
    </v-row>
    <v-row align="center" width="100%" justify="center">
      <v-card-actions class="justify-center">
        <v-container>
          <v-btn
            x-large
            dark
            color="primary"
            justify="center"
            @click="goToManual"
            >GO TO MANUAL CONTROL<v-icon x-large
              >mdi-gamepad-square</v-icon
            ></v-btn
          >
        </v-container>
      </v-card-actions>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({}),
  methods: {
    goToManual() {
      this.$emit("goToManual", true);
      //console.log(true);
    },
  },
};
</script>