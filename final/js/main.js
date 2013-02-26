$(document).ready(function(){

	var viz = window["DataVIZ"];


	// at first, initialize the "slide" interactions with scrollarama
    var sr = $.scrollorama({
    	blocks: 'section'
	});


	// initialize all the visualizations
	for(var key in viz){
		if(viz.hasOwnProperty(key)){
			viz[key].init();
		}
	}


});