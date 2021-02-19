<template>
  <v-col v-bind:class="cols" height="100%" id="map">
  </v-col>
</template>

<script>
import mapboxgl from 'mapbox-gl'

export default {
    props:['cols'],
    
    head () {
        return  {
            script: [
                { src: 'https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js' }
            ],
            link: [
                { 
                    href: 'https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css',
                    rel: 'stylesheet'
                }
            ]
        }
    },
    methods: {
        makeMap: function() {
            // Creates and adds a mapbox to the element with id "map"
            mapboxgl.accessToken = 'pk.eyJ1IjoiaGxpbjkxIiwiYSI6ImNrbDQ2MjY4NzE0ZXEycHFpaXBya2tvN3gifQ.Tqa8iLUqXeKZQ8SmhLoRtg';
            
            return new mapboxgl.Map({
                container: 'map',
                center: [-74.5, 40],
                zoom: 9,
                style: 'mapbox://styles/mapbox/streets-v11'
            });
        }
    },
    data: {
        function() {
            return {
                map: null
            }
        }
    },
    mounted() {
        map = this.makeMap()
        map.addControl(new mapboxgl.NavigationControl());
    },
    template: '<v-col :cols={{ cols }} height="100%" id="map"></v-col>'
}
</script>

<style>
  .map {
    height: 100%;
    width: 100%;
  }
</style>
