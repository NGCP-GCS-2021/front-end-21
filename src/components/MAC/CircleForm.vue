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
                name="Radius"
                :rules="{
                  required: true,
                  regex: /^-?[0-9]\d*(.\d+)?$/,
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
            <v-col>
              <v-card-actions>
                <v-btn
                  class="mr-4"
                  color="green"
                  type="submit"
                  :disabled="invalid"
                >
                  Submit
                </v-btn>
                <v-btn @click="clear"> Clear </v-btn>
              </v-card-actions>
            </v-col>
            <v-col>
              <v-card-actions class="justify-end">
                <v-btn
                  @click="addCircle"
                  color="primary"
                  :disabled="!(Latitude && Longitude && Radius)"
                >
                  Create Circle
                </v-btn>
              </v-card-actions>
            </v-col>
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
  props: ["circleCoords"],
  data() {
    return {
      Search_Area: {
        Search_Area: {
          Coordinates: [],
          Circle_inputs: {
            lng: null,
            lat: null,
            rad: null,
          },
        },
      },
      Longitude: "",
      Latitude: "",
      Radius: "",
    };
  },
  mounted() {
    this.$emit("setCircleCoordinates")
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
      this.invalid = true;
    },
    addCircle() {
      this.$emit("addCircle", this.Longitude, this.Latitude, this.Radius);
    },
    postSearchArea() {
      // for (
      //   let i = 0;
      //   i < this.Search_Area.Search_Area.Coordinates.length;
      //   i++
      // ) {
      //   this.Search_Area.Search_Area.Coordinates[i].lat = parseFloat(
      //     this.Search_Area.Search_Area.Coordinates[i].lat
      //   );
      //   this.Search_Area.Search_Area.Coordinates[i].lng = parseFloat(
      //     this.Search_Area.Search_Area.Coordinates[i].lng
      //   );
      // }

      this.Search_Area.Search_Area.Circle_inputs.lng = parseFloat(
        this.Longitude
      );
      this.Search_Area.Search_Area.Circle_inputs.lat = parseFloat(
        this.Latitude
      );
      this.Search_Area.Search_Area.Circle_inputs.rad = parseFloat(this.Radius);

      const searchAreaStringify = JSON.stringify(this.Search_Area);
      const path = "http://127.0.0.1:5000/MAC_INPUT";
      axios
        .post(path, searchAreaStringify)
        .then(() => {
          console.log("Posted Search Area (Circle) coordinates to MAC_INPUT");
          console.log(searchAreaStringify);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>