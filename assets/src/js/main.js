$(function () {
  //Set Active Menu
  let stub = window.location.pathname.split('/')[1];

  if (stub !== "") {
    $('.' + stub).addClass('active');
  } else {
    $('.home').addClass('active');
  }

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

  $('.accordion').on('click', function () {
    $(this).toggleClass('acc-open');
  })

  $('.menu-toggle').on('click', function () {
    $('body').toggleClass('nav-open');
  });

  $('.serve-nav-item').on('click', function () {
    var goto = $(this).data('goto');
    $('html, body').animate({
      scrollTop: $("#" + goto).offset().top - 100
    }, 2000);
  });
});
