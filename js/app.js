var map;

var app = {
	tiles: "images/tiles",
	temp_tiles: "images/new",
	content_image: "#content-image",
	close_description: "#close-description",
	map: null,
	markers: [],

	initMap: function() {
		var self = this;
		var deatlassenOptions = {
		  getTileUrl: function(coord, zoom) {
		  	if (!self.validateLimit(coord,zoom)) {
		  		return null
		  	}
		   	return self.tiles + '/' + (zoom) + '/tile-' + coord.x + '-' + coord.y + '.png';
		  },
		  tileSize: new google.maps.Size(256, 256),
		  maxZoom: 5,
		  minZoom: 3,
		  name: 'De-Atlassen'
		};

		var deatlassenMapType = new google.maps.ImageMapType(deatlassenOptions);

		var center = new google.maps.LatLng(63.78248603116466, 4.04296875);
  		var mapOptions = {
    		center: center,
    		zoom: 3,
    		zoomControl: true,
    		zoomControlOptions: {
    			style: google.maps.ZoomControlStyle.LARGE
    		},
		    streetViewControl: false,
		    mapTypeControl: false,
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
	addMarker: function(lat, lng) {
		var position = new google.maps.LatLng(lat, lng);

		var marker = new google.maps.Marker({
			position: position,
			title: 'Marker #1'
		});

		this.markers.push(marker);
	},

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
	},

	/* EVENTS */
	triggerEvents: function() {
		$(this.content_image).on("load", this.loadImageEvent);
		$(this.close_description).click(this.closeDescription);
	},

	loadImageEvent: function() {
		$("#map-canvas").hide();
		$("#image-wrapper").show();
	},

	closeDescription: function() {
		$("#description").fadeOut();
	}
}

$(document).ready(function() {
	// INIT Front-end framework
	$(document).foundation();
	
	if (typeof(google) != 'undefined') {
		// INIT Google Maps features
		app.initMap();

		// Trigger events
		app.triggerEvents();

		//app.getMarkers(false);
		// Fake markers
		app.addMarker(41.64007838467894, -52.91015625);
		app.addMarker(41.11246878918085, -74.35546875);
		app.addMarker(31.80289258670676, 37.6171875);
		app.addMarker(41.508577297439324, 75.76171875);
		app.addMarker(8.407168163601074, 19.86328125);
		app.addMarker(57.136239319177434, -14.0625)
		// Show markers
		app.showMarkers();
		
	} else {
		$("#map-canvas").html("Network disconnected.");
	}

});