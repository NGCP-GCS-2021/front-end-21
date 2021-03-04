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
          >VEHICLE CONTROL<v-icon x-large>mdi-gamepad-square</v-icon></v-btn
        >
      </template>

      <v-card>
        <v-select
          class="pa-4"
          v-model="select"
          :items="stages"
          :rules="[(v) => !!v || 'Please select stage']"
          label="Stage"
          item-text="stage"
          item-value="id"
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
  }),
  methods: {
    postCurrentStage() {
      console.log("hello there");
      this.menu = false;
      const path = "http://127.0.0.1:5000/ERU_INPUT";
      this.currentStage.Perform_stage = this.select - 1;
      axios
        .post(path, this.currentStage)
        .then(() => {
          console.log("Posted stage to ERU_INPUT");
          //console.log(this.currentStage);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>