<template>
  <v-container>
    <v-row>
      <h1 class="font-weight-light">Evacuation Zone</h1>
      <img src="../assets/map_icons/evac-point.png" width="30" height="30"/>
    </v-row>
  <div>
    <!-- <h3>Current Data: {{ Longitude }}, {{ Latitude }}</h3> -->
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit" style="height: 150px">
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
            <v-btn
              class="mr-4"
              color="green"
              @click="submit"
              :disabled="invalid"
            >
              Submit
            </v-btn>
            <v-btn @click="clear"> Clear </v-btn>
          </v-row>
        </v-container>
        <p></p>
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
  data: () => ({
    EZ: {},
    Longitude: "",
    Latitude: "",
    firstGetEvac: true,
  }),
  props: ["evacPointExists"],
  // mounted() {
  //   setTimeout(this.getCurrentEvac, 5000);
  // },
  // updated() {
  //   console.log(this.firstGetEvac);
  //   if (!this.firstGetEvac) {
  //     this.getCurrentEvac();
  //   }
  // },
  methods: {
    getCurrentEvac() {
      const path = "http://127.0.0.1:5000/ERU_INPUT";
      axios
        .get(path)
        .then((res) => {
          if (this.firstGetEvac) {
            if (res.data.EZ_lng == 0 && res.data.EZ_lat == 0) {
            } else {
              this.Longitude = res.data.EZ_lng;
              this.Latitude = res.data.EZ_lat;
              this.setEvacPosition(res.data.EZ_lng, res.data.EZ_lat);
            }
          } else {
            this.setEvacPosition(res.data.EZ_lng, res.data.EZ_lat);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setEvacPosition(lng, lat) {
      let coord = [lng, lat]; //array for editPointSource
      this.$emit("editEvac", coord);
      if (this.evacPointExists) {
        console.log("edited point");
      } else {
        console.log("added point");
        this.$emit("addEvac", lng, lat);
      }
      this.firstGetEvac = false;
    },
    submit() {
      this.$refs.observer.validate();
      // this.postEvacMEA();
      this.postEvacERU();
    },
    clear() {
      this.Longitude = "";
      this.Latitude = "";
      this.$refs.observer.reset();
    },

    postEvacERU() {
      this.EZ = JSON.stringify({
        EZ_lng: parseFloat(this.Longitude),
        EZ_lat: parseFloat(this.Latitude),
      });
      const path = "http://127.0.0.1:5000/ERU_INPUT";
      axios
        .post(path, this.EZ)
        .then(() => {
          console.log("Posted Evacuation Zone coordinates to ERU_INPUT");
          console.log(this.EZ);
          this.getCurrentEvac();
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    // postEvacMEA() {
    //   this.EZ = JSON.stringify({
    //     EZ_lng: parseFloat(this.Latitude),
    //     EZ_lat: parseFloat(this.Longitude),
    //   });
    //   const path = "http://127.0.0.1:5000/MEA_INPUT";
    //   axios
    //     .post(path, this.EZ, {
    //       headers: { "Content-Type": "application/json" },
    //     })
    //     .then(() => {
    //       console.log("Posted Evacuation Zone coordinates to MEA_INPUT");
    //       console.log(this.EZ);
    //     })
    //     .catch((error) => {
    //       console.log(error.response);
    //     });
    // },
  },
};
</script>