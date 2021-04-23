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
import axios from "axios";
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
  mounted() {
    this.getMaxSpeed();
  },
  methods: {
    getMaxSpeed() {
      const path = "http://127.0.0.1:5000/ERU_INPUT";
      axios
        .get(path)
        .then((res) => {
          if (res.data.Manual_speed == 0) {
          } else {
            this.MaxSpeed = res.data.Manual_speed;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    submit() {
      this.$refs.observer.validate();
      this.postMaxSpeed();
    },
    clear() {
      this.MaxSpeed = "";
      this.$refs.observer.reset();
    },
    postMaxSpeed() {
      let maxSpeed = JSON.stringify({
        Manual_speed: parseFloat(this.MaxSpeed),
      });
      console.log(maxSpeed);
      const path = "http://127.0.0.1:5000/ERU_INPUT";
      axios
        .post(path, maxSpeed)
        .then(() => {
          console.log("Posted Manual Speed to ERU_INPUT");
          console.log(maxSpeed);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>