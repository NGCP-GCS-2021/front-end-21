<template>
  <v-card class="pa-2" width="100%">
    <h1 class="font-weight-regular text-center display-2">Select a Vehicle:</h1>
    <v-card-actions class="justify-center">
      <v-btn-toggle v-model="vehicleSelect" background-color="primary">
        <v-btn value="MAC"> MAC </v-btn>
        <v-btn value="ERU"> ERU </v-btn>
        <v-btn value="MEA"> MEA </v-btn>
      </v-btn-toggle>
    </v-card-actions>
  </v-card>
</template>
