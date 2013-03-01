;(function(w){
	
	if(!w["DataVIZ"]) var viz = w["DataVIZ"] = {};


	// DataVIZ is an object containing all the visualizations.
	// each visualization has 
	// 	-	a data endpoint / own data
	// 	-	to be internally initialized ()
	// 	-	custom interactions



	viz["CultureHotspots"] = (function(){

		var	map = null,
			init = function(){

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
			            zoomToInitialExtent();
			        }
			    });

			};

		return {
			init: init
		}
	}());


	viz["PublicTransport"] = (function(){

		return {
			init: function(){

			}
		}
	}());


	viz[""]

}(this));