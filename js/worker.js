/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var i = 0;
var loop = 0;

//Training inputs
var trainInputs = [[255,255,255]];
//Corresponding target outputs
var targetOut = [[255, 0, 0]];

//Define input array for Red, Green, Blue and bias values
var input = new Array(4);

//Define 2D array for layer-one weights
//Consists of eight weights for 4 inputs mapping to 2 hidden layer nodes(4x2)
var w1 = new Array(4);
for(var i = 0; i < w1.length; i++){
    w1[i] = new Array(2);
}

//Define 2D layer two weight array
//Consists of nine weights for 3 hidden layer nodes mapping to 3 outputs(3x3)
//Outputs corresponds to Red, Green and Blue values
var w2 = new Array(3);
for(var i = 0; i< w2.length; i++){
    w2[i] = new Array(3);
}

//Define layer one output array
//Represents the 2 hidden layer nodes and the bias node
var outputL1 = new Array(3);

//Define output array
//For Red, Green Blue values
var output = new Array(3);

//Define learning rate
var learningRate = 0.3;

//Define training loop
var trainingLoop = 0;

//Create the event listner to pick the colours
this.addEventListener("message",function(e){
   
    targetOut[0][0] = e.data[0][0]/255;
    targetOut[0][1] = e.data[0][1]/255;
    targetOut[0][2] = e.data[0][2]/255;

},false);

//initializing network
initNet();
//Train neural network for the training inputs and the target outputs
TrainNetwork(100,trainInputs,targetOut);

//Initializing method 
function initNet(){

   //Assign a value between 0 and 1 for the inputs and outputs including the input layer bias
   var randomColour = 1.0;
   input[3] = randomColour;
   outputL1[2] = randomColour;

   //Assign random values between -2 and 2 for layer-one weights
   for(var i = 0; i < 4; i++){
       for(var j = 0;j < 2; j++){
           w1[i][j] = Math.random() * 4 - 2;
       }
   }

   //Assign random values between -2 and 2 for layer-two weights
   for(var i = 0; i < 3; i++){
       for(var j = 0; j < 3; j++){
           w2[i][j] = Math.random() * 4 - 2;
       }
   }
   
   //For debugging
   console.log("Initialized");
}

//Forward propagation method
function ForwardPropagation(inputs){
    
    //Assign inputs given by the user to network inputs
    for(var i = 0; i < 3; i++){
        input[i] = inputs[i];
        
    }

    //Take the sum of the weights for a output node, multiplied by the corresponding input in layer-one
    for(var j = 0; j < 2; j++){
        var sum = 0.0;

        for(var i = 0; i < 4; i++){
            sum += input[i] * w1[i][j];
        }
        
        //store the value resulted by running the sum through a sigmoid function, in outputs of hidden layer
        outputL1[j] = SigmoidFunction(sum);
    }
    
    //Take the sum of the weights for a output node, multiplied by the corresponding input in layer-two
    for(var j = 0; j < 3; j++){
        var sum = 0.0;

        for(var i = 0; i < 3; i++){
            sum += outputL1[i] * w2[i][j];
        }

        //store the value resulted by running the sum through a sigmoid function, in outputs of hidden layer
        output[j] = SigmoidFunction(sum);

    }
    
    //For debugging
    console.log(output[0] * 255 + "," + output[1] * 255 + "," + output[2] * 255);
    
}

//Train the network given the training loop, training inputs and the target outputs
function TrainNetwork(trainLoop,trainInput,target){
    trainingLoop = trainLoop;
    
    //run the do loop function which uses the settimeout function
    doloop(trainingLoop,trainInput,target);
}


function doloop(trainloop,inp,tar){
    //For debugging
    console.log(loop+","+trainloop);
    
    //run the function until the loop matches the training loop
    if(loop<trainloop){
      
        //setTimeout function
        setTimeout(function (){
            
            //For debugging
            console.log("inloop");
            
            //For each input set feed the input values and train the network
            for(var j = 0; j < inp.length; j++){
                ForwardPropagation(inp[j]);
                Train(tar[j]);
            }
            //Increment the loop
            loop+=1;
            //postMessage post the resulting output values after each loop to the browser interface
            postMessage(toHexa(Math.floor(output[0] * 255), Math.floor(output[1] * 255), Math.floor(output[2] * 255)));
                
            //repeat the function
            doloop(trainloop,inp,tar);
        },100); //function runs every 100 milliseconds
    }
    else
        close(); //stop the function
}

function Train(target){

    //Define new array to store the difference between layer-one
    var delta1 = new Array(3);
    //Define new array to store the difference between layer-two
    var deltaout = new Array(3);

    //for evey output calculate the delta as below and store in deltaout array
    for(var i = 0; i < 3; i++){
        deltaout[i] = output[i] * (1.0 - output[i]) * (target[i] - output[i]);
    }

    //Calculate the error for each delta
    //for evey output calculate the delta as below and store in delta1 array
    for(var i = 0; i < 3; i++){
        var error = 0.0;

        for(var j = 0; j < 3; j++){
            error += w2[i][j] * deltaout[j];
        }

        delta1[i] = outputL1[i] * (1 - outputL1[i]) * error;
    }

    //Adjust the weights of layer two according to deltaout
    for(var i = 0; i < 3; i++){
        for(var j = 0; j <3; j++){
            w2[i][j] += learningRate * outputL1[i] * deltaout[j];
        }
    }

    //Adjust the weights of layer one according to delta1
    for(var i = 0; i < 4; i++){
        for(var j = 0; j <2; j++){
            w1[i][j] += learningRate * input[i] * delta1[j];
        }
    }
}

//Defines the sigmoidfunction
function SigmoidFunction(val){
    return 1/(1 + Math.exp(-val));
}

//Function to convert R,G,B value to hexa
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
