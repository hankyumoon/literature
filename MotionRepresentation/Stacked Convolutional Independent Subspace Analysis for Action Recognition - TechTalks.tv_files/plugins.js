/*
 * jQuery FlexSlider v1.4
 * http://flex.madebymufffin.com
 *
 * Copyright 2011, Tyler Smith
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * TouchWipe gesture credits: http://www.netcu.de/jquery-touchwipe-iphone-ipad-library
 */


(function ($) {
  $.fn.extend({
    flexslider: function(options) {
      //Plugin options and their default values
      var defaults = {
        animation: "fade",              //Select your animation type (fade/slide/show)
        slideshow: true,                //Should the slider animate automatically by default? (true/false)
        slideshowSpeed: 5000,           //Set the speed of the slideshow cycling, in milliseconds
        animationDuration: 500,         //Set the speed of animations, in milliseconds
        directionNav: false,             //Create navigation for previous/next navigation? (true/false)
        controlNav: true,               //Create navigation for paging control of each clide? (true/false)
        keyboardNav: true,              //Allow for keyboard navigation using left/right keys (true/false)
        touchSwipe: true,               //Touch swipe gestures for left/right slide navigation (true/false)
        prevText: "Previous",           //Set the text for the "previous" directionNav item
        nextText: "Next",               //Set the text for the "next" directionNav item
        randomize: false,               //Randomize slide order on page load? (true/false)
        slideToStart: 0,                //The slide that the slider should start on. Array notation (0 = first slide)
        pauseOnAction: true,            //Pause the slideshow when interacting with control elements, highly recommended. (true/false)
        pauseOnHover: false,            //Pause the slideshow when hovering over slider, then resume when no longer hovering (true/false)
        controlsContainer: "",          //Advanced property: Can declare which container the navigation elements should be appended too. Default container is the flexSlider element. Example use would be ".flexslider-container", "#container", etc. If the given element is not found, the default action will be taken.
        manualControls: ""              //Advanced property: Can declare custom control navigation. Example would be ".flex-control-nav" or "#tabs-nav", etc. The number of elements in your controlNav should match the number of slides/tabs (obviously).
			}

			//Get slider, slides, and other useful variables
			var options =  $.extend(defaults, options),
			    slider = this,
			    container = $('.slides', slider),
			    slides = $('.slides li.homeslide', slider),
			    length = slides.length;
			    ANIMATING = false,
          currentSlide = options.slideToStart;


      ///////////////////////////////////////////////////////////////////
      // FLEXSLIDER: RANDOMIZE SLIDES
      if (options.randomize && length > 1) {
        slides.sort(function() { return (Math.round(Math.random())-0.5); });
        container.empty().append(slides);
      }
      ///////////////////////////////////////////////////////////////////


      //Slider animation initialize
      if (options.animation.toLowerCase() == "slide" && length > 1) {
        slider.css({"overflow": "hidden"});

        container.append(slides.filter(':first').clone().addClass('clone')).prepend(slides.filter(':last').clone().addClass('clone'));
        container.width(((length + 2) * slider.width()) + 2000); //extra width to account for quirks

        //Timeout function to give browser enough time to get proper width initially
        var newSlides = $('.slides li', slider);
        setTimeout(function() {
          newSlides.width(slider.width()).css({"float": "left"}).show();
        }, 100);

        container.css({"marginLeft": (-1 * (currentSlide + 1))* slider.width() + "px"});

      } else { //Default to fade
        slides.hide().eq(currentSlide).fadeIn(400);
      }

    	///////////////////////////////////////////////////////////////////
    	// FLEXSLIDER: ANIMATION TYPE
    	function flexAnimate(target) {
        if (!ANIMATING) {
          ANIMATING = true;
          if (options.animation.toLowerCase() == "slide") {
            if (currentSlide == 0 && target == length - 1) {
              container.animate({"marginLeft": "0px"}, options.animationDuration, function(){
        	      container.css({"marginLeft": (-1 * length) * slides.filter(':first').width() + "px"});
        	      ANIMATING = false;
        	      currentSlide = target;
        	    });
            } else if (currentSlide == length - 1 && target == 0) {
              container.animate({"marginLeft": (-1 * (length + 1)) * slides.filter(':first').width() + "px"}, options.animationDuration, function(){
        	      container.css({"marginLeft": -1 * slides.filter(':first').width() + "px"});
        	      ANIMATING = false;
        	      currentSlide = target;
        	    });
            } else {
              container.animate({"marginLeft": (-1 * (target + 1)) * slides.filter(':first').width() + "px"}, options.animationDuration, function(){
        	      ANIMATING = false;
        	      currentSlide = target;
        	    });
            }
        	} else if (options.animation.toLowerCase() == "show") {

            slides.eq(currentSlide).hide();
            slides.eq(target).show();
            ANIMATING = false;
            currentSlide = target;

        	} else { //Default to Fade
        	  slider.css({"minHeight": slides.eq(currentSlide).height()});
      	    slides.eq(currentSlide).fadeOut(options.animationDuration, function() {
              slides.eq(target).fadeIn(options.animationDuration, function() {
                ANIMATING = false;
                currentSlide = target;
              });
              slider.css({"minHeight": "inherit"});
            });
        	}
      	}
  	  }
    	///////////////////////////////////////////////////////////////////

    	///////////////////////////////////////////////////////////////////
    	// FLEXSLIDER: CONTROL NAV
      if (options.controlNav && length > 1) {
        if (options.manualControls != "" && $(options.manualControls).length > 0) {
          var controlNav = $(options.manualControls);
        } else {
          var controlNav = $('<ol class="flex-control-nav"></ol>');
          var j = 1;
          for (var i = 0; i < length; i++) {
            controlNav.append('<li><a>' + j + '</a></li>');
            j++;
          }

          //extra children check for jquery 1.3.2 - Drupal 6
          if (options.controlsContainer != "" && $(options.controlsContainer).length > 0) {
            $(options.controlsContainer).append(controlNav);
          } else {
            slider.append(controlNav);
          }

          controlNav = $('.flex-control-nav li a');
        }

        controlNav.eq(currentSlide).addClass('active');

        controlNav.click(function(event) {
          event.preventDefault();

          if ($(this).hasClass('active') || ANIMATING) {
            return;
          } else {

            controlNav.removeClass('active');
            $(this).addClass('active');

            var selected = controlNav.index($(this));
            flexAnimate(selected);
            if (options.pauseOnAction) {
              clearInterval(animatedSlides);
            }
          }
        });
      }
      ///////////////////////////////////////////////////////////////////

      //////////////////////////////////////////////////////////////////
      //FLEXSLIDER: DIRECTION NAV
      if (options.directionNav && length > 1) {
        //Create and append the nav
        if (options.controlsContainer != "" && $(options.controlsContainer).length > 0) {
            $(options.controlsContainer).append($('<ul class="flex-direction-nav"><li><a class="prev" href="#">' + options.prevText + '</a></li><li><a class="next" href="#">' + options.nextText + '</a></li></ul>'));
          } else {
            slider.append($('<ul class="flex-direction-nav"><li><a class="prev" href="#">' + options.prevText + '</a></li><li><a class="next" href="#">' + options.nextText + '</a></li></ul>'));
          }

      	$('.flex-direction-nav li a').click(function(event) {
      	  event.preventDefault();
      	  if (ANIMATING) {
      	    return;
      	  } else {

        	  if ($(this).hasClass('next')) {
        	    var target = (currentSlide == length - 1) ? 0 : currentSlide + 1;
        	  } else {
        	    var target = (currentSlide == 0) ? length - 1 : currentSlide - 1;
        	  }

            if (options.controlNav) {
          	  controlNav.removeClass('active');
          	  controlNav.eq(target).addClass('active');
      	    }

        	  flexAnimate(target);
        	  if (options.pauseOnAction) {
              clearInterval(animatedSlides);
            }
          }
      	});
      }
    	//////////////////////////////////////////////////////////////////

      //////////////////////////////////////////////////////////////////
      //FLEXSLIDER: KEYBOARD NAV
      if (options.keyboardNav && length > 1) {
        $(document).keyup(function(event) {
          if (ANIMATING) {
            return;
          } else if (event.keyCode != 39 && event.keyCode != 37){
            return;
          } else {

            if (event.keyCode == 39) {
        	    var target = (currentSlide == length - 1) ? 0 : currentSlide + 1;
        	  } else if (event.keyCode == 37){
        	    var target = (currentSlide == 0) ? length - 1 : currentSlide - 1;
        	  }

        	  if (options.controlNav) {
          	  controlNav.removeClass('active');
          	  controlNav.eq(target).addClass('active');
      	    }

        	  flexAnimate(target);
        	  if (options.pauseOnAction) {
              clearInterval(animatedSlides);
            }
          }
        });
      }
    	//////////////////////////////////////////////////////////////////

    	//////////////////////////////////////////////////////////////////
      //FLEXSLIDER: ANIMATION SLIDESHOW
      if (options.slideshow && length > 1) {
        var animatedSlides;

        function animateSlides() {
          if (ANIMATING) {
            return;
          } else {
        	  var target = (currentSlide == length - 1) ? 0 : currentSlide + 1;

        	  if (options.controlNav) {
          	  controlNav.removeClass('active');
          	  controlNav.eq(target).addClass('active');
      	    }

        	  flexAnimate(target);
          }
        }

        //pauseOnHover
        if (options.pauseOnHover) {
          slider.hover(function() {
            clearInterval(animatedSlides);
          }, function() {
            animatedSlides = setInterval(animateSlides, options.slideshowSpeed);
          });
        }

        //Initialize animation
        if (length > 1) {
          animatedSlides = setInterval(animateSlides, options.slideshowSpeed);
        }
      }
    	//////////////////////////////////////////////////////////////////

			//////////////////////////////////////////////////////////////////
      //FLEXSLIDER: TOUCHSWIPE GESTURES
      //Credit of concept: TouchSwipe - http://www.netcu.de/jquery-touchwipe-iphone-ipad-library
      if (options.touchSwipe && 'ontouchstart' in document.documentElement && length > 1) {
        slider.each(function() {
          var startX,
              min_move_x = 20;
              isMoving = false;

          function cancelTouch() {
            this.removeEventListener('touchmove', onTouchMove);
            startX = null;
            isMoving = false;
          }
          function onTouchMove(e) {
            if (isMoving) {
              var x = e.touches[0].pageX,
                  dx = startX - x;

              if(Math.abs(dx) >= min_move_x) {
                cancelTouch();
                if(dx > 0) {
                	var target = (currentSlide == length - 1) ? 0 : currentSlide + 1;
                }
                else {
                	var target = (currentSlide == 0) ? length - 1 : currentSlide - 1;
                }

                if (options.controlNav) {
              	  controlNav.removeClass('active');
              	  controlNav.eq(target).addClass('active');
                 }

                flexAnimate(target);
                if (options.pauseOnAction) {
                  clearInterval(animatedSlides);
                }
              }
            }
          }
          function onTouchStart(e) {
            if (e.touches.length == 1) {
              startX = e.touches[0].pageX;
              isMoving = true;
              this.addEventListener('touchmove', onTouchMove, false);
            }
          }
          if ('ontouchstart' in document.documentElement) {
            this.addEventListener('touchstart', onTouchStart, false);
          }
        });
      }
    	//////////////////////////////////////////////////////////////////

    	//////////////////////////////////////////////////////////////////
      //FLEXSLIDER: RESIZE FUNCTIONS (If necessary)
      if (options.animation.toLowerCase() == "slide" && length > 1) {
        var sliderTimer;
        $(window).resize(function(){
          newSlides.width(slider.width());
          //clones.width(slider.width());
          container.width(((length + 2) * slider.width()) + 2000); //extra width to account for quirks

          //slider resize reset
          clearTimeout(sliderTimer);
          sliderTimer = setTimeout(function(){
            flexAnimate(currentSlide);
          }, 300);
        });
      }
      //////////////////////////////////////////////////////////////////
	  }
  });

})(jQuery);



