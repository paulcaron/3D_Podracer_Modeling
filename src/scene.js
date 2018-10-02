"use strict";


///    INITIALIZING THE SCENE   ////


// Initializing the parameters of the scene from the parameters of the interface

function updatedGui(guiParam,sceneThreeJs) {
      if(step1){
            if (move){
                for(var i=0;i<wings1.length;i++){
                    object1.remove(wings1[i]);
                    object2.remove(wings2[i]);
                }
                    wings1=[];
                    wings2=[];
                    const l=0.5*ymax;
                    const L=1.5*(vectorPoints[vectorPoints.length-1].x-vectorPoints[0].x);
                for(var i=0;i<interfaceData.numberWings;i++){
                    var geometryBis = primitive.specialGeometry(l  , L);
                    geometryBis.rotateX(Math.PI/2);
                    geometryBis.translate(vectorPointsCenter[imax].x+0.4*L, ymax,0);
                    var wing1 = new THREE.Mesh( geometryBis,MaterialRGB(0,0,0));
                    var wing2 = new THREE.Mesh( geometryBis,MaterialRGB(0,0,0));
                    wing1.material.color = new THREE.Color(interfaceData.color);
                    wing1.castShadow = true;
                    wing1.receiveShadow = true;
                    wing2.material.color = new THREE.Color(interfaceData.color);
                    wing2.castShadow = true;
                    wing2.receiveShadow = true;
                    object1.add(wing1);
                    object2.add(wing2);
                    wing1.setRotationFromAxisAngle(Vector3(1,0,0),Math.PI*2*i/interfaceData.numberWings);
                    wings1.push(wing1);
                    wing2.setRotationFromAxisAngle(Vector3(1,0,0),Math.PI*2*i/interfaceData.numberWings);
                    wings2.push(wing2);
                }
                render();
            }
      }

}
const updateFunc = function() { updatedGui(interfaceData); };


var sceneGraph=new THREE.Scene();
sceneInit.insertAmbientLight(sceneGraph);
sceneInit.insertLight(sceneGraph,Vector3(1,2,2));

var camera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);
var controls=new THREE.OrbitControls( camera );
controls.enabled=false;

var renderer = new THREE.WebGLRenderer( { antialias: true,alpha:false } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor(0xeeeeee,1.0);

let canvasSize = Math.min(window.innerWidth, window.innerHeight);
renderer.setSize( canvasSize,canvasSize );

const baliseHtml = document.querySelector("#AffichageScene3D");
baliseHtml.appendChild(renderer.domElement);

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0,0,1);
sceneGraph.add(spotLight);

const interfaceData = {intensity:0.5, color:'#E7F00D', numberWings:3};
const gui = new dat.GUI();
gui.add( interfaceData,'intensity',0,1).onChange(updateFunc);
gui.add( interfaceData,'numberWings',0,10).step(1).onChange(updateFunc);
gui.addColor(interfaceData, 'color').onChange(updateFunc);


// Picking data
const pickingData = {
    enabled: false,           // Wether picking is activated (CTRL key)
    selectableObjects: [],    
    selectedObject: null,     
    selectedPlane: {p:null,n:null}, // Plane of the camera during the selection. Given by position and vector n.
}
var pickingShape;// Shape of the digging object
var sculptureRange =0.1;
var sculptureLong = 0.5;
var sculptureLarg = 0.3;
var sculptureHaut = 0.1;
const transMat = new THREE.MeshLambertMaterial({color:0xff0000,transparent:true,opacity:0.4});

pickingShape = new THREE.Mesh(primitive.Cube(Vector3(0,0,0),sculptureLong,sculptureHaut,sculptureLarg),transMat );
pickingShape.name = "pickingShape";
pickingShape.visible = false;
sceneGraph.add(pickingShape);

const raycaster = new THREE.Raycaster();

////////////////////////////////////////////////////////////////////////////////////////////////////////////

var step1=true;
var step2=false;
var step3=false;
var side=false;
var up=false;

var rectangle;
var rectangle2;
var geometry;
var geom;
var vectorPoints = [];
var vectorPointsCenter=[];
var vectorPoints2=[]
var vectorPointsCenter2=[]
var vectorPoints3=[]
var vectorPointsCenter3=[]
var object1;
var object2;
var object3;
var object;
var wings1;
var wings2;
var shapegeom;
var vectorlist;
var faceslist;

var ymax;
var ymax2;
var ymin;
var ymin2;
var xmax;
var xmax2;
var xmin;
var xmin2;
var imax;
var imax2;
var cockpitScale;
var engineScale;

//Cable data
var points1 = [];
var points2 = [];
var nextPoints1 = [];
var nextPoints2 = [];
var speeds1 = [];
var speeds2 = [];
var k = 90;
var l0 = 0.1;
var forces;
var masse = 2;
var lambdaf = 10;

var previoustime = 0;
var dt = 0;

var nbmasses = 5;
l0 = 0.1*4/nbmasses;
var cables1 =[];
var cables2 =[];

var rcable = 0.01;
var cableheadxposition;
var cabletailxposition;

var jumping = false;
var stabilize = false;
var timestart = 0;
var movecounter = 0;
var jumping2 = false;
var stabilize2 = false;
var timestart2 = 0;
var sceneThreeJs;
var tmeteor=0;
//End of cable data

var allObjects;
const metalMat = new THREE.MeshStandardMaterial({metalness:0.7,roughness:0.5});

var controlDown=false;
var firstPoint = true;
var draw = false;
var move=false;
var change= false;
var changeAndDown=false;
var outofball=false;
var xLign1=null;
var xLign=null;
var lastX=0;
var lastY=0;
var lastLastX=0;
var lastLastY=0;
var yLign=null;
var line=null;
var indexChange=0;

const saveFunction = function(){ saveScene(sceneThreeJs.sceneGraph); };
const loadFunction = function(){ loadScene(sceneThreeJs.sceneGraph,allObjects); };
const exportOBJFunction = function(){ exportOBJ(allObjects); };


window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('resize',onResize);
window.addEventListener('keydown',onKeyDown);
window.addEventListener('keyup',onKeyUp);




