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
				map = L.map('cultureMap', {
				    center: [51.505, -0.09],
				    zoom: 13
				});
				L.tileLayer('http://maps1.wien.gv.at/wmts/lb/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg', {
				    style: 'farbe',
				    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
				    maxZoom: 18
				}).addTo(map);
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