<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h2 class="font-weight-light" pa-0 ma-0>Keep In: {{ vehicle }}</h2>
        </v-col>
        <v-col align="center">
          <v-btn @click="dialog = true" color="red"> Delete </v-btn>
        </v-col>
      </v-row>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form
          class="scrollable"
          @submit.prevent="submit"
          style="height: 400px; overflow-y: hidden; overflow-x: hidden"
        >
          <v-container>
            <v-form v-for="(input, k) in Coordinates" :key="k">
              <v-row>
                <v-col cols="5">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Latitude"
                    :rules="{
                      required: true,
                    }"
                    class="pa-0 ma-0"
                  >
                    <v-text-field
                      v-model="input.lng"
                      :error-messages="errors"
                      label="Latitude"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="5">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Longitude"
                    :rules="{
                      required: true,
                    }"
                  >
                    <v-text-field
                      v-model="input.lat"
                      :error-messages="errors"
                      label="Longitude"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col :cols="1">
                  <v-icon
                    class="mt-2"
                    color="green"
                    @click="add(k)"
                    v-show="k == Coordinates.length - 1"
                    >mdi-plus-circle</v-icon
                  >
                </v-col>
                <v-col :cols="1">
                  <v-icon
                    class="mt-2"
                    color="red"
                    @click="remove(k)"
                    v-show="k || (!k && Coordinates.length > 1)"
                    >mdi-minus-circle</v-icon
                  >
                </v-col>
              </v-row>
            </v-form>
            <v-row>
              <v-btn
                class="mr-4"
                color="green"
                type="submit"
                :disabled="invalid"
              >
                Submit
              </v-btn>
              <!-- <v-btn @click="dialog = true"> Clear </v-btn> -->
              <!-- <div>
              <h3>Coordinates: {{ Coordinates }}</h3>
            </div> -->
            </v-row>
          </v-container>
        </form>
      </validation-observer>
    </v-container>
    <v-dialog v-model="dialog" max-width="425">
      <v-card>
        <v-card-title class="headline">
          <v-icon large color="red" class="pr-3">mdi-alert</v-icon>
          <h3 class="font-weight-light text-center red--text" justify="center">
            Clear Geofence (Keep In)?
          </h3>
        </v-card-title>
        <v-card-text justify="center">
          Warning: All {{ vehicle }} Geofence (Keep In) Coordinates will be
          cleared.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="secondary" text @click="dialog = false"> Cancel </v-btn>

          <v-btn color="primary" text @click="clear"> Clear </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { required, minValue } from "vee-validate/dist/rules";
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
  props: ["vehicle", "keepIn"],
  data: () => ({
    dialog: false,
    Coordinates: [
      {
        lng: "",
        lat: "",
      },
    ],
    Geofence: {
      Geofence: {
        Coordinates: [],
      },
      Keep_in: true
    },
  }),

  methods: {
    submit() {
      this.$refs.observer.validate();
      this.postGeofenceKeepIn();
    },
    add() {
      this.Coordinates.push({
        lng: "",
        lat: "",
      });
    },
    remove() {
      this.Coordinates.pop();
    },
    clear() {
      this.Coordinates = [
        {
          lng: "",
          lat: "",
        },
      ];
      this.deleteKeepIn();
      //  !!!!!!   do we want to clear the search area on MAC's side as well?
      //            most likely not since MAC might need geofence to function
    },

    postGeofenceKeepIn() {
      this.Geofence.Geofence.Coordinates = this.Coordinates;

      for (let i = 0; i < this.Geofence.Geofence.Coordinates.length; i++) {
        this.Geofence.Geofence.Coordinates[i].lat = parseFloat(
          this.Geofence.Geofence.Coordinates[i].lat
        );
        this.Geofence.Geofence.Coordinates[i].lng = parseFloat(
          this.Geofence.Geofence.Coordinates[i].lng
        );
      }

      const geofenceStringify = JSON.stringify(this.Geofence);

      const path = "http://127.0.0.1:5000/MAC_INPUT";
      axios
        .post(path, geofenceStringify)
        .then(() => {
          console.log("Posted Geofence (Keep In) coordinates to MAC_INPUT");
          console.log(geofenceStringify);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    deleteKeepIn() {
      this.$emit("deleteKeepIn", this.keepIn);
    },
  },
};
</script>
<style>
.scrollable:hover,
.scrollable:active,
.scrollable:focus {
  overflow-y: auto !important;
}
</style>