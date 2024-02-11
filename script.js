function setup() {
    
    var cameraCanvas = document.getElementById('cameraCanvas');
    var context = cameraCanvas.getContext('2d');
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;
    var tParam = 0;
    var theta1 = 0;

    function draw() {

        cameraCanvas.width = cameraCanvas.width;

        var cameraAngle = slider2.value*0.02*Math.PI;
        
        function moveToTx(loc,Tx) {
            var res=vec3.create(); 
            vec3.transformMat4(res,loc,Tx); 
            context.moveTo(res[0],res[1]);
        }

        function lineToTx(loc,Tx) {
            var res=vec3.create(); 
            vec3.transformMat4(res,loc,Tx); 
            context.lineTo(res[0],res[1]);
        }
        
        function mainSquare(color,TxU,scale) {
            var Tx = mat4.clone(TxU);
            mat4.scale(Tx,Tx,[scale,scale,scale]);
            context.beginPath();
            context.fillStyle = color;
            
            moveToTx([-.5,-.5,.5],Tx);
            lineToTx([-.5,-.5,0],Tx);
            lineToTx([-.5,0,0],Tx);
            lineToTx([-.5,0,.5],Tx);
            context.closePath();
            context.fill();

            context.beginPath();
            moveToTx([-.5, 0, .5], Tx);
            lineToTx([-.5, 0, 0], Tx);
            lineToTx([0, 0, 0], Tx);
            lineToTx([0, 0, .5], Tx);
            context.closePath();
            context.fill();

            context.beginPath();
            moveToTx([0, 0, .5], Tx);
            lineToTx([0, 0, 0], Tx);
            lineToTx([0, -.5, 0], Tx);
            lineToTx([0, -.5, .5], Tx);
            context.closePath();
            context.fill();

            context.beginPath();
            moveToTx([0, -.5, .5], Tx);
            lineToTx([0, -.5, 0], Tx);
            lineToTx([-.5, -.5, 0], Tx);
            lineToTx([-.5, -.5, .5], Tx);
            context.closePath();
            context.fill();

            context.beginPath();
            moveToTx([-.5, -.5, .5], Tx);
            lineToTx([0, -.5, .5], Tx);
            lineToTx([0, 0, .5], Tx);
            lineToTx([-.5, 0, .5], Tx);
            context.closePath();
            context.fill();

            context.beginPath();
            moveToTx([-.5, -.5, 0], Tx);
            lineToTx([-.5, 0, 0], Tx);
            lineToTx([0, 0, 0], Tx);
            lineToTx([0, -.5, 0], Tx);
            context.closePath();
            context.fill();     
        }

        function attachedSquare(color,TxU,scale) { 
            var Tx = mat4.clone(TxU);
            mat4.scale(Tx,Tx,[scale,scale,scale]);
            context.beginPath();
            context.fillStyle = color;

            moveToTx([-.5,-.25,.25],Tx);
            lineToTx([-.5,-.25,-.25],Tx);
            lineToTx([-.5,.25,-.25],Tx);
            lineToTx([-.5,.25,.25],Tx);
            
            context.closePath();
            context.fill();

            context.beginPath();
            moveToTx([-.5, .25, .25], Tx);
            lineToTx([-.5, .25, -.25], Tx);
            lineToTx([0, .25, -.25], Tx);
            lineToTx([0, .25, .25], Tx);
            context.closePath();
            context.fill();

            context.beginPath();
            moveToTx([0, .25, .25], Tx);
            lineToTx([0, .25, -.25], Tx);
            lineToTx([0, -.25, -.25], Tx);
            lineToTx([0, -.25, .25], Tx);
            context.closePath();
            context.fill();

            context.beginPath();
            moveToTx([0, -.25, .25], Tx);
            lineToTx([0, -.25, -.25], Tx);
            lineToTx([-.5, -.25, -.25], Tx);
            lineToTx([-.5, -.25, .25], Tx);
            context.closePath();
            context.fill();

            context.beginPath();
            moveToTx([-.5, -.25, .25], Tx);
            lineToTx([0, -.25, .25], Tx);
            lineToTx([0, .25, .25], Tx);
            lineToTx([-.5, .25, .25], Tx);
            context.closePath();
            context.fill();

            context.beginPath();
            moveToTx([-.5, -.25, -.25], Tx);
            lineToTx([-.5, 0.25, -.25], Tx);
            lineToTx([0, 0.25, -.25], Tx);
            lineToTx([0, -.25, -.25], Tx);
            context.closePath();
            context.fill();
        }

        var Hermite = function(t) {
            return [
            2*t*t*t-3*t*t+1,
            t*t*t-2*t*t+t,
            -2*t*t*t+3*t*t,
            t*t*t-t*t
            ];
        }

        var HermiteDerivative = function(t) {
            return [
            6*t*t-6*t,
            3*t*t-4*t+1,
            -6*t*t+6*t,
            3*t*t-2*t
            ];
        }

        function Cubic(basis,P,t){
            var b = basis(t);
            var result=vec3.create();
            vec3.scale(result,P[0],b[0]);
            vec3.scaleAndAdd(result,result,P[1],b[1]);
            vec3.scaleAndAdd(result,result,P[2],b[2]);
            vec3.scaleAndAdd(result,result,P[3],b[3]);
            return result;
        }

        var p0 = [0,0,250];
        var d0 = [100,-200,50];
        var p1 = [400,0,200];
        var d1 = [300,200,-500];
        var p2 = [400,0,-250];
        var d2 = [-300,-100,-100];
        var p3 = [-100,0,-200];
        var d3 = [100,-200,-600];
        var p4 = [100,0,-400];
        var d4 = [200,100,200];
        var p5 = [-100,0,-100];
        var d5 = [-300,100,50];
        var p6 = [-200,0,100];
        var d6 = [50,-200,150];
        var p7 = [0,0,250];
        var d7 = [100,-200,50];

        var P0 = [p0,d0,p1,d1];
        var P1 = [p1,d1,p2,d2]; 
        var P2 = [p2,d2,p3,d3];
        var P3 = [p3,d3,p4,d4];
        var P4 = [p4,d4,p5,d5];
        var P5 = [p5,d5,p6,d6];
        var P6 = [p6,d6,p7,d7];

        var C0 = function(t_) {return Cubic(Hermite,P0,t_);};
        var C1 = function(t_) {return Cubic(Hermite,P1,t_);};
        var C2 = function(t_) {return Cubic(Hermite,P2,t_);};
        var C3 = function(t_) {return Cubic(Hermite,P3,t_);};
        var C4 = function(t_) {return Cubic(Hermite,P4,t_);};
        var C5 = function(t_) {return Cubic(Hermite,P5,t_);};
        var C6 = function(t_) {return Cubic(Hermite,P6,t_);};

        var C0prime = function(t_) {return Cubic(HermiteDerivative,P0,t_);};
        var C1prime = function(t_) {return Cubic(HermiteDerivative,P1,t_);};
        var C2prime = function(t_) {return Cubic(HermiteDerivative,P2,t_);};
        var C3prime = function(t_) {return Cubic(HermiteDerivative,P3,t_);};
        var C4prime = function(t_) {return Cubic(HermiteDerivative,P4,t_);};
        var C5prime = function(t_) {return Cubic(HermiteDerivative,P5,t_);};
        var C6prime = function(t_) {return Cubic(HermiteDerivative,P6,t_);};
        
        var Ccomp = function(t) { 
            if (t == 0) {
                return C0(u);
            }
            if (t <= 1) {
                var u = t;
                return C0(u);
            } else if (t >= 1 && t <= 2) {
                var u = t - 1; 
                return C1(u);
            } else if (t >= 2 && t <= 3) {
                var u = t - 2; 
                return C2(u);
            } else if (t >= 3 && t <= 4) {
                var u = t - 3; 
                return C3(u);
            } else if (t >= 4 && t <= 5) {
                var u = t - 4; 
                return C4(u);
            } else if (t >= 5 && t <= 6) {
                var u = t -5;
                return C5(u);
            }  else if (t >= 6 && t <= 7) {
                var u = t -6;
                return C6(u);
            }           
        }

        var Ccomp_tangent = function(t) {
            if (t == 0) {
                return C0prime(u);
            }
            if (t <= 1) {
                var u = t;
                return C0prime(u);
            } else if (t >= 1 && t <= 2) {
                var u = t - 1; 
                return C1prime(u);
            } else if (t >= 2 && t <= 3) {
                var u = t - 2; 
                return C2prime(u);
            } else if (t >= 3 && t <= 4) {
                var u = t - 3; 
                return C3prime(u);
            } else if (t >= 4 && t <= 5) {
                var u = t - 4; 
                return C4prime(u);
            } else if (t >= 5 && t <= 6) {
                var u = t -5;
                return C5prime(u);
            } else if (t >= 6 && t <= 7) {
                var u = t -6;
                return C6prime(u);
            }               
        }

        var CameraPath = function(angle) {
            var distance = 200.0;
            var eye = vec3.create();
            eye[0] = distance*Math.sin(cameraAngle);
            eye[1] = 50;
            eye[2] = distance*Math.cos(cameraAngle);  
            return [eye[0],eye[1],eye[2]];
        }

        function squareTrajectory(t_begin,t_end,intervals,C,Tx,color) {
            context.strokeStyle=color;
            context.beginPath();
            moveToTx(C(t_begin),Tx);
            for(var i=1;i<=intervals;i++){
                var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
                lineToTx(C(t),Tx);
            }
            context.stroke();
        }

        var eyeCamera = CameraPath(cameraAngle);
        var targetCamera = vec3.fromValues(0,0,0);
        var upCamera = vec3.fromValues(0,100,0);
        var TlookAtCamera = mat4.create();
        mat4.lookAt(TlookAtCamera, eyeCamera, targetCamera, upCamera);
        
        var Tviewport = mat4.create();
        mat4.fromTranslation(Tviewport,[500,300,0]); 
        mat4.scale(Tviewport,Tviewport,[100,-100,1]);
 
        var TprojectionCamera = mat4.create();
        mat4.ortho(TprojectionCamera,-100,100,-100,100,-1,1);

        var tVP_PROJ_VIEW_Camera = mat4.create();
        mat4.multiply(tVP_PROJ_VIEW_Camera,Tviewport,TprojectionCamera);
        mat4.multiply(tVP_PROJ_VIEW_Camera,tVP_PROJ_VIEW_Camera,TlookAtCamera);

        var Tmodel = mat4.create();
        mat4.fromTranslation(Tmodel,Ccomp(tParam));
        var tangent = Ccomp_tangent(tParam);
        var angle = Math.atan2(tangent[1],tangent[0]);
        mat4.rotateZ(Tmodel,Tmodel,angle);

        var tVP_PROJ_VIEW_MOD_Camera = mat4.create();
        mat4.multiply(tVP_PROJ_VIEW_MOD_Camera, tVP_PROJ_VIEW_Camera, Tmodel);
        
        squareTrajectory(0.0,1.0,100,C0,tVP_PROJ_VIEW_Camera,"red");
        squareTrajectory(0.0,1.0,100,C1,tVP_PROJ_VIEW_Camera,"blue");
        squareTrajectory(0.0,1.0,100,C2,tVP_PROJ_VIEW_Camera,"green");
        squareTrajectory(0.0,1.0,100,C3,tVP_PROJ_VIEW_Camera,"orange");
        squareTrajectory(0.0,1.0,100,C4,tVP_PROJ_VIEW_Camera,"purple");
        squareTrajectory(0.0,1.0,100,C5,tVP_PROJ_VIEW_Camera,"black");
        squareTrajectory(0.0,1.0,100,C6,tVP_PROJ_VIEW_Camera,"pink");
        
        mainSquare("orange",tVP_PROJ_VIEW_MOD_Camera,100.0);

        var propeller = mat4.create();
        mat4.fromTranslation(propeller, [50,0,0]);
        mat4.rotate(propeller,propeller,theta1,[1,0,0]);
        var complete = mat4.create();
        mat4.multiply(complete, tVP_PROJ_VIEW_MOD_Camera, propeller);
        attachedSquare("blue",complete,100.0);
  
        tParam = (tParam + .01) % 7;
        theta1 = (theta1 + .2) % (2 *Math.PI);
        setTimeout(() => {
            window.requestAnimationFrame(draw);
          }, "100")  
    }

    window.requestAnimationFrame(draw);
    setTimeout(() => {
            window.requestAnimationFrame(draw);
          }, "100");
}  
window.onload = setup;