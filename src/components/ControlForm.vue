<template>
<div>
  <h1 class="font-weight-light">State Command</h1>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    class="pa-5"
  >
    <v-select
      v-model="select"
      :items="stages"
      :rules="[v => !!v || 'State is required']"
      label="Select Mission State"
      required
    ></v-select>
    <v-btn
      :disabled="!valid"
      color="green"
      class="mr-5"
      @click="validate"
    >
      Submit
    </v-btn>
    <v-dialog
        v-model="dialog"
        max-width="425">
        <v-card>
        <v-card-title class="headline">
            <v-icon large color="red" class="pr-3">mdi-alert</v-icon>
            <h5 class="font-weight-light text-center red--text" justify="center"> Undo Mission State Subsmission? </h5>
        </v-card-title>
        <v-card-text justify="center">
            Warning: Vehicle will be commanded to begin previous state.
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
        Undo
        </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
  </v-form>
</div>
</template>

<script>
export default {
    data: () => ({
      dialog: false, 
      valid: true,
      stages: [
        'Standby',
        'Minimum Altitude Climb',
        'Eru Drop',
        'Load Hiker',
        'Return Home',
      ],
    }),
    methods: {
      validate () {
        this.$refs.form.validate()
      }
    }
}
</script>