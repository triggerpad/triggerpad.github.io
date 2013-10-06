// Width and height of the grid used by leap.js
const leap_w = 300, leap_h = 300;

// z-value of all the points
//const z = -700;
const z = 0;

// List of fingertip coordinates
var fingertips;
// List of fingertip buffers
var fingertipBuffers, fingertipCBuffers;

// Colors for fingertips and cell[1-9]
var COLOR_TIP = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1];
var COLOR_CELL = [];

// Randomize colors
function randomColor() {
    var color = [];
    for (i = 0; i < 16; i++) 
	if (i % 4 == 3)
	    color.push(1);
	else
	    color.push(1 - Math.random());
    return color;
}

function randomizeColor() {
    // Randomize colors if there is a key hit
    newColors = [];
    var k;
    for (k = 0; k < 9; k++)  {
	newColors.push(randomColor());
    }

    COLOR_CELL = newColors;
    initBuffers();
}

/****************** CALLBACK FUNCTIONS *****************/
function updateFingertips(points) {
    _w = gl.viewportWidth;
    _h = gl.viewportHeight;
    fingertips = [];
    for (i = 0; i < points.length; i++) {
	fingertips.push(points[i]);
    }

    /* Scale the coordinates */
    for (i = 0; i < fingertips.length; i++) {
	fingertips[i].x *= _w / leap_w;
	/* Invert y coordinates */
	fingertips[i].y *= _h / leap_h * -1;
    }

    /* Recreate buffers */
    initSquareBuffers();

    /* Redraw */ 
    drawScene();
}

/****************** RENDERING FUNCTIONS *****************/
function initSquareBuffers() {
    var buf, cbuf;
    fingertipBuffers = [];
    for (i = 0; i < fingertips.length; i++) {
	x = fingertips[i].x;
	y = fingertips[i].y;
	l = 30;
	fingertipBuffers.push(initSingleBuffer(
	    [x-l/2, y+l/2, z+5, x-l/2, y-l/2, z+5, x+l/2, y+l/2, z+5, x+l/2, y-l/2, z+5]
	));
    }

    fingertipCBuffers = [];
    for (i = 0; i < fingertips.length; i++) {
	fingertipCBuffers.push(initSingleCBuffer(COLOR_TIP));
    }
}

function drawFingertips() {
    for (i = 0; i < fingertips.length; i++) {
	drawSingleBuffer(fingertipBuffers[i], fingertipCBuffers[i]);
    }
}


/****************** GL STUFF *****************/
var gl;
function initGL(canvas) {
    try {
	gl = canvas.getContext("experimental-webgl");
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
	alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
	return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
	if (k.nodeType == 3) {
	    str += k.textContent;
	}
	k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
	shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
	shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
	return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	alert(gl.getShaderInfoLog(shader));
	return null;
    }

    return shader;
}

var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

/* Vertex and color buffers for each grid cell */
var buf1, buf2, buf3, buf4, buf5, buf6, buf7, buf8, buf9;
var cbuf1, cbuf2, cbuf3, cbuf4, cbuf5, cbuf6, cbuf7, cbuf8, cbuf9;

function initSingleBuffer(vertices) {
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    buf.itemSize = 3;
    buf.numItems = 4;
    
    return buf;
}

function initSingleCBuffer(colors) {
    var cbuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    cbuf.itemSize = 4;
    cbuf.numItems = 4;

    return cbuf;
}

function initBuffers() {
    var w = gl.viewportWidth, h = gl.viewportHeight;
    buf1 = initSingleBuffer([-w/2, h/2, z, -w/2, h/6, z, -w/6, h/2, z, -w/6, h/6, z]);
    buf2 = initSingleBuffer([-w/6, h/2, z, -w/6, h/6, z, w/6, h/2, z, w/6, h/6, z]);
    buf3 = initSingleBuffer([w/6, h/2, z, w/6, h/6, z, w/2, h/2, z, w/2, h/6, z]);
    buf4 = initSingleBuffer([-w/2, h/6, z, -w/2, -h/6, z, -w/6, h/6, z, -w/6, -h/6, z]);
    buf5 = initSingleBuffer([-w/6, h/6, z, -w/6, -h/6, z, w/6, h/6, z, w/6, -h/6, z]);
    buf6 = initSingleBuffer([w/6, h/6, z, w/6, -h/6, z, w/2, h/6, z, w/2, -h/6, z]);
    buf7 = initSingleBuffer([-w/2, -h/6, z, -w/2, -h/2, z, -w/6, -h/6, z, -w/6, -h/2, z]);
    buf8 = initSingleBuffer([-w/6, -h/6, z, -w/6, -h/2, z, w/6, -h/6, z, w/6, -h/2, z]);
    buf9 = initSingleBuffer([w/6, -h/6, z, w/6, -h/2, z, w/2, -h/6, z, w/2, -h/2, z]);

    cbuf1 = initSingleCBuffer(COLOR_CELL[0]);
    cbuf2 = initSingleCBuffer(COLOR_CELL[1]);
    cbuf3 = initSingleCBuffer(COLOR_CELL[2]);
    cbuf4 = initSingleCBuffer(COLOR_CELL[3]);
    cbuf5 = initSingleCBuffer(COLOR_CELL[4]);
    cbuf6 = initSingleCBuffer(COLOR_CELL[5]);
    cbuf7 = initSingleCBuffer(COLOR_CELL[6]);
    cbuf8 = initSingleCBuffer(COLOR_CELL[7]);
    cbuf9 = initSingleCBuffer(COLOR_CELL[8]);
}

function drawSingleBuffer(buf, cbuf) {
    // Position
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buf.itemSize, gl.FLOAT, false, 0, 0);
    
    // Color
    gl.bindBuffer(gl.ARRAY_BUFFER, cbuf);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cbuf.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, buf.numItems);
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /* Tilt the screen */ 
    mat4.identity(pMatrix);
    mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 10, 5000, pMatrix);
    mat4.translate(pMatrix, [0, 0, -1000]);
    mat4.identity(mvMatrix);
    mat4.rotate(mvMatrix, degToRad(-40), [1, 0, 0]);

    /* Draw the grid */
    drawSingleBuffer(buf1, cbuf1);
    drawSingleBuffer(buf2, cbuf2);
    drawSingleBuffer(buf3, cbuf3);
    drawSingleBuffer(buf4, cbuf4);
    drawSingleBuffer(buf5, cbuf5);
    drawSingleBuffer(buf6, cbuf6);
    drawSingleBuffer(buf7, cbuf7);
    drawSingleBuffer(buf8, cbuf8);
    drawSingleBuffer(buf9, cbuf9);

    /* Draw fingertips markers */
    drawFingertips();
}

function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    randomizeColor();
    drawScene();
}