/*!
 * jCarousel - Riding carousels with jQuery
 *   http://sorgalla.com/jcarousel/
 *
 * Copyright (c) 2006 Jan Sorgalla (http://sorgalla.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Built on top of the jQuery library
 *   http://jquery.com
 *
 * Inspired by the "Carousel Component" by Bill Scott
 *   http://billwscott.com/carousel/
 */

(function(i){var q={vertical:false,rtl:false,start:1,offset:1,size:null,scroll:1,visible:null,animation:"normal",easing:"swing",auto:0,wrap:null,initCallback:null,reloadCallback:null,itemLoadCallback:null,itemFirstInCallback:null,itemFirstOutCallback:null,itemLastInCallback:null,itemLastOutCallback:null,itemVisibleInCallback:null,itemVisibleOutCallback:null,buttonNextHTML:"<div></div>",buttonPrevHTML:"<div></div>",buttonNextEvent:"click",buttonPrevEvent:"click",buttonNextCallback:null,buttonPrevCallback:null, itemFallbackDimension:null},r=false;i(window).bind("load.jcarousel",function(){r=true});i.jcarousel=function(a,c){this.options=i.extend({},q,c||{});this.autoStopped=this.locked=false;this.buttonPrevState=this.buttonNextState=this.buttonPrev=this.buttonNext=this.list=this.clip=this.container=null;if(!c||c.rtl===undefined)this.options.rtl=(i(a).attr("dir")||i("html").attr("dir")||"").toLowerCase()=="rtl";this.wh=!this.options.vertical?"width":"height";this.lt=!this.options.vertical?this.options.rtl? "right":"left":"top";for(var b="",d=a.className.split(" "),f=0;f<d.length;f++)if(d[f].indexOf("jcarousel-skin")!=-1){i(a).removeClass(d[f]);b=d[f];break}if(a.nodeName.toUpperCase()=="UL"||a.nodeName.toUpperCase()=="OL"){this.list=i(a);this.container=this.list.parent();if(this.container.hasClass("jcarousel-clip")){if(!this.container.parent().hasClass("jcarousel-container"))this.container=this.container.wrap("<div></div>");this.container=this.container.parent()}else if(!this.container.hasClass("jcarousel-container"))this.container= this.list.wrap("<div></div>").parent()}else{this.container=i(a);this.list=this.container.find("ul,ol").eq(0)}b!==""&&this.container.parent()[0].className.indexOf("jcarousel-skin")==-1&&this.container.wrap('<div class=" '+b+'"></div>');this.clip=this.list.parent();if(!this.clip.length||!this.clip.hasClass("jcarousel-clip"))this.clip=this.list.wrap("<div></div>").parent();this.buttonNext=i(".jcarousel-next",this.container);if(this.buttonNext.size()===0&&this.options.buttonNextHTML!==null)this.buttonNext= this.clip.after(this.options.buttonNextHTML).next();this.buttonNext.addClass(this.className("jcarousel-next"));this.buttonPrev=i(".jcarousel-prev",this.container);if(this.buttonPrev.size()===0&&this.options.buttonPrevHTML!==null)this.buttonPrev=this.clip.after(this.options.buttonPrevHTML).next();this.buttonPrev.addClass(this.className("jcarousel-prev"));this.clip.addClass(this.className("jcarousel-clip")).css({overflow:"hidden",position:"relative"});this.list.addClass(this.className("jcarousel-list")).css({overflow:"hidden", position:"relative",top:0,margin:0,padding:0}).css(this.options.rtl?"right":"left",0);this.container.addClass(this.className("jcarousel-container")).css({position:"relative"});!this.options.vertical&&this.options.rtl&&this.container.addClass("jcarousel-direction-rtl").attr("dir","rtl");var j=this.options.visible!==null?Math.ceil(this.clipping()/this.options.visible):null;b=this.list.children("li");var e=this;if(b.size()>0){var g=0,k=this.options.offset;b.each(function(){e.format(this,k++);g+=e.dimension(this, j)});this.list.css(this.wh,g+100+"px");if(!c||c.size===undefined)this.options.size=b.size()}this.container.css("display","block");this.buttonNext.css("display","block");this.buttonPrev.css("display","block");this.funcNext=function(){e.next()};this.funcPrev=function(){e.prev()};this.funcResize=function(){e.reload()};this.options.initCallback!==null&&this.options.initCallback(this,"init");if(!r&&i.browser.safari){this.buttons(false,false);i(window).bind("load.jcarousel",function(){e.setup()})}else this.setup()}; var h=i.jcarousel;h.fn=h.prototype={jcarousel:"0.2.7"};h.fn.extend=h.extend=i.extend;h.fn.extend({setup:function(){this.prevLast=this.prevFirst=this.last=this.first=null;this.animating=false;this.tail=this.timer=null;this.inTail=false;if(!this.locked){this.list.css(this.lt,this.pos(this.options.offset)+"px");var a=this.pos(this.options.start,true);this.prevFirst=this.prevLast=null;this.animate(a,false);i(window).unbind("resize.jcarousel",this.funcResize).bind("resize.jcarousel",this.funcResize)}}, reset:function(){this.list.empty();this.list.css(this.lt,"0px");this.list.css(this.wh,"10px");this.options.initCallback!==null&&this.options.initCallback(this,"reset");this.setup()},reload:function(){this.tail!==null&&this.inTail&&this.list.css(this.lt,h.intval(this.list.css(this.lt))+this.tail);this.tail=null;this.inTail=false;this.options.reloadCallback!==null&&this.options.reloadCallback(this);if(this.options.visible!==null){var a=this,c=Math.ceil(this.clipping()/this.options.visible),b=0,d=0; this.list.children("li").each(function(f){b+=a.dimension(this,c);if(f+1<a.first)d=b});this.list.css(this.wh,b+"px");this.list.css(this.lt,-d+"px")}this.scroll(this.first,false)},lock:function(){this.locked=true;this.buttons()},unlock:function(){this.locked=false;this.buttons()},size:function(a){if(a!==undefined){this.options.size=a;this.locked||this.buttons()}return this.options.size},has:function(a,c){if(c===undefined||!c)c=a;if(this.options.size!==null&&c>this.options.size)c=this.options.size;for(var b= a;b<=c;b++){var d=this.get(b);if(!d.length||d.hasClass("jcarousel-item-placeholder"))return false}return true},get:function(a){return i(".jcarousel-item-"+a,this.list)},add:function(a,c){var b=this.get(a),d=0,f=i(c);if(b.length===0){var j,e=h.intval(a);for(b=this.create(a);;){j=this.get(--e);if(e<=0||j.length){e<=0?this.list.prepend(b):j.after(b);break}}}else d=this.dimension(b);if(f.get(0).nodeName.toUpperCase()=="LI"){b.replaceWith(f);b=f}else b.empty().append(c);this.format(b.removeClass(this.className("jcarousel-item-placeholder")), a);f=this.options.visible!==null?Math.ceil(this.clipping()/this.options.visible):null;d=this.dimension(b,f)-d;a>0&&a<this.first&&this.list.css(this.lt,h.intval(this.list.css(this.lt))-d+"px");this.list.css(this.wh,h.intval(this.list.css(this.wh))+d+"px");return b},remove:function(a){var c=this.get(a);if(!(!c.length||a>=this.first&&a<=this.last)){var b=this.dimension(c);a<this.first&&this.list.css(this.lt,h.intval(this.list.css(this.lt))+b+"px");c.remove();this.list.css(this.wh,h.intval(this.list.css(this.wh))- b+"px")}},next:function(){this.tail!==null&&!this.inTail?this.scrollTail(false):this.scroll((this.options.wrap=="both"||this.options.wrap=="last")&&this.options.size!==null&&this.last==this.options.size?1:this.first+this.options.scroll)},prev:function(){this.tail!==null&&this.inTail?this.scrollTail(true):this.scroll((this.options.wrap=="both"||this.options.wrap=="first")&&this.options.size!==null&&this.first==1?this.options.size:this.first-this.options.scroll)},scrollTail:function(a){if(!(this.locked|| this.animating||!this.tail)){this.pauseAuto();var c=h.intval(this.list.css(this.lt));c=!a?c-this.tail:c+this.tail;this.inTail=!a;this.prevFirst=this.first;this.prevLast=this.last;this.animate(c)}},scroll:function(a,c){if(!(this.locked||this.animating)){this.pauseAuto();this.animate(this.pos(a),c)}},pos:function(a,c){var b=h.intval(this.list.css(this.lt));if(this.locked||this.animating)return b;if(this.options.wrap!="circular")a=a<1?1:this.options.size&&a>this.options.size?this.options.size:a;for(var d= this.first>a,f=this.options.wrap!="circular"&&this.first<=1?1:this.first,j=d?this.get(f):this.get(this.last),e=d?f:f-1,g=null,k=0,l=false,m=0;d?--e>=a:++e<a;){g=this.get(e);l=!g.length;if(g.length===0){g=this.create(e).addClass(this.className("jcarousel-item-placeholder"));j[d?"before":"after"](g);if(this.first!==null&&this.options.wrap=="circular"&&this.options.size!==null&&(e<=0||e>this.options.size)){j=this.get(this.index(e));if(j.length)g=this.add(e,j.clone(true))}}j=g;m=this.dimension(g);if(l)k+= m;if(this.first!==null&&(this.options.wrap=="circular"||e>=1&&(this.options.size===null||e<=this.options.size)))b=d?b+m:b-m}f=this.clipping();var p=[],o=0,n=0;j=this.get(a-1);for(e=a;++o;){g=this.get(e);l=!g.length;if(g.length===0){g=this.create(e).addClass(this.className("jcarousel-item-placeholder"));j.length===0?this.list.prepend(g):j[d?"before":"after"](g);if(this.first!==null&&this.options.wrap=="circular"&&this.options.size!==null&&(e<=0||e>this.options.size)){j=this.get(this.index(e));if(j.length)g= this.add(e,j.clone(true))}}j=g;m=this.dimension(g);if(m===0)throw Error("jCarousel: No width/height set for items. This will cause an infinite loop. Aborting...");if(this.options.wrap!="circular"&&this.options.size!==null&&e>this.options.size)p.push(g);else if(l)k+=m;n+=m;if(n>=f)break;e++}for(g=0;g<p.length;g++)p[g].remove();if(k>0){this.list.css(this.wh,this.dimension(this.list)+k+"px");if(d){b-=k;this.list.css(this.lt,h.intval(this.list.css(this.lt))-k+"px")}}k=a+o-1;if(this.options.wrap!="circular"&& this.options.size&&k>this.options.size)k=this.options.size;if(e>k){o=0;e=k;for(n=0;++o;){g=this.get(e--);if(!g.length)break;n+=this.dimension(g);if(n>=f)break}}e=k-o+1;if(this.options.wrap!="circular"&&e<1)e=1;if(this.inTail&&d){b+=this.tail;this.inTail=false}this.tail=null;if(this.options.wrap!="circular"&&k==this.options.size&&k-o+1>=1){d=h.margin(this.get(k),!this.options.vertical?"marginRight":"marginBottom");if(n-d>f)this.tail=n-f-d}if(c&&a===this.options.size&&this.tail){b-=this.tail;this.inTail= true}for(;a-- >e;)b+=this.dimension(this.get(a));this.prevFirst=this.first;this.prevLast=this.last;this.first=e;this.last=k;return b},animate:function(a,c){if(!(this.locked||this.animating)){this.animating=true;var b=this,d=function(){b.animating=false;a===0&&b.list.css(b.lt,0);if(!b.autoStopped&&(b.options.wrap=="circular"||b.options.wrap=="both"||b.options.wrap=="last"||b.options.size===null||b.last<b.options.size||b.last==b.options.size&&b.tail!==null&&!b.inTail))b.startAuto();b.buttons();b.notify("onAfterAnimation"); if(b.options.wrap=="circular"&&b.options.size!==null)for(var f=b.prevFirst;f<=b.prevLast;f++)if(f!==null&&!(f>=b.first&&f<=b.last)&&(f<1||f>b.options.size))b.remove(f)};this.notify("onBeforeAnimation");if(!this.options.animation||c===false){this.list.css(this.lt,a+"px");d()}else this.list.animate(!this.options.vertical?this.options.rtl?{right:a}:{left:a}:{top:a},this.options.animation,this.options.easing,d)}},startAuto:function(a){if(a!==undefined)this.options.auto=a;if(this.options.auto===0)return this.stopAuto(); if(this.timer===null){this.autoStopped=false;var c=this;this.timer=window.setTimeout(function(){c.next()},this.options.auto*1E3)}},stopAuto:function(){this.pauseAuto();this.autoStopped=true},pauseAuto:function(){if(this.timer!==null){window.clearTimeout(this.timer);this.timer=null}},buttons:function(a,c){if(a==null){a=!this.locked&&this.options.size!==0&&(this.options.wrap&&this.options.wrap!="first"||this.options.size===null||this.last<this.options.size);if(!this.locked&&(!this.options.wrap||this.options.wrap== "first")&&this.options.size!==null&&this.last>=this.options.size)a=this.tail!==null&&!this.inTail}if(c==null){c=!this.locked&&this.options.size!==0&&(this.options.wrap&&this.options.wrap!="last"||this.first>1);if(!this.locked&&(!this.options.wrap||this.options.wrap=="last")&&this.options.size!==null&&this.first==1)c=this.tail!==null&&this.inTail}var b=this;if(this.buttonNext.size()>0){this.buttonNext.unbind(this.options.buttonNextEvent+".jcarousel",this.funcNext);a&&this.buttonNext.bind(this.options.buttonNextEvent+ ".jcarousel",this.funcNext);this.buttonNext[a?"removeClass":"addClass"](this.className("jcarousel-next-disabled")).attr("disabled",a?false:true);this.options.buttonNextCallback!==null&&this.buttonNext.data("jcarouselstate")!=a&&this.buttonNext.each(function(){b.options.buttonNextCallback(b,this,a)}).data("jcarouselstate",a)}else this.options.buttonNextCallback!==null&&this.buttonNextState!=a&&this.options.buttonNextCallback(b,null,a);if(this.buttonPrev.size()>0){this.buttonPrev.unbind(this.options.buttonPrevEvent+ ".jcarousel",this.funcPrev);c&&this.buttonPrev.bind(this.options.buttonPrevEvent+".jcarousel",this.funcPrev);this.buttonPrev[c?"removeClass":"addClass"](this.className("jcarousel-prev-disabled")).attr("disabled",c?false:true);this.options.buttonPrevCallback!==null&&this.buttonPrev.data("jcarouselstate")!=c&&this.buttonPrev.each(function(){b.options.buttonPrevCallback(b,this,c)}).data("jcarouselstate",c)}else this.options.buttonPrevCallback!==null&&this.buttonPrevState!=c&&this.options.buttonPrevCallback(b, null,c);this.buttonNextState=a;this.buttonPrevState=c},notify:function(a){var c=this.prevFirst===null?"init":this.prevFirst<this.first?"next":"prev";this.callback("itemLoadCallback",a,c);if(this.prevFirst!==this.first){this.callback("itemFirstInCallback",a,c,this.first);this.callback("itemFirstOutCallback",a,c,this.prevFirst)}if(this.prevLast!==this.last){this.callback("itemLastInCallback",a,c,this.last);this.callback("itemLastOutCallback",a,c,this.prevLast)}this.callback("itemVisibleInCallback", a,c,this.first,this.last,this.prevFirst,this.prevLast);this.callback("itemVisibleOutCallback",a,c,this.prevFirst,this.prevLast,this.first,this.last)},callback:function(a,c,b,d,f,j,e){if(!(this.options[a]==null||typeof this.options[a]!="object"&&c!="onAfterAnimation")){var g=typeof this.options[a]=="object"?this.options[a][c]:this.options[a];if(i.isFunction(g)){var k=this;if(d===undefined)g(k,b,c);else if(f===undefined)this.get(d).each(function(){g(k,this,d,b,c)});else{a=function(m){k.get(m).each(function(){g(k, this,m,b,c)})};for(var l=d;l<=f;l++)l!==null&&!(l>=j&&l<=e)&&a(l)}}}},create:function(a){return this.format("<li></li>",a)},format:function(a,c){a=i(a);for(var b=a.get(0).className.split(" "),d=0;d<b.length;d++)b[d].indexOf("jcarousel-")!=-1&&a.removeClass(b[d]);a.addClass(this.className("jcarousel-item")).addClass(this.className("jcarousel-item-"+c)).css({"float":this.options.rtl?"right":"left","list-style":"none"}).attr("jcarouselindex",c);return a},className:function(a){return a+" "+a+(!this.options.vertical? "-horizontal":"-vertical")},dimension:function(a,c){var b=a.jquery!==undefined?a[0]:a,d=!this.options.vertical?(b.offsetWidth||h.intval(this.options.itemFallbackDimension))+h.margin(b,"marginLeft")+h.margin(b,"marginRight"):(b.offsetHeight||h.intval(this.options.itemFallbackDimension))+h.margin(b,"marginTop")+h.margin(b,"marginBottom");if(c==null||d==c)return d;d=!this.options.vertical?c-h.margin(b,"marginLeft")-h.margin(b,"marginRight"):c-h.margin(b,"marginTop")-h.margin(b,"marginBottom");i(b).css(this.wh, d+"px");return this.dimension(b)},clipping:function(){return!this.options.vertical?this.clip[0].offsetWidth-h.intval(this.clip.css("borderLeftWidth"))-h.intval(this.clip.css("borderRightWidth")):this.clip[0].offsetHeight-h.intval(this.clip.css("borderTopWidth"))-h.intval(this.clip.css("borderBottomWidth"))},index:function(a,c){if(c==null)c=this.options.size;return Math.round(((a-1)/c-Math.floor((a-1)/c))*c)+1}});h.extend({defaults:function(a){return i.extend(q,a||{})},margin:function(a,c){if(!a)return 0; var b=a.jquery!==undefined?a[0]:a;if(c=="marginRight"&&i.browser.safari){var d={display:"block","float":"none",width:"auto"},f,j;i.swap(b,d,function(){f=b.offsetWidth});d.marginRight=0;i.swap(b,d,function(){j=b.offsetWidth});return j-f}return h.intval(i.css(b,c))},intval:function(a){a=parseInt(a,10);return isNaN(a)?0:a}});i.fn.jcarousel=function(a){if(typeof a=="string"){var c=i(this).data("jcarousel"),b=Array.prototype.slice.call(arguments,1);return c[a].apply(c,b)}else return this.each(function(){i(this).data("jcarousel", new h(this,a))})}})(jQuery);



