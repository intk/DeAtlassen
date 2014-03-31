var map;

var app = {
	tiles: "images/tiles",
	blank_path: 'images/tiles' + '/blank.png',
	map: null,
	markers: [],

	initMap: function() {
		var self = this;
		var deatlassenOptions = {
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
		  minZoom: 3,
		  name: 'Map'
		};

		var deatlassenMapType = new google.maps.ImageMapType(deatlassenOptions);

		var myLatlng = new google.maps.LatLng(0, 0);
  		var mapOptions = {
    		center: myLatlng,
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