window.data = [];
d3.json("/flask/ferris/sensor/fridge2",function(d) {
  var data = d;
  window.data = data
  d3.json("/flask/ferris/sensor/icebox1",function(d) {
    window.data = window.data.concat(d);
    d3.json("/flask/ferris/sensor/setpoint",function(d) {
      window.data = window.data.concat(d);
      d3.json("/flask/ferris/sensor/compState",function(d) {
        comp_data=d;
        draw_display();
        draw_timer(beer_data);
      });
    });
  });
});
/*
draw_display();
draw_timer(beer_data); */
//console.log(data);

var beer_data = {'name':"Cans, Waiting to Start Brew...", 'endtime':1485100800*1000,
  'starttime':1484755200*1000, 'PSI':"-", 'carbonation':"-"};

function estimate_carbonation(psi,temp) {
  //TODO add real estimate
  return 2.4;
}

function draw_display() {
  // process the data in some useful ways
  data = window.data;
  data.forEach(function(d) {
    d.time = new Date(+d.time*1000);
  });
  // console.log(data);
  //extract the fridge & freezer data, as well as the current time
  //console.log(data);
  d3.select('#brew').text('Current Brew: '+beer_data['name']);
  /*states_controller = data.filter(function(e,i,a) {
    return e["sensor"] == 'Compressor State';
  });*/
  temps_fridge = data.filter(function(e,i,a) {
    //return e["sensor"] == 'Fridge Temperature Avg';
    return (e["name"] == 'fridge2');
  });
  //state_controller = states_controller[states_controller.length-1];
  temp_fridge = temps_fridge[temps_fridge.length-1];
  //last_time = d3.max([state_controller['time'],temp_fridge['time']]);
  last_time = temp_fridge['time'];
  time_fmt = d3.time.format("%c")
  d3.select('#update-time').text('Last Updated '+time_fmt(last_time));
  //console.log(last_time);
  //console.log(time_fmt(new Date(+last_time)));
  var col = 'Springgreen';
  d3.select('#fridge-temp').text(temp_fridge['value'].toString()).attr('style','color:'+col);
  d3.select('#controller-state').text(comp_data[comp_data.length-1]['value'].toString()).attr('style','color:'+col);

  //clamp data values, to reduce impact of noise.  Assume proper temp should never go above 40 degrees C
  data = data.forEach(function(d) {
    d.value = (d.value <= 40 ? d.value : 40);
  });

  //add plots
  var padding = {'top':50,'left':50,'right':50,'bottom':50};
  var height = Math.floor(window.innerHeight*0.5)-padding.top-padding.bottom;
  var width = Math.floor(window.innerWidth*0.95)-padding.left-padding.right;
  //delete all the old data in the plot, prior to new processing

  d3.select('#plots-svg')
    .attr('width',width+padding.left+padding.right)
    .attr('height',height+padding.top+padding.bottom);

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

  x.domain(d3.extent(data, function(d) { return d.time; }));
  fridgeY.domain(d3.extent(data, function(d) { return +d.value; }));


  //add plot for refrigerator temperature
  //remove the old data
  d3.select('#plots-svg').selectAll("g").remove()
  var fridgeGroup = d3.select('#plots-svg').append("g");

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

  function get_color(d) {
    if (d.name=="fridge2") {
      return d3.rgb(255.0,0.0,0.0);
    } else if (d.name=="icebox1") {
      return d3.rgb(0.0,0.0,255.0);
    } else if (d.name=="setpoint") {
      return d3.rgb(0.0,255.0,0.0);
    } else {
      return d3.rgb(0.0,0.0,0.0);
    }
  };

  fridgeGroup.selectAll('.scatter').data(data).enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r",1.5)
    .attr("cx", function(d) {return x(d.time)})
    .attr("cy", function(d) {return fridgeY(+d.value)})
    .style("fill", function(d) {return get_color(d)});

  fridgeGroup.attr('transform','translate('+padding.left+','+padding.top+')');
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
