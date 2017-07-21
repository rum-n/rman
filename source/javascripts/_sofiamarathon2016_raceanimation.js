(function(){

//------------------------------------
//----- setting up the graph, axis
//------------------------------------  

var margin = {top: 20, right: 5, bottom: 100, left: 60}, 
    width = 0.58*($(document).width()) - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
if ( width > 0.75*1140 ) { width = 0.75*1140-margin.left-margin.right; } //-- max-width in js
if ( $(document).width() < 1100 ) { width = 0.9*$(document).width() - margin.right - margin.left;}

var x = d3.scale.linear()
    .range([0, width]);

    var y = d3.scale.linear()
    .range([0, height]);

var color = d3.scale.ordinal()
    .domain(['me (Rumen)','passed','passed by'])
    .range(['#ff0000', '#BBB', '#000']);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickValues([1, 250, 500, 750, 1000])
    .tickFormat(function(d) {
      if (d%10 == 1) {
        return (d+"st");
      } else {
        return (d+"th");
      }
    });

var race = d3.select("#raceviz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");