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
        },
        SW_bound_lat: {
            default: null,
            type: Number
        },
        SW_bound_long: {
            default: null,
            type: Number
        },
        NE_bound_lat: {
            default: null,
            type: Number
        },
        NE_bound_long: {
            default: null,
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
            mapboxgl.accessToken = 'pk.eyJ1IjoiaGxpbjkxIiwiYSI6ImNrbDQ2MjY4NzE0ZXEycHFpaXBya2tvN3gifQ.Tqa8iLUqXeKZQ8SmhLoRtg';
            if (this.SW_bound_lat != null && this.SW_bound_long != null
                && this.NE_bound_lat != null && this.NE_bound_long != null) {
                // User supplied a valid bound
                var bounds = [
                    [this.SW_bound_long, this.SW_bound_lat],
                    [this.NE_bound_long, this.NE_bound_lat]
                ];
                return new mapboxgl.Map({
                    container: 'map',
                    center: [this.center_long, this.center_lat],
                    zoom: this.zoom,
                    style: 'mapbox://styles/mapbox/satellite-streets-v11',
                    maxBounds: bounds
                });
            } else {
                // Create a map with no bounds
                return new mapboxgl.Map({
                    container: 'map',
                    center: [this.center_long, this.center_lat],
                    zoom: this.zoom,
                    style: 'mapbox://styles/mapbox/satellite-streets-v11'
                });
            }
        },
        
        addCircle: function(longitude, latitude, radius, name, color) {
            // TODO: Test this
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
        },
        
        addCoord: function(lng, lat) {
            // Taken from CurrentMap.html
            var point = new mapboxgl.Point(lng, lat);
            var marker = new mapboxgl.Marker()
                .setLngLat([lng,lat])
                .setPopup(new mapboxgl.Popup().setHTML(lng + ',' + lat))
                .addTo(this.map); // add the marker to the map
            
            return {
                center: [lng, lat],
                geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                },
                
                place_name: 'Lat: ' + lat + ' Lng: ' + lng,
                place_type: ['coordinate'],
                properties: {},
                type: 'Feature'
            };
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
