<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h2 class="font-weight-light">Keep Out Area: {{ vehicle }}</h2>
        </v-col>
        <v-col align="center">
          <v-container>
            <KeepOutShapeToggle
              @selected="selectShape"
              :ref="KeepOutShapeToggle"
            />
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <KeepOutPolygonForm
      v-if="shape === 'polygon'"
      @addToKeepOut="addToKeepOut"
      @addKeepOutPolygon="addKeepOutPolygon"
    />
    <KeepOutCircleForm
      v-if="shape === 'circle'"
      @addToKeepOut="addToKeepOut"
      @addKeepOutCircle="addKeepOutCircle"
      :circleCoords="circleCoords"
    />
  </div>
</template>

<script>
import KeepOutCircleForm from "@/components/Geofence/KeepOut/KeepOutCircleForm.vue";
import KeepOutPolygonForm from "@/components/Geofence/KeepOut/KeepOutPolygonForm.vue";
import KeepOutShapeToggle from "@/components/Geofence/KeepOut/KeepOutShapeToggle.vue";
export default {
  props: ["vehicle", "circleCoords"],
  components: {
    KeepOutCircleForm,
    KeepOutPolygonForm,
    KeepOutShapeToggle,
  },
  data: () => ({
    shape: null,
  }),

  methods: {
    selectShape(shape) {
      this.shape = shape;
    },
    addToKeepOut(coordinates, lng, lat, rad) {
      this.$emit("addToKeepOut", coordinates, lng, lat, rad);
    },
    addKeepOutPolygon(coordinates) {
      this.$emit("addKeepOutPolygon", coordinates);
    },
    addKeepOutCircle(lng, lat, rad) {
      this.$emit("addKeepOutCircle", lng, lat, rad);
    },
  },
};
</script>
