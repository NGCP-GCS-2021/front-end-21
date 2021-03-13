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
      <!-- <v-btn @click="clear"> Clear </v-btn> -->
      <v-dialog v-model="dialog" max-width="425">
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
      </v-dialog>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    menu: false,
    // stages: [
    //   "Standby",
    //   "Minimum Altitude Climb",
    //   "Search For Hiker",
    //   "ERU Drop",
    //   "Return Home",
    // ],
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
        stage: "Takeoff to Minimum Altitude",
        id: 2,
      },
      {
        stage: "Drive to Hiker",
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
  }),
  methods: {
    postCurrentStage() {
      const path = "http://127.0.0.1:5000/MAC_INPUT";
      this.currentStage.Perform_stage = this.select.id - 1;
      const currentStageStringify = JSON.stringify(this.currentStage);
      axios
        .post(path, currentStageStringify)
        .then(() => {
          console.log("Posted stage to MAC_INPUT");
          console.log(currentStageStringify);
          this.$emit("setGeneralStage", this.select.stage, "MAC");
        })
        .catch((error) => {
          console.log(error.response);

        });
    },
  },
};
</script>