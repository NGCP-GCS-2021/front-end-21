<template>
  <v-card-actions class="justify-left">
    <v-btn class="mx-2" fab dark color="gray" @click="back">
      <v-icon dark> mdi-arrow-left </v-icon>
    </v-btn>
  </v-card-actions>
</template>

<script>
export default {
  data: () => ({}),
  methods: {
    back() {
      this.$emit("back", false);
      this.$emit("deactivate", false)
      this.$emit("inputSelected", null)
    },
  },
};
</script>