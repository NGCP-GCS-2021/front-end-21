<template>
  <div>
      <h1> Team B </h1>
      <v-btn @click="toWeeniePage" >
      Go to Weenie!
      </v-btn>
  </div>
</template>

<script>
export default {
    methods: {
    toWeeniePage(){
      console.log("yeeee")
      this.$router.push({name: "Weenie"})
        },
    }
}
</script>

<style>

</style>