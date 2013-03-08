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
				updateLayer("d0");
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

				var transf = function(){
					$.each(georss2.markers, function(key,value){
						// EXTREMELY TERRIFYING UGLY!!!
						value.lonlat = new OpenLayers.LonLat(value.lonlat.lon, value.lonlat.lat).transform(normalProjection, baseProjection);
						georss2.addMarker(value);
					});
				}

				setTimeout(function(){ 
					//extremely ugly
					if(georss2.markers.length == 0){
						setTimeout(transf, 1500);
					}else{
						transf();
					}

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

    viz["PopulationByCountryOfBirth"] = (function(){
            var map = null,
                normalProjection = null,
                baseProjection = null,
                markerLayer = null,
                fmzk = null,
                init = function() {
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
                        
                    Raphael("population", 700, 700).pieChart(200, 200, 150, values, labels, "#fff");
                });

            };
        return {
            init: init
        }
    }());
    
    viz["GDP"] = (function(){
            var map = null,
                normalProjection = null,
                baseProjection = null,
                markerLayer = null,
                fmzk = null,
                init = function() {
			Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
			color = color || "#000";
			var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
			    rowHeight = h / hv,
			    columnWidth = w / wv;
			for (var i = 1; i < hv; i++) {
			    path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
			}
			for (i = 1; i < wv; i++) {
			    path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
			}
			return this.path(path.join(",")).attr({stroke: color});
		    };
		    
		    
		    window.onload = function () {
			function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
			    var l1 = (p2x - p1x) / 2,
				l2 = (p3x - p2x) / 2,
				a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
				b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
			    a = p1y < p2y ? Math.PI - a : a;
			    b = p3y < p2y ? Math.PI - b : b;
			    var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
				dx1 = l1 * Math.sin(alpha + a),
				dy1 = l1 * Math.cos(alpha + a),
				dx2 = l2 * Math.sin(alpha + b),
				dy2 = l2 * Math.cos(alpha + b);
			    return {
				x1: p2x - dx1,
				y1: p2y + dy1,
				x2: p2x + dx2,
				y2: p2y + dy2
			    };
			}
			// Grab the data
			var labels = [1995,1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004,2005,2006,2007,2008],
			    data = [31800,32700,32800,34200,35300,36600,37400,38400,38400,38900,40000,41700,43500,44700];
			
			// Draw
			var width = 450,
			    height = 250,
			    leftgutter = 30,
			    bottomgutter = 20,
			    topgutter = 20,
			    colorhue = .5 || Math.random(),
			    color = "hsl(" + [colorhue, .5, .5] + ")",
			    r = Raphael("gdp", width, height),
			    txt = {font: '11px Helvetica, Arial', fill: "#999"},
			    txt1 = {font: '10px Helvetica, Arial', fill: "#fff"},
			    txt2 = {font: '12px Helvetica, Arial', fill: "#000"},
			    X = (width - leftgutter) / labels.length,
			    max = Math.max.apply(Math, data),
			    Y = (height - bottomgutter - topgutter) / max;
			r.drawGrid(leftgutter + X * .5 + .5, topgutter + .5, width - leftgutter - X, height - topgutter - bottomgutter, 10, 10, "#eee");
			var path = r.path().attr({stroke: color, "stroke-width": 4, "stroke-linejoin": "round"}),
			    bgp = r.path().attr({stroke: "none", opacity: .3, fill: color}),
			    label = r.set(),
			    lx = 0, ly = 0,
			    is_label_visible = false,
			    leave_timer,
			    blanket = r.set();
			label.push(r.text(60, 12, "24000 Euro").attr(txt));
			label.push(r.text(60, 27, "2008").attr(txt1).attr({fill: color}));
			label.hide();
			var frame = r.popup(100, 100, label, "right").attr({fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .7}).hide();
		    
			var p, bgpp;
			for (var i = 0, ii = labels.length; i < ii; i++) {
			    var y = Math.round(height - bottomgutter - Y * data[i]),
				x = Math.round(leftgutter + X * (i + .5)),
				t = r.text(x, height - 6, labels[i]).attr(txt).toBack();
			    if (!i) {
				p = ["M", x, y, "C", x, y];
				bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
			    }
			    if (i && i < ii - 1) {
				var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
				    X0 = Math.round(leftgutter + X * (i - .5)),
				    Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
				    X2 = Math.round(leftgutter + X * (i + 1.5));
				var a = getAnchors(X0, Y0, x, y, X2, Y2);
				p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
				bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
			    }
			    var dot = r.circle(x, y, 4).attr({fill: "#ccc", stroke: color, "stroke-width": 2});
			    blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
			    var rect = blanket[blanket.length - 1];
			    (function (x, y, data, lbl, dot) {
				var timer, i = 0;
				rect.hover(function () {
				    clearTimeout(leave_timer);
				    var side = "right";
				    if (x + frame.getBBox().width > width) {
					side = "left";
				    }
				    var ppp = r.popup(x, y, label, side, 1),
					anim = Raphael.animation({
					    path: ppp.path,
					    transform: ["t", ppp.dx, ppp.dy]
					}, 200 * is_label_visible);
				    lx = label[0].transform()[0][1] + ppp.dx;
				    ly = label[0].transform()[0][2] + ppp.dy;
				    frame.show().stop().animate(anim);
				    label[0].attr({text: data + " Euro"}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
				    label[1].attr({text: lbl + ""}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
				    dot.attr("r", 6);
				    is_label_visible = true;
				}, function () {
				    dot.attr("r", 4);
				    leave_timer = setTimeout(function () {
					frame.hide();
					label[0].hide();
					label[1].hide();
					is_label_visible = false;
				    }, 1);
				});
			    })(x, y, data[i], labels[i], dot);
			}
			p = p.concat([x, y, x, y]);
			bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
			path.attr({path: p});
			bgp.attr({path: bgpp});
			frame.toFront();
			label[0].toFront();
			label[1].toFront();
			blanket.toFront();
		    };
            };
        return {
            init: init
        }
    }());


}(this));