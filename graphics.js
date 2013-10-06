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

var buf1, buf2, buf3, buf4, buf5, buf6, buf7, buf8, buf9;
var cbuf1, cbuf2, cbuf3, cbuf4, cbuf5, cbuf6, cbuf7, cbuf8, cbuf9;
var z = -500;

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

    cbuf1 = initSingleCBuffer([1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]);
    cbuf2 = initSingleCBuffer([0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
    cbuf3 = initSingleCBuffer([0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]);
    cbuf4 = initSingleCBuffer([0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
    cbuf5 = initSingleCBuffer([0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]);
    cbuf6 = initSingleCBuffer([1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]);
    cbuf7 = initSingleCBuffer([0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]);
    cbuf8 = initSingleCBuffer([1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]);
    cbuf9 = initSingleCBuffer([0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
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

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 10, 1000.0, pMatrix);
    mat4.identity(mvMatrix);

    drawSingleBuffer(buf1, cbuf1);
    drawSingleBuffer(buf2, cbuf2);
    drawSingleBuffer(buf3, cbuf3);
    drawSingleBuffer(buf4, cbuf4);
    drawSingleBuffer(buf5, cbuf5);
    drawSingleBuffer(buf6, cbuf6);
    drawSingleBuffer(buf7, cbuf7);
    drawSingleBuffer(buf8, cbuf8);
    drawSingleBuffer(buf9, cbuf9);
}

function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}

