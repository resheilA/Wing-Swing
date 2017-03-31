
var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta;

var thetaLoc;

 
var Tx = 0, Ty = 0, Tz = 0.0;
var translation;
var projectionMatrixLoc;
var modelViewMatrixLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    vcolor = (0.5, 0.5, 0.5, 1.0);
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
	translationLoc = gl.getUniformLocation(program, "translation"); 
    modelViewMatrixLoc = gl.getUniformLocation(program, 'modelView');
	projectionMatrixLoc = gl.getUniformLocation(program, 'projection');
        
    render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d) 
{
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  3.5,  0.5, 1.0 ),
        vec4(  0.5,  3.5,  0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  3.5, -0.5, 1.0 ),
        vec4(  0.5,  3.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 )
		
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use 
        colors.push(vertexColors[a]);
        
    }
	
	
}
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0,1.0,0.0);
var left = 1.0;
var right = -1.0;
var ytop = 1.0;
var bottom = -1.0;
var near = -10;
var far = 10;
var radius = 10;
var theta  = 2*Math.PI/36;
var phi  = 2*Math.PI/36;
var mx = 0; my = 0; mz = 0 ;
 var Tx = 0.5, Ty = 0.5, Tz = 1.0, t4 = 5;
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	at = vec3(mx,my,mz);
	 
	eye = vec3(radius * Math.sin(theta) * Math.cos(phi),
				radius * Math.sin(theta) * Math.sin(phi),
				radius * Math.cos(phi)
	)
	
	eye = vec3(0.0,0.0,0.0);
	
	modelViewMatrix = lookAt(eye, at, up);
	
	projectionMatrix = ortho(left, right, bottom, ytop, near, far);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	
	    //mz += 0.01;
    mx = 0.1;	
	my = -0.1;
    //mx = 0.1;
	//mz = 0.01;
	Ty -= 0.001;
	Tx -= 0.001;
	t4 -= 0.009; 
	
 	gl.uniform4f(translationLoc, Tx, Ty, 0.0, t4);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	
	gl.uniform4f(translationLoc, Tx+0.5, Ty, 0.0, t4-2.25);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	
	gl.uniform4f(translationLoc, Tx-2.0, Ty, 0.0, t4-2.25);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	
	gl.uniform4f(translationLoc, Tx-1.8, Ty, 0.0, t4-1.25);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	
	gl.uniform4f(translationLoc, Tx+1.5, Ty, 0.0, t4-1.0);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	
	gl.uniform4f(translationLoc, Tx+3.5, Ty, 0.0, t4+0.9);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	
	gl.uniform4f(translationLoc, Tx+2.5, Ty, 0.0, t4+1.25);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	
	gl.uniform4f(translationLoc, Tx+1.0, Ty, 0.0, t4+1.0);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

	gl.uniform4f(translationLoc, Tx-3.5, Ty, 0.0, t4+0.9);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	
	gl.uniform4f(translationLoc, Tx-2.5, Ty, 0.0, t4+1.25);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	
	gl.uniform4f(translationLoc, Tx-1.0, Ty, 0.0, t4+1.0);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
		
	
    requestAnimFrame( render );
}


   	
document.addEventListener("keydown", function (KeyboardEvent){
var key=KeyboardEvent.keyCode;
if(key==37){
   Tx += 0.1;
   mz -= 0.001;
}
if(key==39){
   Tx -= 0.1;
   mz += 0.001;
}

if(key==38){
   Ty += 0.1;
}

if(key==40){
   Ty -= 0.1;
}

});	

