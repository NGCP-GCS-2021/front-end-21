<template>
  <div>
    <h1 class="font-weight-light">Evacuation Zone</h1>
    <!-- <h3>Current Data: {{ Longitude }}, {{ Latitude }}</h3> -->
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit" style="height: 150px;">
        <v-container>
          <v-row>
            <v-col cols="6">
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
            <v-col cols="6">
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
          </v-row>
          <v-row>
            <v-btn class="mr-4" color="green" type="submit" :disabled="invalid">
              Submit
            </v-btn>
            <v-btn @click="clear"> Clear </v-btn>
          </v-row>
        </v-container>
        <p></p>
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
    drop_loc: {},
    Longitude: "",
    Latitude: "",
  }),

  methods: {
    submit() {
      this.$refs.observer.validate();
      this.postEvacMEA();
      this.postEvacERU();
    },
    clear() {
      this.Longitude = "";
      this.Latitude = "";
      this.$refs.observer.reset();
    },

    postEvacERU() {
      this.drop_loc = JSON.stringify({
        Drop_loc_lat: parseFloat(this.Latitude),
        Drop_loc_lng: parseFloat(this.Longitude),
      });
      const path = "http://127.0.0.1:5000/ERU_INPUT";
      axios
        .post(path, this.drop_loc, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          console.log("Posted Evacuation Zone coordinates to ERU_INPUT");
          console.log(this.drop_loc);
        })
        .catch((error) => {
          console.log(error.response);
        });
    }, 
    postEvacMEA() {
      this.drop_loc = JSON.stringify({
        Drop_loc_lat: parseFloat(this.Latitude),
        Drop_loc_lng: parseFloat(this.Longitude),
      });
      const path = "http://127.0.0.1:5000/MEA_INPUT";
      axios
        .post(path, this.drop_loc, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          console.log("Posted Evacuation Zone coordinates to MEA_INPUT");
          console.log(this.drop_loc);
        })
        .catch((error) => {
          console.log(error.response);
        });
    }, 

  },
};
</script>