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
      <div v-for="(mea_data, index) in mea_data" :key="index">
        <div style="display: flex; padding-right: 3px">
          <h4 class="font-weight-regular pr-1">{{ mea_data.title }}:</h4>
          <h4 class="font-weight-bold" style="float: right">
            {{ mea_data.value }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  //either props or in data MOST LIKELY DATA
  data() {
    return {
      mea_data: [],
      mea_messages: [],
      current_stage: {
        stage: "No stage",
        id: -1,
      },
      //All stage id's are: (Integer Indication + 1)
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
    getMEAData() {
      const path = "http://127.0.0.1:5000/MEA_XBEE";
      axios
        .get(path)
        .then((res) => {
          var dataArray = res.data.MAC;

          let altitude =  dataArray[0]
          let latitude = dataArray[4]
          let longitude = dataArray[5]

          let removedAlt = dataArray.splice(0, 1)
          let removedLatLong = dataArray.splice(3, 2)

          dataArray.push(altitude,latitude, longitude);
          this.mea_data = dataArray;
          this.setCurrentStage();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setCurrentStage() {
      for (let i = 0; i < this.mea_data.length; i++) {
        let pair = this.mea_data[i];
        if (pair.title == "Current_stage") {
          this.current_stage.id = pair.value;

          for (let k = 0; k < this.stages.length; k++) {
            if (this.current_stage.id == this.stages[k].id) {
              this.current_stage.stage = this.stages[k].stage;
              i = this.mea_data.length; //ends loop
              k = this.stages.length; //ends loop
            }
          }
        }
        if (pair.title == "Battery") { 
          this.mea_data[i].value = (Math.round(((pair.value * 100) + Number.EPSILON) * 100) / 100) + "%"
        }
      }
    }
  },
  mounted() {
    this.getMEAData();
  },
  updated() {
    this.getMEAData();
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