svg-erase
=========

An eraser tool for SVG written in javascript.

The main method is in erase.js. It will handle polylines for the drawings and a polyline with a radius for the eraser path.

Clone to your computer, open the index.html file in your browser and drag with your mouse / finger on the svg to see it in action!

Uses the great [d3.js](https://github.com/mbostock/d3) library from Mike Bostock.

To setup the testing enviroment, install node.js, then install npm (or does it actually come with node nowadays?). Then run `npm install nodeunit` on your command line. To run the tests call `node_modules/.bin/nodeunit tests.js` or just `nodeunit test.js` if you used the `-g` option during installing `nodeunit`.