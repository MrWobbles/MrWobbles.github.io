$(document).on("ready",function(){$(".mouse").on("click",function(){$("html, body").animate({scrollTop:"+=150px"},800)}),$("html, body").on("scroll",function(){var o=$(this).scrollTop();$(".page-banner").css("background-position","0% "+parseInt(-o/10)+"%")})});
//# sourceMappingURL=main.js.map
