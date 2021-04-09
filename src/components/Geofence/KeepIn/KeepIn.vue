<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h2 class="font-weight-light">Keep In Area: {{ vehicle }}</h2>
        </v-col>
        <v-col align="center">
          <v-container>
            <KeepInShapeToggle
              @selected="selectShape"
              :ref="KeepInShapeToggle"
            />
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <KeepInPolygonForm
      v-if="shape === 'polygon'"
      @addToKeepIn="addToKeepIn"
      @addKeepInPolygon="addKeepInPolygon"
    />
    <KeepInCircleForm
      v-if="shape === 'circle'"
      @addToKeepIn="addToKeepIn"
      @addKeepInCircle="addKeepInCircle"
      :circleCoords="circleCoords"
    />
  </div>
</template>

<script>
import KeepInCircleForm from "@/components/Geofence/KeepIn/KeepInCircleForm.vue";
import KeepInPolygonForm from "@/components/Geofence/KeepIn/KeepInPolygonForm.vue";
import KeepInShapeToggle from "@/components/Geofence/KeepIn/KeepInShapeToggle.vue";
export default {
  props: ["vehicle", "circleCoords"],
  components: {
    KeepInCircleForm,
    KeepInPolygonForm,
    KeepInShapeToggle,
  },
  data: () => ({
    shape: null,
  }),

  methods: {
    selectShape(shape) {
      this.shape = shape;
    },
    addToKeepIn(coordinates, lng, lat, rad) {
      this.$emit("addToKeepIn", coordinates, lng, lat, rad);
    },
    addKeepInPolygon(coordinates) {
      this.$emit("addKeepInPolygon", coordinates);
    },
    addKeepInCircle(lng, lat, rad) {
      this.$emit("addKeepInCircle", lng, lat, rad);
    },
  },
};
</script>
