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
        style="height: 165px; overflow-y: hidden; overflow-x: hidden"
      >
        <v-container v-if="submitDisabled">
          <v-row>
            <h4>
              <code>No Keep In Areas have been added.</code>
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
              <v-row v-for="(Coordinates, j) in Coordinates" :key="j">
                <h4 class="font-weight-light" pa-0 ma-0>
                  <code
                    >Coordinate {{ j + 1 }}: [{{ Coordinates.lat }},
                    {{ Coordinates.lng }}]</code
                  >
                </h4>
              </v-row>
            </v-container>
            <v-divider></v-divider>
          </v-container>
        </v-row>
      </div>
    </v-container>
    <v-container>
      <v-row>
        <v-col align="center">
          <v-btn
            color="green"
            :disabled="submitDisabled"
            @click="postGeofenceKeepOut"
          >
            Submit All
          </v-btn>
        </v-col>
        <v-col align="center">
          <v-btn color="red" :disabled="deleteDisabled" @click="dialog = true">
            Delete All
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">
          <v-icon large color="red" class="pr-3">mdi-alert</v-icon>
          <h3 class="font-weight-light text-center red--text" justify="center">
            Delete All Geofences (Keep Out)?
          </h3>
        </v-card-title>
        <v-card-text justify="center">
          Warning: Current {{ vehicle }} Geofences (Keep Out) will be deleted.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="secondary" text @click="dialog = false"> Cancel </v-btn>

          <v-btn color="primary" text @click="deleteAll"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  props: ["vehicle"],
  data: () => ({
    dialog: false,
    Geofence: {
      Geofence: {
        Coordinates: [],
        Keep_in: false,
      },
    },
    CoordinatesArray: [],
    submitDisabled: true,
    deleteDisabled: true,
  }),
  methods: {
    addCoordinates(coordinates) {
      this.CoordinatesArray.push(coordinates);
      this.submitDisabled = false;
      this.deleteDisabled = false;
    },
    deleteAll() {
      this.dialog = false;
      this.CoordinatesArray = [];
      this.deleteDisabled = true;
      this.submitDisabled = true;
      //console.log(this.CoordinatesArray);
    },
    postGeofenceKeepOut() {
      for (let i = 0; i < this.CoordinatesArray.length; i++) {
        this.Geofence.Geofence.Coordinates = this.CoordinatesArray[i];

        for (let i = 0; i < this.Geofence.Geofence.Coordinates.length; i++) {
          this.Geofence.Geofence.Coordinates[i].lat = parseFloat(
            this.Geofence.Geofence.Coordinates[i].lat
          );
          this.Geofence.Geofence.Coordinates[i].lng = parseFloat(
            this.Geofence.Geofence.Coordinates[i].lng
          );
        }

        const geofenceStringify = JSON.stringify(this.Geofence);
        let path = "";
        if (this.vehicle == "MAC") {
          path = "http://127.0.0.1:5000/MAC_INPUT";
        } else if (this.vehicle == "ERU") {
          path = "http://127.0.0.1:5000/ERU_INPUT";
        } else if (this.vehicle == "MEA") {
          path = "http://127.0.0.1:5000/ERU_INPUT";
        }
        axios
          .post(path, geofenceStringify)
          .then(() => {
            if (this.vehicle == "MAC") {
              console.log("Posted Geofence (Keep In) coordinates to MAC_INPUT");
            } else if (this.vehicle == "ERU") {
              console.log("Posted Geofence (Keep In) coordinates to ERU_INPUT");
            } else if (this.vehicle == "MEA") {
              console.log("Posted Geofence (Keep In) coordinates to MEA_INPUT");
            }
            console.log(geofenceStringify);
          })
          .catch((error) => {
            console.log(geofenceStringify);
            console.log(error.response);
          });
      }
    },
  },
};
</script>