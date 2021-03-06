<template>
  <v-col v-bind:class="cols" height="100%" id="map">
  </v-col>
</template>
<script>
import mapboxgl from 'mapbox-gl'
import * as conversions from '@/libraries/Conversions.js'
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import {
    CircleMode,
    DragCircleMode,
    DirectMode,
    SimpleSelectMode
} from 'mapbox-gl-draw-circle';

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
            mapboxgl.accessToken = 'pk.eyJ1IjoiaGxpbjkxIiwiYSI6ImNrbDQ2MjY4NzE0ZXEycHFpaXBya2tvN3gifQ.Tqa8iLUqXeKZQ8SmhLoRtg';
            var map = null;
            if (this.SW_bound_lat != null && this.SW_bound_long != null
                && this.NE_bound_lat != null && this.NE_bound_long != null) {
                // User supplied a valid bound
                var bounds = [
                    [this.SW_bound_long, this.SW_bound_lat],
                    [this.NE_bound_long, this.NE_bound_lat]
                ];
                map = new mapboxgl.Map({
                    container: 'map',
                    center: [this.center_long, this.center_lat],
                    zoom: this.zoom,
                    scrollZoom: false,
                    style: 'mapbox://styles/mapbox/satellite-streets-v11',
                    maxBounds: bounds
                });
            } else {
                // Create a map with no bounds
                map = new mapboxgl.Map({
                    container: 'map',
                    center: [this.center_long, this.center_lat],
                    zoom: this.zoom,
                    scrollZoom: false,
                    style: 'mapbox://styles/mapbox/satellite-streets-v11'
                });
            }
            map.doubleClickZoom.disable();
            const draw = new MapboxDraw({
                defaultMode: "drag_circle",
                userProperties: true,
                modes: {
                    ...MapboxDraw.modes,
                    draw_circle  : CircleMode,
                    drag_circle  : DragCircleMode,
                    direct_select: DirectMode,
                    simple_select: SimpleSelectMode
                }
            });
            map.addControl(draw);
            return map;
        },
        
        approxCircle: function(lng, lat, radius, numPoints) {
            // Return a list of coordinates that form an n point polygon approximation
            // of the circle
            // Lng lat is in DEGREES
            // Radius is in METERS
            if (numPoints < 3)
                return [];
            var lngRadians = conversions.toRadians(lng);
            var latRadians = conversions.toRadians(lat);
            conversions.init(lngRadians, latRadians); // Initialize circle center as anchor coordinate
            conversions.computeBasis(); // Compute basis vectors
            var center = conversions.GPStoCoord(lngRadians, latRadians); // Should be nearly (0,0)
            // Compute points on the circle using polar coordinates
            var angleStep = (Math.PI * 2) / numPoints;
            var angle = 0;
            var points = [];
            for (var i = 0; i < numPoints; ++i) {
                var x = center[0] + radius * Math.cos(angle);
                var y = center[1] + radius * Math.sin(angle);
                var p = conversions.CoordtoGPS([x, y]);
                p[0] = conversions.toDegrees(p[0]);
                p[1] = conversions.toDegrees(p[1]);
                points.push(p);
                angle += angleStep;
            }
            return points;
        },
        
        addCircle: function(lng, lat, radius, numPoints, name, color, opacity) {
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
                        'coordinates': [coords]
                    }
                }
            });
            this.map.addLayer({
                'id': name + '_layer',
                'type': 'fill',
                'source': name,
                'layout': {},
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
        this.map = this.makeMap();
        var vm = this;
        this.map.on('load', function() {
            vm.addCircle(vm.center_long, vm.center_lat, 20, 16, "test1", "black", 0.8);
            vm.addCircle(vm.center_long, vm.center_lat, 40, 16, "test2", "black", 0.8);
            vm.addCircle(vm.center_long, vm.center_lat, 50, 16, "test3", "black", 0.8);
        });
        
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
