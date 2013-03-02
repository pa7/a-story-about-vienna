;(function(w){
	
	if(!w["DataVIZ"]) var viz = w["DataVIZ"] = {};


	// DataVIZ is an object containing all the visualizations.
	// each visualization has 
	// 	-	a data endpoint / own data
	// 	-	to be internally initialized ()
	// 	-	custom interactions



	viz["CultureHotspots"] = (function(){

		var	map = null,
			dataUrls = {
				"d0": "data/grillspots.json",
				"d1": "data/citybike.json",
				"d2": "data/markets.json",
				"d3": "data/universities.json",
				"d4": "data/badestellen.json",
				"d5": "data/museum.json",
				"d6": "data/camping.json",
				"d7": "data/castles.json"
			},
			dataIcons = {
				"d0": "img/icons/grillplatzogd.png",
				"d1": "img/icons/citybike.png",
				"d2": "img/icons/market.png",
				"d3": "img/icons/university.png",
				"d4": "img/icons/badestelle.png",
				"d5": "img/icons/museum.png",
				"d6": "img/icons/camping.png",
				"d7": "img/icons/castle.png" 
			},
			data = {
				"d0": null,
				"d1": null,
				"d2": null,
				"d3": null,
				"d4": null,
				"d5": null,
				"d6": null,
				"d7": null
			},
			normalProjection = null,
			baseProjection = null,
			markerLayer = null,
			fmzk = null,
			init = function(){
				$('#tags_slide2 div').click(function() {
					updateLayer("d"+$(this).index());
				});
				// Defaults for the WMTS layers
			    var defaults = {
			        zoomOffset: 12,
			        requestEncoding: "REST",
			        matrixSet: "google3857",
			        attribution: '<div style="background:white;">Datenquelle: Stadt Wien - <a href="http://data.wien.gv.at">data.wien.gv.at</a></div>'
			    };
				map = new OpenLayers.Map({
			    	div: "cultureMap",
			        theme: null,
			        projection: "EPSG:3857",
			        units: "m",
			        maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
			        maxResolution: 156543.0339,
			        controls: [
			            new OpenLayers.Control.Attribution()
			        ]
				});
				baseProjection = new OpenLayers.Projection("EPSG:3857");
				normalProjection = new OpenLayers.Projection("EPSG:4326");
				function zoomToInitialExtent() {
			        map.setCenter(new OpenLayers.LonLat(1819237.393019, 6142104.9771083), 12);
			    };

			   
			    OpenLayers.Request.GET({
			        url: "misc/WMTSCapabilities.xml",
			        success: function(request) {
			            var format = new OpenLayers.Format.WMTSCapabilities();
			            var defaults = {
			                requestEncoding: "REST",
			                matrixSet: "google3857",
			        		attribution: '<div style="background:white;padding:3px;">Datenquelle: Stadt Wien - <a href="http://data.wien.gv.at">data.wien.gv.at</a></div>'
			            };
			            var doc = request.responseText,
			                caps = format.read(doc);
			            /*fmzk = format.createLayer(caps, OpenLayers.Util.applyDefaults(
			                {layer:"fmzk", requestEncoding:"REST", transitionEffect:"resize"}, defaults
			            ));

			            labels = format.createLayer(caps, OpenLayers.Util.applyDefaults(
			                {layer:"beschriftung", requestEncoding:"REST", isBaseLayer: false},
			                defaults
			            ));
			            map.addLayers([fmzk, labels]); */
			            fmzk = format.createLayer(caps, OpenLayers.Util.applyDefaults(
			                {layer:"lb", requestEncoding:"REST", transitionEffect:"resize"}, defaults
			            ));
			            map.addLayer(fmzk);
			            zoomToInitialExtent();
			        }
			    });
				markerLayer = new OpenLayers.Layer.Markers();
				map.addLayer(markerLayer);

			},
			updateLayer = function(dataId){
				//TODO:
				//	-	Optimize animations
				//
				markerLayer.clearMarkers();

				// load data if doesn't exist + create lonlat objects
				if(!data[dataId]){
					$.getJSON(dataUrls[dataId], function(response) {
						var res = [];
						
						$.each(response.features, function(key, value) {
							var lonlat = value.geometry.coordinates;
							// we need to add the datapoints transformed into the same projection as the base layer projection
							res.push(new OpenLayers.LonLat( lonlat[0], lonlat[1]).transform(normalProjection, baseProjection));
						});


						data[dataId] = res;
						updateLayer(dataId);
					});
				}
				var timeMs = 2000 / $(data[dataId]).size();

				var size = new OpenLayers.Size(20,20);
				var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
				var icon = new OpenLayers.Icon(dataIcons[dataId], size, offset);
				


				// animate markers on layer
				$(data[dataId]).each(function(index){
					
					setTimeout(function(){
						markerLayer.addMarker(new OpenLayers.Marker(data[dataId][index],icon.clone()));
					}, timeMs*index);

				});
			};

		return {
			init: init
		}
	}());


	viz["PublicTransport"] = (function(){
		var map = null,
			normalProjection = null,
			baseProjection = null,
			markerLayer = null,
			fmzk = null,
			init = function() {
				// Defaults for the WMTS layers
			    var defaults = {
			        zoomOffset: 12,
			        requestEncoding: "REST",
			        matrixSet: "google3857",
			        attribution: '<div style="background:white;">Datenquelle: Stadt Wien - <a href="http://data.wien.gv.at">data.wien.gv.at</a></div>'
			    };
				map = new OpenLayers.Map({
			    	div: "ptMap",
			        theme: null,
			        projection: "EPSG:3857",
			        units: "m",
			        maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
			        maxResolution: 156543.0339,
			        controls: [
			            new OpenLayers.Control.Attribution()
			        ]
				});
				baseProjection = new OpenLayers.Projection("EPSG:3857");
				normalProjection = new OpenLayers.Projection("EPSG:4326");
				function zoomToInitialExtent() {
			        map.setCenter(new OpenLayers.LonLat(1819237.393019, 6142104.9771083), 12);
			    };

			   
			    OpenLayers.Request.GET({
			        url: "misc/WMTSCapabilities.xml",
			        success: function(request) {
			            var format = new OpenLayers.Format.WMTSCapabilities();
			            var defaults = {
			                requestEncoding: "REST",
			                matrixSet: "google3857",
			        		attribution: '<div style="background:white;padding:3px;">Datenquelle: Stadt Wien - <a href="http://data.wien.gv.at">data.wien.gv.at</a></div>'
			            };
			            var doc = request.responseText,
			                caps = format.read(doc);
			            fmzk = format.createLayer(caps, OpenLayers.Util.applyDefaults(
			                {layer:"fmzk", requestEncoding:"REST", transitionEffect:"resize"}, defaults
			            ));

			            labels = format.createLayer(caps, OpenLayers.Util.applyDefaults(
			                {layer:"beschriftung", requestEncoding:"REST", isBaseLayer: false},
			                defaults
			            ));
			            map.addLayers([fmzk, labels]); 
			            map.addLayer(fmzk);
			            zoomToInitialExtent();
			        }
			    });
				

				var size = new OpenLayers.Size(18,18);
				var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
				var icon = new OpenLayers.Icon("img/icons/bim.png", size, offset);

				var georss2 = new OpenLayers.Layer.GeoRSS(0, 'misc/strassenbahnen_.xml', {
					icon: icon
				});

				setTimeout(function(){ 
					//extremely ugly
					$.each(georss2.markers, function(key,value){
						// EXTREMELY TERRIFYING UGLY!!!
						value.lonlat = new OpenLayers.LonLat(value.lonlat.lon, value.lonlat.lat).transform(normalProjection, baseProjection);
						georss2.addMarker(value);
					});

				 }, 1500);
				
				map.addLayer(georss2);
				var size = new OpenLayers.Size(18,18);
				var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
				var icon = new OpenLayers.Icon("img/icons/ubahn.png", size, offset);

				var georss = new OpenLayers.Layer.GeoRSS(0, 'misc/ubahnen.xml', {
					icon: icon
				});

				setTimeout(function(){ 
					//extremely ugly
					$.each(georss.markers, function(key,value){
						// EXTREMELY TERRIFYING UGLY!!!
						value.lonlat = new OpenLayers.LonLat(value.lonlat.lon, value.lonlat.lat).transform(normalProjection, baseProjection);
						georss.addMarker(value);
					});

				 }, 1500);
				
				map.addLayer(georss);

			};
		return {
			init: init
		}
	}());



    viz["Population"] = (function(){
            var map = null,
                normalProjection = null,
                baseProjection = null,
                markerLayer = null,
                fmzk = null,
                init = function() {
                                
                var margin = {top: 20, right: 40, bottom: 30, left: 20},
                    width = 600 - margin.left - margin.right,
                    height = 300 - margin.top - margin.bottom,
                    barWidth = Math.floor(width / 19) - 1;

                var x = d3.scale.linear()
                    .range([barWidth / 2, width - barWidth / 2]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("right")
                    .tickSize(-width)
                    .tickFormat(function(d) { return Math.round(d / 1e6) + "M"; });

                // An SVG element with a bottom-right origin.
                var svg = d3.select("#population").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // A sliding container to hold the bars by birthyear.
                var birthyears = svg.append("g")
                    .attr("class", "birthyears");

                // A label for the current year.
                var title = svg.append("text")
                    .attr("class", "title")
                    .attr("dy", ".71em")
                    .text(2000);

                d3.csv("data/population.csv", function(error, data) {

                  // Convert strings to numbers.
                  data.forEach(function(d) {
                    d.people = +d.people;
                    d.year = +d.year;
                    d.age = +d.age;
                  });

                  // Compute the extent of the data set in age and years.
                  var age1 = d3.max(data, function(d) { return d.age; }),
                      year0 = d3.min(data, function(d) { return d.year; }),
                      year1 = d3.max(data, function(d) { return d.year; }),
                      year = year1;

                  // Update the scale domains.
                  x.domain([year1 - age1, year1]);
                  y.domain([0, d3.max(data, function(d) { return d.people; })]);

                  // Produce a map from year and birthyear to [male, female].
                  data = d3.nest()
                      .key(function(d) { return d.year; })
                      .key(function(d) { return d.year - d.age; })
                      .rollup(function(v) { return v.map(function(d) { return d.people; }); })
                      .map(data);

                  // Add an axis to show the population values.
                  svg.append("g")
                      .attr("class", "y axis")
                      .attr("transform", "translate(" + width + ",0)")
                      .call(yAxis)
                    .selectAll("g")
                    .filter(function(value) { return !value; })
                      .classed("major", true);

                  // Add labeled rects for each birthyear (so that no enter or exit is required).
                  var birthyear = birthyears.selectAll(".birthyear")
                      .data(d3.range(year0 - age1, year1 + 1, 5))
                    .enter().append("g")
                      .attr("class", "birthyear")
                      .attr("transform", function(birthyear) { return "translate(" + x(birthyear) + ",0)"; });

                  birthyear.selectAll("rect")
                      .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
                    .enter().append("rect")
                      .attr("x", -barWidth / 2)
                      .attr("width", barWidth)
                      .attr("y", y)
                      .attr("height", function(value) { return height - y(value); });

                  // Add labels to show birthyear.
                  birthyear.append("text")
                      .attr("y", height - 4)
                      .text(function(birthyear) { return birthyear; });

                  // Add labels to show age (separate; not animated).
                  svg.selectAll(".age")
                      .data(d3.range(0, age1 + 1, 5))
                    .enter().append("text")
                      .attr("class", "age")
                      .attr("x", function(age) { return x(year - age); })
                      .attr("y", height + 4)
                      .attr("dy", ".71em")
                      .text(function(age) { return age; });

                  // Allow the arrow keys to change the displayed year.
                  window.focus();
                  d3.select(window).on("keydown", function() {
                    switch (d3.event.keyCode) {
                      case 37: year = Math.max(year0, year - 10); break;
                      case 39: year = Math.min(year1, year + 10); break;
                    }
                    update();
                  });

                  function update() {
                    if (!(year in data)) return;
                    title.text(year);

                    birthyears.transition()
                        .duration(750)
                        .attr("transform", "translate(" + (x(year1) - x(year)) + ",0)");

                    birthyear.selectAll("rect")
                        .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
                      .transition()
                        .duration(750)
                        .attr("y", y)
                        .attr("height", function(value) { return height - y(value); });
                  }
                });

                Raphael.fn.pieChart = function (cx, cy, r, values, labels, stroke) {
                    var paper = this,
                        rad = Math.PI / 180,
                        chart = this.set();
                    function sector(cx, cy, r, startAngle, endAngle, params) {
                        var x1 = cx + r * Math.cos(-startAngle * rad),
                            x2 = cx + r * Math.cos(-endAngle * rad),
                            y1 = cy + r * Math.sin(-startAngle * rad),
                            y2 = cy + r * Math.sin(-endAngle * rad);
                        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
                    }
                    var angle = 0,
                        total = 0,
                        start = 0,
                        process = function (j) {
                            var value = values[j],
                                angleplus = 360 * value / total,
                                popangle = angle + (angleplus / 2),
                                color = Raphael.hsb(start, .4, 1),
                                ms = 500,
                                delta = 30,
                                bcolor = Raphael.hsb(start, 1, .5),
                                p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 3}),
                                txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 0, "font-size": 20});
                            p.mouseover(function () {
                                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
                                txt.stop().animate({opacity: 1}, ms, "elastic");
                            }).mouseout(function () {
                                p.stop().animate({transform: ""}, ms, "elastic");
                                txt.stop().animate({opacity: 0}, ms);
                            });
                            angle += angleplus;
                            chart.push(p);
                            chart.push(txt);
                            start += .05;
                        };
                    for (var i = 0, ii = values.length; i < ii; i++) {
                        total += values[i];
                    }
                    for (i = 0; i < ii; i++) {
                        process(i);
                    }
                    return chart;
                };



                $(function () {
                    //data source: http://data.wien.gv.at/katalog/bevoelkerung-geburtsland-bezirke.html
                    var values = [ 68.258606966, 5.9608681534,  3.8664034505, 2.4871049962, 2.3310143878, 1.9963046296, 0.5393056956, 1.3346436669, 1.0145889547, 0.9098197429, 11.3013393563],
                        labels = ["Austria","Serbia and Montenegro","Turkey","Germany","Poland",          "Bosnia","Croatia","Romania",       "Czech Republic",   "Hungary",  "Other"];
                        
                    Raphael("holder", 700, 700).pieChart(350, 350, 200, values, labels, "#fff");
                });

            };
        return {
            init: init
        }
    }());




}(this));