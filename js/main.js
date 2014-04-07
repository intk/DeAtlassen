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
		app.addMarkers();
		
		// Show markers
		app.showMarkers();

	} else {
		$("#map-canvas").html("Network disconnected.");
	}

});