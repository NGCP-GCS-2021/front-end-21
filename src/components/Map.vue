<template>
  <v-col v-bind:class="cols" height="100%" id="map"> </v-col>
</template>
<script>
import mapboxgl from "mapbox-gl";
import * as conversions from "@/libraries/Conversions.js";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode,
} from "mapbox-gl-draw-circle";

export default {
  props: {
    cols: {
      default: "",
      type: String,
    },
    center_lat: {
      default: 34,
      type: Number,
    },
    center_long: {
      default: -117,
      type: Number,
    },
    zoom: {
      default: 9,
      type: Number,
    },
    SW_bound_lat: {
      default: null,
      type: Number,
    },
    SW_bound_long: {
      default: null,
      type: Number,
    },
    NE_bound_lat: {
      default: null,
      type: Number,
    },
    NE_bound_long: {
      default: null,
      type: Number,
    },
  },

  head() {
    return {
      script: [
        { src: "https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js" },
      ],
      link: [
        {
          href: "https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css",
          rel: "stylesheet",
        },
      ],
    };
  },
  methods: {
    makeMap: function () {
      // Creates and adds a mapbox to the element with id 'map'
      mapboxgl.accessToken =
        "pk.eyJ1IjoiaGxpbjkxIiwiYSI6ImNrbDQ2MjY4NzE0ZXEycHFpaXBya2tvN3gifQ.Tqa8iLUqXeKZQ8SmhLoRtg";
      var map = null;
      if (
        this.SW_bound_lat != null &&
        this.SW_bound_long != null &&
        this.NE_bound_lat != null &&
        this.NE_bound_long != null
      ) {
        // User supplied a valid bound
        var bounds = [
          [this.SW_bound_long, this.SW_bound_lat],
          [this.NE_bound_long, this.NE_bound_lat],
        ];
        map = new mapboxgl.Map({
          container: "map",
          center: [this.center_long, this.center_lat],
          zoom: this.zoom,
          scrollZoom: false,
          style: "mapbox://styles/mapbox/satellite-streets-v11",
          maxBounds: bounds,
        });
      } else {
        // Create a map with no bounds
        map = new mapboxgl.Map({
          container: "map",
          center: [this.center_long, this.center_lat],
          zoom: this.zoom,
          scrollZoom: false,
          style: "mapbox://styles/mapbox/satellite-streets-v11",
        });
      }
      map.doubleClickZoom.disable();
      // TODO: Deal with interactive drawing later if we have time
      // const draw = new MapboxDraw({
      //     defaultMode: 'drag_circle',
      //     userProperties: true,
      //     modes: {
      //         ...MapboxDraw.modes,
      //         draw_circle  : CircleMode,
      //         drag_circle  : DragCircleMode,
      //         direct_select: DirectMode,
      //         simple_select: SimpleSelectMode
      //     }
      // });
      // map.addControl(draw);
      // // TODO: Decide on appropriate draw.create and draw.update listeners
      // map.on('draw.create', function (e) {
      //     console.log(e.features);
      // });
      // map.on('draw.update', function (e) {
      //     console.log(e.features);
      // });
      return map;
    },

    approxCircle: function (lng, lat, radius, numPoints) {
      // Return a list of coordinates that form an n point polygon approximation
      // of the circle
      // Lng lat is in DEGREES
      // Radius is in METERS
      if (numPoints < 3) return [];
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

    addPoly: function (coords, name, color, opacity) {
      // Add a list of coordinates as a polygon with the given layer name, color, and opacity
      // If the given layer name is already used, nothing will be added
      // coords is a list of lng lat pairs in DEGREES
      // Opacity is from 0 to 1.0
      if (coords.length < 3) {
        console.warn(
          "Map.vue: addPoly: tried to add polygon with less than 3 points"
        );
        return;
      }
      if (this.map.getLayer(name)) {
        console.warn("Map.vue: addPoly: given layer name already exists");
        return;
      }
      // We will use the convention that the source associated with layer name n
      // is n_source
      this.map.addSource(name + "_source", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coords],
          },
        },
      });
      this.map.addLayer({
        id: name,
        type: "fill",
        source: name + "_source",
        layout: {},
        paint: {
          "fill-color": color,
          "fill-opacity": opacity,
        },
      });
      console.log("got to addpoly");
    },

    addCircle: function (lng, lat, radius, numPoints, name, color, opacity) {
      // Adds a circle to the map at the specified coordinate with the given layer name, color, and opacity
      // If the given layer name is already used, nothing will be added
      // Lng lat in DEGREES
      // Radius in METERS
      // Opacity is from 0 to 1.0
      var coords = this.approxCircle(lng, lat, radius, numPoints);
      this.addPoly(coords, name, color, opacity);
    },

    addCoord: function (name, lng, lat) {
      var vm = this;
      vm.map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function (error, image) {
          if (error) throw error;
          vm.map.addImage("custom_marker", image);
          vm.map.addSource(name + "_source", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lng, lat],
              },
            },
          });
          vm.map.addLayer({
            id: name,
            source: name + "_source",
            type: "symbol",
            layout: {
              "icon-image": "custom_marker",
            },
          });
        }
      );
    },

    removeLayer: function (name) {
      // Remove a layer and its associated source from the map if it exists
      if (this.map.getLayer(name)) {
        this.map.removeLayer(name);
        this.map.removeSource(name + "_source");
      } else {
        console.warn(
          "Map.vue: removeLayer: tried to remove non-existent layer"
        );
      }
    },

    setVisibility: function (name, visible) {
      // Set the visibility of the layer if it exists
      // Pass true for visible to set visibility to visible
      // Pass false to set visibility to none
      if (this.map.getLayer(name)) {
        if (visible) {
          this.map.setLayoutProperty(name, "visibility", "visible");
        } else {
          this.map.setLayoutProperty(name, "visibility", "none");
        }
      } else {
        console.warn(
          "Map.vue: setVisibility: tried to set visibility of non-existent layer"
        );
      }
    },

    editPolySource: function (name, coords) {
      // Currently assumes that coords is valid
      // TODO: Needs testing
      if (!this.map.getLayer(name)) {
        console.warn("Map.vue: editPolySource: invalid layer name passed");
        return;
      }
      let geo = this.map.getSource(name + "_source").data.geometry;
      if (geo.type != "Polygon") {
        console.warn("Map.vue: editPolySource: target source is not a Polygon");
        return;
      }
      geo.coordinates = coords;
    },

    editPointSource: function (name, coord) {
      // Currently assumes that coord is valid
      // TODO: Needs testing
      if (!this.map.getLayer(name)) {
        console.warn("Map.vue: editPointSource: invalid layer name passed");
        return;
      }
      let geo = this.map.getSource(name + "_source").data.geometry;
      if (geo.type != "Point") {
        console.warn("Map.vue: editPointSource: target source is not a Point");
        return;
      }
      geo.coordinates = coord;
    },

    editLayerColor: function (name, color) {
      if (this.map.getLayer(name)) {
        this.map.setPaintProperty(name, "fill-color", color);
      } else {
        console.warn(
          "Map.vue: editLayerColor: tried to edit non-existent layer"
        );
      }
    },

    editLayerOpacity: function (name, opacity) {
      // TODO: Needs testing
      if (this.map.getLayer(name)) {
        this.map.setPaintProperty(name, "fill-opacity", opacity);
      } else {
        console.warn(
          "Map.vue: editLayerOpacity: tried to edit non-existent layer"
        );
      }
    },
  },

  data: {
    function() {
      return {
        map: null, // Reference to the mapbox object
      };
    },
  },
  mounted() {
    this.map = this.makeMap();
    // For testing
    var vm = this;
    var tempCoords = [
      [-117.6311926970484, 33.93459532438122],
      [-117.6314209323399, 33.93364332758927],
      [-117.63052445140261, 33.93404089266308],
    ];
    this.map.on("load", function () {
      vm.addCircle(
        vm.center_long,
        vm.center_lat,
        20,
        16,
        "test1",
        "black",
        0.8
      );
      vm.addCircle(
        vm.center_long,
        vm.center_lat,
        40,
        16,
        "test2",
        "black",
        0.8
      );
      vm.addCircle(
        vm.center_long,
        vm.center_lat,
        50,
        16,
        "test3",
        "black",
        0.8
      );
      vm.editLayerOpacity("test1", 0);
      vm.editLayerColor("test2", "red");
      vm.removeLayer("test3");
      vm.removeLayer("test2");
      vm.addCoord("test_point", vm.center_long, vm.center_lat);
      //vm.addPoly(tempCoords, "SearchArea", "red", 0.8);
    });
  },
  template: '<v-col :cols={{ cols }} height="100%" id="map"></v-col>',
};
</script>

<style>
.map {
  height: 100%;
  width: 100%;
}
</style>
