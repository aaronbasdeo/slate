$(document).ready(function() {

	var container = " ";
	var radioClicked = 0;
	var showFiltersClick = 1;
	var searchClass = $('.search-result-title');
	var responsiveBreakPoint = 1073;
	var radio_Click = {
		all: false,
		api: false,
		documentation: false
	}
	var checkbox_Click = {
		market: false,
		billing: false,
		distribution: false,
		reseller: false,
		insights: false,
		wise: false
	}
	var sort_Click = {
		new: false,
		old: false
	}
	getUrlParameter();
	var query = getUrlParameter('search');
	searchOnPageLoad(query);

	$('#search-val').keyup(function(e) {

		var input = $('#search-val').val();
		addClassToSearchBar(input);

		if (e.keyCode == 13 && input.length > 0) {
			window.location.href = "searchPage.html?search=" + input;
		}
	});

	function searchOnPageLoad(query) {
		$('#search-val').attr('value', query);
		var input = query;
		var api = 'https://appwise.appdirect.com/api/v2/marketplaces/marketplace.appdirect.com/index/search?format=json&q=';
		var url = api + input + '&page_size=1000&marketplace_sections=DOCUMENTATION';

		var index = input.indexOf("sort:");
		if (index >= 0) {
			var searchArr = input.split(" sort:");
			searchArr = searchArr.slice(0, searchArr.length - 1);
			input = searchArr.join(" ");

			if (localStorage.getItem('sort') === 'new') {
				$(".index_new").attr('checked', 'checked');
			} else if (localStorage.getItem('sort') === 'old') {
				$(".index_old").attr('checked', 'checked');
			}
		} else {
			localStorage.setItem('store', 'fail');
			localStorage.clear();
		}

		$('html head').find('title').text(input + " - AppDirect Search");

		addClassToSearchBar(input);

		$('.search-result-title').empty();
		$('.search-image').css('display', 'block');
		$('.mobile-filters, .search-results').css('display', 'none');
		$('.index_All').prop('checked', true);

		$.getJSON(url, function(data) {
			if (data.response.docs.length > 0) {
				for (var i = 0; i < data.response.docs.length; i++) {

					var title = data.response.docs[i].title;
					var trimedTitle = getTrimedTitles(title);
					var getUrl = data.response.docs[i].url;
					var desc = data.response.docs[i].description.replace(new RegExp('\r?\n', 'g'), '<br />');
					container = data.response.docs;
					showResultToUser(getUrl, trimedTitle, desc);
				}
			} else {
				searchClass.append("<p class='no-result-message'>No results found for " + "'" + input + "'" + "</p>");
			}
			highlightKeyword(input);
			$('.search-heading').append("Search Results for " + "'" + input + "'");
			$('.search-results').css('display', 'flex');
			$('.search-image').css('display', 'none');
			if ($(window).width() <= responsiveBreakPoint) {
				$('#All_Mobile').prop('checked', true);
			}

			if (localStorage.getItem('store') === 'pass') {
				toggleClearFilterButton();

				if (localStorage.getItem('radio') === 'all') {
					radioClicked = 1;
					$(".index_All").prop('checked', true);
					setTrueForCurrentCheck('all');
					showContentFilterResult();
					backToSearchResults();
				}
				if (localStorage.getItem('radio') === 'api') {
					radioClicked = 1;
					$(".index_api").prop('checked', true);
					setTrueForCurrentCheck('api');
					showContentFilterResult();
					backToSearchResults();
				}
				if (localStorage.getItem('radio') === 'documentation') {
					radioClicked = 1;
					$(".index_documentation").prop('checked', true);
					setTrueForCurrentCheck('documentation');
					showContentFilterResult();
					backToSearchResults();
				}
				if (localStorage.getItem('checkbox_market') === 'market') {
					if ($(window).width() > responsiveBreakPoint) {
						$('#AppMarket').prop('checked', true);
					} else {
						$("#AppMarket_Mobile").prop('checked', true);
					}
					checkbox_Click['market'] = true;
					showProductFilterResult();
				}
				if (localStorage.getItem('checkbox_billing') === 'billing') {
					if ($(window).width() > responsiveBreakPoint) {
						$("#AppBilling").prop('checked', true);
					} else {
						$("#AppBilling_Mobile").prop('checked', true);
					}
					checkbox_Click['billing'] = true;
					showProductFilterResult();
				}
				if (localStorage.getItem('checkbox_distribution') === 'distribution') {
					if ($(window).width() > responsiveBreakPoint) {
						$("#AppDistribution").prop('checked', true);
					} else {
						$("#AppDistribution_Mobile").prop('checked', true);
					}
					checkbox_Click['distribution'] = true;
					showProductFilterResult();
				}
				if (localStorage.getItem('checkbox_reseller') === 'reseller') {
					if ($(window).width() > responsiveBreakPoint) {
						$("#AppReseller").prop('checked', true);
					} else {
						$("#AppReseller_Mobile").prop('checked', true);
					}
					checkbox_Click['reseller'] = true;
					showProductFilterResult();
				}
				if (localStorage.getItem('checkbox_insights') === 'insights') {
					if ($(window).width() > responsiveBreakPoint) {
						$("#AppInsights").prop('checked', true);
					} else {
						$("#AppInsights_Mobile").prop('checked', true);
					}
					checkbox_Click['insights'] = true;
					showProductFilterResult();
				}
				if (localStorage.getItem('checkbox_wise') === 'wise') {
					if ($(window).width() > responsiveBreakPoint) {
						$("#AppWise").prop('checked', true);
					} else {
						$("#AppWise_Mobile").prop('checked', true);
					}
					checkbox_Click['wise'] = true;
					showProductFilterResult();
				}
			}
		});
	}

	function addClassToSearchBar(input) {
		if (input.length > 0) {
			$('.header-search-result').addClass('search-val-hover-result');
		} else if ((input.length == 0) && $('.header-search-result').hasClass('search-val-hover-result')) {
			$('.header-search-result').removeClass('search-val-hover-result');
		}
	}

	function showResultToUser(getUrl, trimedTitle, desc) {
		filterTitleBaseOnUrl(getUrl);
		searchClass.append("<a class='search-title-append' href = " + getUrl + " target = '_blank'>" + "<p class='search-title-append-content'>" + trimedTitle + "</p>" + "</a>" + "<p class='search-highlight'>" + desc + "</p>");
	}

	function getTrimedTitles(title, input) {
		if (title == undefined) {
			searchClass.append("<p class='no-result-message'>No filtered results found for " + "'" + input + "'" + "</p>");
		}
		if (title.includes("AppWise API Reference") || title.includes("AppInsights API Reference") || title.includes("AppMarket API Reference") || title.includes("AppBilling API Reference") || title.includes("AppReseller API Reference")) {
			title = trimApiTitles(title);
		}
		return title;
	}

	function toggleClearFilterButton() {
		if ($(window).width() > responsiveBreakPoint) {
			$('.clear-all-filters').css('display', 'block');
		} else {
			$('.clear-all-filters-mobile').css('display', 'block');
		}
	}

	function backToSearchResults() {
		$('.mobile-filters').css('display', 'none');
		$('.mobile-filters').css('left', '1074px');
		$('.search-heading, .show-filters, .search-result-title').css('display', 'block');
		$('.search-wrapper').css('height', 'unset');
		$('.search-results').css('border-top', '1px solid #ddd');
		showFiltersClick = 1;
	}

	$('.show-filters').click(function() {
		$('.mobile-filters, .back-to-results').css('display', 'block');
		$('.mobile-filters').css('left', '1074px');
		$('.search-heading, .show-filters').css('display', 'none');
		$('.search-results').css('border-top', '0');
		var $inner = $(".mobile-filters");
		var extraWidth = $('.search-wrapper').width();

		if ($inner.position().left == 0) {
			$inner.animate({
				left: "+" + extraWidth
			}, 400);
		} else {
			$inner.animate({
				left: "25px"
			}, 400);
		}

		if (showFiltersClick) {
			$('.search-result-title').css('display', 'none');
			$('.search-wrapper').css('height', '650px')
			showFiltersClick = 0;
		} else {
			$('.search-result-title').css('display', 'block');
			$('.search-wrapper').css('height', 'unset')
			showFiltersClick = 1;
		}
	});

	$('.back-to-results').click(function() {
		backToSearchResults();
	});

	function showContentFilterResult() {
		var noResultFoundCheck = 0;
		toggleClearFilterButton();

		if (radio_Click['all'] === true) {
			$('.search-result-title').empty();
			var input = $('#search-val').val();

			for (var i = 0; i < container.length; i++) {
				var title = container[i].title;
				var trimedTitle = getTrimedTitles(title, input);
				var getUrl = container[i].url;
				var desc = container[i].description.replace(new RegExp('\r?\n', 'g'), '<br />');
				showResultToUser(getUrl, trimedTitle, desc);
				noResultFoundCheck = 1;
			}
			highlightKeyword(input);

		} else {
			$('.search-result-title').empty();
			var input = $('#search-val').val();
			for (var i = 0; i < container.length; i++) {

				var title = container[i].title;
				var trimedTitle = getTrimedTitles(title, input);
				var getUrl = container[i].url;
				var desc = container[i].description.replace(new RegExp('\r?\n', 'g'), '<br />');

				if (getUrl.indexOf("/api/") >= 0 && radio_Click['api'] === true) {
					showResultToUser(getUrl, trimedTitle, desc);
					noResultFoundCheck = 1;

				} else if (getUrl.indexOf("/api/") == -1 && radio_Click['documentation'] === true) {
					showResultToUser(getUrl, trimedTitle, desc);
					noResultFoundCheck = 1;
				}
			}
			highlightKeyword(input);
		}
		if (noResultFoundCheck == 0) {
			searchClass.append("<p class='no-result-message'>No filtered results found for " + "'" + input + "'" + "</p>");
		}
		if ($("[name='product']:checked").length) {
			showProductFilterResult();
		}
	}

	function setTrueForCurrentCheck(name) {
		Object.keys(radio_Click).forEach(function(element) {
			if (element != undefined && element != name) {
				radio_Click[element] = false;
			} else if (element != undefined && element === name) {
				radio_Click[element] = true;
				localStorage.setItem('radio', element);
			}
		});
	}

	$('.index_All').click(function() {
		radioClicked = 1;
		setTrueForCurrentCheck('all');
		showContentFilterResult();
		backToSearchResults();
	});

	$('.index_api').click(function() {
		radioClicked = 1;
		setTrueForCurrentCheck('api');
		showContentFilterResult();
		backToSearchResults();
	});

	$('.index_documentation').click(function() {
		radioClicked = 1;
		setTrueForCurrentCheck('documentation');
		showContentFilterResult();
		backToSearchResults();
	});

	function showProductFilterResult() {
		$('.search-result-title').empty();
		var input = $('#search-val').val();
		var noResultFoundCheck = 0;
		toggleClearFilterButton();

		for (var i = 0; i < container.length; i++) {

			var title = container[i].title;
			var trimedTitle = getTrimedTitles(title, input);
			var getUrl = container[i].url;
			var desc = container[i].description.replace(new RegExp('\r?\n', 'g'), '<br />');

			if ((getUrl.indexOf("/appmarket/") >= 0 || (getUrl.indexOf("/appmarket.html") >= 0 && (!$('.index_documentation').is(':checked')))) && checkbox_Click['market'] === true && (!$('.index_api').is(':checked'))) {
				showResultToUser(getUrl, trimedTitle, desc);
				noResultFoundCheck = 1;
			} else if (getUrl.indexOf("/appmarket.html") >= 0 && checkbox_Click['market'] === true && ($('.index_api').is(':checked'))) {
				showResultToUser(getUrl, trimedTitle, desc);
				noResultFoundCheck = 1;
			} else if ((getUrl.indexOf("/appbilling/") >= 0 || (getUrl.indexOf("/appbilling.html") >= 0 && (!$('.index_documentation').is(':checked')))) && checkbox_Click['billing'] === true && (!$('.index_api').is(':checked'))) {
				showResultToUser(getUrl, trimedTitle, desc);
				noResultFoundCheck = 1;
			} else if (getUrl.indexOf("/appbilling.html") >= 0 && checkbox_Click['billing'] === true && ($('.index_api').is(':checked'))) {
				showResultToUser(getUrl, trimedTitle, desc);
				noResultFoundCheck = 1;
			} else if (getUrl.indexOf("/appdistrib/") >= 0 && checkbox_Click['distribution'] === true && (!$('.index_api').is(':checked'))) {
				showResultToUser(getUrl, trimedTitle, desc);
				noResultFoundCheck = 1;
			} else if ((getUrl.indexOf("/appreseller/") >= 0 || (getUrl.indexOf("/appreseller.html") >= 0 && (!$('.index_documentation').is(':checked')))) && checkbox_Click['reseller'] === true && (!$('.index_api').is(':checked'))) {
				showResultToUser(getUrl, trimedTitle, desc);
				noResultFoundCheck = 1;
			} else if (getUrl.indexOf("/appreseller.html") >= 0 && checkbox_Click['reseller'] === true && ($('.index_api').is(':checked'))) {
				showResultToUser(getUrl, trimedTitle, desc);
				noResultFoundCheck = 1;
			} else if (getUrl.indexOf("/appinsights.html") >= 0 && checkbox_Click['insights'] === true && (!$('.index_documentation').is(':checked'))) {
				showResultToUser(getUrl, trimedTitle, desc);
				noResultFoundCheck = 1;
			} else if (getUrl.indexOf("/appwise.html") >= 0 && checkbox_Click['wise'] === true && (!$('.index_documentation').is(':checked'))) {
				showResultToUser(getUrl, trimedTitle, desc);
				noResultFoundCheck = 1;
			}
		}
		if (noResultFoundCheck == 0) {
			searchClass.append("<p class='no-result-message'>No filtered results found for " + "'" + input + "'" + "</p>");
		}

		highlightKeyword(input);

		if (checkbox_Click['market'] === false && (checkbox_Click['billing'] === false) && (checkbox_Click['distribution'] === false) && (checkbox_Click['reseller'] === false) && (checkbox_Click['insights'] === false) && (checkbox_Click['wise']) === false) {
			if (radioClicked === 0) {
				radio_Click['all'] = true;
			}
			showContentFilterResult();
		}
	}

	$('.index_appmarket').click(function() {
		checkbox_Click['market'] = !checkbox_Click['market'];
		if ($('.index_appmarket').is(":checked") === true) {
			localStorage.setItem('checkbox_market', 'market');
		} else {
			localStorage.setItem('checkbox_market', ' ');
		}
		showProductFilterResult();
	});

	$('.index_appbilling').click(function() {
		checkbox_Click['billing'] = !checkbox_Click['billing'];
		if ($('.index_appbilling').is(":checked") === true) {
			localStorage.setItem('checkbox_billing', 'billing');
		} else {
			localStorage.setItem('checkbox_billing', ' ');
		}
		showProductFilterResult();
	});

	$('.index_appdistribution').click(function() {
		checkbox_Click['distribution'] = !checkbox_Click['distribution'];
		if ($('.index_appdistribution').is(":checked") === true) {
			localStorage.setItem('checkbox_distribution', 'distribution');
		} else {
			localStorage.setItem('checkbox_distribution', ' ');
		}
		showProductFilterResult();
	});

	$('.index_appreseller').click(function() {
		checkbox_Click['reseller'] = !checkbox_Click['reseller'];
		if ($('.index_appreseller').is(":checked") === true) {
			localStorage.setItem('checkbox_reseller', 'reseller');
		} else {
			localStorage.setItem('checkbox_reseller', ' ');
		}
		showProductFilterResult();
	});

	$('.index_appinsights').click(function() {
		checkbox_Click['insights'] = !checkbox_Click['insights'];
		if ($('.index_appinsights').is(":checked") === true) {
			localStorage.setItem('checkbox_insights', 'insights');
		} else {
			localStorage.setItem('checkbox_insights', ' ');
		}
		showProductFilterResult();
	});

	$('.index_appwise').click(function() {
		checkbox_Click['wise'] = !checkbox_Click['wise'];
		if ($('.index_appwise').is(":checked") === true) {
			localStorage.setItem('checkbox_wise', 'wise');
		} else {
			localStorage.setItem('checkbox_wise', ' ');
		}
		showProductFilterResult();
	});

	function refireSearchQuery(query) {
		var input = query;
		var index = input.indexOf("sort:");
		var actualQuery;

		if (index != -1) {
			var searchArr = input.split(" sort:");
			searchArr = searchArr.slice(0, searchArr.length - 1);
			actualQuery = searchArr.join(" ");
		} else {
			actualQuery = input;
		}

		if (sort_Click['new'] === true) {
			window.location.href = "searchPage.html?search=" + actualQuery + ' ' + 'sort:date desc';
		} else if (sort_Click['old'] === true) {
			window.location.href = "searchPage.html?search=" + actualQuery + ' ' + 'sort:date asc';
		}
	}

	function setTrueForCurrentSortCheck(name) {
		Object.keys(sort_Click).forEach(function(element) {
			if (element != undefined && element != name) {
				sort_Click[element] = false;
			} else if (element != undefined && element === name) {
				sort_Click[element] = true;
				localStorage.setItem('sort', element);
			}
		});
	}

	$('.index_new').click(function() {
		setTrueForCurrentSortCheck('new');
		refireSearchQuery(query);
		localStorage.setItem('store', 'pass');
	});

	$('.index_old').click(function() {
		setTrueForCurrentSortCheck('old');
		refireSearchQuery(query);
		localStorage.setItem('store', 'pass');
	});

	function filterTitleBaseOnUrl(getUrl) {
		if (getUrl.indexOf("/appmarket/") >= 0) {
			searchClass.append("<p class='topic-title'>AppMarket Online Help</p>");
		} else if (getUrl.indexOf("/appbilling/") >= 0) {
			searchClass.append("<p class='topic-title'>AppBilling Online Help</p>");
		} else if (getUrl.indexOf("/appdistrib/") >= 0) {
			searchClass.append("<p class='topic-title'>AppDistribution Online Help</p>");
		} else if (getUrl.indexOf("/appreseller/") >= 0) {
			searchClass.append("<p class='topic-title'>AppReseller Online Help</p>");
		} else if (getUrl.indexOf("/appwise/") >= 0) {
			searchClass.append("<p class='topic-title'>AppWise Online Help</p>");
		} else if (getUrl.indexOf("/appinsights/") >= 0) {
			searchClass.append("<p class='topic-title'>AppInsights Online Help</p>");
		} else if (getUrl.indexOf("/api/appmarket.html") >= 0) {
			searchClass.append("<p class='topic-title'>AppMarket API Reference</p>");
		} else if (getUrl.indexOf("/api/appbilling.html") >= 0) {
			searchClass.append("<p class='topic-title'>AppBilling API Reference</p>");
		} else if (getUrl.indexOf("/api/appreseller.html") >= 0) {
			searchClass.append("<p class='topic-title'>AppReseller API Reference</p>");
		} else if (getUrl.indexOf("/api/appinsights.html") >= 0) {
			searchClass.append("<p class='topic-title'>AppInsights API Reference</p>");
		} else if (getUrl.indexOf("/api/appwise.html") >= 0) {
			searchClass.append("<p class='topic-title'>AppWise API Reference</p>");
		}
	}

	function highlightKeyword(input) {
		var index = input.indexOf("sort:");
		if (index >= 0) {

			var searchArr = input.split(" sort:");
			searchArr = searchArr.slice(0, searchArr.length - 1);
			input = searchArr.join(" ");
		}

		$(".search-highlight").mark(input, {
			"element": "span",
			"className": "highlight-search"
		});
	}

	function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	}

	function trimApiTitles(title) {
		var api_title = " ";
		api_title = title.split("-");
		title = api_title.slice(1, api_title.length).join("-");
		return title;
	}

	$('.clear-all-filters, .clear-all-filters-mobile').click(function() {
		var input = $('#search-val').val();
		var index = input.indexOf("sort:");

		if (index >= 0) {
			var searchArr = input.split(" sort:");
			searchArr = searchArr.slice(0, searchArr.length - 1);
			input = searchArr.join(" ");
		}
		window.location.href = "searchPage.html?search=" + input;
	});
});