function onMouseDown(event) {

  if(pickingData.enabled && controlDown){
    if( pickingShape.visible ) {
      for(var i=0; i<vectorlist.length; i++){
        var x = vectorlist[i].x;
        var y = vectorlist[i].y;
        var z = vectorlist[i].z;
        var xp = pickingData.selectedPlane.p.x;
        var yp = pickingData.selectedPlane.p.y;
        var zp = pickingData.selectedPlane.p.z;
        var xn = pickingData.selectedPlane.n.x;
        var yn = pickingData.selectedPlane.n.y;
        var zn = pickingData.selectedPlane.n.z;
        xp+=(-1/20)*xn;
        yp+=(-1/20)*yn;
        zp+=(-1/20)*zn;

// Projection

          var ny;
        if(x>xp-sculptureLong/2&&x<xp+sculptureLong/2 && y>yp-sculptureHaut/2&&y<yp+sculptureHaut/2 && z>zp-sculptureLarg/2&&z<zp+sculptureLarg/2){
          if(yp>=y-sculptureHaut/2){
            ny = yp-sculptureHaut/2;
          }
          else{
            ny = yp+sculptureHaut/2;
          }
          var vector = new THREE.Vector3( x,ny,z );
          vectorlist[i] = vector;
          }
        }


      sceneGraph.remove(object);
      geom = new THREE.Geometry();
      geom.vertices = vectorlist;
      geom.faces = faceslist;
      geom.computeVertexNormals();
      object = new THREE.Mesh( geom, metalMat );
      object.castShadow = true;
      object.receiveShadow = true;
      object.position.set(0,0,0);
      sceneGraph.add(object);

      pickingData.selectableObjects=[];
      pickingData.selectableObjects.push(object);
      render();
    }

  }


    if(step1){
        const xPixel = event.clientX;
        const yPixel = event.clientY;

        const x = 2*(xPixel/canvasSize)-1;
        const y = 1-2*(yPixel/canvasSize);

        if(firstPoint){
            firstPoint=false;
            draw=true;
            const xPixel = event.clientX;
            const yPixel = event.clientY;
            const x = 2*(xPixel/canvasSize)-1;
            const y = 1-2*(yPixel/canvasSize);
            yLign=y;
            lastX=x;
            lastY=y;
            lastLastX=x;
            lastLastY=y;
            vectorPoints.push(Vector3(x,y,0));
            const p0 = new THREE.Vector3(-1,y,0);
            const p1 = new THREE.Vector3(-1,-1,0);
            const p2 = new THREE.Vector3(1,-1,0);
            const p3 = new THREE.Vector3(1,y,0);
            const rectangleGeometry = primitive.Quadrangle(p0,p1,p2,p3);
            rectangle = new THREE.Mesh( rectangleGeometry,MaterialRGB(0.1, 0.1, 0.1) );
            sceneGraph.add(rectangle);
            render();
        }
        else if(change && controlDown){
            changeAndDown=true;
            const xPixel = event.clientX;
            const yPixel = event.clientY;
            const x = 2*(xPixel/canvasSize)-1;
            const y = 1-2*(yPixel/canvasSize);
            var min=0;
            var minValue=(x-vectorPoints[min].x)*(x-vectorPoints[min].x)+(y-vectorPoints[min].y)*(y-vectorPoints[min].y);
            for(let i=1;i<vectorPoints.length;i++){
                if( (x-vectorPoints[i].x)*(x-vectorPoints[i].x)+(y-vectorPoints[i].y)*(y-vectorPoints[i].y)<minValue){
                    min=i,
                    minValue=(x-vectorPoints[i].x)*(x-vectorPoints[i].x)+(y-vectorPoints[i].y)*(y-vectorPoints[i].y);
                }
            }
            indexChange=min;
            lastX=x;
            lastY=y;
        }
    }

    if(step2){
        if(side){
            if(firstPoint){
                firstPoint=false;
                draw=true;
                const xPixel = event.clientX;
                const yPixel = event.clientY;
                const x = 2*(xPixel/canvasSize)-1;
                const y = 1-2*(yPixel/canvasSize);
                yLign=y;
                xLign1=x;
                lastX=x;
                lastY=y;
                lastLastX=x;
                lastLastY=y;
                vectorPoints2.push(Vector3(x,y,0));
                render();
            }

            else if(change && controlDown){
                changeAndDown=true;
                const xPixel = event.clientX;
                const yPixel = event.clientY;
                const x = 2*(xPixel/canvasSize)-1;
                const y = 1-2*(yPixel/canvasSize);
                var min=0;
                var minValue=(x-vectorPoints2[min].x)*(x-vectorPoints2[min].x)+(y-vectorPoints2[min].y)*(y-vectorPoints2[min].y);
                for(let i=1;i<vectorPoints2.length;i++){
                    if( (x-vectorPoints2[i].x)*(x-vectorPoints2[i].x)+(y-vectorPoints2[i].y)*(y-vectorPoints2[i].y)<minValue){
                        min=i,
                        minValue=(x-vectorPoints2[i].x)*(x-vectorPoints2[i].x)+(y-vectorPoints2[i].y)*(y-vectorPoints2[i].y);
                    }
                }
                indexChange=min;
                lastX=x;
                lastY=y;
            }
        }
        if(up){
          if(firstPoint){
            firstPoint=false;
            const xPixel = event.clientX;
            draw=true;
            const yPixel = event.clientY;
            const x = 2*(xPixel/canvasSize)-1;
            const y = 1-2*(yPixel/canvasSize);
            xLign=x;
            lastX=x;
            lastY=y;
            lastLastX=x;
            lastLastY=y;
            vectorPoints3.push(Vector3(x,y,0));
            const p0 = new THREE.Vector3(-1,1,0);
            const p1 = new THREE.Vector3(-1,-1,0);
            const p2 = new THREE.Vector3(x,-1,0);
            const p3 = new THREE.Vector3(x,1,0);
            const rectangleGeometry = primitive.Quadrangle(p0,p1,p2,p3);
            rectangle2 = new THREE.Mesh( rectangleGeometry,MaterialRGB(0.1, 0.1, 0.1) );
            sceneGraph.add(rectangle2);
            render();
          }
        else if(change && controlDown){
            changeAndDown=true;
            const xPixel = event.clientX;
            const yPixel = event.clientY;
            const x = 2*(xPixel/canvasSize)-1;
            const y = 1-2*(yPixel/canvasSize);
            var min=0;
            var minValue=(x-vectorPoints3[min].x)*(x-vectorPoints3[min].x)+(y-vectorPoints3[min].y)*(y-vectorPoints3[min].y);
            for(let i=1;i<vectorPoints3.length;i++){
                if( (x-vectorPoints3[i].x)*(x-vectorPoints3[i].x)+(y-vectorPoints3[i].y)*(y-vectorPoints3[i].y)<minValue){
                    min=i,
                    minValue=(x-vectorPoints3[i].x)*(x-vectorPoints3[i].x)+(y-vectorPoints3[i].y)*(y-vectorPoints3[i].y);
                }
            }
            indexChange=min;
            lastX=x;
            lastY=y;
        }
    }

    }

}

function onMouseUp(event) {
    if (changeAndDown) changeAndDown=false;
}

