var digits = 1;

$(document).ready(function() {

	// sets up loop to run at 60fps (animation speed)
	Leap.loop({enableGestures: true}, function(frame) {
		var glcanvas = document.getElementById('glcanvas');
		//console.log('Frame ID: ' + frame.id + ', Timestamp: ' + frame.timestamp + ', Gestures: ' + frame.gestures.length);
    	
    	//screentap gestures
    	for (var i = 0; i < frame.gestures.length; i++) {
      		var gesture = frame.gestures[i];

      		if(gesture.type === "screenTap") {
	      		var gesture_x = gesture.position[0].toFixed(digits);
	      		var gesture_y = gesture.position[1].toFixed(digits);

      			if (withinBounds(gesture_x, gesture_y)) {

	                var key = mapKey(gesture_x, gesture_y);
	      	   		var gestureString = "Gesture ID: " + gesture.id + ", ";
	          		gestureString += "position: " + gesture_x + ", ";
	          		gestureString += gesture_y + ", key: " + key;
	                console.log(gestureString);

	                animateKey(key, gesture_x, gesture_y-190);
	                playSound(key);
	            }
          	}
      	}

      	//pointables
      	var points = new Array();
    	for (var i = 0; i < frame.pointables.length; i++) {
      		var pointable = frame.pointables[i];
	      	points[i] = [pointable.tipPosition[0].toFixed(digits), pointable.tipPosition[1].toFixed(digits)];
      	}
      	animateKey(key, points);

	});

	//gestures
	// use *frame.gestures*
});



function playSound(key) {
	// plays audio sound associated with that key

	switch(key) {
		case 1: 
			break;
		case 2:
			break;
		case 3:
			break;
		case 4:
			break;
		case 5:
			break;
		case 6:
			break;
		case 7:
			break;
		case 8:
			break;
		case 9: 
			break;
		default:
	}

	/* function playSound(el,soundfile) {
    if (el.mp3) {
        if(el.mp3.paused) el.mp3.play();
        else el.mp3.pause();
    } else {
        el.mp3 = new Audio(soundfile);
        el.mp3.play();
    }
    }
	*/

}

function animateKey(key) {
	// animates key b/c it's playing
}

function animatePoints(key, points) {
	// animates the fingers that are in the frame
}

function withinBounds(x, y) {
	return(x >= -150 && x <= 150 && y >= 40 && y <= 340);
}

function mapKey(x, y) {
	if(x < -50) {
		if(y < 140) return 7;
		if(y > 240) return 1;
		return 4;
	}
	else if(x > 50) {
		if(y < 140) return 9;
		if(y > 240) return 3;
		return 6;
	}
	else {
		if(y < 140) return 8;
		if(y > 240) return 2;
		return 5;
	}
}