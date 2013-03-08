$(document).ready(function(){
    
    var viz = window["DataVIZ"];

    // at first, initialize the "slide" interactions with scrollarama
    var sr = $.scrollorama({
    	blocks: 'section',
    	enablePin: false
	});
    var once = true;

	var block = {
		"0": function(){
			
		},
		"1": function(){
			
		},
		"2": function() {

		if(once){
			once = false;
        // trigger the tram animation
        $('#tram').animate({
          left: -1410
        }, {
          duration:800,
          complete: function(){
          	
            sr.animate('#tram', {
              property: 'left',
              // this needs to be optimized based on screen height (dynamically get it with jquery?)
              delay:($('section')[2]).offsetTop - $($('section')[2]).height(),
              start: -1410,
              end: $(window).width(),
              duration:$($('section')[2]).height()
            });
          }
        });
	    }
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
	$('#btn_slide2').click(function(){
		$(window).scrollTo($('#public-transport'), 1000);
	});

	$("#msg").click(function(){
		$(window).scrollTo($('#economy'), 2000);
	});

	$("#btn_slide3").click(function(){
		$(window).scrollTo($('#finish'), 2000);
	});
	
	$("#c").click(function(){
	    $("#credits").fadeIn();
		
	});

	// initialize all the visualizations
	for(var key in viz){
		if(viz.hasOwnProperty(key)){
			viz[key].init();
		}
	}

	$('#parallax .parallax-layer').parallax({
	    mouseport: jQuery('#parallax'),
	    delay: 2000
	});
	$("#parallax div").each( function(index) {
	    $(this).css("opacity", (index+1)/3);
	});


});