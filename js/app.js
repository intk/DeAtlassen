var app = {
	tiles: "/images/jpg",
	content_image: "#content-image",
	close_description: "#close-description",
	pinPath: null,
	blankPath: null,
	bounds: null,
	detailsLocation: null,
	markers: [],
	minZoom: 2,
	maxZoom: 5,
	zoomin: null,
	zoomout: null,
	canZoomOut: true,
	canZoomIn: false,
	firstOnMax: true,
	firstOnMin: true,
	defaultZoom: 2,

	centers: {
		'world': new google.maps.LatLng(28.013801376379213, -1.9775390625),
		'europe': new google.maps.LatLng(35.47856499535589, -13.2275390625),
		'amsterdam': new google.maps.LatLng(14.626108798875158, -3.3837890625)
	},

	initMap: function(options) {
		var self = this;

		//this.tiles = options.tilesPath;
		this.pinPath = options.pinPath;
		this.blankPath = options.blankPath;
		this.detailsLocation = options.detailsLocation;
		this.tiles = options.tilesPath;

		var extension = options.tiles_extension;

		var type = options.map_type;
		
		var self = this;

		if (type == "world") {
			this.canZoomOut = false;
			this.minZoom = 2;
			this.maxZoom = 4;
			

		} else if (type == "europe") {
			this.canZoomOut = true;
			this.minZoom = 2;
			this.maxZoom = 5;
			
			
		} else if (type == "amsterdam") {
			this.canZoomOut = false;
			this.defaultZoom = 3;
			this.minZoom = 2;
			this.maxZoom = 5;
			
		}

		var deatlassenOptions = {
		  getTileUrl: function(coord, zoom) {
		  	var x,y;

		  	coords = self.validateLimit(coord, zoom);

		  	if (coords == null) {
		  		return self.blankPath;
		  	} 

		  	x = coords.x;
		  	y = coords.y;

		  	/* BLANK WRAP */
		  	if (type == "amsterdam") {
		  		if (zoom == 3 && coord.y == 7) {
		  			return self.blankPath;
		  		}
			  	
			  	if (zoom == 4 && coord.y > 13) {
			  		return self.blankPath;
			  	}

			  	if (zoom == 5 && coord.y > 27) {
			  		return self.blankPath;
			  	}
		  	} else if (type == "europe") {
		  		if (zoom == 3 && coord.y == 7) {
		  			return self.blankPath;
		  		}
			  	
			  	if (zoom == 4 && coord.y > 12) {
			  		return self.blankPath;
			  	}

			  	if (zoom == 5 && coord.y > 24) {
			  		return self.blankPath;
			  	}

		  	} else if (type == "world") {
		  		if (zoom == 3 && coord.y == 7) {
		  			return self.blankPath;
		  		}
			  	
			  	if (zoom == 4 && coord.y > 13) {
			  		return self.blankPath;
			  	}
		  	}

		  	/* EXTENSIONS */
		  	if (type == "world" && zoom > 2) {
		  		extension = ".png";
		  	} else if (type == "world" && zoom < 3) {
		  		extension = ".jpg";
		  	}

		  	if (type == "europe" && zoom > 2) {
		  		extension = ".png";
		  	} else if (type == "europe" && zoom < 3) {
		  		extension = ".jpg";
		  	}

		   	return self.tiles + '/' + (zoom) + '/tile-' + x + '-' + y + extension;
		  },
		  tileSize: new google.maps.Size(256, 256),
		  maxZoom: app.maxZoom,
		  minZoom: app.minZoom,
		  name: 'De-Atlassen'
		};

		var deatlassenMapType = new google.maps.ImageMapType(deatlassenOptions);

		
  		var mapOptions = {
    		center: app.centers[type],
    		zoom: self.defaultZoom,
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

  		google.maps.event.addListener(app.map, 'zoom_changed', function() {
  			
		});
  		
  		var wrapped = false;
  		google.maps.event.addDomListener(app.map, 'tilesloaded', function(){
    		if(!wrapped) {
    			wrapped = true;
        		$("div.gmnoprint").last().parent().wrap("<div id='new-zoom-position' class='hide-for-touch'/>");
        		self.zoomin = $("div.gmnoprint div[title='Zoom in']");
				self.zoomout = $("div.gmnoprint div[title='Zoom out']");
        		
        		if (type == "amsterdam") {
        			$("div.gmnoprint").last().css("margin-top", "25px");
        			$("#wrappingmadness").addClass("hide-for-touch")
        			$("#madness").addClass("hide-for-touch");
        			$("#madness").show();
        			$("#wrappingmadness").show();
        			
					
					self.zoomout.click(function() {
						if (app.canZoomOut) {
							window.location.href = "/europe/";
						}
						//console.log(app.firstOnMin);
						if (app.map.getZoom() == app.minZoom) {
							if (app.firstOnMin) {
								app.firstOnMin = false;
							} else {
								window.location.href = "/europe/";
							}
						}
					});

					self.zoomin.click(function() {
						app.firstOnMin = true;
						app.canZoomOut = false;
					})

        		} else if (type == "europe") {
					self.zoomin.click(function() {
						app.canZoomOut = false;
						app.firstOnMin = true;
						if (app.map.getZoom() == app.maxZoom) {
							if (app.firstOnMax) {
								app.firstOnMax = false;
							} else {
								window.location.href = "/";
							}
						}
					});

					self.zoomout.click(function() {
						if (app.canZoomOut) {
							window.location.href = "/world/";
						}
						console.log(app.firstOnMin);
						if (app.map.getZoom() == app.minZoom) {
							if (app.firstOnMin) {
								app.firstOnMin = false;
							} else {
								window.location.href = "/world/";
							}
						}
					});
				} else if (type == "world") {
					self.zoomin.click(function() {
						
						if (app.map.getZoom() == app.maxZoom) {
							if (app.firstOnMax) {
								app.firstOnMax = false;
							} else {
								window.location.href = "/europe/";
							}
						}
					});
				}
    		}	
		});

  		
		google.maps.event.addListener(app.map, 'click', function() {
			app.hideAllMedia();
		});




		$("#div1").click(function() {
			app.hideAllMedia();
		});
		$(".poem").click(function() {
			app.hideAllMedia();
		});
	},

	sharer: function(url) {
		var winWidth = 520;
		var winHeight = 350;
		var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);
        window.open(url, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width='+winWidth+',height='+winHeight);
	},

	tsharer: function(url, lg) {
		var winWidth = 520;
		var winHeight = 350;
		var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);

        var nl = "Bekijk het 17e eeuwse Amsterdam met ‘Straet View’ van @schpvrtmsm en download unieke gratis kaarten  #DeAtlassen";
        var en = "View 17th century maps of Amsterdam, with 'Streete View' of @schpvrtmsm and download unique free maps! #DeAtlassen";

        if (lg == "nl") {
        	turl = url + "&text=" + encodeURIComponent(nl);
        } else {
        	turl = url + "&text=" + encodeURIComponent(en);
        }
 
        window.open(turl, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width='+winWidth+',height='+winHeight);
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
		if (app.minZoom < options.zoom) {
			app.canZoomOut = false;
		}
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
		
		var y = coord.y;
		var x = coord.x;

		var tileRange = 1 << zoom;

		if (coord.y < 0 || coord.y >= tileRange) {
    		return null;
  		}

  		var x;
  		if (coord.x < 0 || coord.x >= tileRange) {
    		x = (x % tileRange + tileRange) % tileRange;
  		}

		return {
			x: x,
			y: y
		}
	},

	setMapBounds: function(options) {
		var location = new google.maps.LatLng(options.lat, options.lng);
		this.bounds = new google.maps.LatLngBounds();
		
		this.bounds.extend(location);
		this.map.fitBounds(this.bounds);
	},

	addWorldMarker: function(language) {
		if (language == "nl") {
			var	url = "/europe/"; 
			var title = "Europa";
		} else {
			var url = "/en/europe/";
			var title = "Europe";
		}

		this.addMarker({
          lat: 50.45750402042058, 
          lng: 23.203125,
          title: title,
          url: url
        });
	},

	addEuropeMarker: function(language) {
		if (language == "nl") {
			var	url = "/"; 
		} else {
			var url = "/en/"
		}

		this.addMarker({
          lat: 29.80251790576445,
		  lng: -18.80859375,
          title: 'Amsterdam',
          url: url
        });
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
          title: 'De Nieuwe Brugh',
          url: '/'+language+'/nieuwe-brugh/'
        });  

        this.addMarker({
          lat: 35.782170703266075, 
          lng: 43.06640625, 
          title: "t'Stadt Huys",
          url: '/'+language+'/stadt-huys/'
        }); 

        this.addMarker({
          lat: -1.4061088354351468,
		  lng: -32.51953125,
          title: 'Het West Indisch Huys',
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

        this.addMarker({
          lat: -13.325484885597936, 
          lng: -64.4677734375, 
          title: "’s Lants Zee-magazyn en Scheeps Timmerwerf",
          url: '/'+language+'/lantszee-magazyn-en-scheeps-timmerwerf_zicht-op-de-werven-aan-het-oosterdok/'
        }); 

        this.addMarker({
          lat: 14.647368383896632, 
          lng: 3.2958984375, 
          title: 'De Waegh',
          url: '/'+language+'/de-waegh/'
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
			icon: self.pinPath,
			optimized: false
		});

		var self = this;
		google.maps.event.addListener(marker, 'click', function() {
			window.location.href = options.url;
			var center = app.map.getCenter();
			$.cookie("deatlassen", JSON.stringify({"center":{"lat":center.lat(), "lng":center.lng()}, "zoom":app.map.getZoom()}))
		});

		google.maps.event.addListener(marker, 'mouseover', function() {
			marker.setIcon("/static/pin-map-hover.png");	
		});

		google.maps.event.addListener(marker, 'mouseout', function() {
			marker.setIcon("/static/pin-map.png");	
		});

		/*google.maps.event.addListener(marker, 'mouseover', function() {
			alert("over!");
		});*/

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

	hideAllMedia: function() {
		$("#media-sharing-2").removeClass("show-for-large-up");
		$("#media-sharing-2").hide();
		$("#media-sharing").removeClass("show-for-large-up");
		$("#media-sharing").hide();
		$("#download-map").removeClass("show-for-large-up");
		$("#download-map").hide();
		$("#download-options").removeClass("show-for-large-up");
		$("#download-options").hide();
		$("#download-map-2").removeClass("show-for-large-up");
		$("#download-map-2").hide();
	},

	/* EVENTS */
	triggerEvents: function() {
		$("#main-logo").click(function() {
			window.location.href = "http://www.hetscheepvaartmuseum.nl";
		});

		$("#description-logo").click(function() {
			window.location.href = "http://www.hetscheepvaartmuseum.nl";
		});

		$(this.content_image).on("load", this.loadImageEvent);
		$(this.close_description).click(this.closeDescription);
		//$("#more-information").click(this.moreInformationEvent);
		$("#more-info-2").click(this.moreInformationEvent);
		$("#small-info").click(this.smallMoreInfoEvent);
		//$("#faux-map").click(this.fauxMapEvent);
		$("#main-menu #share").click(this.shareButton);
		$("#content-menu #share").click(this.shareDescriptionButton);
		
		$("#main-menu #download").click(function () {
			$("#media-sharing-2").removeClass("show-for-large-up");
			$("#media-sharing-2").hide();
			$("#media-sharing").removeClass("show-for-large-up");
			$("#media-sharing").hide();
			$("#download-options").removeClass("show-for-large-up");
			$("#download-options").hide();

			if (!$("#download-map").is(":visible")) {
				$("#download-map").fadeIn();
				$("#download-map").addClass("show-for-large-up");
				
			} else {
				$("#download-map").fadeOut();
				$("#download-map").removeClass("show-for-large-up");
			}
		});

		$("#select-map").click(function () {
			$("#download-map").removeClass("show-for-large-up");
			$("#download-map").hide();
			$("#media-sharing-2").removeClass("show-for-large-up");
			$("#media-sharing-2").hide();
			$("#media-sharing").removeClass("show-for-large-up");
			$("#media-sharing").hide();

			if (!$("#download-options").is(":visible")) {
				$("#download-options").fadeIn();
				$("#download-options").addClass("show-for-large-up");
				
			} else {
				$("#download-options").fadeOut();
				$("#download-options").removeClass("show-for-large-up");
			}
		});

		$("#content-menu #download").click(function (){
			$("#download-options").removeClass("show-for-large-up");
			$("#download-options").hide();
			$("#download-map").removeClass("show-for-large-up");
			$("#download-map").hide();
			$("#media-sharing-2").removeClass("show-for-large-up");
			$("#media-sharing-2").hide();
			$("#media-sharing").removeClass("show-for-large-up");
			$("#media-sharing").hide();

			if (!$("#download-map-2").is(":visible")) {
				$("#download-map-2").fadeIn();
				$("#download-map-2").addClass("show-for-large-up");
				
			} else {
				$("#download-map-2").fadeOut();
				$("#download-map-2").removeClass("show-for-large-up");
			}
		});

		$("#zoom-in-small").click(function() {
			var z = app.map.getZoom();
			if (z < app.maxZoom) {
				app.map.setZoom(z+1);
			} 
		});
		$("#zoom-out-small").click(function() {
			var z = app.map.getZoom();
			if (z > app.minZoom) {
				app.map.setZoom(z-1);
			} 
		});
	},

	shareDescriptionButton: function () {
		$("#download-map-2").removeClass("show-for-large-up");
		$("#download-map-2").hide();
		$("#download-map").removeClass("show-for-large-up");
		$("#download-map").hide();
		$("#media-sharing").removeClass("show-for-large-up");
		$("#media-sharing").hide();
		$("#download-options").removeClass("show-for-large-up");
		$("#download-options").hide();
		if (!$("#media-sharing-2").is(":visible")) {
			$("#media-sharing-2").fadeIn();
			$("#media-sharing-2").addClass("show-for-large-up");
			
		} else {
			$("#media-sharing-2").fadeOut();
			$("#media-sharing-2").removeClass("show-for-large-up");
			
		}
	},

	shareButton: function() {
		$("#download-map-2").removeClass("show-for-large-up");
		$("#download-map-2").hide();
		$("#download-map").removeClass("show-for-large-up");
		$("#download-map").hide();
		$("#media-sharing-2").removeClass("show-for-large-up");
		$("#media-sharing").hide();
		$("#download-options").removeClass("show-for-large-up");
		$("#download-options").hide();
		
		if (!$("#media-sharing").is(":visible")) {
			$("#media-sharing").fadeIn();
			$("#media-sharing").addClass("show-for-large-up");
			
		} else {
			$("#media-sharing").fadeOut();
			$("#media-sharing").removeClass("show-for-large-up");	
		}
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
		$("#more-info-2").fadeOut(600);
		$("#main-menu").fadeOut(600);
		$("#language-menu").fadeOut(600);

		if ($("#main-logo").hasClass('show-for-small-up')) {
			$("#main-logo").removeClass('show-for-small-up');
		}

		if (!$(".page-details #description").hasClass('show-for-large-up')) {
			$(".page-details #description").addClass('show-for-large-up');
		}

		$("#download-options").removeClass("show-for-large-up");
		$("#download-options").hide();
		$("#media-sharing").removeClass("show-for-large-up");
		$("#media-sharing").hide();
		$("#download-map").removeClass("show-for-large-up");
		$("#download-map").hide();
		$("#download-map-2").removeClass("show-for-large-up");
		$("#download-map-2").hide();
		$("#main-logo").hide();
		$("#description").fadeIn(800);

	},

	loadImageEvent: function() {
		$("#loader").hide();
		$("#map-canvas").hide();
		$("#main-logo").hide();
		$("#image-wrapper").fadeIn();
		$("#faux-map").show();
		$("#description").fadeIn();
		$("#content-image").addClass("show-for-large-up");
	},

	smallMoreInfoEvent: function() {
		$("#description").fadeIn();
		$("#description").removeClass("show-for-large-up");

		if ($("#main-logo").hasClass('show-for-small-up')) {
			$("#main-logo").removeClass('show-for-small-up');
			$("#main-logo").hide();
		} else {
			$("#main-logo").addClass('show-for-small-up');
		}
		$("#small-info").hide();
		$("#small-info").removeClass('show-for-medium-down');
		$("#faux-map").hide();
		$("#description").fadeIn();
	},

	closeDescription: function() {
		if ($("#faux-map").hasClass("show-for-small-up")) {
			$("#faux-map").removeClass("show-for-small-up");
		}
		
		$("#download-map-2").removeClass("show-for-large-up");
		$("#download-map-2").hide();
		$("#media-sharing-2").removeClass("show-for-large-up");
		$("#media-sharing-2").hide();
		
		$("#main-menu").addClass('show-for-large-up');
		$("#more-info-2").addClass('show-for-large-up');
		$("#language-menu").addClass('show-for-large-up');
		$("#main-menu").fadeIn(800);
		$("#more-info-2").fadeIn(800);
		$("#language-menu").fadeIn(800);

		$("#description").fadeOut();
		$("#description").removeClass("show-for-large-up");
		
		if (!$("#main-logo").hasClass("show-for-small-up")) {
			$("#main-logo").addClass('show-for-small-up');
		}
		$("#main-logo").show();
		$("#faux-map").show();
		$("#small-info").addClass('show-for-medium-down');
		$("#small-info").fadeIn();
	}
}

