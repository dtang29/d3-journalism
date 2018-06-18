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
    .attr("r", "15")
    .attr("fill", "teal")
    .attr("opacity", ".5")
    
    // Create tool tips
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([150, -60])
    .html(function(d) {
      return (`<center>${d.abbr}</center><hr>% People Reported with Depression:<br> ${d.depression}<br><br>Median Household Income: ${d.medianIncome}`);
    });

    //Create the tool tip
    chartGroup.call(toolTip);

    //Create event listeners
    circlesGroup.on("click", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    //Append a label to each data point
    chartGroup.selectAll("text")
        .data(data)
        .enter()
        .text(function(data) {
            return data.abbr
        })
        .attr("x", function(data) {
            return xLinearScale(data.depression);
        })
        .attr("y", function(data) {
            return yLinearScale(data.medianIncome);
        })
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        
    
    //Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 5)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("% of people that said they have Depression");

    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 10 })`)
    .attr("class", "axisText")
    .text("Median Household Income");
    
    

})