function generateNoise(opacity, nodeId) {
   if ( !!!document.createElement('canvas').getContext ) {
      return false;
   }
 
   var canvas = document.createElement("canvas"),
   ctx = canvas.getContext('2d'),
   x, y,
   number,
   opacity = opacity || .2,
   node = document.getElementById(nodeId);
 
   canvas.width = 45;
   canvas.height = 45;
 
   for ( x = 0; x < canvas.width; x++ ) {
      for ( y = 0; y < canvas.height; y++ ) {
         number = Math.floor( Math.random() * 60 );
 
         ctx.fillStyle = "rgba(" + number + "," + number + "," + number + "," + opacity + ")";
         ctx.fillRect(x, y, 1, 1);
      }
   }
   
   node.style.position = 'absolute';
   node.style.width = '100%';
   node.style.height = '100%';
   node.style.opacity = '0.4';
   node.style.backgroundImage = "url(" + canvas.toDataURL("image/png") + ")";
}
generateNoise(.1, 'noiseContainer'); // default opacity is .2