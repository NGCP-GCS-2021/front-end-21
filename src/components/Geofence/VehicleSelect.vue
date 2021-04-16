<template>
  <v-card class="pa-2" width="100%">
    <h1 class="font-weight-light text-center">Select a Vehicle:</h1>
    <v-card-actions class="justify-center">
      <v-btn-toggle v-model="vehicleSelect">
        <v-btn value="MAC" @click="selectMAC">
          <h1 class="font-weight-light">MAC</h1>
          <v-icon color="green">mdi-airplane</v-icon>
        </v-btn>
        <v-btn value="ERU" @click="selectERU">
          <h1 class="font-weight-light">ERU</h1>
          <v-icon color="orange">mdi-car</v-icon>
        </v-btn>
        <v-btn value="MEA" @click="selectMEA">
          <h1 class="font-weight-light">MEA</h1>
          <v-icon color="purple">mdi-quadcopter</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    MACselected: true,
    ERUselected: false,
    MEAselected: false,
    vehicleSelect: 0,
  }),
  mounted() {
    this.selectMAC();
  },
  methods: {
    selectMAC() {
      this.MACselected = !this.MACselected;
      this.ERUselected = false;
      this.MEAselected = false;
      if (this.MACselected) {
        this.$emit("selected", "MAC");
      } else {
        this.$emit("selected", null);
      }
    },
    selectERU() {
      this.ERUselected = !this.ERUselected;
      this.MACselected = false;
      this.MEAselected = false;
      if (this.ERUselected) {
        this.$emit("selected", "ERU");
      } else {
        this.$emit("selected", null);
      }
    },
    selectMEA() {
      this.MEAselected = !this.MEAselected;
      this.MACselected = false;
      this.ERUselected = false;
      if (this.MEAselected) {
        this.$emit("selected", "MEA");
      } else {
        this.$emit("selected", null);
      }
    },
  },
};
</script>
