<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Neural Colours</title>
    </head>
    <body>
        
        <div class="container" align="center" style="margin-top: 50px">
             
            <div class="col-md-6" align="center">
                
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h1 id="col1">Matched Colour</h1>
                    </div>
                    
                    <div class="panel-body">
                        <canvas id="canvas" height="200" width="200"></canvas>
                    </div>
                </div>
                
                
            </div> 
            
            
            <div class="col-md-6" align="center">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h1>Controls</h1>
                    </div>

                    <div class="panel-body">
                        <div class="input-group">
                            <h6>Pick Colour</h6>
                            <input type="color" id="html5colorpicker" onchange="" value="#ff0000" align="center" style="width:80%; margin:10px;"/>
                            <h6>Training Loop</h6>
                            <input type="number" id="loopcount" value="100" align="center" style="width:80%;margin:10px;">
                            <button class="btn btn-default" onclick="startWorker()" align="center" style="margin:10px;">Start Training</button>
                        </div>
                    </div>
                </div>
                
                
                
            </div> 
            
        </div>
        
        <link rel="stylesheet" href="css/bootstrap-theme.css">
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="css/bootstrap.css">
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/jquery-ui.css">
        <script type="text/javascript" src="js/jquery-2.1.3.min.js"></script>
        <script type="text/javascript" src="js/jquery-ui.js"></script>
        <script src="js/bootstrap.min.js"></script>
        
        <script>
            var col = 'black';

            var w;
            var picker = document.getElementById('html5colorpicker');
            var loop = document.getElementById('loopcount');
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var centerX = canvas.width/2;
            var centerY = canvas.height/2;
            var radius = 70;
            
            context.beginPath();
            context.arc(centerX,centerY,radius,0,2*Math.PI,false);
            context.fillStyle = '#456f45';
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = 'black';
            context.stroke();
            
            loop.disabled = true;
            

function startWorker() {
    
    if(typeof(w) !== "undefined"){
        stopWorker();
        
    }
   
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) === "undefined") {
            var val = picker.value;
            var loopcount = loop.value;
            
            var colour = [[hexToRgb(val).r, hexToRgb(val).g, hexToRgb(val).b]];
            
            w = new Worker("js/worker.js");
            w.postMessage(colour);
            //w.postMessage(loopcount);
        }
        
        w.onmessage = function(event) {
            document.getElementById("col1").innerHTML = event.data;
            var col = 'green';

            context.fillStyle = event.data;
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = 'black';
            context.stroke();
            
        };
    } else {
        document.getElementById("col1").innerHTML = "Sorry, your browser does not support Web Workers...";
    }
}
function getRandomColour() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function stopWorker() { 
    context.fillStyle = '#456f45';
    context.fill();
    w.terminate();
    w = undefined;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
        </script>
    </body>
</html>
