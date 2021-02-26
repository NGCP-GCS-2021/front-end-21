<template>
  <div>
    <v-row justify="center">
      <h2 class="font-weight-light pr-2">Vehicle Mission State:</h2>
      <h2 class="font-weight-regular pb-2">Standby</h2>
    </v-row>
    <div
      style="
        display: grid;
        grid-template-columns: auto auto auto auto auto;
        grid-gap: 5px;
        padding-bottom: 15px;
      "
    >
      <div v-for="(eru_data, index) in eru_data" :key="index">
        <div style="display: flex; padding-right: 3px">
          <h4 class="font-weight-regular pr-1">{{ eru_data.title }}:</h4>
          <h4 class="font-weight-bold" style="float: right">
            {{ eru_data.value }}
          </h4>
        </div>
      </div>
    </div>

    <v-row justify="left">
      <h3 class="font-weight-bold">Messages:</h3>
    </v-row>
    <v-row fluid justify="center">
      <v-col :cols="12">
        <div class="scrollable" style="border: 1px solid #bfbfbf; font-size: small; border-radius: 5px; height: 65px; overflow-y: hidden;"
        >
          <div v-for="(eru_messages, index) in eru_messages" :key="index">
            <p class="my-0 py-0 px-1">{{ eru_messages.message }}</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  //either props or in data MOST LIKELY DATA
  data() {
    return {
      eru_data: [],
      eru_messages: [],
      //mission_status
      //battery
    };
  },
  methods: {
    getMEAData() {
      const path = "http://127.0.0.1:5000/MEA";
      axios
        .get(path)
        .then((res) => {
          //console.log(res.data);
          //console.log("hello there");
          this.mea_data = res.data.MEA;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getMEAData();
  },
  updated() {
    this.getMEAData();
  },
  //formatted() {},
};
</script>

<style>
.scrollable:hover,
.scrollable:active,
.scrollable:focus {
  overflow-y: auto !important;
}
</style>
<script>
import axios from 'axios';

export default {
  data: () => ({
        eru_data: [ 
            {
            value: 41.0,
            title: "Altitude"
            },
            {
            value: 0.0,
            title: "Battery"
            },
            {
            value: 0,
            title: "Current State"
            },
            {
            value: false,
            title: "Geofence Compliant"
            },
            {
            value: 0.0,
            title: "Latitude"
            },
            {
            value: 0.0,
            title: "Longitude" 
            },
            {
            value: false,
            title: "Sensors Ok"
            },
            {
            value: 0.0,
            title: "Speed"
            },
            {
            value: false,
            title: "State Completed"
            },
            {
            value: 0,
            title: "Status"
            }
        ],
        eru_messages: [
          {
            message: 'connected'
          },
          {
            message: 'vehicle updated'
          },
          {
            message: 'status updated'
          },
          {
            message: 'coordinates sent'
          },
          {
            message: 're-connected'
          },
          {
            message: 're-connected'
          },
        ]
    }),
  methods: {
    getERUStatus() {
      const path = 'http://localhost:5000/eru';
      axios.get(path)
        .then((res) => {
          this.eru = res.data.eru;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
  },
  created() {
    this.ERUStatus();
  },
};
</script>