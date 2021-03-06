<template>
  <v-sheet class="px-3">
    <v-switch
        v-model="switch1"
        inset
        :label="`Keep In: ${switch1.toString()}`"
    ></v-switch>
  </v-sheet>
</template>

<script>
export default {
  data () {
    return {
      switch1: true,
    }
  },
}
</script>