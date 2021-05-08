<template>
  <div>
    <h1 class="font-weight-light">Stage Command</h1>
    <v-form ref="form" v-model="valid" lazy-validation class="pa-5">
      <v-select
        v-model="currentStage"
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

      <!-- <v-btn @click="clear"> Clear </v-btn> -->
      <!-- <v-dialog v-model="dialog" max-width="425">
        <v-card>
          <v-card-title class="headline">
            <v-icon large color="red" class="pr-3">mdi-alert</v-icon>
            <h5
              class="font-weight-light text-center red--text"
              justify="center"
            >
              Undo Mission Stage Submission?
            </h5>
          </v-card-title>
          <v-card-text justify="center">
            Warning: Vehicle will be commanded to begin previous stage.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="secondary" text @click="dialog = false">
              Cancel
            </v-btn>

            <v-btn color="primary" text @click="dialog = false"> Undo </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
    </v-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    menu: false,
    //All stage id's are: (Integer Indication + 1)
    currentStage: {
      stage: null,
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
    currentData: null,
  }),
  mounted() {
    this.getCurrentStage();
  },

  methods: {
    getCurrentStage() {
      const path = "http://127.0.0.1:5000/MAC_XBEE";

      axios
        .get(path)
        .then((res) => {
          this.currentData = res.data.MAC;
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
        const path = "http://127.0.0.1:5000/MAC_INPUT";
        const currentStageStringify = JSON.stringify({
          Perform_stage: this.currentStage.id - 1,
        });
        axios
          .post(path, currentStageStringify)
          .then(() => {
            console.log("Posted stage to MAC_INPUT");
            this.$emit("setGeneralStage", this.currentStage.stage, "MAC");
          })
          .catch((error) => {
            console.log(error.response);
          });
      }
    },
  },
};
</script>