function onMouseMove(event) {
    if(step1){
        if(draw){
            const xPixel = event.clientX;
            const yPixel = event.clientY;
            const x = 2*(xPixel/canvasSize)-1;
            const y = 1-2*(yPixel/canvasSize);

            const cond1 = (x-lastX)*(x-lastX)+(y-lastY)*(y-lastY)>0.0001;
            const ux = lastLastX-lastX;
            const uy = lastLastY-lastY;
            const vx = x-lastX;
            const vy = y-lastY;
            const wx = x-lastLastX;
            const wy = y-lastLastY;
            const cond2 = (ux*vx+uy*vy)*(ux*vx+uy*vy)/((ux*ux+uy*uy)*(vx*vx+vy*vy))<0.99999999999;
            const cond3 = (y<yLign);

            if(cond3){
                vectorPoints.push(Vector3(x,yLign,0));
                draw=false;
                geometry = new THREE.Geometry();
                geometry.vertices=vectorPoints;
                const materialWireframe = new THREE.LineBasicMaterial({color:0x000000});
                sceneGraph.remove(line)
                line = new THREE.Line(geometry,materialWireframe)
                sceneGraph.add( line );
                render();
                lastLastX=lastX;
                lastLastY=lastY;
                lastX=x;
                lastY=y;
                change=true;



            }

            else if(cond1){
                vectorPoints.push(Vector3(x,y,0));
                geometry = new THREE.Geometry();
                geometry.vertices=vectorPoints;
                const materialWireframe = new THREE.LineBasicMaterial({color:0x000000});
                sceneGraph.remove(line)
                line = new THREE.Line(geometry,materialWireframe)
                sceneGraph.add( line );
                render();
                lastLastX=lastX;
                lastLastY=lastY;
                lastX=x;
                lastY=y;
            }
      }

        else if (changeAndDown && controlDown){

            const xPixel = event.clientX;
            const yPixel = event.clientY;
            const x = 2*(xPixel/canvasSize)-1;
            const y = 1-2*(yPixel/canvasSize);

            if((x-lastX)*(x-lastX)+(y-lastY)*(y-lastY)>0.00002){

                const intensity = interfaceData.intensity;
                const nbSquare = vectorPoints.length*vectorPoints.length
                const coef = Math.exp(-(indexChange-vectorPoints.length/2)*(indexChange-vectorPoints.length/2)*10/nbSquare)

                for(let i=1; i<vectorPoints.length-1 ; i++){
                      vectorPoints[i]=Vector3(
                          vectorPoints[i].x+(x-lastX)*coef*Math.exp(-(i-indexChange)*4000*intensity*intensity*intensity*(i-indexChange)/nbSquare),
                          vectorPoints[i].y+(y-lastY)*coef*Math.exp(-(i-indexChange)*4000*intensity*intensity*intensity*(i-indexChange)/nbSquare),
                          0)
                  }
                lastX=x;
                lastY=y;

                sceneGraph.remove(line)

                geometry = new THREE.Geometry();
                geometry.vertices=vectorPoints;
                const materialWireframe = new THREE.LineBasicMaterial({color:0x000000});
                line = new THREE.Line(geometry,materialWireframe)
                sceneGraph.add( line );
                render();
                sceneGraph.remove(line);


            }


        }

        else if(move){render();}
    }

    if(step2){

        if(pickingData.enabled && controlDown){

          // Click coordinates
          const xPixel = event.clientX;
          const yPixel = event.clientY;

          const windowW = renderer.domElement.clientWidth;
          const windowH = renderer.domElement.clientHeight;

          const x =  2*xPixel/windowW-1;
          const y = -2*yPixel/windowH+1;

          // Radius going through (x,y) point
          raycaster.setFromCamera(new THREE.Vector2(x,y), camera);

          // Interections between radius and parameter objects
          const intersects = raycaster.intersectObjects( pickingData.selectableObjects );

          const nbrIntersection = intersects.length;
          if (nbrIntersection==0){pickingShape.visible = false;}
          if( nbrIntersection>0 ) {

              // Intersections sorting
              const intersection = intersects[0];

              // Picking data storage
              pickingData.selectedObject = intersection.object; // Selected object
              pickingData.selectedPlane.p = intersection.point.clone(); // Intersection point coordinates
              pickingData.selectedPlane.n = camera.getWorldDirection().clone(); // Normal vevtor



              pickingShape.visible = true;
              pickingShape.position.set( pickingData.selectedPlane.p.x,pickingData.selectedPlane.p.y,pickingData.selectedPlane.p.z ); // Shpere position

          }

    }


        if(side){
            if(draw){
                const xPixel = event.clientX;
                const yPixel = event.clientY;
                const x = 2*(xPixel/canvasSize)-1;
                const y = 1-2*(yPixel/canvasSize);

                const cond1 = (x-lastX)*(x-lastX)+(y-lastY)*(y-lastY)>0;
                const ux = lastLastX-lastX;
                const uy = lastLastY-lastY;
                const vx = x-lastX;
                const vy = y-lastY;
                const wx = x-lastLastX;
                const wy = y-lastLastY;
                const cond2 = (ux*vx+uy*vy)*(ux*vx+uy*vy)/((ux*ux+uy*uy)*(vx*vx+vy*vy))<0.99999999999;
                const cond3 = ((y-yLign)*(y-yLign)+(x-xLign1)*(x-xLign1)<0.001);

                if(!cond3){outofball=true;}

                if(cond3 && outofball){
                    vectorPoints2.push(Vector3(xLign1,yLign,0));
                    draw=false;
                    geometry = new THREE.Geometry();
                    geometry.vertices=vectorPoints2;
                    const materialWireframe = new THREE.LineBasicMaterial({color:0x000000});
                    sceneGraph.remove(line)
                    line = new THREE.Line(geometry,materialWireframe)
                    sceneGraph.add( line );
                    render();
                    lastLastX=lastX;
                    lastLastY=lastY;
                    lastX=x;
                    lastY=y;
                    change=true;



                }

                else if(cond1){
                    vectorPoints2.push(Vector3(x,y,0));
                    geometry = new THREE.Geometry();
                    geometry.vertices=vectorPoints2;
                    const materialWireframe = new THREE.LineBasicMaterial({color:0x000000});
                    sceneGraph.remove(line)
                    line = new THREE.Line(geometry,materialWireframe)
                    sceneGraph.add( line );
                    render();
                    lastLastX=lastX;
                    lastLastY=lastY;
                    lastX=x;
                    lastY=y;
                }
            }

            else if(changeAndDown && controlDown){
                const xPixel = event.clientX;
                const yPixel = event.clientY;
                const x = 2*(xPixel/canvasSize)-1;
                const y = 1-2*(yPixel/canvasSize);

                if((x-lastX)*(x-lastX)+(y-lastY)*(y-lastY)>0.00002){

                    const intensity = interfaceData.intensity;
                    const nbSquare = vectorPoints2.length*vectorPoints2.length;

                    for(let i=0; i<vectorPoints2.length; i++){
                        const dist = Math.min(Math.abs(i-indexChange), Math.abs(i-indexChange+vectorPoints2.length),Math.abs(-i+indexChange+vectorPoints2.length));
                          vectorPoints2[i]=Vector3(
                              vectorPoints2[i].x+(x-lastX)*Math.exp(-dist*dist*10000*intensity*intensity*intensity/nbSquare),
                              vectorPoints2[i].y+(y-lastY)*Math.exp(-dist*dist*10000*intensity*intensity*intensity/nbSquare),
                              0)
                    }
                    lastX=x;
                    lastY=y;

                    sceneGraph.remove(line)

                    geometry = new THREE.Geometry();
                    geometry.vertices=vectorPoints2;
                    const materialWireframe = new THREE.LineBasicMaterial({color:0x000000});
                    line = new THREE.Line(geometry,materialWireframe)
                    sceneGraph.add( line );
                    render();
                    sceneGraph.remove(line);


                }


            }
        }

        if(up){
            if(draw){
                const xPixel = event.clientX;
                const yPixel = event.clientY;
                const x = 2*(xPixel/canvasSize)-1;
                const y = 1-2*(yPixel/canvasSize);

                const cond1 = (x-lastX)*(x-lastX)+(y-lastY)*(y-lastY)>0;
                const ux = lastLastX-lastX;
                const uy = lastLastY-lastY;
                const vx = x-lastX;
                const vy = y-lastY;
                const wx = x-lastLastX;
                const wy = y-lastLastY;
                const cond2 = (ux*vx+uy*vy)*(ux*vx+uy*vy)/((ux*ux+uy*uy)*(vx*vx+vy*vy))<0.99999999999;
                const cond3 = (x<xLign);

                if(cond3){
                    vectorPoints3.push(Vector3(xLign,y,0));
                    draw=false;
                    geometry = new THREE.Geometry();
                    geometry.vertices=vectorPoints3;
                    const materialWireframe = new THREE.LineBasicMaterial({color:0x000000});
                    sceneGraph.remove(line)
                    line = new THREE.Line(geometry,materialWireframe)
                    sceneGraph.add( line );
                    render();
                    lastLastX=lastX;
                    lastLastY=lastY;
                    lastX=x;
                    lastY=y;
                    change=true;



                }

                else if(cond1){
                    vectorPoints3.push(Vector3(x,y,0));
                    geometry = new THREE.Geometry();
                    geometry.vertices=vectorPoints3;
                    const materialWireframe = new THREE.LineBasicMaterial({color:0x000000});
                    sceneGraph.remove(line)
                    line = new THREE.Line(geometry,materialWireframe)
                    sceneGraph.add( line );
                    render();
                    lastLastX=lastX;
                    lastLastY=lastY;
                    lastX=x;
                    lastY=y;
                }
            }


        else if (changeAndDown && controlDown){

            const xPixel = event.clientX;
            const yPixel = event.clientY;
            const x = 2*(xPixel/canvasSize)-1;
            const y = 1-2*(yPixel/canvasSize);

            if((x-lastX)*(x-lastX)+(y-lastY)*(y-lastY)>0.00002){

                const intensity = interfaceData.intensity;
                const nbSquare = vectorPoints3.length*vectorPoints3.length
                const coef = Math.exp(-(indexChange-vectorPoints3.length/2)*(indexChange-vectorPoints3.length/2)*10/nbSquare)

                for(let i=1; i<vectorPoints3.length-1 ; i++){
                      vectorPoints3[i]=Vector3(
                          vectorPoints3[i].x+(x-lastX)*coef*Math.exp(-(i-indexChange)*4000*intensity*intensity*intensity*(i-indexChange)/nbSquare),
                          vectorPoints3[i].y+(y-lastY)*coef*Math.exp(-(i-indexChange)*4000*intensity*intensity*intensity*(i-indexChange)/nbSquare),
                          0)
                  }
                lastX=x;
                lastY=y;

                sceneGraph.remove(line)

                geometry = new THREE.Geometry();
                geometry.vertices=vectorPoints3;
                const materialWireframe = new THREE.LineBasicMaterial({color:0x000000});
                line = new THREE.Line(geometry,materialWireframe)
                sceneGraph.add( line );
                render();
                sceneGraph.remove(line);


            }


        }
        }

    else if(move){render();}


    }
}


