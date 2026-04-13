$(function () {
  //Set Active Menu
  let stub = window.location.pathname.split('/')[1];
  var $body = $('body');

  if (stub !== "") {
    $('.' + stub).addClass('active');
  } else {
    $('.home').addClass('active');
  }

  if (!document.documentElement.lang) {
    document.documentElement.lang = 'en';
  }

  var $mainContent = $('.page-content').first();
  if ($mainContent.length) {
    if (!$mainContent.attr('id')) {
      $mainContent.attr('id', 'main-content');
    }
    $mainContent.attr('role', 'main');
  }

  $('a[target="_blank"]').attr('rel', 'noopener noreferrer');

  $('.mouse').on('click', function () {
    $('html, body').animate({ scrollTop: '+=150px' }, 800);
  });

  $('html, body').on('scroll', function () {
    var x = $(this).scrollTop();
    $('.page-banner').css('background-position', '0% ' + parseInt(-x / 10) + '%')
  });

  $('.newsletter-signup input[type="email"]').on('focus', function () {
    $('.newsletter-signup').addClass('signup-active')
  });

  $('.newsletter-signup input[type="email"]').on('blur', function () {
    $('.newsletter-signup').removeClass('signup-active')
    $('.newsletter-signup input[type="email"]').val('');
  });

  var $accordionTitles = $('.accordion .acc-title');

  function setAccordionState($title, isOpen) {
    var $accordion = $title.closest('.accordion');
    var $panel = $accordion.children('.acc-content').first();

    $accordion.toggleClass('acc-open', isOpen);
    $title.attr('aria-expanded', isOpen.toString());
    $panel.attr('aria-hidden', (!isOpen).toString());
    $panel.prop('hidden', !isOpen);
  }

  $accordionTitles.each(function (index) {
    var $title = $(this);
    var $accordion = $title.closest('.accordion');
    var $panel = $accordion.children('.acc-content').first();
    var panelId = $panel.attr('id') || 'accordion-panel-' + index;
    var headingId = $title.attr('id') || panelId + '-label';
    var isOpen = $accordion.hasClass('acc-open');

    $title.attr({
      'id': headingId,
      'tabindex': '0',
      'role': 'button',
      'aria-controls': panelId,
      'aria-expanded': isOpen.toString()
    });

    $panel.attr({
      'id': panelId,
      'role': 'region',
      'aria-labelledby': headingId,
      'aria-hidden': (!isOpen).toString()
    });

    $panel.prop('hidden', !isOpen);
  });

  $accordionTitles.on('click', function () {
    var $title = $(this);
    var isOpen = $title.attr('aria-expanded') === 'true';
    setAccordionState($title, !isOpen);
  });

  $accordionTitles.on('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      $(this).trigger('click');
    }
  });

  var $menuToggle = $('.menu-toggle');
  var $primaryNavigation = $('#primary-navigation');

  function syncMenuState() {
    var isOpen = $body.hasClass('nav-open');
    $menuToggle.attr('aria-expanded', isOpen.toString());
    $menuToggle.attr('aria-label', isOpen ? 'Close main menu' : 'Open main menu');
    $primaryNavigation.attr('aria-hidden', (!isOpen).toString());
  }

  $menuToggle.on('click', function () {
    $body.toggleClass('nav-open');
    syncMenuState();
  });

  $(document).on('keydown', function (event) {
    if (event.key === 'Escape' && $body.hasClass('nav-open')) {
      $body.removeClass('nav-open');
      syncMenuState();
      $menuToggle.trigger('focus');
    }
  });

  syncMenuState();

  $('.nav-submenu-toggle').on('click', function () {
    var $toggle = $(this);
    var $item = $toggle.closest('.has-subnav');
    var willOpen = !$item.hasClass('subnav-open');

    $item.toggleClass('subnav-open', willOpen);
    $toggle.attr('aria-expanded', willOpen.toString());
  });

  $('.serve-nav-item').on('click', function () {
    var goto = $(this).data('goto');
    $('html, body').animate({
      scrollTop: $("#" + goto).offset().top - 100
    }, 2000);
  });

  var $trainingLab = $('.training-lab');

  if ($trainingLab.length) {
    var $cards = $trainingLab.find('.discipline-card');
    var $natureButtons = $('[data-filter-nature]');
    var $goalFilter = $('#discipline-goal-filter');
    var $searchFilter = $('#discipline-search');
    var $emptyState = $('.training-empty-state');
    var $resultCount = $('.training-result-count');

    var activeNature = 'all';

    function includesValue(rawValues, expected) {
      if (!rawValues) {
        return false;
      }

      return rawValues
        .split(/[\s,]+/)
        .map(function (item) { return item.trim().toLowerCase(); })
        .indexOf(expected) !== -1;
    }

    function applyDisciplineFilters() {
      var activeGoal = ($goalFilter.val() || 'all').toLowerCase();
      var searchText = ($searchFilter.val() || '').toLowerCase().trim();
      var visibleCount = 0;

      $cards.each(function () {
        var $card = $(this);
        var cardNature = ($card.data('nature') || '').toString().toLowerCase();
        var cardGoals = ($card.data('goals') || '').toString().toLowerCase();
        var searchableText = (($card.data('search') || '') + ' ' + $card.text()).toLowerCase();

        var natureMatch = activeNature === 'all' || includesValue(cardNature, activeNature);
        var goalMatch = activeGoal === 'all' || includesValue(cardGoals, activeGoal);
        var searchMatch = searchText === '' || searchableText.indexOf(searchText) !== -1;

        var isVisible = natureMatch && goalMatch && searchMatch;
        $card.toggleClass('is-hidden', !isVisible);
        $card.attr('aria-hidden', (!isVisible).toString());

        if (isVisible) {
          visibleCount += 1;
        }
      });

      $emptyState.prop('hidden', visibleCount !== 0);
      $resultCount.text(visibleCount + ' discipline' + (visibleCount === 1 ? '' : 's') + ' shown');
    }

    $natureButtons.on('click', function () {
      var $button = $(this);
      activeNature = ($button.data('filter-nature') || 'all').toString().toLowerCase();
      $natureButtons.removeClass('is-active');
      $button.addClass('is-active');
      applyDisciplineFilters();
    });

    $goalFilter.on('change', applyDisciplineFilters);
    $searchFilter.on('input', applyDisciplineFilters);

    applyDisciplineFilters();
  }
});
