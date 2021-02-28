<template>
  <v-col v-bind:class="cols" height="100%" id="map">
  </v-col>
</template>
<script>
import mapboxgl from 'mapbox-gl'

export default {
    props: {
        cols: {
            default: "",
            type: String
        },
        center_lat: {
            default: 34,
            type: Number
        },
        center_long: {
            default: -117,
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
            // TODO: Lock the zoom level
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
        
        addCircle: function(lng, lat, radius, numPoints, name, color, opacity) {
            // TODO: Needs testing
            // Adds a circle to the map at the specified coordinate
            // Lng lat in DEGREES
            // Radius in METERS
            // Opacity is from 0 to 1.0
            var coords = this.approxCircle(lng, lat, radius, numPoints);
            
            this.map.addSource(name, {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': coords,
                    }
                }
            });
            this.map.addLayer({
                'id': name + '_layer',
                'type': 'fill',
                'source': name,
                'paint': {
                    'fill-color': color,
                    'fill-opacity': opacity
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
        },

        approxCircle: function(lng, lat, radius, numPoints) {
            // Return a list of coordinates that form an n point polygon approximation
            // of the circle
            // Lng lat is in DEGREES
            // Radius is in METERS
            if (numPoints < 3)
                return [];
            // Calculate the meters per pixel conversion factor
            var earthCircum = 40075017; // In meters
            var latitudeRadians = latitude * (Math.PI/180);
            // Use this.zoom + 8 for 256px tiles, this.zoom + 9 for 512px tiles
            var metersPerPixel = earthCircum * Math.cos(latitudeRadians) / Math.pow(2, this.zoom + 8);
            var radiusInPixels = radius / metersPerPixel;
            var center = this.map.project([lng, lat]); // Center coordinate in pixels
            // Compute points on the circle using polar coordinates
            var angleStep = (Math.PI * 2) / numPoints;
            var angle = 0;
            var points = [];
            for (var i = 0; i < numPoints; ++i) {
                var p = new mapboxgl.Point();
                p.x = center.x + radiusInPixels * Math.cos(angle);
                p.y = center.y + radiusInPixels * Math.sin(angle);
                points.push(this.map.unproject(p));
                angle += angleStep;
            }
            return points;
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
