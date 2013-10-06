$(document).ready(function() {


	var controller = new Leap.Controller({enableFeatures: true}); 
	var canvas = document.getElementById('canvas');
	var c = canvas.getContext('2d'); 

	controller.on('connect', function() {
	  console.log("Successfully connected.");
	});

	// 60 fps, getting data from the leap motion
	controller.on('frame', function() {

	  // your code here
	});


  	var img = document.createElement('img');
  	img.src = "./wat.jpg"
	c.drawImage(img, 0, 0);

	controller.on('ready', function(){
	// Ready code will go here
		console.log("Ready");
	});

	controller.connect();

});