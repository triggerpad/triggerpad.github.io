Trigger Pad
===========

Made for HackMIT 2013

Geoffrey, Jay, Johnny, Jonathan

Playing sounds on a trigger pad represented by a 3v3 grid of keys. We used a leap motion on the plane parallel to the screen, and shows fingers (pointers) on this plane. Using the "screenTap" gesture to detect key presses on the trigger pad. 

Basic Algorithm:
----------------
```
onEachFrame() {

	if(there exists a gesture g s.t. g.screenTap == true) {
		for(all gestures g where g.x > x_min && g.x < x_max && g.y > y_min && g.y < y_max) {
			key = mapKey(g);
			playSound(key);
			animateKey(key);
		}	
	}
	for(all pointers p s.t. p.x > x_pmin && p.x < x_pmax && p.y > y_pmin && p.y < y_pmax ) {
		drawPoint(p);
	}
}

var x_max, x_min, y_max, y_min;
var x_pmax, x_pmin, y_pmax, y_pmin;
mapKey(Gesture g)
playSound(Key key)
animateKey(Key key)
drawPoint(Point p)
```

Additional features
-------------------

	Option to add custom sounds
	Not overlapping the same sound if pressed too soon
	Potentially export to soundcloud