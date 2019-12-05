//= require ../lib/_jquery
//= require ../lib/_imagesloaded.min
;
(function() {
    'use strict';

    var loaded = false;

    var debounce = function(func, waitTime) {
        var timeout = false;
        return function() {
            if (timeout === false) {
                setTimeout(function() {
                    func();
                    timeout = false;
                }, waitTime);
                timeout = true;
            }
        };
    };


    var closeToc = function() {
        $('.toc-wrapper').removeClass('open');
        $('#nav-button').removeClass('open');
    };

    function loadToc($toc, tocLinkSelector, tocListSelector, scrollOffset) {
        var headerHeights = {};
        var pageHeight = 0;
        var windowHeight = 0;
        var originalTitle = document.title;
        var recacheHeights = function() {
            headerHeights = {};
            pageHeight = $(document).height();
            windowHeight = $(window).height();

            $toc.find(tocLinkSelector).each(function() {
                var targetId = $(this).attr('href');
                if (targetId[0] === '#') {
                    headerHeights[targetId] = $(targetId).offset().top;
                }
            });
        };

        var refreshToc = function() {
            var currentTop = $(document).scrollTop() + scrollOffset;

            if (currentTop + windowHeight >= pageHeight) {
                // at bottom of page, so just select last header by making currentTop very large
                // this fixes the problem where the last header won't ever show as active if its content
                // is shorter than the window height
                currentTop = pageHeight + 1000;
            }

            var best = null;
            for (var name in headerHeights) {
                if ((headerHeights[name] < currentTop && headerHeights[name] > headerHeights[best]) || best === null) {
                    best = name;
                }
            }

            // Catch the initial load case
            if (currentTop == scrollOffset && !loaded) {
                best = window.location.hash;
                loaded = true;
            }

            var $best = $toc.find('[href=\'' + best + '\']').first();
            if (!$best.hasClass('active')) {
                // .active is applied to the ToC link we're currently on, and its parent <ul>s selected by tocListSelector
                // .active-expanded is applied to the ToC links that are parents of this one
                $toc.find('.active').removeClass('active');
                $toc.find('.active-parent').removeClass('active-parent');
                $best.addClass('active');
                $best.parents(tocListSelector).addClass('active').siblings(tocLinkSelector).addClass('active-parent');
                $best.siblings(tocListSelector).addClass('active');
                $toc.find(tocListSelector).filter(':not(.active)').slideUp(150);
                $toc.find(tocListSelector).filter('.active').slideDown(150);
                if (window.history.pushState) {
                    window.history.pushState(null, '', best);
                }
                // TODO remove classnames
                document.title = $best.data('title') + ' – ' + originalTitle;
            }
        };

        var makeToc = function() {
            recacheHeights();
            refreshToc();

            $('#nav-button').click(function() {
                $('.toc-wrapper').toggleClass('open');
                $('#nav-button').toggleClass('open');
                return false;
            });
            $('.page-wrapper').click(closeToc);
            $('.toc-link').click(closeToc);

            // reload immediately after scrolling on toc click
            $toc.find(tocLinkSelector).click(function() {
                setTimeout(function() {
                    refreshToc();
                }, 0);
            });

            $(window).scroll(debounce(refreshToc, 200));
            $(window).resize(debounce(recacheHeights, 200));
        };

        makeToc();

        window.recacheHeights = recacheHeights;
        window.refreshToc = refreshToc;
    }

    window.loadToc = loadToc;

    /////////////////////////////////////////////////
    /// SCROLL DOWN PAGE TO GET TO CLICKED LINK
    /////////////////////////////////////////////////

    $(document).ready(function() {

        var target;
        window.onload = function(e) {
            if ($('#toc a[href = "' + window.location.hash + '"]')) {
                target = window.location.hash;
                managePageScroll();
            }
        };

        $('a[href*="#"]').on('click', function(e) {
            target = $(this).attr('href'); //Get the target
            managePageScroll();
            e.preventDefault();
        });

        $('.search').change(function() {
            $('.search-results').find('a[href*="#"]').on('click', function(e) {
                target = $(this).attr('href'); //Get the target
                managePageScroll();
                e.preventDefault();
            });
        });

        function managePageScroll() {
            if ($('body').hasClass('iam')) {
                var scrollToPosition = $(target).offset().top - document.getElementById('header').offsetHeight - document.getElementById('iam_secondary_nav').offsetHeight + 2;

            } else if ($('body').hasClass('billing-subscription-management')) {
                var scrollToPosition = $(target).offset().top - document.getElementById('header').offsetHeight - document.getElementById('sub_billing_secondary_nav').offsetHeight + 2;

            } else if ($('body').hasClass('checkout')) {
                var scrollToPosition = $(target).offset().top - document.getElementById('header').offsetHeight - document.getElementById('checkout_second_nav').offsetHeight + 2;

            } else if ($('body').hasClass('platform-admin')) {
                var scrollToPosition = $(target).offset().top - document.getElementById('header').offsetHeight - document.getElementById('platform_second_nav').offsetHeight + 2;

            } else if ($('body').hasClass('catalog-management')) {
                var scrollToPosition = $(target).offset().top - document.getElementById('header').offsetHeight - document.getElementById('catalog_second_nav').offsetHeight + 2;

            } else if ($('body').hasClass('assisted-sales')) {
                var scrollToPosition = $(target).offset().top - document.getElementById('header').offsetHeight - document.getElementById('assisted_second_nav').offsetHeight + 2;

            } else if ($('body').hasClass('reports-v1')) {
                var scrollToPosition = $(target).offset().top - document.getElementById('header').offsetHeight - document.getElementById('reports_v1_second_nav').offsetHeight + 2;

            } else if ($('body').hasClass('reports-v2')) {
                var scrollToPosition = $(target).offset().top - document.getElementById('header').offsetHeight - document.getElementById('reports_v2_second_nav').offsetHeight + 2;

            } else if ($('body').hasClass('storefront')) {
                var scrollToPosition = $(target).offset().top - document.getElementById('header').offsetHeight - document.getElementById('storefront_second_nav').offsetHeight + 2;

            } else {
                var scrollToPosition = $(target).offset().top - document.getElementById('header').offsetHeight - 51 + 2;
            }

            $('html,body').animate({
                'scrollTop': scrollToPosition
            }, 0, function(target) {
                window.location.hash = target;
            });
        }
    });
})();
