var app = {
	tiles: "images/tiles",
	content_image: "#content-image",
	close_description: "#close-description",
	pinPath: null,
	blankPath: null,
	bounds: null,
	markers: [],

	initMap: function(options) {
		var self = this;

		this.tiles = options.tilesPath;
		this.pinPath = options.pinPath;
		this.blankPath = options.blankPath;

		var deatlassenOptions = {
		  getTileUrl: function(coord, zoom) {
		  	if (!self.validateLimit(coord,zoom)) {
		  		return self.blankPath;
		  	}
		   	return self.tiles + '/' + (zoom) + '/tile-' + coord.x + '-' + coord.y + '.png';
		  },
		  tileSize: new google.maps.Size(256, 256),
		  maxZoom: 5,
		  minZoom: 3,
		  name: 'De-Atlassen'
		};

		var deatlassenMapType = new google.maps.ImageMapType(deatlassenOptions);

		var center = new google.maps.LatLng(77.47079605592884, 2.2412109375);
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

	/* CONTEXT Handler */

	mainContext: function(show) {
		if (show) {
			$("#main-menu").hide();
			$("#main-logo").hide();
		} else {
			$("#main-menu").show();
			$("#main-logo").show();
		}
	},

	descriptionContext: function(show) {
		if (show) {
			$("#description").show();
			$("#faux-map").show();
		} else {
			$("#description").show();
			$("#faux-map").show();
		}
	},

	/* Map Bounds handler */

	hackAmsterdamBounds: function() {
		this.bounds = new google.maps.LatLngBounds();

		this.bounds.extend(new google.maps.LatLng(76.9039293885709, -63.984375));
		this.bounds.extend(new google.maps.LatLng(81.8300417529174, 68.466796875));
		if ($("body").height() > 800) {
			this.bounds.extend(new google.maps.LatLng(-16.26769474828897, -3.515625));
		} else {
			this.bounds.extend(new google.maps.LatLng(10.26769474828897, -3.515625));
		}
		this.map.fitBounds(this.bounds);
		
		//app.map.setCenter(bounds.getCenter());
		this.map.panToBounds(this.bounds);
	},

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
	addMarker: function(options) {
		var self =  this;
		var position = new google.maps.LatLng(options.lat, options.lng);
		console.log(self.pinPath);
		var marker = new google.maps.Marker({
			position: position,
			title: options.title,
			icon: self.pinPath
		});

		var self = this;
		google.maps.event.addListener(marker, 'click', function() {
			window.location.href = options.url;
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
		$("#small-info").click(this.smallMoreInfoEvent);
		$("#faux-map").click(this.fauxMapEvent);
	},

	fauxMapEvent: function() {	
		window.location.href = "../../index.html"
	},

	moreInformationEvent: function () {
		$("#main-menu").removeClass('show-for-large-up');
		$("#main-menu").fadeOut();
		$("#language-menu").removeClass('show-for-large-up');
		$("#language-menu").fadeOut();
		if ($("#main-logo").hasClass('show-for-medium-up')) {
			$("#main-logo").removeClass('show-for-medium-up');
		}
		$("#main-logo").hide();
		$("#description").fadeIn();
	},

	loadImageEvent: function() {
		$("#map-canvas").fadeOut();
		$("#main-logo").hide();
		$("#image-wrapper").fadeIn();
		$("#faux-map").show();
		$("#description").fadeIn();
	},

	smallMoreInfoEvent: function() {		
		if ($("#main-logo").hasClass('show-for-medium-up')) {
			$("#main-logo").removeClass('show-for-medium-up');
			$("#main-logo").hide();
		} else {
			$("#main-logo").addClass('show-for-medium-up');
		}
		$("#small-info").hide();
		$("#small-info").removeClass('show-for-medium-down');
		$("#description").fadeIn();
	},

	closeDescription: function() {
		$("#description").fadeOut();
		$("#main-menu").addClass('show-for-large-up');
		$("#main-menu").fadeIn();
		$("#language-menu").addClass('show-for-large-up');
		$("#language-menu").fadeIn();
		if (!$("#main-logo").hasClass("show-for-medium-up")) {
			$("#main-logo").addClass('show-for-medium-up');
		}
		$("#main-logo").show();
		$("#small-info").addClass('show-for-medium-down');
		$("#small-info").fadeIn();
	}
}

