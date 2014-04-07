$(document).ready(function() {
	// INIT Front-end framework
	$(document).foundation();
	
	if (typeof(google) != 'undefined') {
		// INIT Google Maps features
		app.initMap({
			tilesPath: "images/tiles",
			pinPath: "static/pin-map.png",
			blankPath: "static/blank.png",
			positon: ""
		});

		app.hackAmsterdamBounds();

		// Trigger events
		app.triggerEvents();

		//app.getMarkers(false);
		// Fake markers
		app.addMarker({
          lat: 10.228437266155943, 
          lng: -22.7197265625, 
          title: 'Monkelbaens Toorn',
          url: 'nl/monkelbaens-toorn/index.html'
        });

        app.addMarker({
          lat: 33.54139466898275, 
          lng: -7.470703125, 
          title: 'Zuyder Kerck',
          url: 'nl/zuyder-kerck/index.html'
        }); 

        app.addMarker({
          lat: 31.728167146023935, 
          lng: 4.5263671875, 
          title: 'Oost Indisch Huys',
          url: 'nl/t-oost-indisch-huys/index.html'
        });

        app.addMarker({
          lat: -11.480024648555816, 
          lng: 30.3662109375, 
          title: 'Nieuwe Brugh',
          url: 'nl/nieuwe-brugh/index.html'
        });  

        app.addMarker({
          lat: 35.782170703266075, 
          lng: 43.06640625, 
          title: 'Stadt Huys',
          url: 'nl/lants-zeemagazyn-en-scheeps-timmerwerf-zicht-op-de-werven-aan-het-oosterdokt-stadt-huys-van-vooren-aen-te-sien/index.html'
        }); 

        app.addMarker({
          lat: -11.092165893501988, 
          lng: 74.267578125, 
          title: 'West Indisch Huys',
          url: 'nl/west-indisch-huys/index.html'
        }); 

        app.addMarker({
          lat: 7.623886853120036,
          lng: 93.427734375, 
          title: 'Noorder Kerck',
          url: 'nl/noorder-kerck/index.html'
        }); 

        app.addMarker({
          lat: 43.8028187190472, 
          lng: 75.3662109375, 
          title: 'Wester Kerck',
          url: 'nl/wester-kerck/index.html'
        }); 
		
		// Show markers
		app.showMarkers();

	} else {
		$("#map-canvas").html("Network disconnected.");
	}

});