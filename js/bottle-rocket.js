function f_pressure(p_0,V_0,start_mass,mass,rho_w,gamma) {
  var p_in = p_0*Math.pow(((V_0+((start_mass-mass)/rho_w))/V_0),-gamma);
  //console.log((V_0+((start_mass-mass)/rho_w))/V_0);
  return p_in;
}

function f_mass_flow(r,rho_w,pressure,p_out) {
  var mass_flow = 3.14159*Math.pow(r,2)*rho_w*Math.sqrt((2*(pressure-p_out))/rho_w);
  return mass_flow;
}

function f_thrust(r,pressure,p_out) {
  var thrust = 2*3.14159*Math.pow(r,2)*(pressure-p_out);
  return thrust;
}

function f_drag_constant(A,rho_a,Cd) {
  var drag_constant = -0.5*A*rho_a*Cd;
  return drag_constant;
}

function f_dv(thrust,g,drag_constant,mass,v,dry_mass) {
  if (mass>dry_mass) {
    var dv = (thrust/mass)-g+(drag_constant/mass)*v*Math.abs(v);
  }
  else {
    //console.log("running dry")
    var dv = -g+(drag_constant/mass)*v*Math.abs(v);
  }
  return dv;
}

function f_v(v,dv,dt) {
  return v+dv*dt;
}

function f_mass(mass,mass_flow,dry_mass,dt) {
  mass = mass-mass_flow*dt;
  if (mass<dry_mass) {
    mass = dry_mass;
  }
  return mass;
}

function f_z(z,v,dt) {
  z = z+v*dt;
  return z;
}

function plot_helper(id, data, xlabel, ylabel) {
  //plot dimensions
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

  //create scales
  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);
  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(5);

  var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);

  // Define the line
  var plot_line = d3.svg.line()
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return y(d[1]); });

  //select the SVG TODO make this work for updates
  svg = d3.select(id);
  svg.selectAll("g").remove();

  svg = svg
    .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d[0]; }));
  y.domain(d3.extent(data, function(d) { return d[1]; }));

  // Add the valueline path.
  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", plot_line);

  // Add the X Axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  // Add xAxis label
  svg.append("g")
      .attr("class", "x label")
      .attr("transform", "translate(30," + (height + 17 ) + ")")
        .append("text")
          .text(xlabel)
          .attr("font-family", "sans-serif")
          .attr("font-size", "10px");



  // Add the Y Axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // Add yAxis label
  svg.append("g")
      .attr("class", "y label")
      .attr("transform", "translate(-30,-5)")
        .append("text")
          .text(ylabel)
          .attr("font-family", "sans-serif")
          .attr("font-size", "10px");

}

function plot(vs,zs,ts,masses) {
  var data = d3.zip(ts,zs);
  plot_helper("#height-plot",data,'Time (s)','Altitude (m)');
  var data = d3.zip(ts,vs);
  plot_helper("#speed-plot",data,'Time (s)','Speed (m/s)');
}

function run(dt,p_0,V_0,dry_mass,rho_w,p_out,gamma,r,A,Cd,rho_a,g) {
  //initialize constants
  var drag_constant = f_drag_constant(A,rho_a,Cd);
  var start_mass = dry_mass+(0.002-V_0)*rho_w;
  var dt_0 = dt;

  //initialize arrays for plotting
  var vs = [];
  var zs = [];
  var ts = [];
  var masses = [];

  //initialize working vars
  var pressure = p_0;
  var mass_flow = 0;
  var thrust = 0;
  var dv = 0;
  var v = 0;
  var mass = start_mass;
  var z = 0;
  var t = 0;

  var i = 0;

  var state = 'thrusting';

  while (z>=0) {
    //    if (i%1 == 0) {
    //      console.log(i,dv);
    //    }
    vs.push(v);
    zs.push(z);
    ts.push(t);
    masses.push(mass);
    if ((mass <= dry_mass) && (state == 'thrusting')) {
      dt_0 = dt_0*10;
      state = 'coasting';
    };
    dt = dt_0;
    pressure = f_pressure(p_0,V_0,start_mass,mass,rho_w,gamma);
    mass_flow = f_mass_flow(r,rho_w,pressure,p_out);
    thrust = f_thrust(r,pressure,p_out);
    dv = f_dv(thrust,g,drag_constant,mass,v,dry_mass);
    //if the mass will drop below zero, recalculate dt for just this step to compensate
    if (mass>dry_mass) {
      if (mass-(mass_flow*dt)<dry_mass) {
        dt = (mass-dry_mass)/mass_flow;
      }
    }
    v = f_v(v,dv,dt);
    mass = f_mass(mass,mass_flow,dry_mass,dt);
    z = f_z(z,v,dt);
    t = t+dt;
    i = i+1;
    if (i>100000) {
      break;
    }
  }
  plot(vs,zs,ts,masses);
  var max_height = Math.round(d3.max(zs)*100)/100.0;
  var max_speed = Math.round(d3.max(vs)*100)/100.0;
  d3.select('#height-out')
    .text(max_height.toString()  + " meters");
  d3.select('#speed-out')
    .text(max_speed.toString()  + " meters/sec");
}

function run_from_form() {
  var p_0 = 6894.75729*parseFloat(document.getElementById("air_pressure").value);
  var V_0 = 0.002*parseFloat(document.getElementById("air_vol").value)/100.0;
  var A = parseFloat(document.getElementById("area").value)/10000.0;
  var Cd = parseFloat(document.getElementById("cd").value);
  var r = parseFloat(document.getElementById("nozzle").value)/1000.0;
  var dry_mass = parseFloat(document.getElementById("mass").value)/1000.0;
/*  d3.select('#pressure-out').text(document.getElementById("air_pressure").value);
  d3.select('#volume-out').text(document.getElementById("air_vol").value);
  d3.select('#area-out').text(document.getElementById("area").value);
  d3.select('#cd-out').text(document.getElementById("cd").value);
  d3.select('#r-out').text(document.getElementById("nozzle").value);
  d3.select('#mass-out').text(document.getElementById("mass").value);*/
  run(0.001,p_0+101325,V_0,dry_mass,1000,101325,1.4,r,A,Cd,1,9.8);
}
