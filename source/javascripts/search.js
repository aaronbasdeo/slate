$(document).ready(function() {

        var container = ' ';
        var radioClicked = 0;
        var showFiltersClick = 1;
        var searchClass = $('.search-result-title');
        var responsiveBreakPoint = 1073;
        var radio_Click = {
            all: false, api_reference: false, guides: false
        };
        var checkbox_Click = {
            products: false, platform: false, reseller: false, api_guides: false, api_flare: false
        };
        var sort_Click = {
            new: false, old: false
        };
        getUrlParameter();
        var query = getUrlParameter('search');
        searchOnPageLoad(query);

        $('#search-val').keyup(function(e) {

            var input = $('#search-val').val();
            addClassToSearchBar(input);

            if (e.keyCode === 13 && input.length > 0) {
                window.location.href = 'searchPage.html?search=' + input;
            }
        });

        function searchOnPageLoad(query) {
            $('#search-val').attr('value', query);
            var input = query;
            var api = 'https://appwise-test.appdirect.com/api/v2/marketplaces/testmarketplace.appdirect.com/index/search?format=json&q';
            var url = api + input + '&page_size=1000&marketplace_sections=DOCUMENTATION';

            var index = input.indexOf('sort:');
            if (index >= 0) {
                var searchArr = input.split(' sort:');
                searchArr = searchArr.slice(0, searchArr.length - 1);
                input = searchArr.join(' ');

                if (localStorage.getItem('sort') === 'new') {
                    $('.index_new').attr('checked', 'checked');
                } else if (localStorage.getItem('sort') === 'old') {
                    $('.index_old').attr('checked', 'checked');
                }
            } else {
                localStorage.setItem('store', 'fail');
                localStorage.clear();
            }

            $('html head').find('title').text(input + ' - AppDirect Search');

            addClassToSearchBar(input);

            $('.search-result-title').empty();
            $('.search-image').css('display', 'block');
            $('.mobile-filters, .search-results').css('display', 'none');
            $('.index_all').prop('checked', true);

            $.getJSON(url, function(data) {
                if (data.response.docs.length > 0) {
                    for (var i = 0; i < data.response.docs.length; i++) {

                        var title = data.response.docs[i].title;
                        var trimedTitle = getTrimedTitles(title);
                        var getUrl = data.response.docs[i].url;
                        var desc = data.response.docs[i].description;

                        checkForHTMLTags(getUrl, trimedTitle, desc); // Check for the HTML tags in the string. If present parse them so that it won't break the whole script.
                        container = data.response.docs;
                    }
                } else {
                    searchClass.append('<p class=\'no-result-message\'>No results found for ' + '\'' + input + '\'' + '</p>');
                }

                highlightKeyword(input);

                $('.search-heading').append('Search Results for ' + '\'' + input + '\'');
                $('.search-results').css('display', 'flex');
                $('.search-image').css('display', 'none');

                if ($(window).width() <= responsiveBreakPoint) {
                    $('#All_Mobile').prop('checked', true);
                }

                if (localStorage.getItem('store') === 'pass') {
                    toggleClearFilterButton();

                    if (localStorage.getItem('radio') === 'all') {
                        radioClicked = 1;
                        $('.index_all').prop('checked', true);
                        setTrueForCurrentCheck('all');
                        showContentFilterResult();
                        backToSearchResults();
                    }
                    if (localStorage.getItem('radio') === 'api_reference') {
                        radioClicked = 1;
                        $('.index_api').prop('checked', true);
                        setTrueForCurrentCheck('api_reference');
                        showContentFilterResult();
                        backToSearchResults();
                    }
                    if (localStorage.getItem('radio') === 'guides') {
                        radioClicked = 1;
                        $('.index_guides').prop('checked', true);
                        setTrueForCurrentCheck('guides');
                        showContentFilterResult();
                        backToSearchResults();
                    }
                    if (localStorage.getItem('checkbox_product') === 'products') {
                        if ($(window).width() > responsiveBreakPoint) {
                            $('#product').prop('checked', true);
                        } else {
                            $('#product_mobile').prop('checked', true);
                        }
                        checkbox_Click['products'] = true;
                        showProductFilterResult();
                    }
                    if (localStorage.getItem('checkbox_platform') === 'platform') {
                        if ($(window).width() > responsiveBreakPoint) {
                            $('#platform').prop('checked', true);
                        } else {
                            $('#platform_Mobile').prop('checked', true);
                        }
                        checkbox_Click['platform'] = true;
                        showProductFilterResult();
                    }
                    if (localStorage.getItem('checkbox_reseller') === 'reseller') {
                        if ($(window).width() > responsiveBreakPoint) {
                            $('#reseller').prop('checked', true);
                        } else {
                            $('#reseller_Mobile').prop('checked', true);
                        }
                        checkbox_Click['reseller'] = true;
                        showProductFilterResult();
                    }
                    if (localStorage.getItem('checkbox_api_guides') === 'api_guides') {
                        if ($(window).width() > responsiveBreakPoint) {
                            $('#api_guides').prop('checked', true);
                        } else {
                            $('#api_guides_mobile').prop('checked', true);
                        }
                        checkbox_Click['api_guides'] = true;
                        showProductFilterResult();
                    }
                    if (localStorage.getItem('checkbox_api_flare') === 'api_flare') {
                        if ($(window).width() > responsiveBreakPoint) {
                            $('#api_flare').prop('checked', true);
                        } else {
                            $('#api_flare_mobile').prop('checked', true);
                        }
                        checkbox_Click['api_flare'] = true;
                        showProductFilterResult();
                    }
                }
            });
        }

        function addClassToSearchBar(input) {
            if (input.length > 0) {
                $('.header-search-result').addClass('search-val-hover-result');
            } else if ((input.length === 0) && $('.header-search-result').hasClass('search-val-hover-result')) {
                $('.header-search-result').removeClass('search-val-hover-result');
            }
        }

        function showResultToUser(getUrl, trimedTitle, desc) {
            filterTitleBaseOnUrl(getUrl);
            searchClass.append('<a class=\'search-title-append\' href = ' + getUrl + ' \'target\' = \'_blank\'>' + '<p class=\'search-title-append-content\'>' + trimedTitle + '</p>' + '</a>' + '<p class=\'search-highlight\'>' + desc + '</p>');
        }

        function getTrimedTitles(title, input) {
            if (title === undefined) {
                searchClass.append('<p class=\'no-result-message\'>No filtered results found for ' + '\'' + input + '\'' + '</p>');
            }
            if (title.includes('AppWise API Reference')
                || title.includes('AppInsights API Reference')
                || title.includes('Identity and Access Management API Reference')
                || title.includes('Checkout API Reference')
                || title.includes('Storefront API Reference')
                || title.includes('Reports v1 API Reference')
                || title.includes('Reports v2 API Reference')
                || title.includes('Subscription Management and Billing API Reference')
                || title.includes('Storefront API Reference')
                || title.includes('Catalog Management API Reference')
                || title.includes('Platform Administration API Reference')
                || title.includes('Assisted Sales API Reference')) {
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
            var $inner = $('.mobile-filters');
            var extraWidth = $('.search-wrapper').width();

            if ($inner.position().left === 0) {
                $inner.animate({
                    left: '+' + extraWidth
                }, 400);
            } else {
                $inner.animate({
                    left: '25px'
                }, 400);
            }

            if (showFiltersClick) {
                $('.search-result-title').css('display', 'none');
                $('.search-wrapper').css('height', '650px');
                showFiltersClick = 0;
            } else {
                $('.search-result-title').css('display', 'block');
                $('.search-wrapper').css('height', 'unset');
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
                    var desc = container[i].description;

                    checkForHTMLTags(getUrl, trimedTitle, desc); // Check for the HTML tags in the string. If present parse them so that it won't break the whole script.
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
                    var desc = container[i].description;

                    if (getUrl.indexOf('/api/') >= 0 && radio_Click['api_reference'] === true) {
                        checkForHTMLTags(getUrl, trimedTitle, desc); // Check for the HTML tags in the string. If present parse them so that it won't break the whole script.
                        noResultFoundCheck = 1;

                    } else if (getUrl.indexOf('/api/') === -1 && radio_Click['guides'] === true) {
                        checkForHTMLTags(getUrl, trimedTitle, desc); // Check for the HTML tags in the string. If present parse them so that it won't break the whole script.
                        noResultFoundCheck = 1;
                    }
                }
                highlightKeyword(input);
            }
            if (noResultFoundCheck === 0) {
                searchClass.append('<p class=\'no-result-message\'>No filtered results found for ' + '\'' + input + '\'' + '</p>');
            }
            if ($('[name=\'category\']:checked').length) {
                showProductFilterResult();
            }
        }

        function setTrueForCurrentCheck(name) {
            Object.keys(radio_Click).forEach(function(element) {
                if (element !== undefined && element !== name) {
                    radio_Click[element] = false;
                } else if (element !== undefined && element === name) {
                    radio_Click[element] = true;
                    localStorage.setItem('radio', element);
                }
            });
        }

        $('.index_all').click(function() {
            radioClicked = 1;
            setTrueForCurrentCheck('all');
            showContentFilterResult();
            backToSearchResults();
        });

        $('.index_api').click(function() {
            radioClicked = 1;
            setTrueForCurrentCheck('api_reference');
            showContentFilterResult();
            backToSearchResults();
        });

        $('.index_guides').click(function() {
            radioClicked = 1;
            setTrueForCurrentCheck('guides');
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
                var desc = container[i].description;

                if (desc.includes('<') && desc.includes('>')) {
                    var parsedInputWithHTML = parseHtmlEntities(desc);
                    desc = parsedInputWithHTML;
                }

                switch (true) {
                    case (getUrl.indexOf('/products/') >= 0 && (checkbox_Click['products'] === true || $('.index_product').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                    case (getUrl.indexOf('/platform/') >= 0 && (checkbox_Click['platform'] === true || $('.index_platform').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                    case (getUrl.indexOf('/reseller/') >= 0 && (checkbox_Click['reseller'] === true || $('.index_reseller').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                    case (getUrl.indexOf('/api-sub-billing/') >= 0 && (checkbox_Click['api_guides'] === true || $('.index_api_guides').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                    case (getUrl.indexOf('/api-assist/') >= 0 && (checkbox_Click['api_guides'] === true || $('.index_api_guides').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                    case (getUrl.indexOf('/api-platform/') >= 0 && (checkbox_Click['api_guides'] === true || $('.index_api_guides').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                    case (getUrl.indexOf('/api-storefront/') >= 0 && (checkbox_Click['api_guides'] === true || $('.index_api_guides').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                    case (getUrl.indexOf('/api-iam/') >= 0 && (checkbox_Click['api_guides'] === true || $('.index_api_guides').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                    case (getUrl.indexOf('/api-checkout/') >= 0 && (checkbox_Click['api_guides'] === true || $('.index_api_guides').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                    case (getUrl.indexOf('/api-reports-v1') >= 0 && (checkbox_Click['api_guides'] === true || $('.index_api_guides').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                    case (getUrl.indexOf('/api-reports-v2') >= 0 && (checkbox_Click['api_guides'] === true || $('.index_api_guides').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                    case (getUrl.indexOf('/api-catalog') >= 0 && (checkbox_Click['api_guides'] === true || $('.index_api_guides').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                    case (getUrl.indexOf('/api/') >= 0 && (checkbox_Click['api_flare'] === true || $('.index_api_flare').is(':checked'))):
                        showResultToUser(getUrl, trimedTitle, desc);
                        noResultFoundCheck = 1;
                        break;
                }
            }
            highlightKeyword(input);

            if ((checkbox_Click['platform'] === false) && (checkbox_Click['products'] === false) && (checkbox_Click['reseller'] === false) && (checkbox_Click['api_guides'] === false) && (checkbox_Click['api_flare'] === false)) {
                if (radioClicked === 0) {
                    radio_Click['all'] = true;
                }
                showContentFilterResult();
            }
            if (noResultFoundCheck === 0) {
                searchClass.append('<p class=\'no-result-message\'>No filtered results found for ' + '\'' + input + '\'' + '</p>');
            }
        }

        $('.index_platform').click(function() {
            checkbox_Click['platform'] = !checkbox_Click['platform'];
            if ($('.index_platform').is(':checked') === true) {
                localStorage.setItem('checkbox_platform', 'platform');
            } else {
                localStorage.setItem('checkbox_platform', ' ');
                $('.index_platform').prop('checked', false);

            }
            showProductFilterResult();
        });

        $('.index_product').click(function() {
            checkbox_Click['products'] = !checkbox_Click['products'];
            if ($('.index_product').is(':checked') === true) {
                localStorage.setItem('checkbox_product', 'products');
            } else {
                localStorage.setItem('checkbox_product', ' ');
                $('.index_product').prop('checked', false);
            }
            showProductFilterResult();
        });

        $('.index_reseller').click(function() {
            checkbox_Click['reseller'] = !checkbox_Click['reseller'];
            if ($('.index_reseller').is(':checked') === true) {
                localStorage.setItem('checkbox_reseller', 'reseller');
            } else {
                localStorage.setItem('checkbox_reseller', ' ');
                $('.index_reseller').prop('checked', false);
            }
            showProductFilterResult();
        });

        $('.index_api_guides').click(function() {
            checkbox_Click['api_guides'] = !checkbox_Click['api_guides'];
            if ($('.index_api_guides').is(':checked') === true) {
                localStorage.setItem('checkbox_api_guides', 'api_guides');
            } else {
                localStorage.setItem('checkbox_api_guides', ' ');
                $('.index_api_guides').prop('checked', false);
            }
            showProductFilterResult();
        });

        $('.index_api_flare').click(function() {
            checkbox_Click['api_flare'] = !checkbox_Click['api_flare'];
            if ($('.index_api_flare').is(':checked') === true) {
                localStorage.setItem('checkbox_api_flare', 'api_flare');
            } else {
                localStorage.setItem('checkbox_api_flare', ' ');
                $('.index_api_flare').prop('checked', false);
            }
            showProductFilterResult();
        });

        function refireSearchQuery(query) {
            var input = query;
            var index = input.indexOf('sort:');
            var actualQuery;

            if (index !== -1) {
                var searchArr = input.split(' sort:');
                searchArr = searchArr.slice(0, searchArr.length - 1);
                actualQuery = searchArr.join(' ');
            } else {
                actualQuery = input;
            }

            if (sort_Click['new'] === true) {
                window.location.href = 'searchPage.html?search=' + actualQuery + ' ' + 'sort:date desc';
            } else if (sort_Click['old'] === true) {
                window.location.href = 'searchPage.html?search=' + actualQuery + ' ' + 'sort:date asc';
            }
        }

        function setTrueForCurrentSortCheck(name) {
            Object.keys(sort_Click).forEach(function(element) {
                if (element !== undefined && element !== name) {
                    sort_Click[element] = false;
                } else if (element !== undefined && element === name) {
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
            switch (true) {
                case (getUrl.indexOf('/products/') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Product Development Help</p>');
                    break;
                case (getUrl.indexOf('/platform/') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Platform Management Help</p>');
                    break;
                case (getUrl.indexOf('/reseller/') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Reseller Management Help</p>');
                    break;
                case (getUrl.indexOf('/api-sub-billing/') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Billing API Guides</p>');
                    break;
                case (getUrl.indexOf('/api-assist/') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Assisted Sales API Guides</p>');
                    break;
                case (getUrl.indexOf('/api-platform/') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Platform Administration API Guides</p>');
                    break;
                case (getUrl.indexOf('/api-storefront/') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Storefront API Guides</p>');
                    break;
                case (getUrl.indexOf('/api-iam/') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Identity and Access Management API Guides</p>');
                    break;
                case (getUrl.indexOf('/api-checkout/') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Checkout API Guides</p>');
                    break;
                case (getUrl.indexOf('/api-reportsv1/') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Reports v1 API Guides</p>');
                    break;
                case (getUrl.indexOf('/api-reportsv2/') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Reports v2 API Guides</p>');
                    break;
                case (getUrl.indexOf('/api-catalog/') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Catalog Management API Guides</p>');
                    break;
                case (getUrl.indexOf('/api/appinsights.html') >= 0):
                    searchClass.append('<p class=\'topic-title\'>AppInsights API Reference</p>');
                    break;
                case (getUrl.indexOf('/api/appwise.html') >= 0):
                    searchClass.append('<p class=\'topic-title\'>AppWise API Reference</p>');
                    break;
                case (getUrl.indexOf('/api/iam.html') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Identity and Access Management API Reference</p>');
                    break;
                case (getUrl.indexOf('/api/checkout.html') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Checkout API Reference</p>');
                    break;
                case (getUrl.indexOf('/api/storefront.html') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Storefront API Reference</p>');
                    break;
                case (getUrl.indexOf('/api/reports-v1.html') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Reports v1 API Reference</p>');
                    break;
                case (getUrl.indexOf('/api/reports-v2.html') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Reports v2 API Reference</p>');
                    break;
                case (getUrl.indexOf('/api/billing-subscription-management.html') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Billing API Reference</p>');
                    break;
                case (getUrl.indexOf('/api/assisted-sales.html') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Assisted Sales API Reference</p>');
                    break;
                case (getUrl.indexOf('/api/platform-admin.html') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Platform Administration API Reference</p>');
                    break;
                case (getUrl.indexOf('/api/catalog-management.html') >= 0):
                    searchClass.append('<p class=\'topic-title\'>Catalog Management API Reference</p>');
            }
        }

        function highlightKeyword(input) {
            var index = input.indexOf('sort:');
            if (index >= 0) {

                var searchArr = input.split(' sort:');
                searchArr = searchArr.slice(0, searchArr.length - 1);
                input = searchArr.join(' ');
            }

            $('.search-highlight').mark(input, {
                'element': 'span',
                'className': 'highlight'
            });
        }

        function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL.split('&'),
                sParameterName, i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        }

        function trimApiTitles(title) {
            var api_title = ' ';
            api_title = title.split('-');
            title = api_title.slice(1, api_title.length).join('-');
            return title;
        }

        $('.clear-all-filters, .clear-all-filters-mobile').click(function() {
            var input = $('#search-val').val();
            var index = input.indexOf('sort:');

            if (index >= 0) {
                var searchArr = input.split(' sort:');
                searchArr = searchArr.slice(0, searchArr.length - 1);
                input = searchArr.join(' ');
            }
            window.location.href = 'searchPage.html?search=' + input;
        });

        function parseHtmlEntities(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        function checkForHTMLTags(getUrl, trimedTitle, desc) {
            if (desc.includes('<') && desc.includes('>')) {
                var parsedInputWithHTML = parseHtmlEntities(desc);
                showResultToUser(getUrl, trimedTitle, parsedInputWithHTML);
            } else {
                showResultToUser(getUrl, trimedTitle, desc);
            }
        }
    }
);
