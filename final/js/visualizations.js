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


	viz[""]

}(this));