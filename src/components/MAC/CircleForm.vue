<template>
  <div>
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
                    v-model="Radius"
                    :error-messages="errors"
                    label="Radius"
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
  data() {
    return {
      travelTo: {},
      Longitude: "",
      Latitude: "",
      Radius: "",
    };
  },

  methods: {
    submit() {
      this.$refs.observer.validate();
      this.postSearchArea();
    },
    clear() {
      this.Longitude = "";
      this.Latitude = "";
      this.Radius = "";
      this.$refs.observer.reset();
    },
    postTravelTo() {
      this.travelTo = JSON.stringify({
        Travel_to_lat: parseFloat(this.Latitude),
        Travel_to_lng: parseFloat(this.Longitude),
        Travel_to_alt: parseFloat(this.Radius),
      });
      const path = "http://127.0.0.1:5000/MAC_INPUT";
      // console.log(this.travelTo);
      axios
          .post(path, this.travelTo) //removed header
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