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
                  @click="submit"
                  :disabled="invalid"
                >
                  Add to List
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
      Search_area: {
        Search_area: {
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

  methods: {
    submit() {
      this.$refs.observer.validate();
      this.$emit(
        "addToKeepOut",
        this.circleCoords,
        this.Longitude,
        this.Latitude,
        this.Radius
      );
      this.clear();
    },
    clear() {
      this.Longitude = "";
      this.Latitude = "";
      this.Radius = "";
      this.$refs.observer.reset();
      this.invalid = true;
    },
    addCircle() {
      this.$emit("addKeepOutCircle", this.Longitude, this.Latitude, this.Radius);
    },
  },
};
</script>