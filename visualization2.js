// Resource used - https://d3-graph-gallery.com/barplot.html
// Setting the dimensions of the page and the graph
var margin = {top: 40, right: 30, bottom: 20, left: 70},
    width = 1400 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Appending the svg to the page
var svg = d3.select("#viz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 40)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//variables to check when buttons are clicked         
var ped  = "ped"
var car = "car"
var mot = "mot"
var bic = "bic"
var tru = "tru"

function update(s) {

//Removing the old chart from the screen
svg.selectAll("*").remove();

// Legend creation
svg.append("circle").attr("cx",1196).attr("cy",35).attr("r", 6).style("fill", "#E9D758")
svg.append("text").attr("x", 1210).attr("y", 35).text("Car Occupants").style("font-size", "15px").attr("alignment-baseline","middle")

svg.append("circle").attr("cx",1196).attr("cy",55).attr("r", 6).style("fill", "#297373")
svg.append("text").attr("x", 1210).attr("y", 55).text("Pedestrians").style("font-size", "15px").attr("alignment-baseline","middle")

svg.append("circle").attr("cx",1196).attr("cy",75).attr("r", 6).style("fill", "#FF8552")
svg.append("text").attr("x", 1210).attr("y", 75).text("Motorcycle").style("font-size", "15px").attr("alignment-baseline","middle")

svg.append("circle").attr("cx",1196).attr("cy",95).attr("r", 6).style("fill", "#A0CCDA")
svg.append("text").attr("x", 1210).attr("y", 95).text("Bicycle").style("font-size", "15px").attr("alignment-baseline","middle")

svg.append("circle").attr("cx",1196).attr("cy",115).attr("r", 6).style("fill", "#37123C")
svg.append("text").attr("x", 1210).attr("y", 115).text("Trucks").style("font-size", "15px").attr("alignment-baseline","middle")

d3.csv("transportation.csv").then( function(data) {

  const years = data.map(d => (d.Year)) // years column from the dataset

// Setting up the axis and their labels

  var x = d3.scaleBand()
  .domain(years)
  .range([0, width])
  .padding([0.2])
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x).tickSizeOuter(0));

svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 650)
    .attr("y", 585)
    .style('font-weight', '300')
    .style('font-size', '20px')
    .style('font-family','Calibri')
    .text("Year");

svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+30)
    .attr("x", -margin.top-130)
    .style('font-weight', '300')
    .style('font-size', '20px')
    .style('font-family','Calibri')
    .text("Number of Fatalities")

var y = d3.scaleLinear()
.domain([0, 25])
.range([ height, 0 ]);
svg.append("g")
.call(d3.axisLeft(y));

// Removing the first column from the data
var cols = data.columns.slice(1)
var colarr;
var colorarr;

// If condition to get the columns that need to be displayed depdning upon the button clicked by the user

if (s=="car") {
  colarr = [cols[7]]
  colorarr = ['#E9D758']
  console.log(colarr)
} else if (s=="ped") {
  colarr = [cols[8]]
  colorarr = ['#297373']
  console.log(colarr)
} else if(s=="mot") {
  colarr = [cols[9]]
  colorarr = ['#FF8552']
  console.log(colarr)
} else if(s=="bic") {
  colarr = [cols[10]]
  colorarr = ['#A0CCDA']
  console.log(colarr)
}
else if(s=="tru") {
  colarr = [cols[11]]
  colorarr = ['#37123C']
  console.log(colarr)
} 
else {
  colarr = [cols[7],cols[8],cols[9],cols[10],cols[11]]
  colorarr = ['#E9D758','#297373','#FF8552',"#A0CCDA","#37123C"]
}


// Getting the colors array and the stacked data that has to be displayed
var colorp = d3.scaleOrdinal()
.domain(colarr)
.range(colorarr)

var updateddata = d3.stack()
.keys(colarr)
(data)

// Making the stacked bar plot 
svg.append("g")
.selectAll("g")
// Traversing through the data
.data(updateddata)
.enter().append("g")
  .attr("fill", function(d) { return colorp(d.key); })
  .selectAll("rect")
  .data(function(d) { return d; })
  //Drawing the stacked bar plots using the updated data
  .enter().append("rect")
    .attr("x", function(d) { return x(d.data.Year); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .attr("width", x.bandwidth())

    // Mouse Hover Functionality for displaying ticker
    .on("mouseover", function(d){

      d3.select(this).attr("stroke","black").attr("stroke-width",0.8);    
      printval = Math.round((d[1] - d[0]) * 100) / 100

      svg.append("text")
      .attr("x",1190)
      .attr("y",5)
      .attr("class","tooltip")
      .text("Fatalities: " + printval); 
   })
   .on("mouseout",function(){
      svg.select(".tooltip").remove();
      d3.select(this).attr("stroke-width",0.2);                   
    })
})
}

// For the general case, display all values:
update("all")

