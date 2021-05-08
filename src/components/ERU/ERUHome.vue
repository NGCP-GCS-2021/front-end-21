<template>
  <v-container>
    <v-row>
      <h1 class="font-weight-light">Travel to/Home Coordinates</h1>
      <img src="../../assets/map_icons/home.png" width="30" height="30"/>
    </v-row>
  <div>
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
            <v-col cols="6">
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
      firstGetHome: true,
    };
  },
  mounted() {
    setTimeout(this.getCurrentTravelTo, 5000);
  },
  // updated() {
  //   if (!this.firstGetHome) {
  //     this.getCurrentTravelTo();
  //   }
  // },
  props: ["pointExists"],
  methods: {
    getCurrentTravelTo() {
      const path = "http://127.0.0.1:5000/ERU_INPUT";
      axios
          .get(path)
          .then((res) => {
            if (this.firstGetHome) {
              if (
                  res.data.Travel_to_lng == 0 &&
                  res.data.Travel_to_lat == 0
              ) {
              } else {
                this.Longitude = res.data.Travel_to_lng;
                this.Latitude = res.data.Travel_to_lat;
                this.setHomePosition(this.Longitude, this.Latitude);
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
      this.$emit("editERUHome", coord);
      //let pointExists = this.$refs.Map.editPointSource("mac_home", coord);
      if (this.pointExists) {
        console.log("edited point");
      } else {
        console.log("added point");
        this.$emit("addERUHome", lng, lat);
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
      this.$refs.observer.reset();
    },
    postTravelTo() {
      this.travelTo = JSON.stringify({
        Travel_to_lat: parseFloat(this.Latitude),
        Travel_to_lng: parseFloat(this.Longitude),
      });
      const path = "http://127.0.0.1:5000/ERU_INPUT";
      // console.log(this.travelTo);
      axios
        .post(path, this.travelTo)
        .then(() => {
          console.log("Posted Travel to/Home coordinates to ERU_INPUT");
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