<template>
  <v-div>
      <v-btn-toggle v-model="PolygonToggle" rounded>
        <v-btn value="polygon" text small @click="selectPolygon">
          Polygon
        </v-btn>
        <v-btn value="circle" text small @click="selectCircle">
          Circle
        </v-btn>
      </v-btn-toggle>
  </v-div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods:{
    selectPolygon(){
      this.$emit("selected", "polygon")
      // console.log("working?")
    },
    selectCircle(){
      this.$emit("selected", "circle")
      // console.log("working????")
    }
  }
}
</script>
