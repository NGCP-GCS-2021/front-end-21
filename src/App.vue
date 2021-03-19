<template>
  <v-app class="grey lighten-2">
    <Navbar />
  </v-app>
</template>

<script>

import Navbar from '@/components/Navbar.vue'

export default {
  name: 'App',

  components: {
    Navbar
  },

  data: () => ({
    //
  }),
};
</script>

<style>
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #021d48;*/
  background-color: rgb(218, 218, 218);
}

</style>
