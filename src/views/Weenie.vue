<template>
  <div>
    <h1>Weenie</h1>
    <v-btn @click="goNextPage">Go Next Page</v-btn>

  </div>
  
</template>

<script>
export default {
  method: {
    goNextPage(){
      console.log("hello")
      this.$router.push({name: "Geofence"})
    },
  }

}
</script>

<style>

</style>