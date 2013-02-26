$(document).ready(function(){

	var viz = window["DataVIZ"];


	// at first, initialize the "slide" interactions with scrollarama
    var sr = $.scrollorama({
    	blocks: 'section',
    	enablePin: false
	});

	var block = {
		"0": function(){
				console.log("hello world block1");
		},
		"1": function(){
			console.log("hello world block2");	
		}
	};

	sr.onBlockChange(function(){
		var index = sr.blockIndex;

		if(block[index]) {
			block[index]();
		}

	});


	// initialize all the visualizations
	for(var key in viz){
		if(viz.hasOwnProperty(key)){
			viz[key].init();
		}
	}


});