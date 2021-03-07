<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h2 class="font-weight-light" pa-0 ma-0>Keep In Area: {{ vehicle }}</h2>
        </v-col>
      </v-row>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form
          class="scrollable"
          @submit.prevent="submit"
          style="height: 315px; overflow-y: hidden; overflow-x: hidden"
        >
          <v-container>
            <v-form v-for="(input, k) in Coordinates" :key="k">
              <v-container>
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
                        v-model="input.lat"
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
                        v-model="input.lng"
                        :error-messages="errors"
                        label="Longitude"
                        required
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col :cols="1" align="center">
                    <v-icon
                      class="mt-2"
                      color="green"
                      @click="add(k)"
                      v-show="k == Coordinates.length - 1"
                      >mdi-plus-circle</v-icon
                    >
                  </v-col>
                  <v-col :cols="1" align="center">
                    <v-icon
                      class="mt-2"
                      color="red"
                      @click="remove(k)"
                      v-show="k || (!k && Coordinates.length > 1)"
                      >mdi-minus-circle</v-icon
                    >
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-container>
        </form>
        <v-row>
          <v-col align="center"
            ><v-btn
              class="mr-4"
              color="green"
              type="submit"
              :disabled="invalid"
              @click="submit"
            >
              Add to List
            </v-btn>
          </v-col>
          <v-col align="center">
            <v-btn @click="dialog = true" color="red"> Clear </v-btn>
          </v-col>
        </v-row>
      </validation-observer>
    </v-container>
    <v-dialog v-model="dialog" max-width="425">
      <v-card>
        <v-card-title class="headline">
          <v-icon large color="red" class="pr-3">mdi-alert</v-icon>
          <h3 class="font-weight-light text-center red--text" justify="center">
            Clear Keep In: {{ vehicle }}?
          </h3>
        </v-card-title>
        <v-card-text justify="center">
          Warning: Current {{ vehicle }} Geofence (Keep In) inputs
          will be cleared.
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
  props: ["vehicle"],
  data: () => ({
    dialog: false,
    Coordinates: [
      {
        lng: "",
        lat: "",
      },
    ],
  }),

  methods: {
    submit() {
      this.$refs.observer.validate();
      this.$emit("addToKeepIn", this.Coordinates);
      this.clear();
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
      this.dialog = false;
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