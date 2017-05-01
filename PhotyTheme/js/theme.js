(function () {

  'use strict';

  var clickMenu = function() {

    $('#mainMenu a:not([class="external"])').click(function(event){
      var section = $(this).data('nav-section'), navbar = $('#mainMenu');

      if ($('[data-section="' + section + '"]').length ){
        $('html, body').animate({
            scrollTop: $('[data-section="' + section + '"]').offset().top
        }, 1200, 'easeInOutExpo');
      }
      event.preventDefault();
      return false;
    });
    $('a.js-page-scroll').click(function(event) {
      var anchor = $(this);
      $('html, body').animate({
        scrollTop: ($(anchor.attr('href')).offset().top + 1)
      }, 1200, 'easeInOutExpo');
      event.preventDefault();
    });

  };

  // Window Scroll
var windowScroll = function() {
  var lastScrollTop = $(window).scrollTop();
  var header = $('#headerMenu');
  if (lastScrollTop > 2000) {
    header.addClass('navbar-fixed-top');
  }

  $(window).scroll(function(event) {

    var scrlTop = $(this).scrollTop();

    if ( scrlTop > 500 && scrlTop <= 2000 ) {
      header.addClass('navbar-fixed-top slideInDown');
    } else if ( scrlTop <= 500 ) {
      if ( header.hasClass('navbar-fixed-top')) {
        header.addClass('slideOutUp');
        setTimeout(function(){
          header.removeClass('navbar-fixed-top slideOutUp slideInDown');
        }, 800);
      }
    }
  });
};

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

 var scrollDownAnimationDelay = function(hook,e,animate,os,delay){
   $(hook).waypoint({
     handler: function(direction){
       var ele = $(e);
       if(direction == 'down'){
         var time = 0;
         for (var i = 0; i < ele.length; i++) {
           $(ele[i]).css({
             '-webkit-animation-delay': time + 'ms',
             '-ms-animation-delay': time + 'ms',
             '-o-animation-delay': time + 'ms'
           }).animateCss(animate);
           time += delay;
         }
       }
     }, offset: os});
 }
var scrollDownAnimation = function(hook,e,os){
  $(hook).waypoint({
    handler: function(direction){
      var ele = $(e);
      if(direction == 'down'){
        for (var i = 0; i < ele.length; i++) {
          var animate = $(ele[i]).data('animate');
           $(ele[i]).animateCss(animate);
        }
      }
    }, offset: os});
}

var animationscroll = function(){
  scrollDownAnimation('#services','.service-block','50%');
  scrollDownAnimation('#features','.feature-block','50%');
  scrollDownAnimation('#blog','.post-block','20%');
  scrollDownAnimation('#photowalk','.walk-block','50%');
  scrollDownAnimation('#contact','.js-animate','50%');
  scrollDownAnimationDelay('#artists','#artists .well','fadeInRight','50%', 50);
  scrollDownAnimationDelay('#blog','#blog .post-block .post-info','fadeInRight','50%', 50);
}

//Custom validation
// Validation jquery.validate
// var validationContactForm = function(){
//   $('#contactForm').validate({
//     rules:{
//       name: {
//         required: true,
//         minlenght: 2,
//         maxlenght: 20,
//         lettersonly: true
//       },
//       email: {
//         required: true,
//         email: true
//       },
//       phone: {
//         required: true,
//         tel: true
//       }
//     },
//     messages: {
//       name: {
//         required: "Please enter your name",
//         minlenght: "Your name must consist of at least 2 characters"
//       },
//       email: {
//         required: "Please enter your email",
//         email: "Enter a valid email"
//       },
//       phone: {
//         required: "Please enter your phone",
//         tel: "Enter valid phone"
//       }
//     }
//   });
// }

var editableContent = function(){
  // mettere contentEditable="true" in un ul tag e mettere un id="edit"
  //OK funzia
  var edit = document.getElementById('edit');
  $(edit).blur(function(){
    localStorage.setItem('data', this.innerHTML);
  });
  //Whene refresh the page
  if(localStorage.getItem('data')){
    edit.innerHTML = localStorage.getItem('data');
  }
}
  $(function(){
    clickMenu();
    windowScroll();
    animationscroll();
//    validationContactForm();
    validation('#contactForm');
    // editableContent();
  })

}());
