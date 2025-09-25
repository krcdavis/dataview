"use strict";

function main() {

//keys of convenience
const c = 'c';
const tx = 't';
const r = 0;
const g = 1;
const b = 2;

//starter vals...
var width = window.innerWidth*.8;
var height = window.innerHeight*.8;
//to do: use above, make canvas a percentage of page, use percentage to calc size; update and recalc if window is resized (: -done

  var canvas = document.querySelector("#canvas");
  var divContainerElement = document.querySelector("#divcontainer");

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }
  function degToRad(d) {
    return d * Math.PI / 180;
  }
const sin = Math.sin;
const cos = Math.cos;
//rot x: y = cos(a)*y - sin(a)*z; z = sin(a)*y + cos(a)*z

var rot = 0;

//based on keypress, modify transformation state and draw()
document.addEventListener('keydown', function(event) {
    if(event.key == "ArrowLeft") {
  event.preventDefault();
        console.log('Left was pressed');
        rot += degToRad(5);
        draw();
    }
    else if(event.key == "ArrowRight") {
  event.preventDefault();
        console.log('Right was pressed');
        rot -= degToRad(5);
        draw();
    }
});

window.addEventListener('resize', function(event) {
 width = window.innerWidth*.8;
 height = window.innerHeight*.8*.9;//there!
draw();//oooo
});

  var divSetNdx = 0;
  var divSets = [];


//replace size with z and do some math within here?
  function addDivSet(msg, x, y, siz,col) {
    // get the next div, except don't.
    var divSet = divSets[divSetNdx++];

    // If it doesn't exist make a new one
//it doesn't exist because i changed thing but do it anyway
    if (!divSet) {
      divSet = {};
      divSet.div = document.createElement("div");
      divSet.textNode = document.createTextNode("");
      divSet.style = divSet.div.style;
      divSet.div.className = "floating-div";

      // add the text node to the div
      divSet.div.appendChild(divSet.textNode);

      // add the div to the container
      divContainerElement.appendChild(divSet.div);

      // Add it to the set
      divSets.push(divSet);
    }//if

// temp values, will be overwritten almost immediately by draw/mod
        var pixelX = xx*width/260;// + time;
        var pixelY = yy*height/262;

    divSet.style.display = "block";
    divSet.style.position = "absolute";
    divSet.style.left = Math.floor(pixelX) + "px";
    divSet.style.top = Math.floor(pixelY) + "px";
    divSet.style["font-size"] = Math.min(siz,0.51) + "rem";
    divSet.style.color = col;
    divSet.textNode.nodeValue = msg;
  }//add



//modify/move div set.
//transformation state is a global value.
//I think i will just send in raw x y z and do all the math here, so clean up main/add.

  function modDivSet(x,y,z,index) {
//console.log(canvas.offsetLeft);//USELESS
    var divSet = divSets[index];//[divSetNdx++];

//math zone
var xx = x;
var yy = y;
var zz = z;
//test
xx = cos(rot)*(x-128) - sin(rot)*(z-128) + 128;
zz = sin(rot)*(x-128) + cos(rot)*(z-128) + 128;//YEAH

        var pixelX = (xx+52)*(width)/(360*1);
        var pixelY = (yy+52)*(height)/(360*1);
    var siz = zz/(128 *1.45) +.5;//yay?

//fix size to not go to zero. -done
//to account for top-left problem, subtact a small amt based on size...
pixelX += 5 * (2-siz);
pixelY += 8 * (2-siz);//gud enuf
//do further math but earlier to correctly resize for h/w but with a buffer border.....

var centerX = width/2;
var centerY = height/2;
//perspective matrix... z of 255 (siz ~128) unchanged, else.
pixelX = (pixelX -centerX)*(siz/2) +centerX  +width/8;//perfect
pixelY = (pixelY -centerY)*(siz/2) +centerY  +height*.05;//temp... not quite right

//math zone

//translation: move cube of points forward if user steps forward, back if back
//within limits. also somewhat grid-based/bit-by-bit... word? discrete?
//rotation: rotate around redefined center. starts at... 128,128,128
//moving 'forward' moves center towards viewer...
//rotate first, so put translation first in the funny matrix multiplier array function

//just implement rotation first. watch the cube rotate from a distance

    divSet.style.left = Math.floor(pixelX) + "px";
    divSet.style.top = Math.floor(pixelY) + "px";
    divSet.style["font-size"] = siz + "rem";

    divSet.style["z-index"] = Math.floor(zz+56);

}//mod

  function draw() {

divSetNdx = 0;//is this used?

//for thing in json... order or at least count should be the same
var index = 0;
    for ( var t in things  ) {
var thing = things[t]
//console.log(thing)
var xx = thing[c][0];
var yy = thing[c][1];

//size should vary from like .001 to 1.999 remmies... or maybe .5 to 1.999...
var z = thing[c][2];///128;
//math will be done in modDivSet
        modDivSet( xx, yy,z,index);//index
index++;
      }//for

}//draw



//main: initiate divSets

    for ( var t in things  ) {
var thing = things[t]
//console.log(thing)
var xx = thing[c][0];
var yy = thing[c][1];

//size should vary from like .001 to 1.999 remmies... doesn't matter here
var siz = thing[c][2]/128;


//next: move math functions into... functions.
//or, only work with the math in/with modDV, add is placeholder which will be overwrittn immediately.

var col = `rgb(${thing[c][0]},${thing[c][1]},${thing[c][2]})`;//i always forget the backticks
//idea: programmatically lighten the colors and use a dark background.
//change this to just send in xyz as is. math done elsewhere/in a more centralized location. clean up the stuff above this
        addDivSet(thing[tx], xx, yy,siz,
            col);
      }//for

//then start draw loop.
draw();

}//main

main();