function onKeyDown(event){

    if(event.key=="Control"){
        controlDown=true;
    }

    if(step1){

        if(change){
            if(changeAndDown){}
            else if (event.key==" "){
                vectorPointsCenter=[];
                move=true;
                change=false;
                sceneGraph.remove(line);
                sceneGraph.remove(rectangle);
                for(var i =0; i<vectorPoints.length; i++){
                    vectorPointsCenter.push(Vector3(vectorPoints[i].x, vectorPoints[i].y-yLign,0));
                }

                geom = new THREE.Geometry();
                let n=300;
                let m = vectorPoints.length;
                for (let j =0; j<n; j++){
                    for(let i=0; i<vectorPoints.length; i++){//Ajout des sommets de la j-ième tranche
                        var vector = new THREE.Vector3( vectorPointsCenter[i].x, vectorPointsCenter[i].y, 0 );
                        var axis = new THREE.Vector3( 1, 0, 0 );
                        var angle = j*2*Math.PI/n;
                        vector.applyAxisAngle( axis, angle );
                        geom.vertices.push(vector);

                    }
                }

                for (let j =0; j<n-1; j++){
                    for(let i=0; i<vectorPoints.length-1; i++){
                        var f1 = new THREE.Face3(j*m+i, (j+1)*m+i, j*m+i+1)
                        var f2 = new THREE.Face3(j*m+i+1, (j+1)*m+i, (j+1)*m+i+1)
                        geom.faces.push(f1);
                        geom.faces.push(f2);
                    }
                }
                for(let i=0; i<vectorPoints.length-1; i++){
                    var f1 = new THREE.Face3((n-1)*m+i, (0)*m+i, (n-1)*m+i+1)
                    var f2 = new THREE.Face3((n-1)*m+i+1, (0)*m+i, (0)*m+i+1)
                    geom.faces.push(f1);
                    geom.faces.push(f2);
                }

                geom.computeVertexNormals();

                imax=0;
                ymax=0;
                for(var i=0;i<vectorPointsCenter.length;i++){
                    if(vectorPointsCenter[i].y>=ymax){
                        ymax=vectorPointsCenter[i].y;
                        imax=i;
                    }
                }

                sceneGraph.remove(object1);
                sceneGraph.remove(object2);

                object1 = new THREE.Mesh( geom, metalMat );
                object1.castShadow = true;
                object1.receiveShadow = true;
                object1.position.set(0,0,2.5*ymax);
                sceneGraph.add(object1);

                object2 = new THREE.Mesh( geom, metalMat );
                object2.castShadow = true;
                object2.receiveShadow = true;
                object2.position.set(0,0,-2.5*ymax)
                sceneGraph.add(object2);


                wings1=[];
                wings2=[];
                const l=0.5*ymax;
                const L=1.5*(vectorPoints[m-1].x-vectorPoints[0].x);
                engineScale = vectorPoints[m-1].x-vectorPoints[0].x;
                cableheadxposition = vectorPoints[0].x;

                for(var i=0;i<interfaceData.numberWings;i++){
                    var geometryBis = primitive.specialGeometry(l  , L);
                    geometryBis.rotateX(Math.PI/2);
                    geometryBis.translate(vectorPointsCenter[imax].x+0.4*L, ymax,0);
                    var wing1 = new THREE.Mesh( geometryBis,MaterialRGB(0,0,0));
                    var wing2 = new THREE.Mesh( geometryBis,MaterialRGB(0,0,0));
                    wing1.material.color = new THREE.Color(interfaceData.color);
                    wing1.castShadow = true;
                    wing1.receiveShadow = true;
                    wing2.material.color = new THREE.Color(interfaceData.color);
                    wing2.castShadow = true;
                    wing2.receiveShadow = true;
                    object1.add(wing1);
                    object2.add(wing2);
                    wing1.setRotationFromAxisAngle(Vector3(1,0,0),Math.PI*2*i/interfaceData.numberWings);
                    wings1.push(wing1);
                    wing2.setRotationFromAxisAngle(Vector3(1,0,0),Math.PI*2*i/interfaceData.numberWings);
                    wings2.push(wing2);

                }

                camera=sceneInit.createCamera(1,1.5,3);
                sceneInit.insertRenderInHtml(renderer.domElement);
                controls = new THREE.OrbitControls(camera);
                render();
            }
        }

        else if(move && event.key==" "){
            move=false;
            change=true;
            sceneGraph.remove(object1);
            sceneGraph.remove(object2);
            sceneGraph.add(line);
            sceneGraph.add(rectangle);
            camera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);
            controls = new THREE.OrbitControls(camera);
            controls.enabled=false;
            render();
        }

        else if(move && event.key=="Enter"){
            step1=false;
            step2=true;
            side=true;
            move=false;
            change=false;
            changeAndDown=false;
            draw=false;
            firstPoint=true;
            lastX=0;
            lastY=0;
            lastLastX=0;
            lastLastY=0;

            sceneGraph.remove(object1);
            sceneGraph.remove(object2);
            camera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);
            controls = new THREE.OrbitControls(camera);
            controls.enabled=false;
            render();
        }
    }


    if(step2){

            if (event.key==" " && side && change && !changeAndDown){
            sceneGraph.remove(line);
            up=true;
            side=false;
            firstPoint=true;
            change=false;
            render();
        }


        if (event.key==" " && up && change && !changeAndDown){
          vectorPointsCenter2=[];
          vectorPointsCenter3=[];
          up=false;
          move=true;
          change=false;
          sceneGraph.remove(line);
          sceneGraph.remove(rectangle2);
          for(var i =0; i<vectorPoints2.length; i++){
              vectorPointsCenter2.push(Vector3(vectorPoints2[i].x, vectorPoints2[i].y-yLign,0));
          }
          for(var i =0; i<vectorPoints3.length; i++){
              vectorPointsCenter3.push(Vector3(vectorPoints3[i].x-xLign, vectorPoints3[i].y,0));
          }


          imax=0;
          ymax=vectorPointsCenter2[0].y;
          imax2=0;
          ymax2=vectorPointsCenter3[0].y;
          ymin2=vectorPointsCenter3[0].y;
          ymin=vectorPointsCenter2[0].y;
          xmax=vectorPointsCenter2[0].x;
          xmin=vectorPointsCenter2[0].x;
          xmax2=vectorPointsCenter3[0].x;
          for(var i=0;i<vectorPointsCenter2.length;i++){
              if(vectorPointsCenter2[i].y>=ymax){
                  ymax=vectorPointsCenter2[i].y;
                  imax=i;
              }
              if(vectorPointsCenter2[i].y<=ymin){
                  ymin=vectorPointsCenter2[i].y;
              }
          }
          for(var i=0;i<vectorPointsCenter3.length;i++){
              if(vectorPointsCenter3[i].y>=ymax2){
                  ymax2=vectorPointsCenter3[i].y;
                  imax2=i;
              }
              if(vectorPointsCenter3[i].y<=ymin2){
                  ymin2=vectorPointsCenter3[i].y;
              }
          }
          for(var i=0;i<vectorPointsCenter2.length;i++){
              if(vectorPointsCenter2[i].x>=xmax){
                  xmax=vectorPointsCenter2[i].x;
              }
              if(vectorPointsCenter2[i].x<=xmin){
                  xmin=vectorPointsCenter2[i].x;
              }
          }
          for(var i=0;i<vectorPointsCenter3.length;i++){
              if(vectorPointsCenter3[i].x>xmax2){
                  xmax2=vectorPointsCenter3[i].x;
                  cabletailxposition = vectorPointsCenter3[i].y;
              }
          }
          var ymid = (ymax+ymin)/2;
          var ymid2 = (ymax2+ymin2)/2;
          var xmid = (xmax+xmin)/2;
          for(var i=0;i<vectorPointsCenter2.length;i++){
              var nvx = vectorPointsCenter2[i].x;
              var nvy = vectorPointsCenter2[i].y;
              var nvz = vectorPointsCenter2[i].z;

              //nvy=nvy - ymid;
              nvx=nvx - xmid;
              vectorPointsCenter2[i] = new THREE.Vector3(nvx,nvy,nvz);
          }
          for(var i=0;i<vectorPointsCenter3.length;i++){
              var nvx = vectorPointsCenter3[i].x;
              var nvy = vectorPointsCenter3[i].y;
              var nvz = vectorPointsCenter3[i].z;
              nvy-=ymid2;

              nvx*=((xmax-xmin)/(ymax2-ymin2));
              nvy*=((xmax-xmin)/(ymax2-ymin2));
              nvz*=((xmax-xmin)/(ymax2-ymin2));

              vectorPointsCenter3[i] = new THREE.Vector3(nvx,nvy,nvz);
          }
          xmax2*=((xmax-xmin)/(ymax2-ymin2));
          cabletailxposition*=((xmax-xmin)/(ymax2-ymin2));



            var lenCockpit = xmax - xmin;
            cockpitScale = xmax - xmin;
            let side = ymax/2;

            geom = new THREE.Geometry();


            //Triangle shape
            const curveShape = new THREE.Shape( vectorPointsCenter2 );
            shapegeom = new THREE.ShapeGeometry( curveShape );
            const object3 = new THREE.Mesh( shapegeom, MaterialRGB(0.2,0.2,0.2) ) ;
            const materialWireframe = new THREE.MeshBasicMaterial({color:0xff0000,wireframe: true,wireframeLinewidth:2});
            const objectWireframe = new THREE.Mesh(shapegeom, materialWireframe);



            // Vertices wrapping
            vectorlist = [];
            var nbtranches = 100;
            var nbtranchesreel = 0;
            for(var q=0 ; q<nbtranches; q++){
              var pas = xmax2/(nbtranches-1);
              var yq = q*pas;
              var listq = [];
              for(var j=0; j<vectorPoints3.length; j++){
                if(vectorPointsCenter3[j].x>yq-5*pas && vectorPointsCenter3[j].x<yq+5*pas){
                  listq.push(vectorPointsCenter3[j]);
                }
              }
              if(listq.length>0){
              nbtranchesreel++;
              var yqmax =listq[0].y;
              var yqmin =listq[0].y;
              //console.log(listq[0].y);
              for(var i=0;i<listq.length;i++){
                  if(listq[i].y>=yqmax){
                      yqmax=listq[i].y;
                  }
                  if(listq[i].y<=yqmin){
                      yqmin=listq[i].y;
                  }
              }
              var yqmid = (yqmax+yqmin)/2;
              var yqlong = yqmax-yqmin;
              var profilelong = xmax-xmin;
            for(var i=0 ; i<vectorPoints2.length ; i++){
              var coeff = yq/xmax2;
              var epsilon = 1;
              var nvy = yqlong/profilelong*vectorPointsCenter2[i].y
              if(vectorPointsCenter2[i].y<0){epsilon*=-1;}
              nvy = (1-coeff)*nvy + epsilon*coeff*(ymax-ymin)/30;
                var vector = new THREE.Vector3( yqmid+yqlong/profilelong*vectorPointsCenter2[i].x, nvy, yq );
                geom.vertices.push(vector);
                vectorlist.push(vector);

              }
            }}
            var nbv = vectorlist.length;
            for(var i=0; i<nbv; i++){
               var vector = new THREE.Vector3( vectorlist[i].x, vectorlist[i].y, -vectorlist[i].z );
               geom.vertices.push(vector);
               vectorlist.push(vector);
            }

            var m = vectorPoints2.length;
            faceslist = [];
              for (let j =0; j<nbtranchesreel-1; j++){
                for(let i=0; i<vectorPoints2.length-1; i++){
                  var f1 = new THREE.Face3( j*m+i,(j+1)*m+i, j*m+i+1)
                  var f2 = new THREE.Face3(j*m+i+1, (j+1)*m+i, (j+1)*m+i+1)
                  geom.faces.push(f1);
                  geom.faces.push(f2);
                  faceslist.push(f1);
                  faceslist.push(f2);
                }
              }
              for (let j=0; j<shapegeom.faces.length; j++){
                var f1 = new THREE.Face3(shapegeom.faces[j].a+(nbtranchesreel-1)*(m),shapegeom.faces[j].b+(nbtranchesreel-1)*(m),shapegeom.faces[j].c+(nbtranchesreel-1)*(m));
                geom.faces.push(f1);
                faceslist.push(f1);
              }

              var nbf = geom.faces.length;
              for(var i=0; i<nbf; i++){
                var f1 = new THREE.Face3(geom.faces[i].a+nbv, geom.faces[i].c+nbv, geom.faces[i].b+nbv);
                geom.faces.push(f1);
                faceslist.push(f1);
              }

            geom.computeVertexNormals();

            object = new THREE.Mesh( geom, metalMat );
            object.castShadow = true;
            object.receiveShadow = true;
            object.position.set(0,0,0);
            sceneGraph.add(object);
            pickingData.enabled = true;
            pickingData.selectableObjects.push(object);

            camera=sceneInit.createCamera(1,1.5,3);
            sceneInit.insertRenderInHtml(renderer.domElement);
            controls = new THREE.OrbitControls(camera);
            render();
        }


        if(event.key=="Enter" && move){
            pickingData.enabled = false;


            var newscale = cockpitScale/engineScale;
            cableheadxposition = cableheadxposition*newscale;
            sceneGraph.add(object1);
            sceneGraph.add(object2);
            object1.scale.set(newscale,newscale,newscale);
            object2.scale.set(newscale,newscale,newscale);
            object1.position.set(2*cockpitScale,0,4*ymax);
            object2.position.set(2*cockpitScale,0,-4*ymax);

            //Cable 1
            var a1 = Vector3(2*cockpitScale +cableheadxposition, 0 ,xmax2);
            points1.push(a1);
            speeds1.push(Vector3(0,0,0));
            for(var i=1; i<=nbmasses; i++){
              points1.push(Vector3(a1.x - i*a1.x/nbmasses, a1.y, a1.z));
              speeds1.push(Vector3(0,0,0));
            }
            //Positionnement du câble 2
            var a2 = Vector3(2*cockpitScale +cableheadxposition, 0 ,-xmax2);
            points2.push(a2);
            speeds2.push(Vector3(0,0,0));
            for(var i=1; i<=nbmasses; i++){
              points2.push(Vector3(a2.x - i*a2.x/nbmasses, a2.y, a2.z));
              speeds2.push(Vector3(0,0,0));
            }
            //Construction du câble 1
            for(var i=0; i<nbmasses-1; i++){
              var cable1iGeometry = primitive.Cylinder( points1[i], points1[i+1], rcable, rcable );
              var cable1i = new THREE.Mesh( cable1iGeometry, MaterialRGB(0.4,0.9,1) );
              cable1i.name = "cable1"+String(i);
              cables1.push(cable1i)
              cable1i.visible = false;
              sceneGraph.add(cable1i);
            }
            //Cable 2
            for(var i=0; i<nbmasses-1; i++){
              var cable2iGeometry = primitive.Cylinder( points2[i], points2[i+1], rcable, rcable );
              var cable2i = new THREE.Mesh( cable2iGeometry, MaterialRGB(0.4,0.9,1) );
              cable2i.name = "cable2"+String(i);
              cables2.push(cable2i);
              cable2i.visible = false;
              sceneGraph.add(cable2i);
            }


            sceneThreeJs = {
                sceneGraph: null,
                camera: null,
                renderer: null,
                controls: null
            };


            const textureLoader = new THREE.TextureLoader();

            var groundGeometry = primitive.Cube(Vector3(0,0.5,0), 1);
            const textureGround = textureLoader.load( 'pictures/Outer-Real-Space-Wallpapers.jpg' );
            const materialGround = new THREE.MeshLambertMaterial({ map: textureGround });
            const ground = new THREE.Mesh(groundGeometry,materialGround);
            ground.name="ground";
            ground.receiveShadow = false;
            sceneGraph.background = textureGround;

            // Stars plan
            const Lp = 400; // Size of the plan
            const floor = -1
            const floor2 = floor +0.01
            const planeGeometry = primitive.Quadrangle(Vector3(-Lp,floor,-Lp),Vector3(-Lp,floor,Lp),Vector3(Lp,floor,Lp),Vector3(Lp,floor,-Lp));
            var planeGeometry2 = new THREE.Geometry();
            for(var i=-Lp; i<Lp; i++){
              for(var j=-Lp; j<Lp; j++){
                planeGeometry2.vertices.push(Vector3(j,floor,i));
              }
            }
            const planemat = new THREE.LineDashedMaterial({dashSize: 0.2, gapSize:1});
            planeGeometry2.computeLineDistances();
            const plane2 = new THREE.Line( planeGeometry2, planemat );
            plane2.name = "plane2";
            sceneGraph.add(plane2);

            const texturemeteor = textureLoader.load( 'pictures/meteor.jpg' );
            const materialMeteor = new THREE.MeshLambertMaterial({ map: texturemeteor });
            const meteorGeometry = primitive.Sphere( Vector3(0,0,0), 0.7 );
            const meteor = new THREE.Mesh( meteorGeometry,materialMeteor );
            meteor.name = "meteor";
            sceneGraph.add(meteor);
            meteor.visible = false;

            const meteor2Geometry = primitive.Sphere( Vector3(0,0,0), 0.7 );
            const meteor2 = new THREE.Mesh( meteor2Geometry,materialMeteor );
            meteor2.name = "meteor2";
            sceneGraph.add(meteor2);
            meteor2.visible = false;

            const meteor3Geometry = primitive.Sphere( Vector3(0,0,0), 0.7 );
            const meteor3 = new THREE.Mesh( meteor3Geometry,materialMeteor );
            meteor3.name = "meteor3";
            sceneGraph.add(meteor3);
            meteor3.visible = false;

            const meteor4Geometry = primitive.Sphere( Vector3(0,0,0), 0.7 );
            const meteor4 = new THREE.Mesh( meteor4Geometry,materialMeteor );
            meteor4.name = "meteor4";
            sceneGraph.add(meteor4);
            meteor4.visible = false;

            animationLoop(sceneGraph);
            render();



        }


    }


}

