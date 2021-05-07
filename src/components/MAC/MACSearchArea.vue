<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="font-weight-light" pa-0 ma-0>Search Area</h1>
        </v-col>
        <v-col align="center">
          <v-container>
            <PolygonToggle @selected="selectShape" ref="PolygonToggle" />
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="shape === 'polygon'">
      <v-row>
        <PolygonForm
          @addPolygon="addPolygon"
          @setPolygonCoordinates="setPolygonCoordinates"
          ref="PolygonForm"
        />
      </v-row>
    </v-container>

    <v-container v-if="shape === 'circle'">
      <v-row>
        <CircleForm
          @addCircle="addCircle"
          @setCircleCoordinates="setCircleCoordinates"
          :circleCoords="circleCoords"
          ref="CircleForm"
        />
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
    // Coordinates: [
    //   {
    //     lng: "",
    //     lat: "",
    //   },
    // ],
    Search_Area: null,
    shape: null,
  }),

  methods: {
    selectShape(shape) {
      this.shape = shape;
      // console.log(this.shape);
    },
    addPolygon(coordinates) {
      this.$emit("addPolygon", coordinates);
    },
    addCircle(lng, lat, rad) {
      this.$emit("addCircle", lng, lat, rad);
    },
    getMACSearchArea() {
      const path = "http://127.0.0.1:5000/MAC_INPUT";
      axios
        .get(path)
        .then((res) => {
          this.Search_Area = res.data.Search_Area;
          // console.log(this.Search_Area)
          this.setSearchArea();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setSearchArea() {
      console.log("length: " + this.Search_Area.Coordinates.length);
      if (this.Search_Area.Coordinates.length > 0) {
        if (this.Search_Area.Circle_inputs.rad == null) {
          //Polygon
          this.$refs.PolygonToggle.selectPolygon();
        }
      }
      if (this.Search_Area.Circle_inputs.rad != null) {
        //Circle
        this.$refs.PolygonToggle.selectCircle();
      }
    },
    setPolygonCoordinates() {
      if (this.Search_Area.Coordinates.length > 0) {
        this.$refs.PolygonForm.Coordinates = this.Search_Area.Coordinates;
        let tempCoordinates = new Array(this.Search_Area.Coordinates.length);
        let temp = [];
        for (let i = 0; i < this.Search_Area.Coordinates.length; i++) {
          temp = new Array(2);
          temp[0] = this.Search_Area.Coordinates[i].lng;
          temp[1] = this.Search_Area.Coordinates[i].lat;
          tempCoordinates[i] = temp;
        }
        this.addPolygon(tempCoordinates);
        // console.log(this.$refs.PolygonForm.Coordinates);
      }
    },
    setCircleCoordinates() {
      // console.log(this.Search_Area.Circle_inputs.lat);
      if (this.Search_Area.Circle_inputs.rad != null) {
        this.$refs.CircleForm.Latitude = this.Search_Area.Circle_inputs.lat;
        this.$refs.CircleForm.Longitude = this.Search_Area.Circle_inputs.lng;
        this.$refs.CircleForm.Radius = this.Search_Area.Circle_inputs.rad;
        this.addCircle(
          this.Search_Area.Circle_inputs.lng,
          this.Search_Area.Circle_inputs.lat,
          this.Search_Area.Circle_inputs.rad
        );
      }
    },
  },
  // mounted() {
  //   setTimeout(this.getMACSearchArea, 5000);
  //   this.getMACSearchArea();
  // },
};
</script>
<style>
.scrollable:hover,
.scrollable:active,
.scrollable:focus {
  overflow-y: auto !important;
}
</style>