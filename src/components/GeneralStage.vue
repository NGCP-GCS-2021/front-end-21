<template>
    <!-- <v-card class="pa-2" width="100%" v-if="currentStage & vehicle">
      <h1 class="font-weight-light text-center">
        General Mission Stage: <br />
      </h1>
      <h1 class="font-weight-regular text-center display-2">ERU Drop</h1>
    </v-card> -->
    <v-card class="pa-2" width="100%" v-if="stage && vehicle">
      <h1 class="font-weight-light text-center">
        General Mission Stage: <br />
      </h1>
      <h1 class="font-weight-regular text-center display-2">{{vehicle}}: {{stage}}</h1>
    </v-card>
    <v-card class="pa-2" width="100%" v-else>
      <h1 class="font-weight-light text-center">
        General Mission Stage:<br />
      </h1>
      <h1 class="font-weight-regular text-center display-2"> Not Set</h1>
    </v-card>
</template>

<script>
export default {
  data: () => ({
    stage: null,
    vehicle: null,
  }),
};
</script>