function onKeyUp(event){
    if(controlDown==true && !pickingData.enabled){
        controlDown=false;
    }

    if(pickingData.enabled && controlDown==true){
      controlDown=false;
      controls.enabled = true;
      pickingData.selectedObject = null;
      pickingShape.visible=false;
    }
}




// OTHER FONCTIONS //
function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}
function Vector3(x,y,z) {
    return new THREE.Vector3(x,y,z);
}
function Vector2(x,y) {
    return new THREE.Vector2(x,y);
}
function MaterialRGB(r,g,b) {
    const c = new THREE.Color(r,g,b);
    return new THREE.MeshLambertMaterial( {color:c} );
}
function render() {
    renderer.render(sceneGraph, camera);
}
function animationLoop(sceneGraph) {

    requestAnimationFrame(

        function(timeStamp){
            animate(sceneGraph,timeStamp); 
            animationLoop(sceneGraph); 
        }

     );

}
function animate(sceneGraph, time) {
    movecounter++;

    const t = time/1000;//time in second
    dt = 1*0.01070560000371188;
    const plane2 = sceneGraph.getObjectByName("plane2");
    const meteor = sceneGraph.getObjectByName("meteor");
    const meteor2 = sceneGraph.getObjectByName("meteor2");
    const meteor3 = sceneGraph.getObjectByName("meteor3");
    const meteor4 = sceneGraph.getObjectByName("meteor4");
    plane2.position.set(-15*(t%10),0,0);
    var m = masse;
    if(movecounter==200){jumping=true; timestart=t; tmeteor = t; meteor.visible = true;
    meteor2.visible = true;
    meteor3.visible = true;
    meteor4.visible = true;}


    meteor.position.set(50 - 20*(t-tmeteor),0,0);
    meteor2.position.set(30 - 20*(t-tmeteor),0.5,-5);
    meteor3.position.set(70 - 20*(t-tmeteor),2,-1);
    meteor4.position.set(40 - 20*(t-tmeteor),-1,3);

    object1.position.set(2*cockpitScale, 0.03*Math.sin(1+15*t), xmax2+0.03*Math.sin(18*t));
    object2.position.set(2*cockpitScale, 0.03*Math.sin(15*t), -xmax2+0.03*Math.sin(1+18*t));
    object.position.set(-cabletailxposition,0.03*Math.sin(3+15*t),0.03*Math.sin(3+18*t));
    points1[0]= Vector3(2*cockpitScale +cableheadxposition, 0.03*Math.sin(1+15*t), xmax2+0.03*Math.sin(18*t));
    points2[0]= Vector3(2*cockpitScale +cableheadxposition, 0.03*Math.sin(15*t), -xmax2+0.03*Math.sin(1+18*t));
    points1[nbmasses-1] = Vector3(0, 0.03*Math.sin(3+15*t), 0.03*Math.sin(3+18*t) + xmax2);
    points2[nbmasses-1] = Vector3(0, 0.03*Math.sin(3+15*t), 0.03*Math.sin(3+18*t) - xmax2);

    if(jumping){
      lambdaf = -2;
      object1.position.set(2*cockpitScale, 0.03*Math.sin(1+15*t)+2*Math.sin(1*(t-timestart)), xmax2+0.03*Math.sin(18*t));
      object2.position.set(2*cockpitScale, 0.03*Math.sin(15*t)+2*Math.sin(1*(t-timestart)), -xmax2+0.03*Math.sin(1+18*t));
      points1[0]= Vector3(2*cockpitScale +cableheadxposition, 0.03*Math.sin(1+15*t)+2*Math.sin(1*(t-timestart)), xmax2+0.03*Math.sin(18*t));
      points2[0]= Vector3(2*cockpitScale +cableheadxposition, 0.03*Math.sin(15*t)+2*Math.sin(1*(t-timestart)), -xmax2+0.03*Math.sin(1+18*t));
      if(!jumping2 && Math.sin(1*(t-timestart))>0.9){
        jumping2 = true;
        timestart2 = t;
      }
      if(Math.sin(1*(t-timestart))<-0.01){
        jumping = false;
        stabilize = true;
      }
    }
    if(stabilize){
      lambdaf=10;
      object1.position.set(2*cockpitScale, 0.03*Math.sin(1+15*t)+0.5*Math.sin(1*(t-timestart)), xmax2+0.03*Math.sin(18*t));
      object2.position.set(2*cockpitScale, 0.03*Math.sin(15*t)+0.5*Math.sin(1*(t-timestart)), -xmax2+0.03*Math.sin(1+18*t));
      points1[0]= Vector3(2*cockpitScale +cableheadxposition, 0.03*Math.sin(1+15*t)+0.5*Math.sin(1*(t-timestart)), xmax2+0.03*Math.sin(18*t));
      points2[0]= Vector3(2*cockpitScale +cableheadxposition, 0.03*Math.sin(15*t)+0.5*Math.sin(1*(t-timestart)), -xmax2+0.03*Math.sin(1+18*t));
      if(Math.sin(1*(t-timestart))>0.01){
        stabilize = false;
      }
    }
    if(jumping2){
      lambdaf = 0;
      object.position.set(-cabletailxposition,0.03*Math.sin(3+15*t)+2*Math.sin(1*(t-timestart2)),0.03*Math.sin(3+18*t));
      points1[nbmasses-1] = Vector3(0, 0.03*Math.sin(3+15*t)+2*Math.sin(1*(t-timestart2)), 0.03*Math.sin(3+18*t) + xmax2);
      points2[nbmasses-1] = Vector3(0, 0.03*Math.sin(3+15*t)+2*Math.sin(1*(t-timestart2)), 0.03*Math.sin(3+18*t) - xmax2);
      if(Math.sin(1*(t-timestart2))<-0.01){
        jumping2 = false;
        stabilize2 = true;
      }
    }
    if(stabilize2){
      object.position.set(-cabletailxposition,0.03*Math.sin(3+15*t)+0.5*Math.sin(1*(t-timestart2)),0.03*Math.sin(3+18*t));
      points1[nbmasses-1] = Vector3(0, 0.03*Math.sin(3+15*t)+0.5*Math.sin(1*(t-timestart2)), 0.03*Math.sin(3+18*t) + xmax2);
      points2[nbmasses-1] = Vector3(0, 0.03*Math.sin(3+15*t)+0.5*Math.sin(1*(t-timestart2)), 0.03*Math.sin(3+18*t) - xmax2);
      if(Math.sin(1*(t-timestart2))>0.01){
        stabilize2 = false;
        movecounter=0;
        lambdaf = 10;
      }
    }

    for(var i=1; i<nbmasses; i++){

      if(i==nbmasses-1){
        sceneGraph.remove(cables1[i-1]);
        var cable1iGeometry = primitive.Cylinder( points1[i-1], points1[i], rcable, rcable );
        var cable1i = new THREE.Mesh( cable1iGeometry, MaterialRGB(0.2, 0.2, 0.2) );
        sceneGraph.add(cable1i);
        cables1[i-1] = cable1i;
      }

      else{
        var xi = points1[i].x;
        var yi = points1[i].y;
        var zi = points1[i].z;

        var xi_1 = points1[i-1].x;
        var yi_1 = points1[i-1].y;
        var zi_1 = points1[i-1].z;

        var xip1 = points1[i+1].x;
        var yip1 = points1[i+1].y;
        var zip1 = points1[i+1].z;

        var vx = speeds1[i].x;
        var vy = speeds1[i].y;
        var vz = speeds1[i].z;

        var li = Math.sqrt((xi-xi_1)*(xi-xi_1) + (yi-yi_1)*(yi-yi_1) + (zi-zi_1)*(zi-zi_1));
        var fnorm = k*(l0-li);
        var fdir = Vector3((xi-xi_1) , (yi-yi_1) , (zi-zi_1)).normalize();
        forces = Vector3(fnorm*fdir.x, fnorm*fdir.y, fnorm*fdir.z);

        var lip1 = Math.sqrt((xi-xip1)*(xi-xip1) + (yi-yip1)*(yi-yip1) + (zi-zip1)*(zi-zip1));
        var fnorm2 = k*(l0-lip1);
        var fdir2 = Vector3((xi-xip1) , (yi-yip1) , (zi-zip1)).normalize();
        var forces2 = Vector3(fnorm2*fdir2.x, fnorm2*fdir2.y, fnorm2*fdir2.z);


        var ax = 1/m*forces.x + 1/m*forces2.x - 1/m*lambdaf*vx;
        var ay = 1/m*forces.y + 1/m*forces2.y - 1/m*lambdaf*vy;
        var az = 1/m*forces.z + 1/m*forces2.z - 1/m*lambdaf*vz;

        vx = speeds1[i].x + dt*ax;
        vy = speeds1[i].y + dt*ay;
        vz = speeds1[i].z + dt*az;

        xi = xi + dt*vx;
        yi = yi + dt*vy;
        zi = zi + dt*vz;

        speeds1[i] = Vector3(vx,vy,vz);
        points1[i] = Vector3(xi,yi,zi);


        sceneGraph.remove(cables1[i-1]);
        var cable1iGeometry = primitive.Cylinder( points1[i-1], points1[i], rcable, rcable );
        var cable1i = new THREE.Mesh( cable1iGeometry, MaterialRGB(0.2, 0.2, 0.2) );
        sceneGraph.add(cable1i);
        cables1[i-1] = cable1i;
      }
    }

    for(var i=1; i<nbmasses; i++){

      if(i==nbmasses-1){
        sceneGraph.remove(cables2[i-1]);
        var cable2iGeometry = primitive.Cylinder( points2[i-1], points2[i], rcable, rcable );
        var cable2i = new THREE.Mesh( cable2iGeometry, MaterialRGB(0.2, 0.2, 0.2) );
        sceneGraph.add(cable2i);
        cables2[i-1] = cable2i;
      }

      else{

        var xi = points2[i].x;
        var yi = points2[i].y;
        var zi = points2[i].z;

        var xi_1 = points2[i-1].x;
        var yi_1 = points2[i-1].y;
        var zi_1 = points2[i-1].z;

        var xip1 = points2[i+1].x;
        var yip1 = points2[i+1].y;
        var zip1 = points2[i+1].z;

        var vx = speeds2[i].x;
        var vy = speeds2[i].y;
        var vz = speeds2[i].z;

        var li = Math.sqrt((xi-xi_1)*(xi-xi_1) + (yi-yi_1)*(yi-yi_1) + (zi-zi_1)*(zi-zi_1));
        var fnorm = k*(l0-li);
        var fdir = Vector3((xi-xi_1) , (yi-yi_1) , (zi-zi_1)).normalize();
        forces = Vector3(fnorm*fdir.x, fnorm*fdir.y, fnorm*fdir.z);

        var lip1 = Math.sqrt((xi-xip1)*(xi-xip1) + (yi-yip1)*(yi-yip1) + (zi-zip1)*(zi-zip1));
        var fnorm2 = k*(l0-lip1);
        var fdir2 = Vector3((xi-xip1) , (yi-yip1) , (zi-zip1)).normalize();
        var forces2 = Vector3(fnorm2*fdir2.x, fnorm2*fdir2.y, fnorm2*fdir2.z);


        var ax = 1/m*forces.x + 1/m*forces2.x - 1/m*lambdaf*vx;
        var ay = 1/m*forces.y + 1/m*forces2.y - 1/m*lambdaf*vy;
        var az = 1/m*forces.z + 1/m*forces2.z - 1/m*lambdaf*vz;

        vx = speeds2[i].x + dt*ax;
        vy = speeds2[i].y + dt*ay;
        vz = speeds2[i].z + dt*az;

        xi = xi + dt*vx;
        yi = yi + dt*vy;
        zi = zi + dt*vz;

        speeds2[i] = Vector3(vx,vy,vz);
        points2[i] = Vector3(xi,yi,zi);


        sceneGraph.remove(cables2[i-1]);
        var cable2iGeometry = primitive.Cylinder( points2[i-1], points2[i], rcable, rcable );
        var cable2i = new THREE.Mesh( cable2iGeometry, MaterialRGB(0.2, 0.2, 0.2) );
        sceneGraph.add(cable2i);
        cables2[i-1] = cable2i;
        }
      }



    render();
}
function initEmptyScene(sceneThreeJs) {

    sceneThreeJs.sceneGraph = new THREE.Scene();

    sceneThreeJs.camera = sceneInit.createCamera(-10,8,10);
    sceneInit.insertAmbientLight(sceneThreeJs.sceneGraph);
    sceneInit.insertLight(sceneThreeJs.sceneGraph,Vector3(-3,5,1));

    sceneThreeJs.renderer = sceneInit.createRenderer();
    sceneInit.insertRenderInHtml(sceneThreeJs.renderer.domElement);

    sceneThreeJs.controls = new THREE.OrbitControls( sceneThreeJs.camera );

}
