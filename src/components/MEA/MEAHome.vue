<template>
  <div>
    <h1 class="font-weight-light">Travel to/Home Coordinates</h1>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit" style="height: 150px;">
        <v-container>
          <v-row>
            <v-col cols="4">
              <validation-provider
                v-slot="{ errors }"
                name="Latitude"
                :rules="{
                  required: true,
                  regex: /^\d*\.?\d*$/,
                }"
                class="pa-0 ma-0"
              >
                <v-text-field
                  v-model="Latitude"
                  :error-messages="errors"
                  label="Latitude"
                  required
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider
                v-slot="{ errors }"
                name="Longitude"
                :rules="{
                  required: true,
                  regex: /^\d*\.?\d*$/,
                }"
              >
                <v-text-field
                  v-model="Longitude"
                  :error-messages="errors"
                  label="Longitude"
                  required
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider
                v-slot="{ errors }"
                name="Altitude"
                :rules="{
                  required: true,
                  regex: /^\d*\.?\d*$/,
                }"
              >
                <v-text-field
                  v-model="Altitude"
                  :error-messages="errors"
                  label="Altidude"
                  required
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-btn class="mr-4" color="green" type="submit" :disabled="invalid">
              Submit
            </v-btn>
            <v-btn @click="clear"> Clear </v-btn>
          </v-row>
        </v-container>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import axios from "axios";
import { required, regex, between } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} cannot be empty",
});

extend("regex", {
  ...regex,
  message: "Numbers Only",
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
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
    currentData: null,
  }),
mounted() {
  this.getCurrentTravelTo();
  this.getCurrentStage();
},
  methods: {
    getCurrentTravelTo(){
      const path = "http://127.0.0.1:5000/MEA_INPUT";
      axios
          .get(path)
          .then((res) => {
            this.Longitude = res.data.Travel_to_lng;
            this.Latitude = res.data.Travel_to_lat;
            this.Altitude = res.data.Travel_to_alt;
          })
          .catch((error) => {
            console.error(error);
          });
    },
    getCurrentStage() {
      const path = "http://127.0.0.1:5000/MEA_XBEE";

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
    setCurrentStage(){
      for (let i = 0; i < this.currentData.length; i++) {
        let pair = this.currentData[i];
        if (pair.title == "Current_stage") {
          this.currentStage.id = pair.value;

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
    submit() {
      this.$refs.observer.validate();
      this.postTravelTo();
    },
    clear() {
      this.Longitude = "";
      this.Latitude = "";
      this.Altitude = "";
      this.$refs.observer.reset();
    },
    postTravelTo() {
      this.travelTo = JSON.stringify({
        Travel_to_lat: parseFloat(this.Latitude),
        Travel_to_lng: parseFloat(this.Longitude),
        Travel_to_alt: parseFloat(this.Altitude),
      });
      const path = "http://127.0.0.1:5000/MAC_INPUT";
      // console.log(this.travelTo);
      axios
        .post(path, this.travelTo, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          console.log("Posted Travel to/Home coordinates to MAC_INPUT");
          console.log(this.travelTo);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>