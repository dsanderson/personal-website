var display = d3.select("#current-svg");
var d_height = 300, d_width = 800;
display.attr('width',d_width);
display.attr('height',d_height);

var data;
d3.csv("ferris.csv",function(d) {
  data = d;
  draw_display();
  draw_timer(beer_data);
});
//console.log(data);

var beer_data = {'name':"Czech Czillsner", 'endtime':1460088000*1000,
  'starttime':1458878400*1000, 'PSI':14.0, 'carbonation':2.48};

function estimate_carbonation(psi,temp) {
  //TODO add real estimate
  return 2.4;
}

function color_freezer() {
  //calculate based on percent error on carbonation
  return null;
};

function color_fridge() {
  return null;
}

function draw_display() {
  // process the data in some useful ways
  data.forEach(function(d) {
    d.time = new Date(+d.time*1000);
  });
  // console.log(data);
  //extract the fridge & freezer data, as well as the current time
  //console.log(data);
  d3.select('#brew').text('Current Brew: '+beer_data['name']);
  states_controller = data.filter(function(e,i,a) {
    return e["sensor"] == 'Compressor State';
  });
  temps_fridge = data.filter(function(e,i,a) {
    return e["sensor"] == 'Fridge Temperature Avg';
  });
  state_controller = states_controller[states_controller.length-1];
  temp_fridge = temps_fridge[temps_fridge.length-1];
  last_time = d3.max([state_controller['time'],temp_fridge['time']]);
  time_fmt = d3.time.format("%c")
  d3.select('#update-time').text('Last Updated '+time_fmt(last_time));
  //console.log(last_time);
  //console.log(time_fmt(new Date(+last_time)));
  var col = 'Springgreen';
  d3.select('#fridge-temp').text(temp_fridge['value'].toString()).attr('style','color:'+col);
  d3.select('#controller-state').text(state_controller['value'].toString()).attr('style','color:'+col);


  //add timer for beer readiness

  //add plots
  //add plot for refrigerator temperature
  var fridgeGroup = d3.select('#fridgegroup');
  var padding = {'top':50,'left':50,'right':50,'bottom':50};
  var height = 200;
  var width = 1000;

  d3.select('#plots-svg')
    .attr('width',width+padding.left+padding.right)
    .attr('height',(height+padding.top+padding.bottom)*2);

  var x = d3.time.scale()
    .range([0, width]);

  var fridgeY = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var fridgeYAxis = d3.svg.axis()
      .scale(fridgeY)
      .orient("left");

  var fridgeLine = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return fridgeY(+d.value); })
    .interpolate('linear');

  x.domain(d3.extent(data, function(d) { return d.time; }));
  fridgeY.domain(d3.extent(temps_fridge, function(d) { return +d.value; }));

  fridgeGroup.append('g').attr('class','x axis')
    .attr('transform','translate(0,'+height+')')
    .call(xAxis);

  fridgeGroup.append('g').attr('class','y axis')
    .attr('transform','translate(0,0)')
    .call(fridgeYAxis)
    .append("text")
    //.attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .attr('transform','translate(5,-5)')
    .style("text-anchor", "start")
    .text("Fridge Temp. (C)");

  fridgeGroup.append('path')
    .datum(temps_fridge)
    .attr('id','fridgeline')
    .attr('d',fridgeLine);

  fridgeGroup.attr('transform','translate('+padding.left+','+padding.top+')');

  //add the plot for the freezer just below

  var controllerGroup = d3.select('#controllergroup');

  var controllerY = d3.scale.linear()
      .range([height, 0]);

  var controllerYAxis = d3.svg.axis()
      .scale(controllerY)
      .orient("left");

  var controllerLine = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return controllerY(+d.value); })
    .interpolate('linear');

  x.domain(d3.extent(data, function(d) { return d.time; }));
  controllerY.domain(d3.extent(states_controller, function(d) { return +d.value; }));

  controllerGroup.append('g').attr('class','x axis')
    .attr('transform','translate(0,'+height+')')
    .call(xAxis);

  controllerGroup.append('g').attr('class','y axis')
    .attr('transform','translate(0,0)')
    .call(controllerYAxis)
    .append("text")
    //.attr("transform", "rotate(-90)")
    .attr('transform','translate(5,-5)')
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "start")
    .text("Controller State");

  controllerGroup.append('path')
    .datum(states_controller)
    .attr('id','controllerline')
    .attr('d',controllerLine);

  controllerGroup.attr('transform','translate('+padding.left+','+(height+padding.top+padding.bottom)+')');

}

function draw_timer(beer_data) {
  var height=125;
  var width=height;
  var padding=5;
  //calcuate intervals
  var st = new Date(+beer_data.starttime);
  var et = new Date(+beer_data.endtime);
  var total = Math.abs(et-st);
  var current = Math.abs(et-(new Date()));
  var percent = current/total;
  //build d:h:m string
  var cd = 60*60*24*1000;
  var ch = 60*60*1000;
  var cm = 60*1000;
  var d = Math.floor(current/cd);
  var h = Math.floor((current%cd)/ch);
  var m = Math.floor(((current%cd)%ch)/cm);
  timestr = d.toString()+':'+h+':'+m;

  svg = d3.select('#current-timer');
  svg.attr('width',(width+(padding*2)).toString()).attr('height',(height+(padding*2)).toString());
  svg.append('text')
    .attr('transform','translate('+width/2+padding*2+','+height/2+padding*2+15+')')
    .attr('id','current-timer-text')
    .attr('text-anchor','middle')
    .text(timestr);

  //add the arc
  var arc = d3.svg.arc()
    .outerRadius(width/2)
    .innerRadius(width/2 - 4)
    .startAngle(0)
    .endAngle(2*3.1415*percent);

  svg.append('path')
    .attr('id','timer-arc')
    .attr('d',arc)
    .attr('transform','translate('+width/2+padding+','+height/2+padding+')');
}
