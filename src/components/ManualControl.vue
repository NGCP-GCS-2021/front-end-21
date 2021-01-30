<template>
<div class="emergency">
    <v-btn dark color="primary" @click="dialog=true">Manual Control<v-icon>mdi-gamepad</v-icon></v-btn>
    <v-dialog
        v-model="dialog"
        max-width="500">
        <v-card>
        <v-card-title class="headline">
            <v-icon large color="primary" class="pr-3">mdi-gamepad</v-icon>
            <h3 class="font-weight-light text-center primary--text" justify="center"> Activate ERU Manual Control? </h3>
        </v-card-title>
        <v-card-text justify="center">
            Vehicle will be controlled by GCS.
        </v-card-text>

        <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
            color="secondary"
            text
            @click="dialog = false"
            >
        Cancel
        </v-btn>

        <v-btn
            color="primary"
            text
             @click="dialog = false"
        >
        Activate
        </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
      }
    },
  }
</script>