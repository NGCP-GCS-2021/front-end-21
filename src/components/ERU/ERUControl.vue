<template>
  <div>
    <h1 class="font-weight-light">Stage Command</h1>
    <v-form ref="form" v-model="valid" lazy-validation class="pa-5">
      <v-select
        v-model="select"
        :items="stages"
        :rules="[(v) => !!v || 'Please select stage']"
        label="Select Mission Stage"
        item-text="stage"
        item-value="id"
        return-object
        required
      ></v-select>
      <v-btn color="green" class="mr-5" @click="postCurrentStage">
        Submit
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    dialog: false,
    currentStage: {
      Perform_stage: null,
    },
    //All stage id's are: (Integer Indication + 1)
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
    currentData: null,
  }),
  mounted() {
    this.getCurrentStage();
  },
  methods: {
    getCurrentStage() {
      const path = "http://127.0.0.1:5000/ERU_XBEE";

      axios
        .get(path)
        .then((res) => {
          this.currentData = res.data.ERU;
          this.setCurrentStage();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setCurrentStage() {
      for (let i = 0; i < this.currentData.length; i++) {
        let pair = this.currentData[i];
        if (pair.title == "Current Stage") {
          this.currentStage.id = pair.value + 1;

          for (let k = 0; k < this.stages.length; k++) {
            if (this.currentStage.id == this.stages[k].id) {
              this.currentStage.stage = this.stages[k].stage;
              i = this.currentData.length; //ends loop
              k = this.stages.length; //ends loop
            }
          }
        }
      }
    },
    postCurrentStage() {
      if (this.currentStage.id == -1) {
      } else {
        this.currentStage.Perform_stage = this.select.id - 1;
        const path = "http://127.0.0.1:5000/ERU_INPUT";
        const currentStageStringify = JSON.stringify({
          Perform_stage: this.select.id - 1,
        });
        console.log(currentStageStringify);
        axios
          .post(path, currentStageStringify)
          .then(() => {
            console.log("Posted stage to ERU_INPUT");
            this.$emit("setGeneralStage", this.select.stage, "ERU");
          })
          .catch((error) => {
            console.log(error.response);
          });
      }
    },
  },
};
</script>