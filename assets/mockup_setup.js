steal(
	'jquery-1.11.1.min.js'
).then(
	'jquery-ui.js'
).then(
	'bootstrap.min.js',
	'bootstraptable/bootstrap-table.js',
	'jquery.sidr.min.js',
	'typeahead.jquery.min.js',
	'selectivity/selectivity-full.min.css',
	'selectivity/selectivity-full.min.js'
).then(function() {



	////
	//// Setup our mockup-displays
	////
	//  Find all the displayable <divs>
	var allDisplays = $('.mockup-display');
	var showIt = function( whichOne ) {

		allDisplays.each(function(indx, el){

			var $el = $(el);
			if ($el.hasClass(whichOne)) {
				$el.show();
			} else { 
				$el.hide();
			}
		})

	}

	// for each element that has a mockup-show="displayableDiv" attribute
	$('[mockup-show]').each(function(indx, el){

		// when it is clicked, then make sure only that div is shown
		var $el = $(el);
		$el.click(function(){
			showIt($el.attr('mockup-show'));
		})
	})




	//Active InActive of Links

    
    // $("ul.art-hmenu>li").on("click", "a", function (event) {
    //     $("#menu_wrapper .activelink").removeClass("activelink");
    //     $(this).addClass("activelink");
    // });





	//// 
	//// setup any tooltips
	////
	$('[data-toggle="tooltip"]').tooltip()




 
	/////
	///// Setup Typeahead Search Bars
	/////

    var inputs = [ '.en-reciepient-search'];
    inputs.forEach(function(tag){

		$(tag)
		.typeahead({
	        hint: true,
	        highlight: true,
	        minLength: 1
	    },
	    {
	        name: 'filter',
	        displayKey: 'value',
	        source: function(q,cb) {
	            cb([
	            	{ value: 'example 1'},
	            	{ value: 'examine'},
	            	{ value: 'exajerate'}
	            ]);
	        }
	    });

	});







	////
	//// Setup selctivity on this input:
	////


	var inputs = ['#image-tags'];
	inputs.forEach(function(el){
		var $el = $(el);

		$el.selectivity({
            items: [ {id:0, text:'no items loaded' }],
            multiple: true,
            placeholder:'people in photo'
        });
        // $el.on('change', function(obj, a, b) {
                
        // })
        $el.on('selectivity-close', function() {
        	$el.css('z-index', 999);  // fix z position bug!
        })
        $el.css('z-index', 999);
	})



	// For Testing Display with lots of entries in our Tables:  
	// copy the last row x20 

    var allTables = $('table');
    allTables.each(function(i, table){
    	var $table = $(table);
    	var lastRow = $table.find('tr:last');
    	var tBody = $table.find('tbody');
    	for (var i=1; i<=20; i++) {
    		tBody.append(lastRow.clone());
    	} 
    })
	





	/////
	///// Setup bootstrap-table on these tables:
	/////

	var tables = [ '.table-notifications' ]
    
    tables.forEach(function(tag){
    	$(tag).bootstrapTable({});
    })


    ////
	//// Document Resizing:
	////
	$(window).resize(function(){

		// figure out the availableHeight to our Tool
		var hWindow = $(window).height();
		var hMasthead = $('.opsportal-container-masthead').outerHeight(true);
		var availableHeight = hWindow  - hMasthead; 

		// find all elements with a [resize-adj] attribute
		$('[resize-adj]').each(function(indx, el){

			var $el = $(el);
			var adj = parseInt($el.attr('resize-adj'), 10);

			$el.css('height', (availableHeight+adj) + 'px');
		})

	})



	// start by showing this <div>
	showIt('en-portal');


})  // end steal()