$(function() {
    var galleries = $('.ad-gallery').adGallery();
});



/**
 * Copyright (c) 2010 Anders Ekdahl (http://coffeescripter.com/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.2.4
 *
 * Demo and documentation: http://coffeescripter.com/code/ad-gallery/
 */
(function($) {
  $.fn.adGallery = function(options) {
    var defaults = { loader_image: '/site_media/static/img/loader.gif',
                     start_at_index: 0,
                     description_wrapper: false,
                     thumb_opacity: 0.4,
                     animate_first_image: false,
                     animation_speed: 400,
                     width: false,
                     height: false,
                     display_next_and_prev: true,
                     display_back_and_forward: true,
                     scroll_jump: 0, // If 0, it jumps the width of the container
                     slideshow: {
                       enable: true,
                       autostart: false,
                       speed: 5000,
                       start_label: 'Start',
                       stop_label: 'Stop',
                       stop_on_scroll: true,
                       countdown_prefix: '(',
                       countdown_sufix: ')',
                       onStart: false,
                       onStop: false
                     },
                     effect: 'fade', // or 'slide-vert', 'fade', or 'resize', 'none'
                     enable_keyboard_move: true,
                     cycle: true,
                     callbacks: {
                       init: false,
                       afterImageVisible: false,
                       beforeImageVisible: false
                     }
    };
    var settings = $.extend(false, defaults, options);
    if(options && options.slideshow) {
      settings.slideshow = $.extend(false, defaults.slideshow, options.slideshow);
    };
    if(!settings.slideshow.enable) {
      settings.slideshow.autostart = false;
    };
    var galleries = [];
    $(this).each(function() {
      var gallery = new AdGallery(this, settings);
      galleries[galleries.length] = gallery;
    });
    // Sorry, breaking the jQuery chain because the gallery instances
    // are returned so you can fiddle with them
    return galleries;
  };

  function VerticalSlideAnimation(img_container, direction, desc) {
    var current_top = parseInt(img_container.css('top'), 10);
    if(direction == 'left') {
      var old_image_top = '-'+ this.image_wrapper_height +'px';
      img_container.css('top', this.image_wrapper_height +'px');
    } else {
      var old_image_top = this.image_wrapper_height +'px';
      img_container.css('top', '-'+ this.image_wrapper_height +'px');
    };
    if(desc) {
      desc.css('bottom', '-'+ desc[0].offsetHeight +'px');
      desc.animate({bottom: 0}, this.settings.animation_speed * 2);
    };
    if(this.current_description) {
      this.current_description.animate({bottom: '-'+ this.current_description[0].offsetHeight +'px'}, this.settings.animation_speed * 2);
    };
    return {old_image: {top: old_image_top},
            new_image: {top: current_top}};
  };

  function HorizontalSlideAnimation(img_container, direction, desc) {
    var current_left = parseInt(img_container.css('left'), 10);
    if(direction == 'left') {
      var old_image_left = '-'+ this.image_wrapper_width +'px';
      img_container.css('left',this.image_wrapper_width +'px');
    } else {
      var old_image_left = this.image_wrapper_width +'px';
      img_container.css('left','-'+ this.image_wrapper_width +'px');
    };
    if(desc) {
      desc.css('bottom', '-'+ desc[0].offsetHeight +'px');
      desc.animate({bottom: 0}, this.settings.animation_speed * 2);
    };
    if(this.current_description) {
      this.current_description.animate({bottom: '-'+ this.current_description[0].offsetHeight +'px'}, this.settings.animation_speed * 2);
    };
    return {old_image: {left: old_image_left},
            new_image: {left: current_left}};
  };

  function ResizeAnimation(img_container, direction, desc) {
    var image_width = img_container.width();
    var image_height = img_container.height();
    var current_left = parseInt(img_container.css('left'), 10);
    var current_top = parseInt(img_container.css('top'), 10);
    img_container.css({width: 0, height: 0, top: this.image_wrapper_height / 2, left: this.image_wrapper_width / 2});
    return {old_image: {width: 0,
                        height: 0,
                        top: this.image_wrapper_height / 2,
                        left: this.image_wrapper_width / 2},
            new_image: {width: image_width,
                        height: image_height,
                        top: current_top,
                        left: current_left}};
  };

  function FadeAnimation(img_container, direction, desc) {
    img_container.css('opacity', 0);
    return {old_image: {opacity: 0},
            new_image: {opacity: 1}};
  };

  // Sort of a hack, will clean this up... eventually
  function NoneAnimation(img_container, direction, desc) {
    img_container.css('opacity', 0);
    return {old_image: {opacity: 0},
            new_image: {opacity: 1},
            speed: 0};
  };

  function AdGallery(wrapper, settings) {
    this.init(wrapper, settings);
  };
  AdGallery.prototype = {
    // Elements
    wrapper: false,
    image_wrapper: false,
    gallery_info: false,
    nav: false,
    loader: false,
    preloads: false,
    thumbs_wrapper: false,
    scroll_back: false,
    scroll_forward: false,
    next_link: false,
    prev_link: false,

    slideshow: false,
    image_wrapper_width: 0,
    image_wrapper_height: 0,
    current_index: 0,
    current_image: false,
    current_description: false,
    nav_display_width: 0,
    settings: false,
    images: false,
    in_transition: false,
    animations: false,
    init: function(wrapper, settings) {
      var context = this;
      this.wrapper = $(wrapper);
      this.settings = settings;
      this.setupElements();
      this.setupAnimations();
      if(this.settings.width) {
        this.image_wrapper_width = this.settings.width;
        this.image_wrapper.width(this.settings.width);
        this.wrapper.width(this.settings.width);
      } else {
        this.image_wrapper_width = this.image_wrapper.width();
      };
      if(this.settings.height) {
        this.image_wrapper_height = this.settings.height;
        this.image_wrapper.height(this.settings.height);
      } else {
        this.image_wrapper_height = this.image_wrapper.height();
      };
      this.nav_display_width = this.nav.width();
      this.current_index = 0;
      this.current_image = false;
      this.current_description = false;
      this.in_transition = false;
      this.findImages();
      if(this.settings.display_next_and_prev) {
        this.initNextAndPrev();
      };
      // The slideshow needs a callback to trigger the next image to be shown
      // but we don't want to give it access to the whole gallery instance
      var nextimage_callback = function(callback) {
        return context.nextImage(callback);
      };
      this.slideshow = new AdGallerySlideshow(nextimage_callback, this.settings.slideshow);
      this.controls.append(this.slideshow.create());
      if(this.settings.slideshow.enable) {
        this.slideshow.enable();
      } else {
        this.slideshow.disable();
      };
      if(this.settings.display_back_and_forward) {
        this.initBackAndForward();
      };
      if(this.settings.enable_keyboard_move) {
        this.initKeyEvents();
      };
      var start_at = parseInt(this.settings.start_at_index, 10);
      if(window.location.hash && window.location.hash.indexOf('#ad-image') === 0) {
        start_at = window.location.hash.replace(/[^0-9]+/g, '');
        // Check if it's a number
        if((start_at * 1) != start_at) {
          start_at = this.settings.start_at_index;
        };
      };

      this.loading(true);
      this.showImage(start_at,
        function() {
          // We don't want to start the slideshow before the image has been
          // displayed
          if(context.settings.slideshow.autostart) {
            context.preloadImage(start_at + 1);
            context.slideshow.start();
          };
        }
      );
      this.fireCallback(this.settings.callbacks.init);
    },
    setupAnimations: function() {
      this.animations = {
        'slide-vert': VerticalSlideAnimation,
        'slide-hori': HorizontalSlideAnimation,
        'resize': ResizeAnimation,
        'fade': FadeAnimation,
        'none': NoneAnimation
      };
    },
    setupElements: function() {
      this.controls = this.wrapper.find('.ad-controls');
      this.gallery_info = $('<p class="ad-info"></p>');
      this.controls.append(this.gallery_info);
      this.image_wrapper = this.wrapper.find('.ad-image-wrapper');
      this.image_wrapper.empty();
      this.nav = this.wrapper.find('.ad-nav');
      this.thumbs_wrapper = this.nav.find('.ad-thumbs');
      this.preloads = $('<div class="ad-preloads"></div>');
      this.loader = $('<img class="ad-loader" src="'+ this.settings.loader_image +'">');
      this.image_wrapper.append(this.loader);
      this.loader.hide();
      $(document.body).append(this.preloads);
    },
    loading: function(bool) {
      if(bool) {
        this.loader.show();
      } else {
        this.loader.hide();
      };
    },
    addAnimation: function(name, fn) {
      if($.isFunction(fn)) {
        this.animations[name] = fn;
      };
    },
    findImages: function() {
      var context = this;
      this.images = [];
      var thumb_wrapper_width = 0;
      var thumbs_loaded = 0;
      var thumbs = this.thumbs_wrapper.find('a');
      var thumb_count = thumbs.length;
      if(this.settings.thumb_opacity < 1) {
        thumbs.find('img').css('opacity', this.settings.thumb_opacity);
      };
      thumbs.each(
        function(i) {
          var link = $(this);
          var image_src = link.attr('href');
          var thumb = link.find('img');
          // Check if the thumb has already loaded
          if(!context.isImageLoaded(thumb[0])) {
            thumb.load(
              function() {
                thumb_wrapper_width += this.parentNode.parentNode.offsetWidth;
                thumbs_loaded++;
              }
            );
          } else{
            thumb_wrapper_width += thumb[0].parentNode.parentNode.offsetWidth;
            thumbs_loaded++;
          };
          link.addClass('ad-thumb'+ i);
          link.click(
            function() {
              context.showImage(i);
              context.slideshow.stop();
              return false;
            }
          ).hover(
            function() {
              if(!$(this).is('.ad-active') && context.settings.thumb_opacity < 1) {
                $(this).find('img').fadeTo(300, 1);
              };
              context.preloadImage(i);
            },
            function() {
              if(!$(this).is('.ad-active') && context.settings.thumb_opacity < 1) {
                $(this).find('img').fadeTo(300, context.settings.thumb_opacity);
              };
            }
          );
          var link = false;
          if(thumb.data('ad-link')) {
            link = thumb.data('ad-link');
          } else if(thumb.attr('longdesc') && thumb.attr('longdesc').length) {
            link = thumb.attr('longdesc');
          };
          var desc = false;
          if(thumb.data('ad-desc')) {
            desc = thumb.data('ad-desc');
          } else if(thumb.attr('alt') && thumb.attr('alt').length) {
            desc = thumb.attr('alt');
          };
          var title = false;
          if(thumb.data('ad-title')) {
            title = thumb.data('ad-title');
          } else if(thumb.attr('title') && thumb.attr('title').length) {
            title = thumb.attr('title');
          };
          context.images[i] = { thumb: thumb.attr('src'), image: image_src, error: false,
                                preloaded: false, desc: desc, title: title, size: false,
                                link: link };
        }
      );
      // Wait until all thumbs are loaded, and then set the width of the ul
      var inter = setInterval(
        function() {
          if(thumb_count == thumbs_loaded) {
            thumb_wrapper_width -= 100;
            var list = context.nav.find('.ad-thumb-list');
            list.css('width', thumb_wrapper_width +'px');
            var i = 1;
            var last_height = list.height();
            while(i < 201) {
              list.css('width', (thumb_wrapper_width + i) +'px');
              if(last_height != list.height()) {
                break;
              }
              last_height = list.height();
              i++;
            }
            clearInterval(inter);
          };
        },
        100
      );
    },
    initKeyEvents: function() {
      var context = this;
      $(document).keydown(
        function(e) {
          if(e.keyCode == 39) {
            // right arrow
            context.nextImage();
            context.slideshow.stop();
          } else if(e.keyCode == 37) {
            // left arrow
            context.prevImage();
            context.slideshow.stop();
          };
        }
      );
    },
    initNextAndPrev: function() {
      this.next_link = $('<div class="ad-next"><div class="ad-next-image"></div></div>');
      this.prev_link = $('<div class="ad-prev"><div class="ad-prev-image"></div></div>');
      this.image_wrapper.append(this.next_link);
      this.image_wrapper.append(this.prev_link);
      var context = this;
      this.prev_link.add(this.next_link).mouseover(
        function(e) {
          // IE 6 hides the wrapper div, so we have to set it's width
          $(this).css('height', context.image_wrapper_height);
          $(this).find('div').show();
        }
      ).mouseout(
        function(e) {
          $(this).find('div').hide();
        }
      ).click(
        function() {
          if($(this).is('.ad-next')) {
            context.nextImage();
            context.slideshow.stop();
          } else {
            context.prevImage();
            context.slideshow.stop();
          };
        }
      ).find('div').css('opacity', 0.7);
    },
    initBackAndForward: function() {
      var context = this;
      this.scroll_forward = $('<div class="ad-forward"></div>');
      this.scroll_back = $('<div class="ad-back"></div>');
      this.nav.append(this.scroll_forward);
      this.nav.prepend(this.scroll_back);
      var has_scrolled = 0;
      var thumbs_scroll_interval = false;
      $(this.scroll_back).add(this.scroll_forward).click(
        function() {
          // We don't want to jump the whole width, since an image
          // might be cut at the edge
          var width = context.nav_display_width - 50;
          if(context.settings.scroll_jump > 0) {
            var width = context.settings.scroll_jump;
          };
          if($(this).is('.ad-forward')) {
            var left = context.thumbs_wrapper.scrollLeft() + width;
          } else {
            var left = context.thumbs_wrapper.scrollLeft() - width;
          };
          if(context.settings.slideshow.stop_on_scroll) {
            context.slideshow.stop();
          };
          context.thumbs_wrapper.animate({scrollLeft: left +'px'});
          return false;
        }
      ).css('opacity', 0.6).hover(
        function() {
          var direction = 'left';
          if($(this).is('.ad-forward')) {
            direction = 'right';
          };
          thumbs_scroll_interval = setInterval(
            function() {
              has_scrolled++;
              // Don't want to stop the slideshow just because we scrolled a pixel or two
              if(has_scrolled > 30 && context.settings.slideshow.stop_on_scroll) {
                context.slideshow.stop();
              };
              var left = context.thumbs_wrapper.scrollLeft() + 1;
              if(direction == 'left') {
                left = context.thumbs_wrapper.scrollLeft() - 1;
              };
              context.thumbs_wrapper.scrollLeft(left);
            },
            10
          );
          $(this).css('opacity', 1);
        },
        function() {
          has_scrolled = 0;
          clearInterval(thumbs_scroll_interval);
          $(this).css('opacity', 0.6);
        }
      );
    },
    _afterShow: function() {
      this.gallery_info.html((this.current_index + 1) +' / '+ this.images.length);
      if(!this.settings.cycle) {
        // Needed for IE
        this.prev_link.show().css('height', this.image_wrapper_height);
        this.next_link.show().css('height', this.image_wrapper_height);
        if(this.current_index == (this.images.length - 1)) {
          this.next_link.hide();
        };
        if(this.current_index == 0) {
          this.prev_link.hide();
        };
      };
      this.fireCallback(this.settings.callbacks.afterImageVisible);
    },
    /**
     * Checks if the image is small enough to fit inside the container
     * If it's not, shrink it proportionally
     */
    _getContainedImageSize: function(image_width, image_height) {
      if(image_height > this.image_wrapper_height) {
        var ratio = image_width / image_height;
        image_height = this.image_wrapper_height;
        image_width = this.image_wrapper_height * ratio;
      };
      if(image_width > this.image_wrapper_width) {
        var ratio = image_height / image_width;
        image_width = this.image_wrapper_width;
        image_height = this.image_wrapper_width * ratio;
      };
      return {width: image_width, height: image_height};
    },
    /**
     * If the image dimensions are smaller than the wrapper, we position
     * it in the middle anyway
     */
    _centerImage: function(img_container, image_width, image_height) {
      img_container.css('top', '0px');
      if(image_height < this.image_wrapper_height) {
        var dif = this.image_wrapper_height - image_height;
        img_container.css('top', (dif / 2) +'px');
      };
      img_container.css('left', '0px');
      if(image_width < this.image_wrapper_width) {
        var dif = this.image_wrapper_width - image_width;
        img_container.css('left', (dif / 2) +'px');
      };
    },
    _getDescription: function(image) {
      var desc = false;
      if(image.desc.length || image.title.length) {
        var title = '';
        if(image.title.length) {
          title = '<strong class="ad-description-title">'+ image.title +'</strong>';
        };
        var desc = '';
        if(image.desc.length) {
          desc = '<span>'+ image.desc +'</span>';
        };
        desc = $('<p class="ad-image-description">'+ title + desc +'</p>');
      };
      return desc;
    },
    /**
     * @param function callback Gets fired when the image has loaded, is displaying
     *                          and it's animation has finished
     */
    showImage: function(index, callback) {
      if(this.images[index] && !this.in_transition) {
        var context = this;
        var image = this.images[index];
        this.in_transition = true;
        if(!image.preloaded) {
          this.loading(true);
          this.preloadImage(index, function() {
            context.loading(false);
            context._showWhenLoaded(index, callback);
          });
        } else {
          this._showWhenLoaded(index, callback);
        };
      };
    },
    /**
     * @param function callback Gets fired when the image has loaded, is displaying
     *                          and it's animation has finished
     */
    _showWhenLoaded: function(index, callback) {
      if(this.images[index]) {
        var context = this;
        var image = this.images[index];
        var img_container = $(document.createElement('div')).addClass('ad-image');
        var img = $(new Image()).attr('src', image.image);
        if(image.link) {
          var link = $('<a href="'+ image.link +'" target="_blank"></a>');
          link.append(img);
          img_container.append(link);
        } else {
          img_container.append(img);
        }
        this.image_wrapper.prepend(img_container);
        var size = this._getContainedImageSize(image.size.width, image.size.height);
        img.attr('width', size.width);
        img.attr('height', size.height);
        img_container.css({width: size.width +'px', height: size.height +'px'});
        this._centerImage(img_container, size.width, size.height);
        var desc = this._getDescription(image, img_container);
        if(desc) {
          if(!this.settings.description_wrapper) {
            img_container.append(desc);
            var width = size.width - parseInt(desc.css('padding-left'), 10) - parseInt(desc.css('padding-right'), 10);
            desc.css('width', width +'px');
          } else {
            this.settings.description_wrapper.append(desc);
          }
        };
        this.highLightThumb(this.nav.find('.ad-thumb'+ index));

        var direction = 'right';
        if(this.current_index < index) {
          direction = 'left';
        };
        this.fireCallback(this.settings.callbacks.beforeImageVisible);
        if(this.current_image || this.settings.animate_first_image) {
          var animation_speed = this.settings.animation_speed;
          var easing = 'swing';
          var animation = this.animations[this.settings.effect].call(this, img_container, direction, desc);
          if(typeof animation.speed != 'undefined') {
            animation_speed = animation.speed;
          };
          if(typeof animation.easing != 'undefined') {
            easing = animation.easing;
          };
          if(this.current_image) {
            var old_image = this.current_image;
            var old_description = this.current_description;
            old_image.animate(animation.old_image, animation_speed, easing,
              function() {
                old_image.remove();
                if(old_description) old_description.remove();
              }
            );
          };
          img_container.animate(animation.new_image, animation_speed, easing,
            function() {
              context.current_index = index;
              context.current_image = img_container;
              context.current_description = desc;
              context.in_transition = false;
              context._afterShow();
              context.fireCallback(callback);
            }
          );
        } else {
          this.current_index = index;
          this.current_image = img_container;
          context.current_description = desc;
          this.in_transition = false;
          context._afterShow();
          this.fireCallback(callback);
        };
      };
    },
    nextIndex: function() {
      if(this.current_index == (this.images.length - 1)) {
        if(!this.settings.cycle) {
          return false;
        };
        var next = 0;
      } else {
        var next = this.current_index + 1;
      };
      return next;
    },
    nextImage: function(callback) {
      var next = this.nextIndex();
      if(next === false) return false;
      this.preloadImage(next + 1);
      this.showImage(next, callback);
      return true;
    },
    prevIndex: function() {
      if(this.current_index == 0) {
        if(!this.settings.cycle) {
          return false;
        };
        var prev = this.images.length - 1;
      } else {
        var prev = this.current_index - 1;
      };
      return prev;
    },
    prevImage: function(callback) {
      var prev = this.prevIndex();
      if(prev === false) return false;
      this.preloadImage(prev - 1);
      this.showImage(prev, callback);
      return true;
    },
    preloadAll: function() {
      var context = this;
      var i = 0;
      function preloadNext() {
        if(i < context.images.length) {
          i++;
          context.preloadImage(i, preloadNext);
        };
      };
      context.preloadImage(i, preloadNext);
    },
    preloadImage: function(index, callback) {
      if(this.images[index]) {
        var image = this.images[index];
        if(!this.images[index].preloaded) {
          var img = $(new Image());
          img.attr('src', image.image);
          if(!this.isImageLoaded(img[0])) {
            this.preloads.append(img);
            var context = this;
            img.load(
              function() {
                image.preloaded = true;
                image.size = { width: this.width, height: this.height };
                context.fireCallback(callback);
              }
            ).error(
              function() {
                image.error = true;
                image.preloaded = false;
                image.size = false;
              }
            );
          } else {
            image.preloaded = true;
            image.size = { width: img[0].width, height: img[0].height };
            this.fireCallback(callback);
          };
        } else {
          this.fireCallback(callback);
        };
      };
    },
    isImageLoaded: function(img) {
      if(typeof img.complete != 'undefined' && !img.complete) {
        return false;
      };
      if(typeof img.naturalWidth != 'undefined' && img.naturalWidth == 0) {
        return false;
      };
      return true;
    },
    highLightThumb: function(thumb) {
      this.thumbs_wrapper.find('.ad-active').removeClass('ad-active');
      thumb.addClass('ad-active');
      if(this.settings.thumb_opacity < 1) {
        this.thumbs_wrapper.find('a:not(.ad-active) img').fadeTo(300, this.settings.thumb_opacity);
        thumb.find('img').fadeTo(300, 1);
      };
      var left = thumb[0].parentNode.offsetLeft;
      left -= (this.nav_display_width / 2) - (thumb[0].offsetWidth / 2);
      this.thumbs_wrapper.animate({scrollLeft: left +'px'});
    },
    fireCallback: function(fn) {
      if($.isFunction(fn)) {
        fn.call(this);
      };
    }
  };

  function AdGallerySlideshow(nextimage_callback, settings) {
    this.init(nextimage_callback, settings);
  };
  AdGallerySlideshow.prototype = {
    start_link: false,
    stop_link: false,
    countdown: false,
    controls: false,

    settings: false,
    nextimage_callback: false,
    enabled: false,
    running: false,
    countdown_interval: false,
    init: function(nextimage_callback, settings) {
      var context = this;
      this.nextimage_callback = nextimage_callback;
      this.settings = settings;
    },
    create: function() {
      this.start_link = $('<span class="ad-slideshow-start">'+ this.settings.start_label +'</span>');
      this.stop_link = $('<span class="ad-slideshow-stop">'+ this.settings.stop_label +'</span>');
      this.countdown = $('<span class="ad-slideshow-countdown"></span>');
      this.controls = $('<div class="ad-slideshow-controls"></div>');
      this.controls.append(this.start_link).append(this.stop_link).append(this.countdown);
      this.countdown.hide();

      var context = this;
      this.start_link.click(
        function() {
          context.start();
        }
      );
      this.stop_link.click(
        function() {
          context.stop();
        }
      );
      $(document).keydown(
        function(e) {
          if(e.keyCode == 83) {
            // 's'
            if(context.running) {
              context.stop();
            } else {
              context.start();
            };
          };
        }
      );
      return this.controls;
    },
    disable: function() {
      this.enabled = false;
      this.stop();
      this.controls.hide();
    },
    enable: function() {
      this.enabled = true;
      this.controls.show();
    },
    toggle: function() {
      if(this.enabled) {
        this.disable();
      } else {
        this.enable();
      };
    },
    start: function() {
      if(this.running || !this.enabled) return false;
      var context = this;
      this.running = true;
      this.controls.addClass('ad-slideshow-running');
      this._next();
      this.fireCallback(this.settings.onStart);
      return true;
    },
    stop: function() {
      if(!this.running) return false;
      this.running = false;
      this.countdown.hide();
      this.controls.removeClass('ad-slideshow-running');
      clearInterval(this.countdown_interval);
      this.fireCallback(this.settings.onStop);
      return true;
    },
    _next: function() {
      var context = this;
      var pre = this.settings.countdown_prefix;
      var su = this.settings.countdown_sufix;
      clearInterval(context.countdown_interval);
      this.countdown.show().html(pre + (this.settings.speed / 1000) + su);
      var slide_timer = 0;
      this.countdown_interval = setInterval(
        function() {
          slide_timer += 1000;
          if(slide_timer >= context.settings.speed) {
            var whenNextIsShown = function() {
              // A check so the user hasn't stoped the slideshow during the
              // animation
              if(context.running) {
                context._next();
              };
              slide_timer = 0;
            };
            if(!context.nextimage_callback(whenNextIsShown)) {
              context.stop();
            };
            slide_timer = 0;
          };
          var sec = parseInt(context.countdown.text().replace(/[^0-9]/g, ''), 10);
          sec--;
          if(sec > 0) {
            context.countdown.html(pre + sec + su);
          };
        },
        1000
      );
    },
    fireCallback: function(fn) {
      if($.isFunction(fn)) {
        fn.call(this);
      };
    }
  };
})(jQuery);



