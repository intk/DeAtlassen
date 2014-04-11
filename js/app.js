var app = {
	tiles: "/images/jpg",
	content_image: "#content-image",
	close_description: "#close-description",
	pinPath: null,
	blankPath: null,
	bounds: null,
	detailsLocation: null,
	markers: [],

	initMap: function(options) {
		var self = this;

		//this.tiles = options.tilesPath;
		this.pinPath = options.pinPath;
		this.blankPath = options.blankPath;
		this.detailsLocation = options.detailsLocation;

		var deatlassenOptions = {
		  getTileUrl: function(coord, zoom) {
		  	if (!self.validateLimit(coord,zoom)) {
		  		return self.blankPath;
		  	}
		   	return self.tiles + '/' + (zoom) + '/tile-' + coord.x + '-' + coord.y + '.jpg';
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

	setMapBounds: function(options) {
		var location = new google.maps.LatLng(options.lat, options.lng);
		this.bounds = new google.maps.LatLngBounds();
		
		this.bounds.extend(location);
		this.map.fitBounds(this.bounds);
	},

	/* Markers handling functions */
	addMarkers: function(language) {
		
		if (language == null) {
			language = 'nl';
		}

		this.addMarker({
          lat: 9.579084335882534,
          lng: -22.32421875, 
          title: 'Monkelbaens Toorn',
          url: '/'+language+'/monkelbaens-toorn/'
        });

        this.addMarker({
          lat: 33.54139466898275, 
          lng: -7.470703125, 
          title: 'Zuyder Kerck',
          url: '/'+language+'/zuyder-kerck/'
        }); 

        this.addMarker({
          lat: 31.728167146023935, 
          lng: 4.5263671875, 
          title: 'Oost Indisch Huys',
          url: '/'+language+'/t-oost-indisch-huys/'
        });

        this.addMarker({
          lat: -11.480024648555816, 
          lng: 30.3662109375, 
          title: 'Nieuwe Brugh',
          url: '/'+language+'/nieuwe-brugh/'
        });  

        this.addMarker({
          lat: 35.782170703266075, 
          lng: 43.06640625, 
          title: 'Stadt Huys',
          url: '/'+language+'/lants-zeemagazyn-en-scheeps-timmerwerf-zicht-op-de-werven-aan-het-oosterdokt-stadt-huys-van-vooren-aen-te-sien/'
        }); 

        this.addMarker({
          lat: -11.092165893501988, 
          lng: 74.267578125, 
          title: 'West Indisch Huys',
          url: '/'+language+'/west-indisch-huys/'
        }); 

        this.addMarker({
          lat: 7.623886853120036,
          lng: 93.427734375, 
          title: 'Noorder Kerck',
          url: '/'+language+'/noorder-kerck/'
        }); 

        this.addMarker({
          lat: 43.8028187190472, 
          lng: 75.3662109375, 
          title: 'Wester Kerck',
          url: '/'+language+'/wester-kerck/'
        }); 
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
		$("#main-menu #share").click(this.shareButton);
	},

	shareButton: function() {
		$("#media-sharing").fadeToggle();
	},

	fauxMapEvent: function() {	
		$("#content-image").attr("src","");
		$("#content-image").hide();
		$("#image-wrapper").hide();
		$("#left").hide();
		$("#faux-map").hide();
		$("#map-canvas").show();
		google.maps.event.trigger(app.map, 'resize');
		if (app.detailsLocation != null) {
			app.setMapBounds(app.detailsLocation);
		}
	},

	moreInformationEvent: function () {
		$("#main-menu").removeClass('show-for-large-up');
		$("#main-menu").fadeOut();
		$("#language-menu").removeClass('show-for-large-up');
		$("#language-menu").fadeOut();
		if ($("#main-logo").hasClass('show-for-medium-up')) {
			$("#main-logo").removeClass('show-for-medium-up');
		}
		$("#media-sharing").hide();
		$("#main-logo").hide();
		$("#description").fadeIn();
	},

	loadImageEvent: function() {
		$("#map-canvas").hide();
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

