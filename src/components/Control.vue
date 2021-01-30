<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn x-large dark color="primary" v-bind="attrs" v-on="on" ><v-icon x-large>mdi-gamepad-square</v-icon></v-btn>
      </template>

      <v-card>
        
        <v-select
            class="pa-4"
            v-model="select"
            :items="stages"
            :rules="[v => !!v || 'Please select stage']"
            label="Stage"
            required
        ></v-select>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="secondary"
            text
            @click= "menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            @click= "menu = false"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
    data: () => ({
      menu:false,
      stages: [
          'Standby',
          'Minimum Altitude Climb',
          'Eru Drop',
          'Load Hiker',
          'Return Home',
        ],
      })
}
</script>