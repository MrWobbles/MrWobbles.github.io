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
    var $categories = $trainingLab.find('.discipline-category');
    var $natureButtons = $('[data-filter-nature]');
    var $goalFilter = $('#discipline-goal-filter');
    var $searchFilter = $('#discipline-search');
    var $emptyState = $('.training-empty-state');
    var $resultCount = $('.training-result-count');
    var $printButton = $('#print-selected-disciplines');

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

    function escapeHtml(raw) {
      return $('<div>').text(raw || '').html();
    }

    function buildChecklistMarkup() {
      var checkboxCount = 0;

      $cards.each(function () {
        var $card = $(this);
        var cardTitle = $.trim($card.find('h3').first().text());
        $card.attr('data-card-title', cardTitle);

        $card.find('ul > li').each(function () {
          var $item = $(this);

          if ($item.find('.discipline-check-input').length) {
            return;
          }

          checkboxCount += 1;

          var checkboxId = 'discipline-check-' + checkboxCount;
          var instructionHtml = $item.html();
          var $label = $('<label/>', {
            'class': 'discipline-check',
            'for': checkboxId
          });

          var $checkbox = $('<input/>', {
            'type': 'checkbox',
            'id': checkboxId,
            'class': 'discipline-check-input'
          });

          var $text = $('<span/>', {
            'class': 'discipline-check-text',
            'html': instructionHtml
          });

          $label.append($checkbox).append($text);
          $item.empty().append($label);
        });
      });
    }

    function getSelectedPracticeGroups() {
      var selectedGroups = [];

      $cards.each(function () {
        var $card = $(this);
        var cardTitle = $card.attr('data-card-title') || $.trim($card.find('h3').first().text());
        var $selectedItems = $card.find('.discipline-check-input:checked');

        if (!$selectedItems.length) {
          return;
        }

        var items = [];
        $selectedItems.each(function () {
          var $input = $(this);
          var itemText = $.trim($input.closest('.discipline-check').find('.discipline-check-text').text() || '');

          if (itemText) {
            items.push(itemText);
          }
        });

        if (items.length) {
          selectedGroups.push({
            title: cardTitle,
            items: items
          });
        }
      });

      return selectedGroups;
    }

    function buildPrintDocument(groups) {
      var sectionsHtml = '';
      var weekDaysHtml = '';

      for (var dayOffset = 0; dayOffset < 7; dayOffset += 1) {
        var dayDate = new Date();
        dayDate.setDate(dayDate.getDate() + dayOffset);

        weekDaysHtml += '' +
          '<span class="week-day">' +
          '<span class="week-day-name">' + escapeHtml(dayDate.toLocaleDateString('en-US', { weekday: 'short' })) + '</span>' +
          '<span class="week-day-date">' + escapeHtml(dayDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })) + '</span>' +
          '</span>';
      }

      groups.forEach(function (group) {
        var itemsHtml = '';
        group.items.forEach(function (item) {
          itemsHtml += '' +
            '<li class="task-item">' +
            '<div class="task-line"><span class="check">[ ]</span><span>' + escapeHtml(item) + '</span></div>' +
            '<div class="week-row">' + weekDaysHtml + '</div>' +
            '</li>';
        });

        sectionsHtml += '' +
          '<section class="print-group">' +
          '<h3>' + escapeHtml(group.title) + '</h3>' +
          '<ul>' + itemsHtml + '</ul>' +
          '</section>';
      });

      return '' +
        '<!doctype html>' +
        '<html lang="en">' +
        '<head>' +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        '<title>Soul\'s Training Ground - Checklist</title>' +
        '<style>' +
        '@page{margin:.5in;}' +
        'body{font-family:Arial,sans-serif;color:#111;margin:0;line-height:1.25;}' +
        'h1{font-size:18pt;margin:0 0 4px;}' +
        'h2{font-size:11pt;margin:0 0 10px;color:#444;font-weight:600;}' +
        'h3{font-size:11pt;margin:10px 0 4px;}' +
        'p{font-size:10pt;margin:0 0 6px;}' +
        '.muted{color:#555;}' +
        '.print-group{margin:0 0 8px;break-inside:avoid;page-break-inside:avoid;}' +
        'ul{margin:0;padding:0;list-style:none;}' +
        'li{margin:0;font-size:10pt;list-style:none;}' +
        '.task-item{margin:0 0 8px;break-inside:avoid;page-break-inside:avoid;}' +
        '.task-line{display:flex;gap:8px;align-items:flex-start;margin:0 0 4px;}' +
        '.check{font-weight:700;min-width:18px;}' +
        '.week-row{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border:1px solid #bbb;border-radius:4px;overflow:hidden;}' +
        '.week-day{display:block;text-align:center;padding:3px 2px;border-right:1px solid #d0d0d0;min-height:28px;}' +
        '.week-day:last-child{border-right:none;}' +
        '.week-day-name{display:block;font-size:8pt;font-weight:700;line-height:1.1;}' +
        '.week-day-date{display:block;font-size:8pt;line-height:1.1;color:#555;}' +
        '</style>' +
        '</head>' +
        '<body>' +
        '<h1>Soul\'s Training Ground</h1>' +
        '<h2>Selected Practices Checklist</h2>' +
        '<p class="muted">Date: ' + escapeHtml(new Date().toLocaleDateString()) + '</p>' +
        '<p>Exercise yourself toward godliness by choosing a focused set of practices for this week. This checklist is designed to help you pursue steady spiritual formation through daily, intentional habits.</p>' +
        '<p>Begin with one or two disciplines that are realistic for your current season, then stay consistent. At the end of the week, reflect prayerfully on what strengthened your walk with Christ and what rhythms need to be adjusted.</p>' +
        sectionsHtml +
        '</body>' +
        '</html>';
    }

    function printSelectedPractices(groups) {
      var printWindow = window.open('about:blank', '_blank', 'width=900,height=700');
      var printHtml = buildPrintDocument(groups);

      if (!printWindow) {
        window.alert('Please allow pop-ups to print your selected plan.');
        return;
      }

      try {
        printWindow.document.open('text/html', 'replace');
        printWindow.document.write(printHtml);
        printWindow.document.close();

        // Give the new document a moment to render before opening print preview.
        window.setTimeout(function () {
          printWindow.focus();
          printWindow.print();
        }, 100);
      } catch (error) {
        printWindow.close();
        window.alert('Unable to open print preview. Please allow pop-ups for this site and try again.');
      }
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

      $categories.each(function () {
        var $category = $(this);
        var hasVisibleCards = $category.find('.discipline-card:not(.is-hidden)').length > 0;
        $category.prop('hidden', !hasVisibleCards);
        $category.attr('aria-hidden', (!hasVisibleCards).toString());
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

    if ($printButton.length) {
      $printButton.on('click', function () {
        var groups = getSelectedPracticeGroups();

        if (!groups.length) {
          window.alert('Select at least one practice before printing.');
          return;
        }

        printSelectedPractices(groups);
      });
    }

    buildChecklistMarkup();
    applyDisciplineFilters();
  }
});
