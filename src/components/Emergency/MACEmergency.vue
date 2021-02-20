<template>
  <div class="emergency">
    <v-btn
      width="100%"
      dark
      x-large
      color="red"
      class="mx-2"
      @click="dialog = true"
    >
      EMERGENCY STOP<v-icon x-large>mdi-alert-octagon</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="425">
      <v-card>
        <v-card-title class="headline">
          <v-icon large color="red" class="pr-3">mdi-alert</v-icon>
          <h3 class="font-weight-light text-center red--text" justify="center">
            Activate Emergency Stop?
          </h3>
        </v-card-title>
        <v-card-text justify="center">
          Warning: Vehicle will come to an immediate stop.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="secondary" text @click="dialog = false"> Cancel </v-btn>

          <v-btn color="primary" text @click="emergencyStop"> Activate </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-if="backendStop">
      <p>Backend stop value: {{ backendStop.value }}</p>
    </div>
    <div v-else>
      <p>emergency not activated yet</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dialog: false,
      e_stop: {
        "Stop": true
      },
      // e_stop: {
      //   title: "Stop",
      //   value: true,
      // },
      backendStop: null,
    };
  },
  methods: {
    emergencyStop() {
      this.dialog = false;
      const path = "http://127.0.0.1:5000/MAC";
      axios
        .post(path, this.e_stop)
        .then(() => {
          console.log("stokers!");
          this.getStop();
        })
        .catch((error) => {
          console.log(error);
        });
        
    },
    getStop() {
      const path = "http://127.0.0.1:5000/MAC";
      axios
        .get(path)
        .then((res) => {
          this.backendStop = res.data.e_stop;
          console.log("stoke nation!");
          console.log("res.data.e_stop: ", res.data.e_stop);
          console.log("this.backendStop: ", this.backendStop);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>