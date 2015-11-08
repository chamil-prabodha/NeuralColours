/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var i = 0;
var loop = 0;
//var network = NeuralColours();



function timedCount() {
    i = i + 1;
    postMessage(i);
    setTimeout("timedCount()",500);
}
//timedCount();
//getRandomColor();
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    postMessage(color);
    setTimeout("getRandomColor()",500);
}


var trainInputs = [[255,255,255]];
var targetOut = [[255, 0, 0]];

//Define input array
var input = new Array(4);

//Define 2D layer one weight array
var w1 = new Array(4);
for(var i = 0; i < w1.length; i++){
    w1[i] = new Array(2);
}

//Define 2D layer two weight array
var w2 = new Array(3);
for(var i = 0; i< w2.length; i++){
    w2[i] = new Array(3);
}

//Define layer one output array
var outputL1 = new Array(3);

//Define output array
var output = new Array(3);

//Define learning rate
var learningRate = 0.3;

//Define training loop
var trainingLoop = 0;


this.addEventListener("message",function(e){
   
    targetOut[0][0] = e.data[0][0]/255;
    targetOut[0][1] = e.data[0][1]/255;
    targetOut[0][2] = e.data[0][2]/255;

},false);

initNet();
TrainNetwork(100,trainInputs,targetOut);


function doit(){
    
    i+=1;
    postMessage(i);
    setTimeout("doit()", 500);
    
}


function initNet(){

   var randomColour = 1.0;
   input[3] = randomColour;
   outputL1[2] = randomColour;

   for(var i = 0; i < 4; i++){
       for(var j = 0;j < 2; j++){
           w1[i][j] = Math.random() * 4 - 2;
       }
   }

   for(var i = 0; i < 3; i++){
       for(var j = 0; j < 3; j++){
           w2[i][j] = Math.random() * 4 - 2;
       }
   }
   console.log("Initialized");
}

function ForwardPropagation(inputs){
    
    for(var i = 0; i < 3; i++){
        input[i] = inputs[i];
        
    }

    for(var j = 0; j < 2; j++){
        var sum = 0.0;

        for(var i = 0; i < 4; i++){
            sum += input[i] * w1[i][j];
        }
        
        outputL1[j] = SigmoidFunction(sum);
    }

    for(var j = 0; j < 3; j++){
        var sum = 0.0;

        for(var i = 0; i < 3; i++){
            sum += outputL1[i] * w2[i][j];
        }

        output[j] = SigmoidFunction(sum);

    }
    
   
    console.log(output[0] * 255 + "," + output[1] * 255 + "," + output[2] * 255);
    
}

function TrainNetwork(trainLoop,trainInput,target){
    trainingLoop = trainLoop;
    
//    for(var i = 0; i < trainingLoop; i++){
//        for(var j = 0; j < trainInput.length; j++){
//            ForwardPropagation(trainInput[j]);
//            Train(target[j]);
//        }
//          
//    }

      doloop(trainingLoop,trainInput,target);
}

function doloop(trainloop,inp,tar){
    console.log(loop+","+trainloop);
    if(loop<trainloop){
//        console.log("inloop");
//        for(var j = 0; j < inp.length; j++){
//            ForwardPropagation(inp[j]);
//            Train(tar[j]);
//        }
//        loop+=1;
//        postMessage(output[0] * 255 + "," + output[1] * 255 + "," + output[2] * 255);
        setTimeout(function (){
            console.log("inloop");
            for(var j = 0; j < inp.length; j++){
                ForwardPropagation(inp[j]);
                Train(tar[j]);
            }
            loop+=1;
            postMessage(toHexa(Math.floor(output[0] * 255), Math.floor(output[1] * 255), Math.floor(output[2] * 255)));
            
            doloop(trainloop,inp,tar);
        },100);
    }
    else
        close();
}

function Train(target){

    var delta1 = new Array(3);
    var deltaout = new Array(3);

    for(var i = 0; i < 3; i++){
        deltaout[i] = output[i] * (1.0 - output[i]) * (target[i] - output[i]);
    }

    for(var i = 0; i < 3; i++){
        var error = 0.0;

        for(var j = 0; j < 3; j++){
            error += w2[i][j] * deltaout[j];
        }

        delta1[i] = outputL1[i] * (1 - outputL1[i]) * error;
    }

    for(var i = 0; i < 3; i++){
        for(var j = 0; j <3; j++){
            w2[i][j] += learningRate * outputL1[i] * deltaout[j];
        }
    }

    for(var i = 0; i < 4; i++){
        for(var j = 0; j <2; j++){
            w1[i][j] += learningRate * input[i] * delta1[j];
        }
    }
}

function SigmoidFunction(val){
    return 1/(1 + Math.exp(-val));
}

function getRandomColour() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return colour;
}

function getRandomVal(){
    return Math.random()*255;
}

function toHexa(r,g,b){
    var colour = '';
    var red = r.toString(16);
    var green = g.toString(16);
    var blue = b.toString(16);
    
    if(parseInt(red,16)<10){
        red = '0' + red;
    }
    
    if(parseInt(green,16)<10){
        green = '0' + green;
    }
    
    if(parseInt(blue,16)<10){
        blue = '0' + blue;
    }
    
    colour = '#'+red+green+blue+'';
    return colour;
}
