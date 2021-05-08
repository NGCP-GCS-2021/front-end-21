<template>
  <div>
    <v-row justify="center">
      <h2 class="font-weight-light pr-2">Vehicle Mission Stage:</h2>
      <h2 class="font-weight-regular pb-2">{{ current_stage.stage }}</h2>
    </v-row>
    <div
      style="
        display: grid;
        grid-template-columns: auto auto auto auto;
        grid-gap: 5px;
        padding-bottom: 15px;
      "
    >
      <div v-for="(mac_data, index) in mac_data" :key="index">
        <div style="display: flex; padding-right: 3px">
          <h4 class="font-weight-regular pr-1">{{ mac_data.title }}:</h4>
          <h4
            :id="mac_data.title"
            class="font-weight-bold"
            style="float: right"
          >
            {{ mac_data.value }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      //battery_color: 'green',
      mac_data: [],
      mac_position: [],
      current_stage: {
        stage: "No stage",
        id: -1,
      },
      stages: [
        {
          stage: "Ready to Start",
          id: 1,
        },
        {
          stage: "Takeoff to Minimum Altitude",
          id: 2,
        },
        {
          stage: "Find the Hiker",
          id: 3,
        },
        {
          stage: "ERU Drop",
          id: 4,
        },
        {
          stage: "Return to Home/Travel to Position",
          id: 10,
        },
      ],
    };
  },
  methods: {
    getMACData() {
      const path = "http://127.0.0.1:5000/MAC_XBEE";
      axios
        .get(path)
        .then((res) => {
          //this.mac_data = res.data.MAC;
          var dataArray = res.data.MAC;

          let altitude = dataArray[0];
          let latitude = dataArray[4];
          let longitude = dataArray[5];

          let removedAlt = dataArray.splice(0, 1);
          let removedLatLong = dataArray.splice(3, 2);
          let removedTime = dataArray.splice(12, 1);

          dataArray.push(altitude, latitude, longitude);
          this.mac_data = dataArray;

          this.setCurrentStage();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setCurrentStage() {
      for (let i = 0; i < this.mac_data.length; i++) {
        let pair = this.mac_data[i];
        if (pair.title == "Current Stage") {
          this.current_stage.id = pair.value + 1;
          console.log(pair);
          for (let k = 0; k < this.stages.length; k++) {
            if (this.current_stage.id == this.stages[k].id) {
              this.current_stage.stage = this.stages[k].stage;
              i = this.mac_data.length; //ends loop
              k = this.stages.length; //ends loop
            }
          }
        }
        if (pair.title == "Battery") {
          this.mac_data[i].value =
            Math.round((pair.value * 100 + Number.EPSILON) * 100) / 100 + "%";
        }
      }
    },
  },
  mounted() {
    this.getMACData();
  },
  updated() {
    // console.log("updated data")
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

