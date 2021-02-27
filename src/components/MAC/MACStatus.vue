<template>
  <div>
    <v-row justify="center">
      <h2 class="font-weight-light pr-2">Vehicle Mission Stage:</h2>
      <h2 class="font-weight-regular pb-2">ERU Drop</h2>
    </v-row>
    <div
      style="
        display: grid;
        grid-template-columns: auto auto auto auto auto;
        grid-gap: 5px;
        padding-bottom: 15px;
      "
    >
      <div v-for="(mac_data, index) in mac_data" :key="index">
        <div style="display: flex; padding-right: 3px">
          <h4 class="font-weight-regular pr-1">{{ mac_data.title }}:</h4>
          <h4 class="font-weight-bold" style="float: right">
            {{ mac_data.value }}
          </h4>
        </div>
      </div>
    </div>
    <v-row justify="left">
      <h3 class="font-weight-bold">Messages:</h3>
    </v-row>
    <v-row fluid justify="center">
      <v-col :cols="12">
        <div
          class="scrollable"
          style="
            border: 1px solid #bfbfbf;
            font-size: small;
            border-radius: 5px;
            height: 65px;
            overflow-y: hidden;
          "
        >
          <div v-for="(mac_messages, index) in mac_messages" :key="index">
            <p class="my-0 py-0 px-1">{{ mac_messages.message }}</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      mac_data: [],
      mac_messages: [],
    };
  },
  methods: {
    getMACData() {
      const path = "http://127.0.0.1:5000/MAC";
      axios
        .get(path)
        .then((res) => {
          this.mac_data = res.data.MAC;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getMACData();
  },
  updated() {
    this.getMACData();
  },
  
};
</script>

<style>
.scrollable:hover,
.scrollable:active,
.scrollable:focus {
  overflow-y: auto !important;
}
</style>

