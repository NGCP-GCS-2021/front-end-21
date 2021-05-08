<template>
  <v-container>
    <v-row>
      <h1 class="font-weight-light">Travel to/Home Coordinates</h1>
      <img src="../../assets/map_icons/home.png" width="30" height="30"/>
    </v-row>
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
                  regex: /^-?[0-9]\d*(.\d+)?$/,
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
                  regex: /^-?[0-9]\d*(.\d+)?$/,
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
                  regex: /^-?[0-9]\d*(.\d+)?$/,
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
            <v-btn class="mr-4" color="green" @click="submit" :disabled="invalid">
              Submit
            </v-btn>
            <v-btn @click="clear"> Clear </v-btn>
          </v-row>
        </v-container>
      </form>
    </validation-observer>
  </div>
  </v-container>
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
      Altitude: "",
      firstGetHome: true,
    };
  },
  props: ["MACHomePointExists"],
  // mounted() {
  //   setTimeout(this.getCurrentTravelTo, 5000);
  // },
  // updated() {
  //   if (!this.firstGetHome) {
  //     this.getCurrentTravelTo();
  //   }
  // },
  methods: {
    getCurrentTravelTo() {
      const path = "http://127.0.0.1:5000/MAC_INPUT";
      axios
        .get(path)
        .then((res) => {
          if (this.firstGetHome) {
            if (
              res.data.Travel_to_lng == 0 &&
              res.data.Travel_to_lat == 0 &&
              res.data.Travel_to_alt == 0
            ) {
            } else {
              this.Longitude = res.data.Travel_to_lng;
              this.Latitude = res.data.Travel_to_lat;
              this.Altitude = res.data.Travel_to_alt;
              this.setHomePosition(
                res.data.Travel_to_lng,
                res.data.Travel_to_lat
              );
            }
          } else {
            this.setHomePosition(
              res.data.Travel_to_lng,
              res.data.Travel_to_lat
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setHomePosition(lng, lat) {
      let coord = [lng, lat]; //array for editPointSource
      this.$emit("editMACHome", coord);
      if (this.MACHomePointExists) {
        console.log("edited MACHome point");
      } else {
        console.log("added MACHome point");
        this.$emit("addMACHome", lng, lat);
      }
      this.firstGetHome = false;
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
        .post(path, this.travelTo) //removed header
        .then(() => {
          console.log("Posted Travel to/Home coordinates to MAC_INPUT");
          console.log(this.travelTo);
          this.getCurrentTravelTo();
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>

