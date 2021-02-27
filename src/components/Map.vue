<template>
  <v-col v-bind:class="cols" height="100%" id="map">
  </v-col>
</template>

<script>
import mapboxgl from 'mapbox-gl'

export default {
    props: {
        cols: {
            type: String
        },
        center_lat: {
            default: 34,
            type: Number
        },
        center_long: {
            default: -70,
            type: Number
        },
        zoom: {
            default: 9,
            type: Number
        }
    },
    
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
            // TODO: Add support for passing in start coordinates, zoom level, and bounds
            mapboxgl.accessToken = 'pk.eyJ1IjoiaGxpbjkxIiwiYSI6ImNrbDQ2MjY4NzE0ZXEycHFpaXBya2tvN3gifQ.Tqa8iLUqXeKZQ8SmhLoRtg';
            
            return new mapboxgl.Map({
                container: 'map',
                center: [this.center_long, this.center_lat],
                zoom: this.zoom,
                style: 'mapbox://styles/mapbox/satellite-streets-v11'
            });
        },
        
        addCircle: function(latitude, longitude, radius, name, color) {
            // Adds a circle to the map at the specified coordinate
            // With specified radius in METERS, name, and color

            // Used to set the radius for max zoom level 22 so circle scales accurately with zoom
            const metersToPixelsAtMaxZoom = (meters, latitude) =>
                  meters / (78271.484 / 2 ** 22) / Math.cos(latitude * Math.PI / 180)
            
            this.map.addSource(name, {
                'type': 'geojson',
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [latitude, longitude]
                }
            });
            this.map.addLayer({
                'id': name + '_layer',
                'type': 'circle',
                'source': name,
                'paint': {
                    'circle-radius': {
                        'base': radius,
                        'stops': [
                            [0,0],
                            [22, metersToPixelsAtMaxZoom(radius, latitude)]
                        ]
                    },
                    'circle-color': color
                }
            });
        }
    },
    data: {
        function() {
            return {
                map: null
            };
        }
    },
    mounted() {
        map = this.makeMap();
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
