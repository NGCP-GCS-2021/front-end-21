<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="font-weight-light" pa-0 ma-0>Search Area</h1>
        </v-col>
        <v-col align="center">
          <v-container>
            <PolygonToggle @selected="selectShape" />
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="shape === 'polygon'">
      <v-row>
        <PolygonForm @addPolygon="addPolygon" />
      </v-row>
    </v-container>

    <v-container v-if="shape === 'circle'">
      <v-row>
        <CircleForm @addCircle="addCircle" :circleCoords="circleCoords" />
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
import PolygonToggle from "@/components/MAC/PolygonToggle.vue";
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
    PolygonToggle,
  },
  props: ["circleCoords"],
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
    shape: null,
  }),

  methods: {
    selectShape(shape) {
      this.shape = shape;
      console.log(this.shape);
    },
    addPolygon(coordinates) {
      this.$emit("addPolygon", coordinates);
    },
    addCircle(lng, lat, rad) {
      this.$emit("addCircle", lng, lat, rad);
    },
  },
  mounted(){
    this.getMACSearchArea();
    if(this.Search_area.Circle_inputs.rad == null){
      //Polygon
      this.shape = "polygon";
      this.$refs.PolygonForm.Coordinates = this.Search_Area.Coordinates;
      this.addPolygon(this.Coordinates);
    } else if (this.Search_area.Circle_inputs.rad != null){
      this.shape = "circle";
      this.$refs.CircleForm.Longitude = this.Search_area.lng;
      this.$refs.CircleForm.Latitude = this.Search_area.lat;
      this.$refs.CircleForm.Radius = this.Search_area.rad;
      this.addCircle(
          this.Search_area.lng,
          this.Search_area.lat,
          this.Search_area.rad
      );
    }
  }
};
</script>
<style>
.scrollable:hover,
.scrollable:active,
.scrollable:focus {
  overflow-y: auto !important;
}
</style>