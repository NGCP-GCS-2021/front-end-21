<template>
  <v-div>
    <v-btn-toggle v-model="ShapeToggle" rounded>
      <v-btn value="polygon" text small @click="selectPolygon"> Polygon </v-btn>
      <v-btn value="circle" text small @click="selectCircle"> Circle </v-btn>
    </v-btn-toggle>
  </v-div>
</template>

<script>
export default {
  data() {
    return {
      polygonSelected: false,
      circleSelected: false,
    };
  },
  methods: {
    selectPolygon() {
      if (!this.polygonSelected) {
        this.$emit("selected", "polygon");
      } else {
        this.$emit("selected", null);
      }
      this.polygonSelected = !this.polygonSelected;
      this.circleSelected = false;
    },
    selectCircle() {
      if (!this.circleSelected) {
        this.$emit("selected", "circle");
      } else {
        this.$emit("selected", null);
      }
      this.circleSelected = !this.circleSelected;
      this.polygonSelected = false;
    },
  },
};
</script>
