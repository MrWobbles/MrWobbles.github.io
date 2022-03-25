$(function(){
    $('.mouse').on('click', function(){  
        $('html, body').animate({scrollTop: '+=150px'}, 800);
    });

    $('html, body').on('scroll', function(){
        var x = $(this).scrollTop();
        $('.page-banner').css('background-position', '0% ' + parseInt(-x / 10) + '%')
    });

    $('.newsletter-signup input[type="email"]').on('focus', function(){
        $('.newsletter-signup').addClass('signup-active')
    });

    $('.newsletter-signup input[type="email"]').on('blur', function(){
        $('.newsletter-signup').removeClass('signup-active')
    });
});