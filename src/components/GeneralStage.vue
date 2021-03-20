<template>
  <!-- <v-card class="pa-2" width="100%" v-if="currentStage & vehicle">
      <h1 class="font-weight-light text-center">
        General Mission Stage: <br />
      </h1>
      <h1 class="font-weight-regular text-center display-2">ERU Drop</h1>
    </v-card> -->
  <v-card class="pa-2" width="100%" v-if="updatedStage && updatedVehicle">
    <h1 class="font-weight-light text-center">General Mission Stage: <br /></h1>
    <h1 class="font-weight-regular text-center display-2">
      {{ updatedVehicle }}: {{ updatedStage }}
    </h1>
  </v-card>
  <v-card class="pa-2" width="100%" v-else-if="stage && vehicle">
    <h1 class="font-weight-light text-center">General Mission Stage: <br /></h1>
    <h1 class="font-weight-regular text-center display-2">
      {{ vehicle }}: {{ stage }}
    </h1>
  </v-card>
  <v-card class="pa-2" width="100%" v-else>
    <h1 class="font-weight-light text-center">General Mission Stage:<br /></h1>
    <h1 class="font-weight-regular text-center display-2">No stage set</h1>
    <!-- <p>Stage: {{ stage }}</p>
    <p>Vehicle: {{ vehicle }}</p> -->
  </v-card>
</template>

<script>
export default {
  props: ["stage", "vehicle", "updatedStage", "updatedVehicle"],
  data: () => ({}),
};
</script>