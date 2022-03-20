$(document).on('ready', function(){
    console.log("Document Ready");
    $('.mouse').on('click', function(){  
        $('html, body').animate({scrollTop: '+=150px'}, 800);
    });

    $('html, body').on('scroll', function(){
        var x = $(this).scrollTop();
        $('.page-banner').css('background-position', '0% ' + parseInt(-x / 10) + '%')
    });
});