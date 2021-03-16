<template>
  <nav id="nav">
    <v-app-bar fixed app class="primary">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-img
        class="rounded-circle mx-3"
        max-height="99%"
        max-width="4%"
        src="../assets/ngcp.png"
      ></v-img>
      <v-toolbar-title>
        <span><h1 class="accent--text font-weight-light">GCS</h1></span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link :to="{ name: 'Main', params: { stage, vehicle } }"
        ><h1 class="font-weight-light">Main</h1></router-link
      >
      <router-link :to="{ name: 'MAC', params: { stage, vehicle } }"
        ><h1 class="font-weight-light">MAC</h1></router-link
      >
      <router-link :to="{ name: 'ERU', params: { stage, vehicle } }"
        ><h1 class="font-weight-light">ERU</h1></router-link
      >
      <router-link :to="{ name: 'MEA', params: { stage, vehicle } }"
        ><h1 class="font-weight-light">MEA</h1></router-link
      >
      <router-link to="/geofence"
        ><h1 class="font-weight-light">Geofence</h1></router-link
      >
    </v-app-bar>
    <v-main>
      <router-view @setGeneralStage="setGeneralStage"></router-view>
    </v-main>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      stage: "[Stage]",
      vehicle: "[Vehicle]",
    };
  },
  methods: {
    setGeneralStage(stage, vehicle) {
      this.stage = stage;
      this.vehicle = vehicle;
      //console.log(stage);
      //console.log("a nice hot cup of tea");
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
#nav a {
  padding: 40px;
  font-size: xx-large;
  text-decoration: none;
  color: #c9e7ff;
}

#nav a.router-link-exact-active {
  color: #61a3ff;
  text-decoration: underline;
}

#nav a:hover {
  text-decoration: underline;
}
</style>