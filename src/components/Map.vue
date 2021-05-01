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
    makeMap: function (images) {
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
      // Load images
      for (const [key, val] of images.entries()) {
        map.loadImage(val, function (error, image) {
          if (error) throw error;
          map.addImage(key, image);
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
      // If the given layer name is already used, nothing will be added and undefined will be returned
      // coords is a list of lng lat pairs in DEGREES
      // Opacity is from 0 to 1.0
      if (coords.length < 3) {
        console.warn(
          "Map.vue: addPoly: tried to add polygon with less than 3 points"
        );
        return undefined;
      }
      if (this.map.getLayer(name)) {
        console.warn("Map.vue: addPoly: given layer name already exists");
        return undefined;
      }
      // Copy the first coordinate to the last to prevent rendering artifacts
      coords.push(coords[0]);
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
      return coords;
    },

    addCircle: function (lng, lat, radius, numPoints, name, color, opacity) {
      // Adds a circle to the map at the specified coordinate with the given layer name, color, and opacity
      // If the given layer name is already used, nothing will be added and undefined will be returned
      // Lng lat in DEGREES
      // Radius in METERS
      // Opacity is from 0 to 1.0
      var coords = this.approxCircle(lng, lat, radius, numPoints);
      return this.addPoly(coords, name, color, opacity);
    },

    addCoord: function (name, icon, lng, lat) {
      // Draws an icon at the specified coordinate with the given layer name
      // Returns [lng, lat] on success, undefined on failure
      // icon is a key value that corresponds with a file path in this.icons
      if (!this.icons.has(icon)) {
        console.warn("Map.vue: addCoord: specified icon does not exist");
        return undefined;
      }
      this.map.addSource(name + "_source", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        },
      });
      this.map.addLayer({
        id: name,
        source: name + "_source",
        type: "symbol",
        layout: {
          "icon-image": icon,
          "icon-rotate": 0,
          "icon-allow-overlap": true,
        },
      });
      return [lng, lat];
    },

    removeLayer: function (name) {
      // Remove a layer and its associated source from the map if it exists
      // Returns true on success, false on failure
      if (this.map.getLayer(name)) {
        this.map.removeLayer(name);
        this.map.removeSource(name + "_source");
        return true;
      } else {
        console.warn(
          "Map.vue: removeLayer: tried to remove non-existent layer"
        );
        return false;
      }
    },

    setVisibility: function (name, visible) {
      // Set the visibility of the layer if it exists
      // Returns true on success, false on failure
      // Pass true for visible to set visibility to visible
      // Pass false to set visibility to none
      if (this.map.getLayer(name)) {
        if (visible) {
          this.map.setLayoutProperty(name, "visibility", "visible");
        } else {
          this.map.setLayoutProperty(name, "visibility", "none");
        }
        return true;
      } else {
        console.warn(
          "Map.vue: setVisibility: tried to set visibility of non-existent layer"
        );
        return false;
      }
    },

    setRotation: function (name, degrees) {
      // Set the rotation of the icon on the layer with the given name
      // Returns true on success, false on failure
      // Rotation is clockwise in DEGREES
      if (!this.map.getLayer(name)) {
        console.warn("Map.vue: setRotation: target layer does not exist");
        return false;
      }
      if (!this.map.getLayoutProperty(name, "icon-image")) {
        console.warn(
          "Map.vue: setRotation: target layer does not have icon-image property"
        );
        return false;
      }
      this.map.setLayoutProperty(name, "icon-rotate", degrees);
      return true;
    },

    editPolySource: function (name, coords) {
      // Currently assumes that coords is valid
      // Returns true on success, false on failure
      if (!this.map.getLayer(name)) {
        console.warn("Map.vue: editPolySource: invalid layer name passed");
        return false;
      }
      this.map.getSource(name + "_source").setData({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [coords],
        },
      });
      return true;
    },

    editPointSource: function (name, coord) {
      // Currently assumes that coord is valid
      // Returns true on success, false on failure
      if (!this.map.getLayer(name)) {
        console.warn("Map.vue: editPointSource: invalid layer name passed");
        return false;
      }
      this.map.getSource(name + "_source").setData({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coord,
        },
      });
      return true;
    },

    editLayerColor: function (name, color) {
      // Returns true on success, false on failure
      if (this.map.getLayer(name)) {
        this.map.setPaintProperty(name, "fill-color", color);
        return true;
      } else {
        console.warn(
          "Map.vue: editLayerColor: tried to edit non-existent layer"
        );
        return false;
      }
    },

    editLayerOpacity: function (name, opacity) {
      // Returns true on success, false on failure
      if (this.map.getLayer(name)) {
        this.map.setPaintProperty(name, "fill-opacity", opacity);
        return true;
      } else {
        console.warn(
          "Map.vue: editLayerOpacity: tried to edit non-existent layer"
        );
        return false;
      }
    },
    styleLoaded() {
      this.$emit("mapMounted")
    }
  },

  data: {
    function() {
      return {
        map: null, // Reference to the mapbox object
        icon: null, // Map of icon names to file paths
      };
    },
  },
  mounted() {
    this.icons = new Map([
      [
        "custom_marker",
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
      ],
      [
        "eru",
        "https://raw.githubusercontent.com/NGCP-GCS-2021/front-end-21/harvey/src/assets/map_icons/eru.png",
      ],
      [
        "evac-point",
        "https://raw.githubusercontent.com/NGCP-GCS-2021/front-end-21/harvey/src/assets/map_icons/evac-point.png",
      ],
      [
        "geofence",
        "https://raw.githubusercontent.com/NGCP-GCS-2021/front-end-21/harvey/src/assets/map_icons/geofence.png",
      ],
      [
        "hiker",
        "https://raw.githubusercontent.com/NGCP-GCS-2021/front-end-21/harvey/src/assets/map_icons/hiker.png",
      ],
      [
        "home",
        "https://raw.githubusercontent.com/NGCP-GCS-2021/front-end-21/harvey/src/assets/map_icons/home.png",
      ],
      [
        "mac",
        "https://raw.githubusercontent.com/NGCP-GCS-2021/front-end-21/harvey/src/assets/map_icons/mac.png",
      ],
      [
        "mea",
        "https://raw.githubusercontent.com/NGCP-GCS-2021/front-end-21/harvey/src/assets/map_icons/mea.png",
      ],
      [
        "drop-location",
        "https://raw.githubusercontent.com/NGCP-GCS-2021/front-end-21/harvey/src/assets/map_icons/search-area.png",
      ],
    ]);
    this.map = this.makeMap(this.icons);
    // For testing
    var vm = this;
    this.map.on("load", function () {
      // var tempCoords = [
      //     [-117.6311926970484, 33.93459532438122],
      //     [-117.6314209323399, 33.93364332758927],
      //     [-117.63052445140261, 33.93404089266308]
      // ];
      // vm.addCircle(vm.center_long, vm.center_lat, 20, 16, "test1", "black", 0.8);
      // vm.addCircle(vm.center_long, vm.center_lat, 40, 16, "test2", "black", 0.8);
      // vm.addCircle(vm.center_long, vm.center_lat, 50, 16, "test3", "black", 0.8);
      // vm.editLayerOpacity("test1", 0);
      // vm.editLayerColor("test2", "red");
      // vm.removeLayer("test3");
      // vm.addCoord("hometest", "drop-location",  -117.63282, 33.9334264);
      // vm.setRotation("test_point", 90);
      // vm.setRotation("test_point", 70);
      // vm.editPointSource("test_point", [-117.63052445140261, 33.93404089266308]);
      // vm.editPolySource("test2", tempCoords);
      // vm.addCoord("test_point2", "hiker", vm.center_long, vm.center_lat);
      vm.styleLoaded();
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
