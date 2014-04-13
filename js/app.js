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
		this.tiles = options.tilesPath;

		var extension = options.tiles_extension;

		var maxZoom = 5;
		var type = options.map_type;
		if (type == "world") {
			maxZoom = 4;
		}

		var deatlassenOptions = {
		  getTileUrl: function(coord, zoom) {
		  	if (!self.validateLimit(coord,zoom)) {
		  		return self.blankPath;
		  	}
		   	return self.tiles + '/' + (zoom) + '/tile-' + coord.x + '-' + coord.y + extension;
		  },
		  tileSize: new google.maps.Size(256, 256),
		  maxZoom: maxZoom,
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
  		
  		var wrapped = false;
  		google.maps.event.addDomListener(app.map, 'tilesloaded', function(){
    		if(!wrapped) {
    			wrapped = true;
        		$("div.gmnoprint").last().parent().wrap("<div id='new-zoom-position'/>");
    		}
		});
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

	updateFromCookie: function(options) {
		var center = options.center;
		var latLng = new google.maps.LatLng(center.lat, center.lng);
		app.map.setCenter(latLng);
		app.map.setZoom(options.zoom);
	},

	hackAmsterdamBounds: function() {
		this.bounds = new google.maps.LatLngBounds();

		this.bounds.extend(new google.maps.LatLng(76.9039293885709, -63.984375));
		this.bounds.extend(new google.maps.LatLng(81.8300417529174, 68.466796875));
		if ($("body").height() > 800) {
			this.bounds.extend(new google.maps.LatLng(-16.26769474828897, -3.515625));
		} else {
			this.bounds.extend(new google.maps.LatLng(15.90069474828897, -3.515625));
			/*this.addMarker({
				lat: 15.26769474828897,
				lng: -3.515625
			});*/
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
			var center = app.map.getCenter();
			$.cookie("deatlassen", JSON.stringify({"center":{"lat":center.lat(), "lng":center.lng()}, "zoom":app.map.getZoom()}))
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
		//$("#more-information").click(this.moreInformationEvent);
		$("#more-info-2").click(this.moreInformationEvent);
		$("#small-info").click(this.smallMoreInfoEvent);
		//$("#faux-map").click(this.fauxMapEvent);
		$("#main-menu #share").click(this.shareButton);
		$("#content-menu #share").click(this.shareDescriptionButton);
		$("#select-map").click(function () {
			$("#download-options").fadeToggle();
		});
	},

	shareDescriptionButton: function () {
		$("#media-sharing").hide();
		$("#download-options").hide();
		$("#media-sharing-2").fadeToggle();
	},

	shareButton: function() {
		$("#media-sharing-2").hide();
		$("#download-options").hide();
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
		$("#more-info-2").removeClass('show-for-large-up');
		$("#language-menu").removeClass('show-for-large-up');

		$("#more-info-2").fadeOut(600)
		$("#main-menu").fadeOut(600);
		$("#language-menu").fadeOut(600);

		if ($("#main-logo").hasClass('show-for-medium-up')) {
			$("#main-logo").removeClass('show-for-medium-up');
		}

		$("#media-sharing").hide();
		$("#main-logo").hide();
		$("#description").fadeIn(900);

	},

	loadImageEvent: function() {
		$("#loader").hide();
		$("#map-canvas").hide();
		$("#main-logo").hide();
		$("#image-wrapper").fadeIn();
		$("#faux-map").show();
		$("#description").fadeIn();
		$("#content-image").addClass("show-for-large");
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
		$("#media-sharing-2").hide();
		$("#description").fadeOut();
		$("#main-menu").addClass('show-for-large-up');
		$("#more-info-2").addClass('show-for-large-up');
		$("#language-menu").addClass('show-for-large-up');
		$("#main-menu").fadeIn(800);
		$("#more-info-2").fadeIn(800);
		$("#language-menu").fadeIn(800);
		
		if (!$("#main-logo").hasClass("show-for-medium-up")) {
			$("#main-logo").addClass('show-for-medium-up');
		}
		$("#main-logo").show();
		$("#small-info").addClass('show-for-medium-down');
		$("#small-info").fadeIn();
	}
}

