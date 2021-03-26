<template>
  <div>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <v-container>
          <v-form v-for="(input, k) in Coordinates" :key="k">
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
                    v-model="input.lat"
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
                    v-model="input.lng"
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
                    v-model="input.rad"
                    :error-messages="errors"
                    label="Radius"
                    required
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
          </v-form>
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
  name: "CircleForm",
  data: () => ({
    // return: {
    //   travelTo: {},
    //   Longitude: "",
    //   Latitude: "",
    //   Radius: "",
    // }
    dialog: false,
    Coordinates: [
      {
        lng: "-117.6311926970484",
        lat: "33.93459532438122",
        rad: "50",
      },
    ],
    Search_area: {
      Search_area: {
        Coordinates: [],
      },
    },
  }),

  methods: {
    submit() {
      this.$refs.observer.validate();
      this.postSearchArea();
    },
    clear() {
      this.Coordinates = [
        {
          lng: "",
          lat: "",
          rad: "",
        },
      ];
    },
    postSearchArea() {
      console.log("submittedorsumn")
      this.$emit(
        "addCircle",
        this.Coordinates.lng,
        this.Coordinates.lat,
        this.Coordinates.rad
      );

      // this.Search_area.Search_area.Coordinates = this.Coordinates;
      // for (
      //   let i = 0;
      //   i < this.Search_area.Search_area.Coordinates.length;
      //   i++
      // ) {
      //   this.Search_area.Search_area.Coordinates[i].lat = parseFloat(
      //     this.Search_area.Search_area.Coordinates[i].lat
      //   );
      //   this.Search_area.Search_area.Coordinates[i].lng = parseFloat(
      //     this.Search_area.Search_area.Coordinates[i].lng
      //   );
      //   this.Search_area.Search_area.Coordinates[i].rad = parseFloat(
      //     this.Search_area.Search_area.Coordinates[i].rad
      //   );
      // }

      // const searchAreaStringify = JSON.stringify(this.Search_area);
      // const path = "http://127.0.0.1:5000/MAC_INPUT";
      // axios
      //   .post(path, searchAreaStringify)
      //   .then(() => {
      //     console.log("Posted Search Area coordinates to MAC_INPUT for Circle");
      //     console.log(searchAreaStringify);
      //   })
      //   .catch((error) => {
      //     console.log(error.response);
      //   });
    },
  },
};
</script>