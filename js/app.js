var app = {
	tiles: "images/tiles",
	blank_path: this.tiles + '/blank.png',
	map: null,

	map_init: function() {
		var self = this;
		var moonTypeOptions = {
		  getTileUrl: function(coord, zoom) {
		    if (coord.x > -1 && coord.y > -1) {
		      var path = self.tiles + '/' + (zoom) + '/tile-' + coord.x + '-' + coord.y + '.png';
		      return path;
		    } else {
		      return self.blank_path;
		    }
		  },
		  tileSize: new google.maps.Size(256, 256),
		  maxZoom: 5,
		  minZoom: 2,
		  name: 'Map'
		};

		var moonMapType = new google.maps.ImageMapType(moonTypeOptions);

		var myLatlng = new google.maps.LatLng(0, 0);
  		var mapOptions = {
    		center: myLatlng,
    		zoom: 2,
		    streetViewControl: false,
		    mapTypeControlOptions: {
      			mapTypeIds: ['moon']
    		}
  		};

  		this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  		this.map.mapTypes.set('moon', moonMapType);
  		this.map.setMapTypeId('moon');
	}
}


$(document).ready(function() {
	$(document).foundation();
	app.map_init();
});