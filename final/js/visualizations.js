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
        attribution: 'Datenquelle: Stadt Wien - <a href="http://data.wien.gv.at">data.wien.gv.at</a>'
    };
map = new OpenLayers.Map({
    div: "cultureMap",
        theme: null,
        projection: "EPSG:3857",
        units: "m",
        restrictedExtent: [1799448.394855, 6124949.747770, 1848250.442089, 6162571.828177],
        maxResolution: 38.21851413574219,
        numZoomLevels: 8,
        controls: [
            new OpenLayers.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true
                },
                zoomBoxEnabled: false
            }),
            new OpenLayers.Control.Attribution()
        ],
        eventListeners: {
            moveend: function() {
                // update anchor for permalinks
                var ctr = map.getCenter();
                window.location.hash = "x="+ctr.lon+"&y="+ctr.lat+"&z="+map.getZoom();
            }
        }
});
function zoomToInitialExtent() {
        var extent = fmzk.tileFullExtent,
            ctr = extent.getCenterLonLat(),
            zoom = map.getZoomForExtent(extent, true),
            params = OpenLayers.Util.getParameters("?"+window.location.hash.substr(1));
        OpenLayers.Util.applyDefaults(params, {x:ctr.lon, y:ctr.lat, z:zoom});
        map.setCenter(new OpenLayers.LonLat(params.x, params.y), params.z);
    	console.log('joo');
    }
    /*
var extent = new OpenLayers.Bounds(1799448.394855, 6124949.74777, 1848250.442089, 6162571.828177);
    defaults.tileFullExtent = extent;

fmzk = new OpenLayers.Layer.WMTS(OpenLayers.Util.applyDefaults({
        url: [
            "http://maps.wien.gv.at/wmts/fmzk/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg",
            "http://maps1.wien.gv.at/wmts/fmzk/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg",
            "http://maps2.wien.gv.at/wmts/fmzk/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg",
            "http://maps3.wien.gv.at/wmts/fmzk/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg",
            "http://maps4.wien.gv.at/wmts/fmzk/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg"
        ],
        layer: "fmzk",
        style: "pastell",
        transitionEffect: "resize"
    },
    defaults));
    aerial = new OpenLayers.Layer.WMTS(OpenLayers.Util.applyDefaults({
        url: [
            "http://maps.wien.gv.at/wmts/lb/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg",
            "http://maps1.wien.gv.at/wmts/lb/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg",
            "http://maps2.wien.gv.at/wmts/lb/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg",
            "http://maps3.wien.gv.at/wmts/lb/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg",
            "http://maps4.wien.gv.at/wmts/lb/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg"
        ],
        layer: "lb",
        style: "farbe",
        transitionEffect: "resize"
    },
    defaults));
    labels = new OpenLayers.Layer.WMTS(OpenLayers.Util.applyDefaults({
        url: [
            "http://maps.wien.gv.at/wmts/beschriftung/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png",
            "http://maps1.wien.gv.at/wmts/beschriftung/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png",
            "http://maps2.wien.gv.at/wmts/beschriftung/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png",
            "http://maps3.wien.gv.at/wmts/beschriftung/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png",
            "http://maps4.wien.gv.at/wmts/beschriftung/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"
        ],
        layer: "beschriftung",
        style: "normal",
        transitionEffect: "resize",
        isBaseLayer: false
    },
    defaults));
    map.addLayers([fmzk, aerial, labels]); */


    //OpenLayers.ProxyHost = "proxy.cgi?url=";    
    OpenLayers.Request.GET({
        url: "http://maps.wien.gv.at/wmts/1.0.0/WMTSCapabilities.xml",
        success: function(request) {
            var format = new OpenLayers.Format.WMTSCapabilities();
            var defaults = {
                requestEncoding: "REST",
                matrixSet: "google3857",
                attribution: 'Datenquelle: Stadt Wien - <a href="http://data.wien.gv.at">data.wien.gv.at</a>'
            };
            var doc = request.responseText,
                caps = format.read(doc);
            fmzk = format.createLayer(caps, OpenLayers.Util.applyDefaults(
                {layer:"fmzk", requestEncoding:"REST", transitionEffect:"resize"}, defaults
            ));
            aerial = format.createLayer(caps, OpenLayers.Util.applyDefaults(
                {layer:"lb", requestEncoding:"REST", transitionEffect:"resize"}, defaults
            ));
            labels = format.createLayer(caps, OpenLayers.Util.applyDefaults(
                {layer:"beschriftung", requestEncoding:"REST", isBaseLayer: false},
                defaults
            ));
            map.addLayers([fmzk, aerial, labels]);
            zoomToInitialExtent();
        }
    });

map.addControl(new OpenLayers.Control.LayerSwitcher());

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