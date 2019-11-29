$(document).ready(function() {

	var primaryHeaderWidth = 0;
	primaryHeaderWidth = document.getElementById("header").offsetWidth;
	$('#header').css('max-width', primaryHeaderWidth);
	$(window).resize(function() {
		primaryHeaderWidth = $(window).width();
		$('#header').css('max-width', primaryHeaderWidth);
	});

	$('#search-val').keyup(function(e) {

		var input = $('#search-val').val();

		if (input.length > 0) {
			$('.header-search-result').addClass('search-val-hover');
		} else if ((input.length == 0) && $('.header-search-result').hasClass('search-val-hover')) {
			$('.header-search-result').removeClass('search-val-hover');
		}

		if (e.keyCode == 13 && input.length > 0) {
			window.location.href = "searchPage.html?search=" + input;
		}
	});

	if ($('#back-to-top').length) {
		var scrollTrigger = 200;

		function backtotop() {
			var scrollTop = $(window).scrollTop();

			if (scrollTop > scrollTrigger) {
				$('#back-to-top').addClass('show');
			} else {
				$('#back-to-top').removeClass('show');
			}
		}

		$(window).on('scroll', function() {
			backtotop();
		});

		$('#back-to-top').click(function(e) {
			e.preventDefault();
			$('html,body').animate({
				scrollTop: 0
			}, 0);
		});
	}

});
