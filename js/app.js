var map;

var app = {
	tiles: "images/tiles",
	temp_tiles: "images/new",
	map: null,
	markers: [],

	initMap: function() {
		var self = this;
		var deatlassenOptions = {
		  getTileUrl: function(coord, zoom) {
		  	if (!self.validateLimit(coord,zoom)) {
		  		return null
		  	}
		   	return self.temp_tiles + '/' + (zoom) + '/tile-' + coord.x + '-' + coord.y + '.png';
		  },
		  tileSize: new google.maps.Size(256, 256),
		  maxZoom: 5,
		  minZoom: 3,
		  name: 'De-Atlassen'
		};

		var deatlassenMapType = new google.maps.ImageMapType(deatlassenOptions);

		var center = new google.maps.LatLng(65.80277639340224, -0.703125);
  		var mapOptions = {
    		center: center,
    		zoom: 3,
		    streetViewControl: false,
		    mapTypeControlOptions: {
      			mapTypeIds: ['deatlassen']
    		}
  		};

  		self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  		self.map.mapTypes.set('deatlassen', deatlassenMapType);
  		self.map.setMapTypeId('deatlassen');
	},

	/* Map Bounds handler */
	validateLimit: function(coord, zoom) {
		var limit = Math.pow(2, zoom) - 1;
		if (coord.x > -1 && coord.x <= (limit) && coord.y > -1 && coord.y <= (limit)) {
			return true
		} else {
			return false
		}
	},

	/* Markers handling functions */

	addMarker: function(position) {
		var marker = new google.maps.Marker({
  			position: position,
  			map: self.map,
  			visible: true
  		});
	},

	getMarkers: function(show) {
		$.getJSON("static/markers.json", function(data) {
			console.log(data);
		});

		if (show) {
			this.showMarkers();
		}
	},

	deleteMarkers: function() {
		this.hideMarkers();
		this.markers.length = 0;
		this.markers = [];
	},

	/* Markers helper functions */
	showMarkers: function() {
		for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(this.map);
		};
	},

	hideMarkers: function() {
		for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(null);
		};
	},

	refreshMarkers: function(show) {
		this.deleteMarkers();
		this.getMarkers(show);
	}
}


$(document).ready(function() {
	$(document).foundation();
	
	if (typeof(google) != 'undefined') {
		app.initMap();
		//app.getMarkers();
	} else {
		$("#map-canvas").html("Network disconnected.");
	}

});