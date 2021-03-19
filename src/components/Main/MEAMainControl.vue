<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" offset-x>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          width="100%"
          x-large
          dark
          color="primary"
          v-bind="attrs"
          v-on="on"
          class="mx-2"
          >STAGE SELECTION<v-icon x-large>mdi-select-marker</v-icon></v-btn
        >
      </template>

      <v-card>
        <v-select
          class="pa-4"
          v-model="select"
          :items="stages"
          :rules="[(v) => !!v || 'Please select stage']"
          label="Select Mission Stage"
          item-text="stage"
          item-value="id"
          return-object
          required
        ></v-select>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="secondary" text @click="menu = false"> Cancel </v-btn>
          <v-btn color="primary" text @click="postCurrentStage"> Submit </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    menu: false,
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
  }),
  methods: {
    postCurrentStage() {
      this.menu = false;
      const path = "http://127.0.0.1:5000/MEA_INPUT";
      this.currentStage.Perform_stage = this.select.id - 1;
      const currentStageStringify = JSON.stringify(this.currentStage);
      axios
        .post(path, currentStageStringify)
        .then(() => {
          console.log("Posted stage to MEA_INPUT");
          this.$emit("setGeneralStage", this.select.stage, "MEA");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>