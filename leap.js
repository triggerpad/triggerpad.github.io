$(document).ready(function() {


	var controller = new Leap.Controller({enableFeatures: true}); 
	var glcanvas = document.getElementById('glcanvas');

	controller.on('connect', function() {
	  console.log("Successfully connected.");
	});

	// 60 fps, getting data from the leap motion
	controller.on('frame', function() {

	  // your code here
	});



	controller.on('ready', function(){
	// Ready code will go here
		console.log("Ready");

	});

	controller.connect();

});