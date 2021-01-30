<template>
<div class="emergency">
    <v-btn dark x-large color="red" class="mx-2" @click="dialog = true">
        <v-icon x-large>mdi-alert-octagon</v-icon>
    </v-btn>
    <v-dialog
        v-model="dialog"
        max-width="425">
        <v-card>
        <v-card-title class="headline">
            <v-icon large color="red" class="pr-3">mdi-alert</v-icon>
            <h3 class="font-weight-light text-center red--text" justify="center"> Activate Emergency Stop? </h3>
        </v-card-title>
        <v-card-text justify="center">
            Warning: Vehicle will come to an immediate stop.
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