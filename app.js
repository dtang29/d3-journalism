////////////////////////////
//////Boiler Plate Code/////
////////////////////////////

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#svg-area")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

////////////////////////////
/////Create Scatter Plot////
////////////////////////////

//Load data from data.csv
d3.csv("data.csv", function(error, data) {

    if (error) throw error;

    console.log(data);

    //cast the values for depression and median income to an int
    data.forEach(function(data) {
        data.id = +data.id;
        data.depression = +data.depression;
        data.medianIncome = +data.medianIncome;
    });

    //Create scales for the chart
    var xLinearScale = d3.scaleLinear()
        .domain([38000, d3.max(data, d => d.medianIncome)])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.depression)])
        .range([chartHeight, 0]);

    //Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Add x-axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Add y-axis
    chartGroup.append("g")
        .classed("green", true)
        .call(leftAxis);

    
    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.medianIncome))
    .attr("cy", d => yLinearScale(d.depression))
    .attr("r", "10")
    .attr("fill", "teal")
    .attr("opacity", ".5");
    

})