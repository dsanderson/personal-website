function display(col,lims,lvls) {
  var ranges = make_range(col,lims);
  var data = d3.shuffle(make_cols(ranges,3));
  d3.select("body").selectAll("div").remove();
  d3.select("body").selectAll("div").data(data).enter().append("div")
  .attr("class","excol")
  .attr("onclick",function (d) {
    return(make_callback(d,lims,lvls));
  })
  .style('background-color',function (d) {
    var r = convert_col(d[0]).toString();
    var g = convert_col(d[1]).toString();
    var b = convert_col(d[2]).toString();
    return ('rgb('+r+','+g+','+b+')');
  })
  .append("p").attr("class","coltxt")
  .text(function (d) {
    var r = convert_col(d[0]).toString();
    var g = convert_col(d[1]).toString();
    var b = convert_col(d[2]).toString();
    return ('rgb('+r+','+g+','+b+')');
  });

}

function make_cols(ranges,lvls) {
  //creates a list of lvls^3 colors, filling the space of volume lvl at color root
  gs=linspace(ranges.green[0],ranges.green[1],lvls);
  rs=linspace(ranges.red[0],ranges.red[1],lvls);
  bs=linspace(ranges.blue[0],ranges.blue[1],lvls);
  var cols = [];
  for (r in rs) {
    for (g in gs) {
      for (b in bs) {
        cols.push([rs[r],gs[g],bs[b]]);
      }
    }
  }
  return (cols);
}

function make_range(col,lims) {
  var range = {
    'red':[col[0]-lims[0],col[0]+lims[1]],
    'green':[col[1]-lims[0],col[1]+lims[1]],
    'blue':[col[2]-lims[0],col[2]+lims[1]],
  };
  return (range);
}

function linspace(low, high, num) {
  var nums = [];
  for (n=0;n<num;n++) {
    nums.push(low+n*(high-low)/(num-1));
  }
  //console.log(nums)
  return (nums);
}

function convert_col(val) {
  if (val<0) {
    return (0);
  }
  if (val>1.0) {
    return (255);
  }
  return (parseInt(val*255));
}

function make_callback(col,lims,lvls) {
  //modifies ranges for new centerpoint, and returns an appropriate string for the callback function
  var lim2= [lims[0],lims[1]];
  lim2[0] = lim2[0]*0.5;
  lim2[1] = lim2[1]*0.5;
  var str = 'display(['+col.toString()+'],['+lim2.toString()+'],'+lvls.toString()+')';
  return (str);
}
