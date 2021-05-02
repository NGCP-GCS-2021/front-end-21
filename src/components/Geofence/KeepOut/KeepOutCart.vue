<template>
  <v-container>
    <v-container>
      <v-row>
        <h3 class="font-weight-light" pa-0 ma-0>
          Keep Out Areas - [Latitude, Longitude]
        </h3>
      </v-row>
    </v-container>
    <v-container>
      <div
        class="scrollable"
        style="height: 145px; overflow-y: hidden; overflow-x: hidden"
      >
        <v-container v-if="keepOutEmpty">
          <v-row>
            <h4>
              <code>No Keep Out Areas have been added.</code>
            </h4>
          </v-row>
        </v-container>
        <v-row v-for="(Coordinates, k) in CoordinatesArray" :key="k">
          <v-container>
            <h4 class="font-weight-light" pa-0 ma-0>
              <code
                ><i>Area {{ k + 1 }}</i></code
              >
            </h4>
            <v-container>
              <v-col>
                <v-row v-for="(Coordinates, j) in Coordinates" :key="j">
                  <h4 class="font-weight-light" pa-0 ma-0>
                    <code
                      >Coordinate {{ j + 1 }}: [{{ Coordinates.lat }},
                      {{ Coordinates.lng }}]</code
                    >
                  </h4>
                </v-row>
              </v-col>
              <v-col :cols="1" align="center">
                <v-icon class="mt-2" color="red" @click="removeArea(k)"
                  >mdi-minus-circle</v-icon
                >
              </v-col>
            </v-container>
            <v-divider></v-divider>
          </v-container>
        </v-row>
      </div>
    </v-container>
  </v-container>
</template>

<script>
export default {
  props: ["vehicle", "keepOutEmpty"],
  data: () => ({
    CoordinatesArray: [],
    CircleInputsArray: [],
  }),
  methods: {
    removeArea(k) {
      this.CoordinatesArray.splice(k, 1);
      this.$emit("removeKeepOutArea");
      if (this.CoordinatesArray.length == 0) {
        this.$emit("setKeepOutEmpty", true);
      }
    },
  },
};
</script>
