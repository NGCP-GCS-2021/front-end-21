<template>
  <v-div>
      <v-btn-toggle v-model="PolygonToggle" rounded mandatory>
        <v-btn text small>
          Polygon
        </v-btn>
        <v-btn text small>
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
}
</script>
