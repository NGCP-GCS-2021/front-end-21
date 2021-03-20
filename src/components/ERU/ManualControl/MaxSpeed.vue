<template>
  <v-card-actions class="justify-center">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <v-col align="center">
          <v-col cols="15">
            <validation-provider
              v-slot="{ errors }"
              name="MaxSpeed"
              :rules="{
                required: true,
                regex: /^\d*\.?\d*$/,
              }"
              class="pa-0 ma-0"
            >
              <v-text-field
                v-model="MaxSpeed"
                :error-messages="errors"
                label="Max Speed"
                required
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-btn class="mr-4" color="green" type="submit" :disabled="invalid">
            Submit
          </v-btn>
          <v-btn @click="clear"> Clear </v-btn>
        </v-col>
      </form>
    </validation-observer>
  </v-card-actions>
</template>

<script>
import { required, regex } from "vee-validate/dist/rules";
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
      MaxSpeed: "",
    };
  },

  methods: {
    submit() {
      this.$refs.observer.validate();
      this.postTravelTo();
    },
    clear() {
      this.MaxSpeed = "";
      this.$refs.observer.reset();
    },
  },
};
</script>