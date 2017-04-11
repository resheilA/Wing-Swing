
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
var scaleLoc;
var scale;
var projectionMatrixLoc;
var modelViewMatrixLoc;

var texCoordsArray = [];
var texture;
var texSize = 64;
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
var texSize = 64;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 0.0 );
    
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
    
	var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
	
	var image = document.getElementById("texImage");
 
    configureTexture( image );
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	
	translationLoc = gl.getUniformLocation(program, "translation"); 
	scaleLoc = gl.getUniformLocation(program, "scale");
    modelViewMatrixLoc = gl.getUniformLocation(program, 'modelView');
	projectionMatrixLoc = gl.getUniformLocation(program, 'projection');
        
    render();
}

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    
    //gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
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
        [ 1.0, 0.0, 0.0, 1.0 ],  // red		
        [ 1.0, 0.23, 0.5, 1.0 ],  // magenta
		[ 0.0, 0.0, 0.0, 1.0 ],  // black			
        [ 0.0, 1.0, 1.0, 1.0 ],  //cyan		
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
		[ 1.0, 1.0, 0.0, 1.0 ],  // yellow	
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue            
		[ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    var texorder = [0,1,2,0,2,3];
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );
        // for solid colored faces use 
        colors.push(vertexColors[a]);
        texCoordsArray.push(texCoord[texorder[i]]); 
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
var Tx = 0.5, Ty = 0.4, Tz = 1.0, 
t4 = 4; // size of the playground
var objaty = -1.0; //movement along y-axis of the object
var objatx = 0.0; //movement along x-axis of the object
	
function render()
{

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
	if(score > 200)
	{
	alert("Hurray ! You win. You scored " + score + " points");
	location.reload();
	}
	
	at = vec3(mx,my,mz);
	up = vec3(0.0,1.0,0.0); 
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
	t4 -= 0.03; 
	
	
	gl.uniform4f(scaleLoc, 1.0, 1.5, 1.0, 1.5);	
 	gl.uniform4f(translationLoc, Tx, Ty, 0.0, t4+0.5);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	detectcollision(Tx,t4-0.5,Ty, 1.5);
	
    gl.uniform4f(scaleLoc, 1.0, 1.0, 1.0, 1.5);	
	gl.uniform4f(translationLoc, Tx+0.5, Ty, 0.0, t4-2.25);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	detectcollision(Tx+0.5,t4-2.25, Ty, 1.5);
	
	gl.uniform4f(scaleLoc, 1.0, 1.5, 1.0, 1.5);	
	gl.uniform4f(translationLoc, Tx+1.0, Ty, 0.0, t4+1.0);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	detectcollision(Tx+1.0,t4+1.0,Ty, 1.5);
	
	
	gl.uniform4f(scaleLoc, 1.0, 1.5, 1.0, 1.5);	
	gl.uniform4f(translationLoc, Tx+1.5, Ty, 0.0, t4-1.0);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    detectcollision(Tx+1.5,t4-1.0,Ty, 1.5);
	
	
	gl.uniform4f(scaleLoc, 1.0, 1.0, 1.0, 1.5);	
	gl.uniform4f(translationLoc, Tx+2.5, Ty, 0.0, t4+1.25);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	detectcollision(Tx+2.5,t4+1.25,Ty, 1.5);
	
    gl.uniform4f(scaleLoc, 1.0, 1.5, 1.0, 1.5);		
	gl.uniform4f(translationLoc, Tx+3.5, Ty, 0.0, t4+0.9);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	detectcollision(Tx+3.5,t4+0.9,Ty, 1.5);
	
	gl.uniform4f(scaleLoc, 1.0, 1.5, 1.0, 1.5);	
	gl.uniform4f(translationLoc, Tx-1.0, Ty, 0.0, t4+1.0);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );	
	detectcollision(Tx-1.0,t4+1.0,Ty, 1.5);
	
	
	gl.uniform4f(scaleLoc, 1.0, 1.0, 1.0, 1.5);	
	gl.uniform4f(translationLoc, Tx-1.8, Ty, 0.0, t4-1.25);
	detectcollision(Tx-1.8,t4-1.25,Ty, 1.5);	
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

	gl.uniform4f(scaleLoc, 1.0, 1.0, 1.0, 1.5);	
	gl.uniform4f(translationLoc, Tx-2.0, Ty, 0.0, t4-2.25);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	detectcollision(Tx-2.0,t4-2.25,Ty, 1.5);

	gl.uniform4f(scaleLoc, 1.0, 1.0, 1.0, 1.5);	
	gl.uniform4f(translationLoc, Tx-2.5, Ty, 0.0, t4+1.25);	
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	detectcollision(Tx-2.5,t4+1.25,Ty, 1.5);
	
	gl.uniform4f(scaleLoc, 1.0, 1.0, 1.0, 1.5);	
	gl.uniform4f(translationLoc, Tx-3.5, Ty, 0.0, t4+0.9);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	detectcollision(Tx-3.5,t4+0.9,Ty, 1.5);
	
