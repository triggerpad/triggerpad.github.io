var digits = 1;
var mp3 = null;

$(document).ready(function() {

	// sets up loop to run at 60fps (animation speed)
	Leap.loop({enableGestures: true}, function(frame) {
		var glcanvas = document.getElementById('glcanvas');
		//console.log('Frame ID: ' + frame.id + ', Timestamp: ' + frame.timestamp + ', Gestures: ' + frame.gestures.length);
    	
    	//screentap gestures
    	for (var i = 0; i < frame.gestures.length; i++) {
      		var gesture = frame.gestures[i];

      		if(gesture.type === "keyTap") {
	      		var gesture_x = gesture.position[0].toFixed(digits);
	      		var gesture_y = gesture.position[2].toFixed(digits);

      			if (withinBounds(gesture_x, gesture_y)) {

	                var key = mapKey(gesture_x, gesture_y);
	      	   		var gestureString = "Gesture ID: " + gesture.id + ", ";
	          		gestureString += "position: " + gesture_x + ", ";
	          		gestureString += gesture_y + ", key: " + key;

	                //animateKey(key, gesture_x, gesture_y);
			randomizeColor();
	                playKey(key);
	            }
          	}
      	}

      	//pointables
      	var points = new Array();
    	for (var i = 0; i < frame.pointables.length; i++) {
      		var pointable = frame.pointables[i];
	      	points[i] = {x: pointable.tipPosition[0].toFixed(digits),
      					y: pointable.tipPosition[2].toFixed(digits)};
      	}
      	updateFingertips(points);
	});

	//gestures
	// use *frame.gestures*
});


function playKey(key) {
	// plays audio sound associated with that key

	switch(key) {
		case 1: 
			playSound("Piano/G.wav");
			break;
		case 2:
			playSound("Piano/A.wav");
			break;
		case 3:
			playSound("Piano/B.wav");
			break;
		case 4:
			playSound("Piano/C.wav");
			break;
		case 5:
			playSound("Piano/D.wav");
			break;
		case 6:
			playSound("Piano/D.wav");
			break;
		case 7:
			playSound("Piano/E.wav");
			break;
		case 8:
			playSound("Piano/F.wav");
			break;
		case 9: 
			playSound("Piano/Gb.wav");
			break;
		default:
	}
}

	function playSound(soundfile) {
    	mp3 = new Audio(soundfile);
        mp3.play();
    }


function withinBounds(x, y) {
	return(x >= -150 && x <= 150 && y >= -150 && y <= 150);
}

function mapKey(x, y) {
	if(x < -50) {
		if(y < -50) return 7;
		if(y > 50) return 1;
		return 4;
	}
	else if(x > 50) {
		if(y < -50) return 9;
		if(y > 50) return 3;
		return 6;
	}
	else {
		if(y < -50) return 8;
		if(y > 50) return 2;
		return 5;
	}
}
