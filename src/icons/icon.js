map.on('load', function() {
    map.loadImage (
        'https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png',
        function (error, image) {
            if (error) throw error;
            map.addImage('cat', image);
            map.addSource('point', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [ {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [0, 0]
                        }
                    }]
                }
            });
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'point',
                'layout': {
                    'icon-image': 'cat',
                    'icon-size': 0.25
                }
            });
        }
    );
});