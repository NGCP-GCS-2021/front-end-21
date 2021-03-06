<template>
  <div>
  <validation-observer ref="observer" v-slot="{ invalid }">
    <form class="scrollable" @submit.prevent="submit" style="height: 250px; overflow-y: hidden; overflow-x: hidden">
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
          <v-btn class="mr-4" color="green" type="submit" :disabled="invalid">
            Submit
          </v-btn>
          <v-btn @click="dialog = true"> Clear </v-btn>
          <!-- <div>
            <h3>Coordinates: {{ Coordinates }}</h3>
          </div> -->
        </v-row>
      </v-container>
    </form>
  </validation-observer>
  </div>

<!--  <v-dialog v-model="dialog" max-width="425">-->
<!--    <v-card>-->
<!--      <v-card-title class="headline">-->
<!--        <v-icon large color="red" class="pr-3">mdi-alert</v-icon>-->
<!--        <h3 class="font-weight-light text-center red&#45;&#45;text" justify="center">-->
<!--          Clear Search Area?-->
<!--        </h3>-->
<!--      </v-card-title>-->
<!--      <v-card-text justify="center">-->
<!--        Warning: All MAC Search Area Coordinates will be deleted.-->
<!--      </v-card-text>-->

<!--      <v-card-actions>-->
<!--        <v-spacer></v-spacer>-->

<!--        <v-btn color="secondary" text @click="dialog = false"> Cancel </v-btn>-->

<!--        <v-btn color="primary" text @click="clear"> Clear </v-btn>-->
<!--      </v-card-actions>-->
<!--    </v-card>-->
<!--  </v-dialog>-->
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
  import axios from "axios";

  export default {
    components: {
      ValidationProvider,
      ValidationObserver,
    },
  name: "PolygonForm",
  data: () => ({
    dialog: false,
    Coordinates: [
      {
        lng: "",
        lat: "",
      },
    ],
    Search_area: {
      Search_area: {
        Coordinates: [],
      },
    }
  }),
  methods:{
    submit() {
      this.$refs.observer.validate();
      this.postSearchArea();
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
      //  !!!!!!   do we want to clear the search area on MAC's side as well?
      //            most likely not since MAC might need geofence to function
    },
    postSearchArea() {
      this.Search_area.Search_area.Coordinates = this.Coordinates;

      for (
          let i = 0;
          i < this.Search_area.Search_area.Coordinates.length;
          i++
      ) {
        this.Search_area.Search_area.Coordinates[i].lat = parseFloat(
            this.Search_area.Search_area.Coordinates[i].lat
        );
        this.Search_area.Search_area.Coordinates[i].lng = parseFloat(
            this.Search_area.Search_area.Coordinates[i].lng
        );
      }

      const searchAreaStringify = JSON.stringify(this.Search_area);

      const path = "http://127.0.0.1:5000/MAC_INPUT";
      axios
          .post(path, searchAreaStringify)
          .then(() => {
            console.log("Posted Search Area coordinates to MAC_INPUT");
            console.log(searchAreaStringify);
          })
          .catch((error) => {
            console.log(error.response);
          });
    },
  }
}
</script>

<style scoped>

</style>