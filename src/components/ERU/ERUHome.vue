<template>
  <div>
    <h1 class="font-weight-light">Travel to/Home Coordinates</h1>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <v-container>
          <v-row>
            <v-col cols="4">
              <validation-provider
                v-slot="{ errors }"
                name="Latitude"
                :rules="{
                  required: true,
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
      </form>
    </validation-observer>
  </div>
</template>

<script>
import axios from "axios";
import { required, minValue, maxValue } from "vee-validate/dist/rules";
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

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      travelTo: {},
    };
  },

  methods: {
    submit() {
      this.$refs.observer.validate();
      this.postTravelTo();
    },
    clear() {
      this.Longitude = "";
      this.Latitude = "";
      this.$refs.observer.reset();
    },
    postTravelTo() {
      this.travelTo = {
        Travel_to_lat: this.Latitude,
        Travel_to_lng: this.Longitude,
      };
      const path = "http://127.0.0.1:5000/ERU";
      axios
        .post(path, this.travelTo)
        .then(() => {
          console.log("Posted Travel to/Home coordinates to ERU");
          // console.log(this.travelTo);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>