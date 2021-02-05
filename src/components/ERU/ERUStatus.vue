<template>
    <div>
        <v-row justify="center">
            <h2 class="font-weight-light pr-2">Vehicle Mission Stage:</h2>
            <h2 class="font-weight-regular pb-2">ERU Drop</h2>
        </v-row>
        <v-row justify="space-around">
            <h4 class="font-weight-light pr-3"></h4>Speed: <h4 class="font-weight-bold pr-3" >80 </h4>
            <h4 class="font-weight-light pr-3"></h4>Longitude: <h4 class="font-weight-bold pr-3">89345 </h4>
            <h4 class="font-weight-light pr-3"></h4>Latitude: <h4 class="font-weight-bold pr-3">45893450 </h4>
            <h4 class="font-weight-light pr-3 pb-2"></h4>Altitude: <h4 class="font-weight-bold pr-3 pb-2">7384 </h4>
        </v-row>
        <v-row justify="space-around">
            <h4 class="font-weight-light pr-3"></h4>In Geofence: <h4 class="font-weight-bold pr-3" >True </h4>
            <h4 class="font-weight-light pr-3"></h4>Connection: <h4 class="font-weight-bold pr-3">5</h4>
            <h4 class="font-weight-light pr-3"></h4>Ready: <h4 class="font-weight-bold pr-3">True </h4>
            <h4 class="font-weight-light pr-3 pb-3"></h4>Battery: <h4 class="font-weight-bold pr-3 pb-3">88</h4>
        </v-row>
        <v-row justify="left">
            <h3 class="font-weight-bold">Messages:</h3>
        </v-row>
        <v-row fluid justify="center">
            <v-col :cols="12">
                <div  class="scrollable" style="border: 1px solid #BFBFBF; font-size: small; border-radius: 5px; height: 65px; overflow-y:hidden;">
                    <p class="my-0 py-0 px-1"> Vehicle connected to GCS</p>
                    <p class="my-0 py-0 px-1"> Location Sent</p>
                    <p class="my-0 py-0 px-1"> Speed Sent</p>
                    <p class="my-0 py-0 px-1"> Altitude Sent</p>
                    <p class="my-0 py-0 px-1"> Error 404</p>
                    <p class="my-0 py-0 px-1"> Re-connected</p>
                    <p class="my-0 py-0 px-1"> Updated</p>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {

  data(){
    return{

    };
  },
};
</script>

<style>
.scrollable:hover, .scrollable:active, .scrollable:focus {
  overflow-y: auto !important;
}
</style>