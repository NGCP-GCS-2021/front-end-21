<template>
  <v-card class="pa-2" width="100%">
    <h1 class="font-weight-regular text-center display-2">Select a Vehicle:</h1>
    <v-card-actions class="justify-center">
      <v-btn-toggle v-model="vehicleSelect" background-color="primary">
        <v-btn value="MAC" @click="selectMAC"> MAC </v-btn>
        <v-btn value="ERU" @click="selectERU"> ERU </v-btn>
        <v-btn value="MEA" @click="selectMEA"> MEA </v-btn>
      </v-btn-toggle>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    MACselected: false,
    ERUselected: false,
    MEAselected: false,
  }),
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