/*	
	//back
	at = vec3(1.0, -0.5, 0.0);
	up = vec3(-1.0,-1.0,0.0);
    modelViewMatrix = lookAt(eye, at, up);
	projectionMatrix = ortho(left, right, bottom, ytop, near, far);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	
	gl.uniform4f(scaleLoc, 15.5, 0.005, 10.5, 10.0);	
	gl.uniform4f(translationLoc, Tx-1.0, Ty-0.5, 0.0, 10.0);
	gl.drawArrays( gl.TRIANGLES, 0, 36 );	
	
	//ground
    at = vec3(1.0, -0.5, 0.0);
	up = vec3(-1.0,-1.0,0.0);
    modelViewMatrix = lookAt(eye, at, up);
	projectionMatrix = ortho(left, right, bottom, ytop, near, far);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	
	gl.uniform4f(scaleLoc, 7.0, 0.05, 10.5, 1.0);	
	gl.uniform4f(translationLoc, Tx-1.0, Ty-0.5, 1.0, 0.0);
	gl.drawArrays( gl.TRIANGLES, 0, 36 );	
	
	*/	
	//PLayer
    var objnear = -5;
    var objfar = 5;
	var objbottom = +1.0;
	var objytop = -1.0;
	
	at = vec3(mx,objaty,objatx);
	up = vec3(0.0,1.0,0.0); 
	modelViewMatrix = lookAt(eye, at, up);
	projectionMatrix = ortho(left, right, objbottom, objytop, objnear, objfar);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	
	
	gl.uniform4f(scaleLoc, 0.002, 0.002, -0.002, 0.1);	
	gl.uniform4f(translationLoc, 0.0, 0.0, 0.0, -0.09);
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );	
	
	changescore();
	
    
	/*
	detectcollision(Tx, t4, Tx-2.5, t4 + 1.25);   
	detectcollision(Tx, t4, Tx-2.0, t4 - 2.25);   
	detectcollision(Tx, t4, Tx+1.8, t4 + 1.25); 
/*	
	detectcollision(Tx, t4, Tx-3.5, t4 - 1.25);   
	detectcollision(Tx, t4, Tx-3,5, t4 + 0.9);   
	detectcollision(Tx, t4, Tx+0.5, t4 ); 
	detectcollision(Tx, t4, Tx+1.0, t4 );   
	detectcollision(Tx, t4, Tx+1.5, t4 );   
	detectcollision(Tx, Tx, Tx+2.5, t4 );   
	detectcollision(Tx, t4, Tx+3.5, t4 );   
*/	
    
	//detectcollision(Math.round(Tx * 100) / 100, Math.round(t4 * 100) / 100, 0.0, 2.15 );   
	//detectcollision(Math.round(Tx * 10) / 10, Math.round(t4 * 10) / 10, -0.5, 0.5);   
    requestAnimFrame( render );


	
}

var score = 0;

function changescore(){
score++;
var element = document.getElementById("header");
element.innerHTML = "Your Score : " + score;
}

function detectcollision(bldx, bldz, currenty, up){
//console.log(bldy);
	up = up + 1.0;
    //console.log(currenty + " " + -up);
	if(currenty > 0.650){
    alert("You loose due to ground touch. You scored " + score + " points");
	location.reload();
	}
	if((Math.round(bldz * 100) / 100) < 0.07){
		if((Math.round(bldz * 100) / 100) > -0.09){
			if(bldx < 0.70)
			{
				if(bldx > -0.5)
				{
				    
					if(currenty > -up)
					{
				    alert("You collided with building. You scored " + score + " points");
				    location.reload();
					}
				}	
			}
		}	
	}
}
   	
document.addEventListener("keydown", function (KeyboardEvent){
var key=KeyboardEvent.keyCode;
if(key==37){
   Tx += 0.1;
   mz -= 0.001;
   //objatx -= 0.001;
}
if(key==39){
   Tx -= 0.1;
   mz += 0.001;
   //objatx += 0.001;
}

if(key==38){
   Ty += 0.1;
   objaty += 0.03;
}

if(key==40){
   Ty -= 0.1;
   objaty -= 0.03;
}


});	

