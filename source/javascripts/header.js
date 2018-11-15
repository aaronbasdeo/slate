$(document).ready(function() {
	var i = 0;
	var responsiveBreakPoint = 1073;

	$(this).find('.subnav').hide();
	$('.primary-header-left-ul-li a').css('color', '#a2a2a2');
	$('.appdirect_dark_logo').css('display', 'block');
	$('.appdirect_light_logo').css('display', 'none');

	//////////////////////////////////////////////////////////////////
	////// Top-Right side hamburger icon hide and show for mobile view
	//////////////////////////////////////////////////////////////////

	$(document).on('click', 'body', function(e) {
		if ($(window).width() <= responsiveBreakPoint) {
			if ($(e.target).attr('id') !== "hide_menu") {
				$('.primary-header-right-ul').hide();
				$('#hide_menu').removeClass('active');
			}
		}
	});
	$('#hide_menu').click(function() {
		$(this).toggleClass('active');
		$('.primary-header-right-ul').toggle();
	});
	$(window).resize(function() {
		if ($(window).width() > responsiveBreakPoint) {
			if ($('#hide_menu').hasClass('active')) {
				$('#hide_menu').removeClass('active');
				$(".primary-header-right-ul").css('display', 'flex');
			}
			$(".primary-header-right-ul").show();
		} else {
			if ($('#hide_menu').hasClass('active')) {
				$(".primary-header-right-ul").show();
			} else {
				$(".primary-header-right-ul").hide();
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////////
		////// Open user guide menu on hover for desktop + tablet view and on click for mobile view
		////////////////////////////////////////////////////////////////////////////////////////////

		if ($(window).width() > responsiveBreakPoint) {
			donotpopulate();
			$('.subnav-li , .subnav').mouseover(function() {
				populate();
			});
			$('.subnav-li , .subnav').mouseout(function() {
				donotpopulate();
			});
		} else if ($(window).width() <= responsiveBreakPoint) {
			donotpopulate();
			$(document).on('click', 'body', function(event) {
				if ($(event.target).attr('id') !== "userguidelink_id") {
					donotpopulate();
					i = 0;
				}
			});
			$('.subnav-li').click(function() {
				if (i == 0) {
					populate();
					i = 1;
				} else {
					donotpopulate();
					i = 0;
				}
			});
		}
	}).trigger('resize');

	///////////////////////////////////////////////////////////////////////////////////////////////
	/////////// functions of populate and non-populate
	//////////////////////////////////////////////////////////////////////////////////////////////


	function populate() {
		$('.subnav').show();
		$('.subnav-li').removeClass('donotpopulate_subnav');
		$('.subnav-li').addClass('populate_subnav');
		$('.userguidelink').removeClass('donotpopulate_user_guide_link');
		$('.userguidelink').addClass('populate_user_guide_link');
	}

	function donotpopulate() {
		$('.subnav').hide();
		$('.subnav-li').removeClass('populate_subnav');
		$('.subnav-li').addClass('donotpopulate_subnav');
		$('.userguidelink').removeClass('populate_user_guide_link');
		$('.userguidelink').addClass('donotpopulate_user_guide_link');
	}
	///////////////////////////////////////////////////////////////////////////////
	///////////// Changing top-left side appdirect logo on hover
	//////////////////////////////////////////////////////////////////////////////


	$('.logo-li').mouseover(function() {

		$('.appdirect_dark_logo').css('display', 'none');
		$('.appdirect_light_logo').css('display', 'block');

	});
	$('.logo-li').mouseout(function() {

		$('.appdirect_dark_logo').css('display', 'block');
		$('.appdirect_light_logo').css('display', 'none');

	});

	$(document).on('click', 'body', function(e) {
		if ($(window).width() <= responsiveBreakPoint) {
			if (($(e.target).attr('id') !== "search_menu") && ($(e.target).attr('id') !== "search_image") && ($(e.target).attr('id') !== "search-val")) {
				$('.header-search-result').hide();
				$('#search_menu').removeClass('active');
			}
		}
	});

	$('#search_menu').click(function() {
		$(this).toggleClass('active');
		$('.header-search-result').toggle();
	});
});

document.onreadystatechange = function() {
	if (document.readyState == 'complete') {
		$('#load').css('display', 'none');
	}


 (function() 
 	{
 		var walkme = document.createElement('script'); 
 		walkme.type = 'text/javascript';
 		walkme.async = true;
 		walkme.src = 'https://cdn.walkme.com/users/7d99ba68b982471c851b1260868b2859/walkme_7d99ba68b982471c851b1260868b2859_https.js'; 
 		var s = document.getElementsByTagName('script')[0]; 
 		s.parentNode.insertBefore(walkme, s); 
 		window._walkmeConfig ={smartLoad:true}; 
 	}
 )();

	
 (function()
	{
        window.heap=window.heap||[],heap.load=function(e,t)
        {
        	window.heap.appid=e,window.heap.config=t=t||{};
        	var r=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");
        	a.type="text/javascript",a.async=!0,a.src=(r?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";
        	var n=document.getElementsByTagName("script")[0];
        	n.parentNode.insertBefore(a,n);
        	for(var o=function(e)
        		{return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","removeEventProperty","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=o(p[c])
        };
        heap.load("169561623");
	}
)();
}
