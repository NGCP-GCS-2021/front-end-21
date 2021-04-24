<template>
  <div>
    <h1 class="font-weight-light">ERU Drop Location</h1>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
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
    Latitude: "",
    Longitude: "",
    firstGetERUDrop: true,
  }),
  props: ['ERUDropPointExists'],
  mounted() {
    setTimeout(this.getCurrentDropLocation, 5000);
  },
  updated() {
    if(!this.firstGetERUDrop){
      this.getCurrentDropLocation();
    }
  },
  methods: {
    getCurrentDropLocation() {
      const path = "http://127.0.0.1:5000/ERU_INPUT";
      axios
        .get(path)
        .then((res) => {
          if(this.firstGetERUDrop) {
            if (res.data.Drop_loc_lng == 0 && res.data.Drop_loc_lng == 0) {
            } else {
              this.Longitude = res.data.Drop_loc_lng;
              this.Latitude = res.data.Drop_loc_lat;
              this.setDropLocationPosition(
                  res.data.Drop_loc_lng,
                  res.data.Drop_loc_lng
              );
            }
          } else {
            this.setDropLocationPosition(
                res.data.Travel_to_lng,
                res.data.Travel_to_lng
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setDropLocationPosition(lng, lat) {
      let coord = [lng, lat]; //array for editPointSource
      this.$emit("editERUDrop", coord);
      if (this.pointExists) {
        console.log("edited point");
      } else {
        console.log("added point");
        this.$emit("addERUDrop", lng, lat)
      }
      this.firstGetERUDrop = false;
    },
    submit() {
      this.$refs.observer.validate();
      console.log("whaddup stokers")
      this.postDropLoc();
    },
    clear() {
      this.Longitude = "";
      this.Latitude = "";
      this.$refs.observer.reset();
    },

    postDropLoc() {
      this.drop_loc = JSON.stringify({
        Drop_loc_lat: parseFloat(this.Latitude),
        Drop_loc_lng: parseFloat(this.Longitude),
      });
      const path = "http://127.0.0.1:5000/MAC_INPUT";
      axios
        .post(path, this.drop_loc, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          console.log("Posted ERU Drop coordinates to MAC_INPUT");
          console.log(this.drop_loc);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>