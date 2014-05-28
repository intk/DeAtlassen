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
	var total = h - (parseInt($("#over-bottom-div").css("height")) + parseInt($(".gap").css("height")) + parseInt($("#main-title").css("height")));
	$("#desc-content-4").attr("style", "height:"+total+"px !important");

	window.addEventListener("orientationchange", function() {
  		// Announce the new orientation number
  		if (window.innerWidth > window.innerHeight) {
  			$(".gap").css("height", 53);
  			$("#main-title").css("height", 35);
  			$("#description-logo").css("width", "36px");
  			$("#description-logo").css("height", "52px");
  			$("#description-logo").css("background-size", "36px 52px");
  		} else {
  			$(".gap").css("height", 104);
  			$("#main-title").css("height", 50);
  			$("#description-logo").css("width", "71px");
  			$("#description-logo").css("height", "104px");
  			$("#description-logo").css("background-size", "71px 104px");
  		}

  		var h = $(window).height();
		var total = h - (parseInt($("#over-bottom-div").css("height")) + parseInt($(".gap").css("height")) + parseInt($("#main-title").css("height")));
		$("#desc-content-4").attr("style", "height:"+total+"px !important");
  	}, false);

	window.addEventListener("resize", function() {
		// Get screen size (inner/outerWidth, inner/outerHeight)
		if (window.innerWidth > window.innerHeight) {
  			$(".gap").css("height", "53px");
  			$("#main-title").attr("style", "height: 35px !important;");
  			$("#description-logo").css("width", "36px");
  			$("#description-logo").css("height", "52px");
  			$("#description-logo").css("background-size", "36px 52px");
  		} else {
  			$(".gap").css("height", "104px");
  			$("#main-title").attr("style", "height: 50px !important;");
  			$("#description-logo").css("width", "71px");
  			$("#description-logo").css("height", "104px");
  			$("#description-logo").css("background-size", "71px 104px");
  		}
		var h = $(window).height();
		var total = h - (parseInt($("#over-bottom-div").css("height")) + parseInt($(".gap").css("height")) + parseInt($("#main-title").css("height")));
		$("#desc-content-4").attr("style", "height:"+total+"px !important");
	}, false);

});