/*!
Smallipop 0.1.5 (01/08/2012)
Copyright (c) 2011-2012 Small Improvements (http://www.small-improvements.com)

Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.

@author Sebastian Helzle (sebastian@small-improvements.com)
*/
(function($) {
  $.smallipop = {
    version: '0.1.5',
    defaults: {
      popupOffset: 31,
      popupYOffset: 0,
      popupDistance: 20,
      popupDelay: 100,
      windowPadding: 30,
      hideTrigger: false,
      theme: "default",
      infoClass: "smallipopHint",
      triggerAnimationSpeed: 150,
      popupAnimationSpeed: 200,
      invertAnimation: false,
      horizontal: false,
      preferredPosition: "top",
      triggerOnClick: false,
      touchSupport: true,
      funcEase: "easeInOutQuad"
    },
    popup: null,
    lastId: 1,
    hideSmallipop: function() {
      var direction, shownId, sip, trigger, triggerOpt, xDistance, yDistance;
      sip = $.smallipop;
      shownId = sip.popup.data("shown");
      trigger = $(".smallipop" + shownId);
      triggerOpt = trigger.data("options") || sip.defaults;
      if (shownId && triggerOpt.hideTrigger) {
        trigger.stop(true).fadeTo(triggerOpt.triggerAnimationSpeed, 1);
      }
      direction = triggerOpt.invertAnimation ? -1 : 1;
      xDistance = sip.popup.data("xDistance") * direction;
      yDistance = sip.popup.data("yDistance") * direction;
      return sip.popup.data({
        hideDelayTimer: null,
        beingShown: false
      }).stop(true).animate({
        top: "-=" + xDistance + "px",
        left: "+=" + yDistance + "px",
        opacity: 0
      }, triggerOpt.popupAnimationSpeed, triggerOpt.funcEase, function() {
        var tip;
        tip = $(this);
        if (!tip.data("beingShown")) {
          return tip.css("display", "none").data("shown", "");
        }
      });
    },
    showSmallipop: function(e) {
      var sip;
      sip = $.smallipop;
      if (sip.popup.data("shown") !== $(this).data("id")) e.preventDefault();
      return sip.triggerMouseover.call(this);
    },
    onWindowClick: function(e) {
      var popup, sip;
      sip = $.smallipop;
      popup = sip.popup;
      if (!(e.target === popup[0] || $(e.target).closest(".sipInitialized").length)) {
        return sip.hideSmallipop.call(this);
      }
    },
    onTouchDevice: function() {
      return typeof Modernizr !== "undefined" && Modernizr !== null ? Modernizr.touch : void 0;
    },
    killTimers: function() {
      var hideTimer, popup, showTimer;
      popup = $.smallipop.popup;
      hideTimer = popup.data("hideDelayTimer");
      showTimer = popup.data("showDelayTimer");
      if (hideTimer) clearTimeout(hideTimer);
      if (showTimer) return clearTimeout(showTimer);
    },
    triggerMouseover: function() {
      var id, opt, popup, self, shownId, sip;
      self = $(this);
      id = self.data("id");
      sip = $.smallipop;
      popup = sip.popup;
      shownId = popup.data("shown");
      sip.killTimers();
      popup.data((id ? "triggerHovered" : "hovered"), true);
      if (id && !popup.data("beingShown") && shownId !== id) {
        opt = self.data("options");
        return popup.data("showDelayTimer", setTimeout(function() {
          var offset, popupCenter, popupH, popupOffsetLeft, popupOffsetTop, popupW, popupY, selfHeight, selfWidth, selfY, trigger, triggerOpt, win, winHeight, winWidth, windowPadding, xDistance, yDistance, yOffset;
          if (!popup.data("triggerHovered")) return;
          trigger = $(".smallipop" + shownId);
          triggerOpt = trigger.data("options") || sip.defaults;
          if (shownId && triggerOpt.hideTrigger) {
            trigger.stop(true).fadeTo(triggerOpt.fadeSpeed, 1);
          }
          popup.removeClass().addClass(opt.theme).data({
            beingShown: true,
            shown: id
          }).find(".sipContent").html(self.data("hint"));
          win = $(window);
          xDistance = yDistance = opt.popupDistance;
          yOffset = opt.popupYOffset;
          offset = self.offset();
          popupH = popup.outerHeight();
          popupW = popup.outerWidth();
          popupCenter = popupW / 2;
          winWidth = win.width();
          winHeight = win.height();
          selfWidth = self.outerWidth();
          selfHeight = self.outerHeight();
          windowPadding = opt.windowPadding;
          popupOffsetLeft = offset.left + selfWidth / 2;
          popupOffsetTop = offset.top - popupH + yOffset;
          if (opt.horizontal) {
            xDistance = 0;
            popupOffsetTop += selfHeight / 2 + popupH / 2;
            if ((opt.preferredPosition === "left" && offset.left - popupW - opt.popupOffset > windowPadding) || offset.left + selfWidth + popupW > winWidth - windowPadding) {
              popup.addClass("sipPositionedLeft");
              popupOffsetLeft = offset.left - popupW - opt.popupOffset;
              yDistance = -yDistance;
            } else {
              popup.addClass("sipPositionedRight");
              popupOffsetLeft = offset.left + selfWidth + opt.popupOffset;
            }
          } else {
            yDistance = 0;
            if (popupOffsetLeft + popupCenter > winWidth - windowPadding) {
              popupOffsetLeft -= popupCenter * 2 - opt.popupOffset;
              popup.addClass("sipAlignLeft");
            } else if (popupOffsetLeft - popupCenter < windowPadding) {
              popupOffsetLeft -= opt.popupOffset;
              popup.addClass("sipAlignRight");
            } else {
              popupOffsetLeft -= popupCenter;
            }
            selfY = offset.top - win.scrollTop();
            popupY = popupH + opt.popupDistance - yOffset;
            if ((opt.preferredPosition === "bottom" && selfY + selfHeight + popupY < winHeight - windowPadding) || selfY - popupY < windowPadding) {
              popupOffsetTop += popupH + selfHeight - 2 * yOffset;
              xDistance = -xDistance;
              yOffset = 0;
              popup.addClass("sipAlignBottom");
            }
          }
          if (opt.hideTrigger) {
            $(".smallipop" + id).stop(true).fadeTo(opt.triggerAnimationSpeed, 0);
          }
          return popup.data({
            xDistance: xDistance,
            yDistance: yDistance
          }).stop(true).css({
            top: popupOffsetTop,
            left: popupOffsetLeft,
            display: "block",
            opacity: 0
          }).animate({
            top: "-=" + xDistance + "px",
            left: "+=" + yDistance + "px",
            opacity: 1
          }, opt.popupAnimationSpeed, opt.funcEase, function() {
            return popup.data("beingShown", false);
          });
        }, opt.popupDelay));
      }
    },
    triggerMouseout: function() {
      var id, popup, self, sip;
      self = $(this);
      sip = $.smallipop;
      popup = sip.popup;
      id = self.data("id");
      sip.killTimers();
      popup.data((id ? "triggerHovered" : "hovered"), false);
      if (!(popup.data("hovered") || popup.data("triggerHovered"))) {
        return popup.data("hideDelayTimer", setTimeout(sip.hideSmallipop, 500));
      }
    }
  };
  /* Add default easing function for smallipop to jQuery if missing
  */
  if (!$.easing.easeInOutQuad) {
    $.easing.easeInOutQuad = function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
      } else {
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      }
    };
  }
  return $.fn.smallipop = function(options, hint) {
    var popup, sip, triggerEvents;
    if (options == null) options = {};
    if (hint == null) hint = "";
    sip = $.smallipop;
    options = $.extend({}, sip.defaults, options);
    if (options.moveSpeed != null) options.popupAnimationSpeed = options.moveSpeed;
    if (options.hideSpeed != null) {
      options.triggerAnimationSpeed = options.hideSpeed;
    }
    triggerEvents = {};
    if (options.triggerOnClick || (options.touchSupport && sip.onTouchDevice())) {
      triggerEvents = {
        click: sip.showSmallipop
      };
    } else {
      triggerEvents = {
        mouseover: sip.triggerMouseover,
        mouseout: sip.triggerMouseout,
        click: sip.hideSmallipop
      };
    }
    popup = $("#smallipop");
    if (!popup.length) {
      popup = sip.popup = $("<div id=\"smallipop\"><div class=\"sipContent\"/><div class=\"sipArrowBorder\"/><div class=\"sipArrow\"/></div>").css("opacity", 0).bind({
        mouseover: sip.triggerMouseover,
        mouseout: sip.triggerMouseout
      });
      $("body").append(popup);
      $("a", popup.get(0)).live("click", sip.hideSmallipop);
      $(document).bind("click touchend", sip.onWindowClick);
    }
    return this.each(function() {
      var newId, objHint, self;
      self = $(this);
      objHint = hint || self.attr("title") || self.find("." + options.infoClass).html();
      if (objHint && !self.hasClass("sipInitialized")) {
        newId = sip.lastId++;
        self.addClass("sipInitialized smallipop" + newId).data({
          id: newId,
          options: options,
          hint: objHint
        }).attr("title", "").bind(triggerEvents);
        return $("a", this).live("click", sip.hideSmallipop);
      }
    });
  };
})(jQuery);
