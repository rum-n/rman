//-- author: IDEO | Jimmy Chion | 2013
//-- license: Creative Commons SA-3.0

(function(){

// var margin = {top: 23, right: 5, bottom: 30, left: 80},
//     width = .75 * (3*$(document).width()/4 - margin.left - margin.right),
//     height = 600 - margin.top - margin.bottom;
// if(width > 870) {width = 870-margin.left;}

var margin = {top: 50, right: 20, bottom: 30, left: 80}, 
    width = 0.76*($(document).width()) - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
if ( width > 1140 ) { width = 1140-margin.left-margin.right; } //-- max-width in js

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([0, height]);

var color = d3.scale.category10();
color.range(['#336699', '#FF5050']); //-- colors of the graph blue red

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickValues( [7200,10800,14400,18000])
    .tickFormat( function(d){
    	return d.toHHMMSS();
    });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return ("<em>" + d.firstName + " " + d.lastName + "</em>, " + d.age + "<br>Time: " + d.totalTime.toHHMMSS() + "<br>Place: " + d.place);
  });

var scatterplot = d3.select("#scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

scatterplot.call(tip);


d3.csv("results/results.csv", function(d) {
  return {
  	place: +d.place,
  	// divTot: d.divTot,
  	// bib: +d.bib,
  	// cat: d.cat,
  	firstName: d.firstName,
  	lastName: d.lastName,
  	age: +d.age,
  	sex: d.sex,
  	// div: d.div,
  	// swimRank: +d.swimRank,
  	// swimTime: +d.swimTime,
  	// swimPace: +d.swimPace,
  	// t1Time: +d.t1Time,
  	// bikeRank: +d.bikeRank,
  	// bikeTime: +d.bikeTime,
  	// bikeSpeed: +d.bikeSpeed,
  	// t2Rank: +d.t2Rank,
  	// t2Time: +d.t2Time,
  	// runRank: +d.runRank,
  	// runTime: +d.runTime,
  	// runPace: +d.runPace,
  	totalTime: +d.totalTime,
  	// wave: +d.wave,
  	// passedSwim: +d.passedSwim,
  	// passedT1: +d.passedT1,
  	// passedBike: +d.passedBike,
  	// passedT2: +d.passedT2,
  	// passedRun: +d.passedRun,
    // estimatedT1Rank: +d.estimatedT1Rank

  };
}, function(error, data) {
  x.domain(d3.extent(data, function(d) { 
  	return d.age; 
  }));

  y.domain(d3.extent(data, function(d) { 
  	return d.totalTime; 
  })).nice();

  scatterplot.append("g")
      .attr("class", "x axis")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 16)
      .style("text-anchor", "end")
      .text("age");

  scatterplot.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "translate(0," + (height-30) + ") rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .text("completion time");

  var scatterplotDots = scatterplot.selectAll(".age-vs-time-dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "age-vs-time-dot")
      .attr("r", 3)
      .attr("cx", function(d) { return x(d.age); })
    	.attr("cy", function(d) { return y(d.totalTime)})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .style("fill", function(d) { return color(d.sex); });

  // draw legend
  var legend = scatterplot.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 50) + ")"; });

  // draw legend colored rectangles
  legend.append("circle")
      .attr("cx", width - 14)
      .attr("cy", 9)
      .attr("r", 6)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { 
        if (d == 'M') return 'Male';
        else return 'Female';
      });

	// get the x and y values for least squares
	var xSeries_overall = data.map(function(d) { return parseFloat(d.age); });
	var ySeries_overall = data.map(function(d) { return parseFloat(d.totalTime); });
	
	var leastSquaresCoeffOverall = leastSquares(xSeries_overall, ySeries_overall);

	var calculateTrendData = function(xSeries, leastSquaresArr){
		var x1 = d3.min(xSeries);
		var y1 = leastSquaresCoeffOverall[0] * x1 + leastSquaresCoeffOverall[1];
		var x2 = d3.max(xSeries);
		var y2 = leastSquaresCoeffOverall[0] * x2 + leastSquaresCoeffOverall[1];
		return [[x1,y1,x2,y2]];
	}

	//-- apply the reults of the least squares regression
	var overallTrendData = calculateTrendData(xSeries_overall, leastSquaresCoeffOverall);

	var trendline = scatterplot.selectAll(".trendline")
		.data(overallTrendData);
		
	trendline.enter()
		.append("line")
		.attr("class", "trendline")
		.attr("x1", function(d) { return x(d[0]); })
		.attr("y1", function(d) { return y(d[1]); })
		// .attr("x2", function(d) { return x(d[0]); })
		// .attr("y2", function(d) { return y(d[1]); })
		.attr("stroke", "black")
		.attr("stroke-width", 1.0)
		.style("stroke-dasharray", ("3,3"))
		// .transition()
		// 	.delay(500)
		// 	.duration(500)
			.attr("x2", function(d) { return x(d[2]); })
			.attr("y2", function(d) { return y(d[3]); });
	
  //-- uncomment to see trend data on female vs male. spoiler: it's not exciting
  var males = scatterplotDots.filter( function(d) { return (d.sex === 'M'); });
  var females = scatterplotDots.filter( function(d) { return (d.sex === 'F'); });


  var malesSeries = data.filter(function(d) {return d.sex == 'M';});
  var xSeries_male = malesSeries.map(function(d) { return parseFloat(d.age); });
  var ySeries_male = malesSeries.map(function(d) { return parseFloat(d.totalTime); });
  var femalesSeries = data.filter(function(d) { return d.sex == 'F';});
  var xSeries_female = femalesSeries.map(function(d) { return parseFloat(d.age); });
  var ySeries_female = femalesSeries.map(function(d) { return parseFloat(d.totalTime); });


  var leastSquaresCoeffMale = leastSquares(xSeries_male, ySeries_male);
  var leastSquaresCoeffFemale = leastSquares(xSeries_female, ySeries_female);

  var maleTrendData = calculateTrendData(xSeries_male, leastSquaresCoeffMale);
  var femaleTrendData = calculateTrendData(xSeries_female, leastSquaresCoeffFemale);

	trendline_male = scatterplot.selectAll(".trendline_male")
		.data(maleTrendData);
	trendline_male.enter()
		.append("line")
		.attr("class", "trendline")
		.attr("x1", function(d) { return x(d[0]); })
		.attr("y1", function(d) { return y(d[1]); })
		.attr("x2", function(d) { return x(d[0]); })
		.attr("y2", function(d) { return y(d[1]); })
		.attr("stroke", "blue")
		.attr("stroke-width", 1)
		.style("stroke-dasharray", ("3,3"))
		// .transition()
		// 	.delay(1000)
		// 	.duration(500)
		// 	.attr("x2", function(d) { return x(d[2]); })
		// 	.attr("y2", function(d){ return y(d[3]); }); 		
	
	trendline_female = scatterplot.selectAll(".trendline_female")
		.data(femaleTrendData);

	trendline_female.enter()
		.append("line")
		.attr("class", "trendline")
		.attr("x1", function(d) { return x(d[0]); })
		.attr("y1", function(d) { return y(d[1]); })
		.attr("x2", function(d) { return x(d[0]); })
		.attr("y2", function(d) { return y(d[1]); })
		.attr("stroke", "red")
			.attr("stroke-width", 1)
		.style("stroke-dasharray", ("3,3"))
		// .transition()
		// 	.delay(1500)
		// 	.duration(500)
		// 	.attr("x2", function(d) { return x(d[2]); })
		// 	.attr("y2", function(d) { return y(d[3]); });
	
  //-- display equation on the chart
  // scatterplot.append("text")
  //  .attr("class", "text-label")
  //  .attr("x", width-200)
  //  .attr("y", height-80)
  //  .text("eq: " + decimalFormat(leastSquaresCoeff[0]) + "x + " + decimalFormat(leastSquaresCoeff[1]));
  
  //-- display r-square on the chart
	// decimalFormat = d3.format("0.3f");
	// scatterplot.append("text")
	// 	.attr("class", "text-label")
	// 	.attr("x", width-200)
	// 	.attr("y", height-60)
	// 	.text("r-sq: " + decimalFormat(leastSquaresCoeffOverall[2]));



  //------------------------------------
  //----- inputs for interactive elements
  //------------------------------------  

  $('input[name=scatterAge]').on('change', inputHandler); //-

  function inputHandler() {
    if (this.id == 'scatterFemale') {
        
        females.transition()
        .attr('r', 3)
        .duration(300);

        males.transition()
        .attr('r', 0)
        .duration(500)
        .delay(100);

        trendline_male.attr("x2", function(d) { return x(d[0]); })
         .attr("y2", function(d){ return y(d[1]); });  
        trendline.attr("x2", function(d) { return x(d[0]); })
         .attr("y2", function(d){ return y(d[1]); });  
        trendline_female.transition()
         .delay(500)
         .duration(500)
         .attr("x2", function(d) { return x(d[2]); })
         .attr("y2", function(d){ return y(d[3]); });  

    } else if (this.id == 'scatterMale') {
        males.transition()
        .attr('r', 3)
        .duration(300);

        females.transition()
        .attr('r', 0)
        .duration(500)
        .delay(100);

        trendline_female.attr("x2", function(d) { return x(d[0]); })
         .attr("y2", function(d){ return y(d[1]); });  
        trendline.attr("x2", function(d) { return x(d[0]); })
         .attr("y2", function(d){ return y(d[1]); }); 
        trendline_male.transition()
         .delay(500)
         .duration(500)
         .attr("x2", function(d) { return x(d[2]); })
         .attr("y2", function(d){ return y(d[3]); });  

    } else {
      males.transition()
        .attr('r', 3)
        .duration(300);
      females.transition()
        .attr('r', 3)
        .duration(300);

      trendline_male.attr("x2", function(d) { return x(d[0]); })
         .attr("y2", function(d){ return y(d[1]); });  
      trendline_female.attr("x2", function(d) { return x(d[0]); })
         .attr("y2", function(d){ return y(d[1]); }); 
      trendline.transition()
        .delay(500)
        .duration(500)
        .attr("x2", function(d) { return x(d[2]); })
        .attr("y2", function(d){ return y(d[3]); });  
    }
  }

	});
})();


// returns slope, intercept and r-square of the line
function leastSquares(xSeries, ySeries) {
	var reduceSumFunc = function(prev, cur) { return prev + cur; };
	
	var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
	var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

	var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
		.reduce(reduceSumFunc);
	
	var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
		.reduce(reduceSumFunc);
		
	var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
		.reduce(reduceSumFunc);
		
	var slope = ssXY / ssXX;
	var intercept = yBar - (xBar * slope);
	var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
	return [slope, intercept, rSquare];
}

//-- function to convert s to HH:MM:SS. thanks stack overflow
Number.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}


