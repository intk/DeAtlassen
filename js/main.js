$(document).ready(function() {
	// INIT Front-end framework
	$(document).foundation();
	
	if (typeof(google) != 'undefined') {
		// INIT Google Maps features
		app.initMap();
		app.hackAmsterdamBounds();

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

	} else {
		$("#map-canvas").html("Network disconnected.");
	}

});