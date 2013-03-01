$(document).ready(function(){

	var viz = window["DataVIZ"];


	// at first, initialize the "slide" interactions with scrollarama
    var sr = $.scrollorama({
    	blocks: 'section',
    	enablePin: false
	});

	var block = {
		"0": function(){
			
		},
		"1": function(){
			
		}
	};

	sr.onBlockChange(function(){
		var index = sr.blockIndex;

		if(block[index]) {
			block[index]();
		}

	});

	$('#btn_slide1').click(function(){
		$(window).scrollTo($('#cultural'), 500);
	});

	// initialize all the visualizations
	for(var key in viz){
		if(viz.hasOwnProperty(key)){
			viz[key].init();
		}
	}


});