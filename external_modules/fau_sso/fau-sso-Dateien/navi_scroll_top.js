if (window.jQuery) {
	$(function(){
		
		var topMenu = $('#pp-mainMenu');
		var topMenuHeight = topMenu.height(); // =40
		var topMenuOffset = 100;
		var windowHeight;
    	var topMenuTop = 0;

		var leftContainer = $('#pp-leftContainer');
		var leftContainerHeight = leftContainer.height();
		
		var mobileMenuContainer = $('#pp-mobileMenuContainer');
		var leftNaviLess = $( 'body' ).hasClass('pp-withoutLeftNavi');
		
		// recalibrate values
		var recalibrate = function() {
			windowHeight = $(window).height();
			topMenuOffset = 100;
			if(isMobile()) {
				topMenuOffset = 0;
			}
		}
		
	    $(window).scroll(function() {
	    	sticky_menus();
	    });
	    
	    // recalibrate after resize to capture switch mobile <-> normal
	    $(window).resize(function() {
	    	recalibrate();
	    	sticky_menus();
	    	check_height();
	    });
	    
	    var isMobile = function() {
	    	return (!$('#pp-header').is(':visible'));
	    };

	    // menu must be scrollable even if it is higher than content
	    var check_height = function() {
	    	var menuHeight = isMobile()?
	    			(mobileMenuContainer.is(':visible')?mobileMenuContainer.height():0):
	    				leftContainer.height();
	    	if(menuHeight > $( '#pp-content').height()) {
	    		$( '#pp-page').css({'min-height': (menuHeight+100)+"px"});
	    	}
	    	else {
	    		$( '#pp-page').css({'min-height': ''});
	    	}
	    }	    
	    
	    var sticky_menus = function() {
	    	var scroll_top = $(window).scrollTop();
	    	sticky_topMenu(scroll_top);
	    	if(!isMobile()) {
	    		sticky_leftContainer(scroll_top);
	    		if(mobileMenuContainer.is(':visible')) { // desktop -> drag small, click on burger -> drag wide
	            	mobileMenuContainer.addClass('pp-up');
	            	mobileMenuContainer.removeClass('pp-down');
	    			mobileMenuContainer.hide();
	    		}
	    	}
	    	else if(mobileMenuContainer.is(':visible')) {
	    		sticky_mobileContainer(scroll_top);
	    	}
	    };
	    
	    var sticky_topMenu = function(scroll_top) {
	    	topMenuTop = Math.max(topMenuOffset - scroll_top, 0);
	    	$('#pp-header').css({'top': (topMenuTop-100)+"px"});
	    	topMenu.css({'top': topMenuTop+"px"});
	    };
	    
		var sticky_mobileContainer = function(scroll_top) {
			var contentHeight = windowHeight - 100; // topMenuHeight: 40 + footer: 50 + space: 10
			// mobileMenu higher than content?
			var overlay =  Math.max(mobileMenuContainer.height() - contentHeight, 0);
			var newMobileContainerTop = Math.max(topMenuOffset - scroll_top, (overlay*-1))+40;
			mobileMenuContainer.css({ 'position': 'fixed', 'top': newMobileContainerTop+"px"});			
		};	
		
	    var sticky_leftContainer = function(scroll_top) {
	    	var contentHeight = windowHeight - 100;
	    	var overlay =  Math.max(leftContainer.height() - contentHeight, 0);
	    	var newLeftContainerTop = Math.max(topMenuOffset - scroll_top, (overlay*-1))+57;
	    	var pageOffset = $( '#pp-page').offset();
	    	var newLeftContainerLeft = Math.round(pageOffset.left-$(window).scrollLeft());
	    	leftContainer.css({ 'position': 'fixed', 'top': newLeftContainerTop+"px", left: newLeftContainerLeft+"px"});
	    };
	    
	    /* MOBILE MENU STUFF */
		// open and close mobile menu
		// hide it on load
	    var init_mobileMenu = function() {
//	    	mobileMenuContainer.css( 'display', 'none' ).css('position', 'fixed');
	        $('.pp-showMainMenu').addClass('pp-up');
	        $('.pp-showMainMenu > img').click(function() {
	        	// Show normal Menu when pp-withoutLeftNavi
	        	if(leftNaviLess && !isMobile()) {
	        		if ($( 'body' ).hasClass('pp-withoutLeftNavi'))
	        			$( 'body' ).removeClass('pp-withoutLeftNavi')
	        		else
	        			$( 'body' ).addClass('pp-withoutLeftNavi')
	        	}
	        	else {
		            if (mobileMenuContainer.hasClass('pp-down')) {
		            	mobileMenuContainer.slideUp(400, check_height);
		            	mobileMenuContainer.addClass('pp-up');
		            	mobileMenuContainer.removeClass('pp-down');
			        } else {
			        	mobileMenuContainer.slideDown(400, check_height);
			        	mobileMenuContainer.addClass('pp-down');
			        	mobileMenuContainer.removeClass('pp-up');
			        	sticky_menus();
		            }
	        	}
	        });
	    };
	    
		// open and close mobile menu entries
		$(function() {
	        $('#pp-mobileMenu').addClass('pp-up');
	        $('.pp-mobileNavButton').click(function( event ) {
	        	var subUl = $( this ).closest("li").children("ul").first();
	            if (subUl.hasClass('pp-down')) {
	            	subUl.slideUp(400, check_height);
		            subUl.addClass('pp-up');
		            subUl.removeClass('pp-down');
		            $( this ).addClass("pp-iconUp");
		            $( this ).removeClass("pp-iconDown");
		            $( this ).html("&#x25BA;");
		            event.stopPropagation();
		            event.preventDefault();
		        } else {
		            subUl.slideDown(400, check_height);
		            subUl.addClass('pp-down');
		            subUl.removeClass('pp-up');
		            $( this ).addClass("pp-iconDown");
		            $( this ).removeClass("pp-iconUp");
		            $( this ).html("&#x25BC;");
		            event.stopPropagation();
		            event.preventDefault();
	            }
	        });
	    }); 
	    
	    recalibrate();
	    check_height();
	    init_mobileMenu();
    	if(leftNaviLess) {
    		$( '.pp-showMainMenu').show();
    	}
    	sticky_menus();
	});
}
