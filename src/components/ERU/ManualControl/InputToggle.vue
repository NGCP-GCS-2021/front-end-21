<template>
  <div>
    <h1 class="font-weight-light text-center">Select an Input:</h1>
    <v-card-actions class="justify-center">
      <v-btn-toggle v-model="inputSelect">
        <v-btn value="keyboard" @click="selectKeyboard">
          <h1 class="font-weight-light">Keyboard</h1>
          <v-icon color="purple">mdi-keyboard-outline</v-icon>
        </v-btn>
        <v-btn value="controller" @click="selectController">
          <h1 class="font-weight-light">Controller</h1>
          <v-icon color="green">mdi-controller-classic-outline</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-card-actions>
  </div>
</template>