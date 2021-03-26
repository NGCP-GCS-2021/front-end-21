<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="font-weight-light" pa-0 ma-0>Search Area</h1>
        </v-col>
        <v-col align="center">
          <v-container>
          <PolygonToggle @selected="selectShape"/>
          </v-container>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="shape === 'polygon'">
      <v-row >
        <PolygonForm @addPolygon="addPolygon"/>
      </v-row>
    </v-container>

    <v-container v-if="shape === 'circle'">
      <v-row >
        <CircleForm/>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" max-width="425">
      <v-card>
        <v-card-title class="headline">
          <v-icon large color="red" class="pr-3">mdi-alert</v-icon>
          <h3 class="font-weight-light text-center red--text" justify="center">
            Clear Search Area?
          </h3>
        </v-card-title>
        <v-card-text justify="center">
          Warning: All MAC Search Area Coordinates will be deleted.
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
import PolygonToggle from '@/components/MAC/PolygonToggle.vue';
import PolygonForm from "@/components/MAC/PolygonForm";
import CircleForm from "@/components/MAC/CircleForm";
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
    CircleForm,
    PolygonForm,
    ValidationProvider,
    ValidationObserver,
    PolygonToggle
  },
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
    },
    shape: null
  }),

  methods: {
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
    selectShape(shape){
      this.shape = shape;
      console.log(this.shape)
    },
    addPolygon(coordinates){
      this.$emit("addPolygon", coordinates)
    }
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