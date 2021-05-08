<template>
  <div>
    <v-row justify="center">
      <h2 class="font-weight-light pr-2">Vehicle Mission Stage:</h2>
      <h2 class="font-weight-regular pb-2">
        {{ current_stage.stage }}
      </h2>
    </v-row>
    <div
      style="
        display: grid;
        grid-template-columns: auto auto auto auto;
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
    <div
      style="
        display: grid;
        grid-template-columns: auto auto auto auto;
        grid-gap: 5px;
        padding-bottom: 15px;
      "
    >
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      eru_data: [],
      eru_position: [],
      eru_messages: [],
      current_stage: {
        stage: "No stage",
        id: -1,
      },
      tempstuff: "temp",
      stages: [
        {
          stage: "Ready to Start",
          id: 1,
        },
        {
          stage: "ERU Landing Sequence",
          id: 5,
        },
        {
          stage: "Drive to Hiker",
          id: 6,
        },
        {
          stage: "Load the Hiker",
          id: 7,
        },
        {
          stage: "Go to EZ",
          id: 8,
        },
        {
          stage: "Transferring Hiker",
          id: 9,
        },
        {
          stage: "Return to Home/Travel to Position",
          id: 10,
        },
      ],
    };
  },

  methods: {
    getERUData() {
      const path = "http://127.0.0.1:5000/ERU_XBEE";
      axios
        .get(path)
        .then((res) => {
          var dataArray = res.data.ERU;

          let altitude = dataArray[0];
          let latitude = dataArray[4];
          let longitude = dataArray[5];


          let removedAlt = dataArray.splice(0, 1);
          let removedLatLong = dataArray.splice(3, 2);
          let removedTime = dataArray.splice(12, 1);

          dataArray.push(altitude, latitude, longitude);
          this.eru_data = dataArray;
          this.setCurrentStage();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setCurrentStage() {
      for (let i = 0; i < this.eru_data.length; i++) {
        let pair = this.eru_data[i];
        if (pair.title == "Current Stage") {
          this.current_stage.id = pair.value + 1;
          for (let k = 0; k < this.stages.length; k++) {
            if (this.current_stage.id == this.stages[k].id) {
              this.current_stage.stage = this.stages[k].stage;
              i = this.eru_data.length; //ends loop
              k = this.stages.length; //ends loop
            }
          }
        }
        if (pair.title == "Battery") {
          this.eru_data[i].value =
            Math.round((pair.value * 100 + Number.EPSILON) * 100) / 100 + "%";
        }
      }
    },
  },
  mounted() {
    this.getERUData();
  },
  updated() {
    this.getERUData();
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