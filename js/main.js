$(document).ready(function() {
	// INIT Front-end framework
	$(document).foundation();
	
	if (typeof(google) != 'undefined') {
		// INIT Google Maps features
		app.initMap({
			map_type: "amsterdam",
			tilesPath: "/images/jpg",
			pinPath: "/static/pin-map.png",
			blankPath: "/static/blank.png",
			positon: "",
			tiles_extension: ".jpg"
		});

		

		var cookie = $.cookie("deatlassen");
		if (cookie != null) {
			var data = JSON.parse(cookie);
			var center = data.center;
			var zoom = data.zoom;
			console.log("updateFromCookie");
			app.updateFromCookie({
				center: center,
				zoom: zoom
			});
			$.removeCookie("deatlassen");
		} else {
			console.log("No cookie");
			//app.hackAmsterdamBounds();
		}
		
		// Trigger events
		app.triggerEvents();

		//app.getMarkers(false);
		// Fake markers
		app.addMarkers('nl');
		
		// Show markers
		app.showMarkers();

		//var scroll = new IScroll('#desc-content-4', { mouseWheel: true });

	} else {
		$("#map-canvas").html("Network disconnected.");
	}
	var h = $(window).height();
	var total = h - $("#over-bottom-div").height() - $(".gap").height() - $("#main-title").height();
	$("#desc-content-4").attr("style", "height:"+total+"px !important");
});