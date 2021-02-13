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
<!--      <div v-for="(mac_data, index) in mac_data" :key="index">-->
<!--        <h1>{{mac_data.title}}: {{mac_data.value}}</h1>-->
<!--      </div>-->
<!--        <v-row justify="space-around">-->
<!--            <h4 class="font-weight-light pr-3"></h4>Speed: <h4 class="font-weight-bold pr-3" >80 </h4>-->
<!--            <h4 class="font-weight-light pr-3"></h4>Longitude: <h4 class="font-weight-bold pr-3">89345 </h4>-->
<!--            <h4 class="font-weight-light pr-3"></h4>Latitude: <h4 class="font-weight-bold pr-3">45893450 </h4>-->
<!--            <h4 class="font-weight-light pr-3 pb-2"></h4>Altitude: <h4 class="font-weight-bold pr-3 pb-2">7384 </h4>-->
<!--        </v-row>-->
<!--        <v-row justify="space-around">-->
<!--            <h4 class="font-weight-light pr-3"></h4>In Geofence: <h4 class="font-weight-bold pr-3" >True </h4>-->
<!--            <h4 class="font-weight-light pr-3"></h4>Connection: <h4 class="font-weight-bold pr-3">5</h4>-->
<!--            <h4 class="font-weight-light pr-3"></h4>Ready: <h4 class="font-weight-bold pr-3">True </h4>-->
<!--            <h4 class="font-weight-light pr-3 pb-3"></h4>Battery: <h4 class="font-weight-bold pr-3 pb-3">88</h4>-->
<!--        </v-row>-->
<!--        <v-row justify="left">-->
<!--            <h3 class="font-weight-bold">Messages:</h3>-->
<!--        </v-row>-->
        <v-row fluid justify="center">
            <v-col :cols="12">
                <div class="scrollable" style="border: 1px solid #BFBFBF; font-size: small; border-radius: 5px; height: 65px; overflow-y:hidden;">
                  <div v-for="(mac_msg, index) in mac_msg" :key="index">
                    <p class="my-0 py-0 px-1"> {{ mac_msg.message }}</p>
                  </div>
                  <div v-for="(mac_messages, index) in mac_messages" :key="index">
                    <p class="my-0 py-0 px-1"> {{ mac_messages.message }}</p>
                  </div>
                </div>
            </v-col>
        </v-row>
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
      mac_msg: [],
      mac_messages: []
    }
  },
  mounted() {
    fetch('http://localhost:3000/mac_data')
        .then(res => res.json())
        .then(data => this.mac_data = data)
        .catch(err => console.log(err.message))

    fetch('http://localhost:3000/mac_msg')
        .then(res => res.json())
        .then(data => this.mac_msg = data)
    fetch('http://localhost:3000/mac_messages')
        .then(res => res.json())
        .then(data => this.mac_messages = data)
        .catch(err => console.log(err.message))
  },
  }
  methods: {
    getMACData() {
      const path = "http://127.0.0.1:5000/MAC";
      axios
        .get(path)
        .then((res) => {
          //console.log(res.data);
          //console.log("hello there");
          this.mac_data = res.data.MAC;
        })
        .catch((error) => {
          console.error(error);
        });
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

