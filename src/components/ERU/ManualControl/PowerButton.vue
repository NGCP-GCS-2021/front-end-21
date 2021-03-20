<template>
  <v-card-actions class="justify-end">
    <v-btn class="mx-2" fab dark color="green">
      <v-icon dark @click="activate"> mdi-power-standby </v-icon>
    </v-btn>
  </v-card-actions>
</template>

<script>
export default {
  data: () => ({}),
  methods: {
    activate() {
      this.$emit("activate", true);
    },
  },
};
</script>