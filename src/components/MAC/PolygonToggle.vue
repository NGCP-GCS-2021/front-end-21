<template>
  <v-div>
    <v-btn-toggle v-model="PolygonToggle" rounded>
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
      this.polygonSelected = !this.polygonSelected;
      this.circleSelected = false;
      if (this.polygonSelected) {
        this.$emit("selected", "polygon");
      } else {
        this.$emit("selected", null);
      }
    },
    selectCircle() {
      this.circleSelected = !this.circleSelected;
      this.polygonSelected = false;
      if (this.circleSelected) {
        this.$emit("selected", "circle");
      } else {
        this.$emit("selected", null);
      }
    },
  },
  unmounted() {
    this.polygonSelected = false;
    this.circleSelected = false;
    this.$emit("selected", null);
  },
};
</script>
