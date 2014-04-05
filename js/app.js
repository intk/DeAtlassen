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
    			style: google.maps.ZoomControlStyle.DEFAULT
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

		google.maps.event.addListener(marker, 'click', function() {
			$("#main-menu").hide();
			$("#content-image").attr('src','static/b1.png');
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
		$("#more-information").click(this.moreInformationEvent);
		$("#faux-map").click(this.fauxMapEvent);
	},

	fauxMapEvent: function() {
		$("#content-image").attr("src","");
		$("#description").show();
		$("#main-menu").hide();
		$("#image-wrapper").fadeOut();
		$("#map-canvas").fadeIn();
		$("#faux-map").hide();
	},

	moreInformationEvent: function () {
		$("#main-menu").fadeOut();
		$("#description").fadeIn();
	},

	loadImageEvent: function() {
		$("#map-canvas").fadeOut();
		$("#image-wrapper").fadeIn();
		$("#faux-map").show();
		$("#description").fadeIn();
	},

	closeDescription: function() {
		$("#description").fadeOut();
		$("#main-menu").fadeIn();
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
		app.addMarker(57.136239319177434, -14.0625);
		
		// Show markers
		app.showMarkers();

		// Testing
		var bounds = new google.maps.LatLngBounds();
		
		bounds.extend(new google.maps.LatLng(78.9039293885709, -63.984375));
		bounds.extend(new google.maps.LatLng(81.8300417529174, 68.466796875));
		bounds.extend(new google.maps.LatLng(16.46769474828897, -3.515625));
		app.map.fitBounds(bounds);
		
		//app.map.setCenter(bounds.getCenter());
		app.map.panToBounds(bounds);
			
		
	} else {
		$("#map-canvas").html("Network disconnected.");
	}

});