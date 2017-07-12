;(function($) {

	$.fn.slideshow = function(customOptions){
	
		var	$body 					= $('body'),
			$window					= $(window),
			$document 				= $(document),
			options 				= {},
			customOptions 			= customOptions ? customOptions : {}
			defaults  				= {	
				sliderImages:[],
				slideshowHolder: '',
				thumbImageWidth: "80px",
				thumbImageHeight: "60px",
				hasThumbs: false,
				hasFullScreen: false,
				animationSpeed: "700",
				emptyThumbs: 3,
				videoSrc: false
			};

		var stop_timeout		= false,
			currentThumbPos 	= 0,
			currentThumb 		= 0,
			slideCount			= 0,
			thumbnails_off_on 	= 0,
			controls_off_on 	= 0,
			video_off_on 		= 1,
			share_off_on 		= 1,
			slideShowFlag       = true;

		var init = function(el){
		
			$slideshowHolder 	= $(el);
			options				= $.extend({}, defaults, customOptions);
			slideCount			= customOptions.sliderImages.length; // count image from array

			// must have array of images path
			if(slideCount === 0){
				return;
			}

			initGaleryHtml(options.sliderImages, slideCount);

			$slidesClass 	= $(".s_slides"),
			$thumbsUl 		= $(".s_slideshow_small_thumbs ul"),
			$nextClass		= $(".s_next"),
			$prevClass		= $(".s_prev"),
			$pageNumClass	= $(".s_page_num"),
			$firstClass		= $(".s_first"),
			$lastClass		= $(".s_last"),
			$smallThumbLeftClass	= $(".s_small_thumb_left"),
			$smallThumbRightClass	= $(".s_small_thumb_right"),
			thumbWidth 		= $thumbsUl.find("li").outerWidth(true),
			thumbPanelWidth = (slideCount * thumbWidth + ((options.emptyThumbs * 2) * thumbWidth));

			initSlideHandler();

			// number of slides and current 
			$pageNumClass.val(currentThumb + 1);
			$(".s_page_num_holder span").text(slideCount);

			// thumbs ul width
			$thumbsUl.css("width", thumbPanelWidth + "px");

			bindings();

		} 

		var bindings = function(){

			$window.resize(function() {
				return $(".s_overlay").is(":visible") ? setOverlay() : false;
			});

			if(options.hasFullScreen === true || options.hasFullScreen === 'true'){				
				$(".s_fullscreen").live("click", function() {
					if($slideshowHolder.hasClass("s_popUpOpen") || $(".s_overlay").is(":visible")){
						return;
					}else {
						$(this).toggleClass('s_fullscreen_on');						
						openOverlay();
					}
				});
			}

			$(".s_close_fullscreen").live("click", function() {
				closeOverlay();
				$(".s_fullscreen").removeClass("s_fullscreen_on");
			});

			$(".s_thumbs_small").live('click',function(){
				$(".s_slideshow_small_thumbs").toggleClass('s_hide_thums');
			});


			$(".s_close_slide_video").live("click", function(){
				$(".s_slide_video").hide();
				setCookie('s_video_off_on', 0);
				$("#s_video_off_on").slider().slider( "value" , video_off_on_cookie);

				var slider = $('#s_video_off_on').slider();
					slider.slider('value', 0);
					slider.trigger('slide',{ ui: $('#s_video_off_on .ui-slider-handle', slider), value: 0});

				$("#s_video_off_on .ui-slider-handle").css("margin-left",'1px');
			});

			$document.on("keyup", function(e) {
				if (e.keyCode == 27) {
					closeOverlay();
				}else if(e.keyCode == 37){
					$prevClass.trigger('click');
				}else if(e.keyCode == 39){
					$nextClass.trigger('click');
				}

			});

			/* @todo proveriti da li sve radi i isklikati dobro */
			$smallThumbRightClass.on('click', function() {
				if (currentThumb < slideCount-1) {
					++currentThumb;
					doAnimate(".s_slideshow_small_thumbs ul", -thumbWidth + currentThumbPos, options.animationSpeed);
					currentThumbPos -= thumbWidth;
					setThumbControlState();

					return true;
				}
				return;
			});

			/* @todo proveriti da li sve radi i isklikati dobro */
			$smallThumbLeftClass.on('click', function() {
				if (currentThumb > 0) {
					--currentThumb;
					currentThumbPos += thumbWidth;
					doAnimate(".s_slideshow_small_thumbs ul", currentThumbPos, options.animationSpeed);
					setThumbControlState();

					return true;
				}
				return;
			});

			//////////////////////////thumbs end//////////////////////////////////////
			$nextClass.on("click", function() {
				if (currentThumb < slideCount - 1 && slideShowFlag === true) {
					++currentThumb;
					imageTransition(currentThumb);

					$thumbsUl.animate({ left: currentThumbPos - thumbWidth + "px" }, '600');

					currentThumbPos -= thumbWidth;
					$pageNumClass.val(currentThumb + 1);

					setCurrentClass(currentThumb + options.emptyThumbs);
					setControlsState();

					$(".s_slider").trigger('initSlider');
					return true;
				}
				return;
			});

			$prevClass.on("click", function() {
				if (currentThumb > 0 && slideShowFlag === true) {
					--currentThumb;
					imageTransition(currentThumb);
					doAnimate(".s_slideshow_small_thumbs ul", currentThumbPos + thumbWidth, options.animationSpeed);

					currentThumbPos += thumbWidth;
					$pageNumClass.val(currentThumb + 1);

					setCurrentClass(currentThumb + options.emptyThumbs);
					setControlsState();

					$(".s_slider").trigger('initSlider');
					return true;
				}
				return;
			});

			$lastClass.on("click", function() {
				if (currentThumb < slideCount - 1) {
					currentThumbPos = -thumbPanelWidth + ((options.emptyThumbs*2) * thumbWidth) + thumbWidth;
					$thumbsUl.animate({
						left: currentThumbPos + "px"
					}, options.animationSpeed);

					imageTransition(slideCount - 1);
					setCurrentClass(slideCount - 1 + options.emptyThumbs);

					currentThumb = slideCount - 1;
					setControlsState();
					$pageNumClass.val(currentThumb + 1);

					$(".s_slider").trigger('initSlider');

					return true;
				}
				return ;
			});

			$firstClass.on("click", function() {
				if (currentThumb > 0) {
					
					doAnimate(".s_slideshow_small_thumbs ul", 0, options.animationSpeed);
					currentThumbPos = 0;

					imageTransition(0);
					setCurrentClass(options.emptyThumbs);
					currentThumb = 0;
					setControlsState();
					$pageNumClass.val(currentThumb + 1);

					$(".s_slider").trigger('initSlider');
					return true;
				}
				return;
			});


			$pageNumClass.keyup(function(e) {

				if (e.which == 13) {
					number = parseInt($(this).val());
					
					if ((parseFloat(number) == parseInt(number, 10)) && !isNaN(number) && number <= slideCount) {

						var thumbsPos = -(thumbWidth * (number - 1));

						doAnimate(".s_slideshow_small_thumbs ul", thumbsPos, options.animationSpeed);
						currentThumbPos = thumbsPos;
						
						var slider = $('.s_slider').slider();
						slider.slider('value',number - 1);
						slider.trigger('slide',{ ui: $('.ui-slider-handle', slider), value: number - 1 });

						currentThumb 	= number - 1;

						imageTransition(number - 1);
						setCurrentClass(number + options.emptyThumbs - 1);
						setControlsState();

						return true;

					}

					$(this).val(currentThumb);
					return;
				}
			});

			$pageNumClass.bind('focus click', function() {
				$(this).select();
			});

			$thumbsUl.find('li').on('click', function() {

				if ($(this).hasClass('s_current') || $(this).hasClass('s_emptyThumbs')){
					return;
				}

				var clickedThumb = $(this).index();
				currentThumbPos = -parseInt((clickedThumb - options.emptyThumbs) * thumbWidth, 10);	
				currentThumb = clickedThumb - options.emptyThumbs;

				// only  if we don't have empty thubs
				if(options.emptyThumbs === 0){
					var visibleThumbs = parseInt($(".s_slideshow_small_thumbs").width()/thumbWidth,10);
					if((slideCount - clickedThumb) <= visibleThumbs){
						currentThumbPos = currentThumbPos + ((visibleThumbs-(slideCount - clickedThumb)) * thumbWidth);	
					}
				}

				imageTransition(currentThumb);
				$thumbsUl.animate({
					left: currentThumbPos + "px"
				}, '600');

				if (clickedThumb > currentThumb) {
					currentThumbPos = -parseInt((clickedThumb - options.emptyThumbs) * thumbWidth, 10);
				}

				setCurrentClass(clickedThumb);
				$pageNumClass.val(currentThumb + 1);
				setControlsState();

				$(".s_slider").trigger('initSlider');
			});

			// show/hide .bottom_controls
			$(".s_show_hide").live("click", function() {
				$(this).parent().toggleClass('s_bottom_controls_hide');

				var text = $('.s_show_hide').text();
				$('.s_show_hide').text(text == "Hide" ? "Show" : "Hide");
			});	

		}

		var initGaleryHtml = function(sliderImages, slideCount){
			
			initPopUp();

			var $bigImgs 		= []; // temp array for big image urls
			var $thumbsImgs 	= []; // temp array for thumb image urls
			var bigImgClass 	= ''; // we need this for {bigImageFirst}, {bigImageLast}, {bigImageDisabled}
			var thumImgClass 	= ''; // // we need this for {current} thumb
			var $control 		= initSlidesControlHtml(); // slider control
			
			for (var i = 0; i < slideCount; i++) {
				$bigImgs.push($('<img>').attr('src', sliderImages[i]));
				$thumbsImgs.push($('<img width="' + options.thumbImageWidth + '" height="' + options.thumbImageHeight + '">').attr('src', sliderImages[i]));
			}

			// slideshow_preview {ul.slides big images} {div.control_holder}
			$slideshowHolder.append('<div class="s_slideshow_preview"><ul class="s_slides"></ul></div>');

			if(options.hasThumbs == 'true' || options.hasThumbs == true){
				// slideshow_small_thumbs {ul li thumb elemnts} {small_thumb_left} {small_thumb_right}
				$slideshowHolder.append('<div class="s_slideshow_small_thumbs"><ul></ul></div>');
			}
			// {small_thumb_left} {small_thumb_right}
			$(".s_slideshow_small_thumbs").append('<a href="javascript:void(0);" class="s_small_thumb_left s_thumb_disabled"></a>');
			$(".s_slideshow_small_thumbs").append('<a href="javascript:void(0);" class="s_small_thumb_right"></a>');

			for (var x = 0; x < slideCount; x++) {

				if (x === 0) {
					// add class {bigImageFirst} for first element
					bigImgClass = 'class="s_current s_bigImageFirst"';
					thumImgClass = 'class="s_current"';

				} else if (x == (slideCount - 1)) {
					// add class {bigImageLast} for last element
					bigImgClass = 'class="s_bigImageLast s_bigImageDisabled"';
					thumImgClass = 'class="s_thumbImageLast"';

				} else {
					// add class {bigImageDisabled} for all hidden images
					bigImgClass = 'class="s_bigImageDisabled"';
					thumImgClass = 'class="s_clickable"';
				}

				var $bigLi = $("<li " + bigImgClass + "></li>").append($bigImgs[x]);
				var $thumbLi = $("<li " + thumImgClass + "></li>").append($thumbsImgs[x]);
				$(".s_slideshow_preview ul").append($bigLi);
				$(".s_slideshow_small_thumbs ul").append($thumbLi);
			}

			// add empty thumbs
			if (options.emptyThumbs > 0) {
				for (var y = 0; y < options.emptyThumbs; y++) {
					$(".s_slideshow_small_thumbs ul").prepend($('<li class="s_emptyThumbs"></li>'));
					$(".s_slideshow_small_thumbs ul").append($('<li class="s_emptyThumbs"></li>'));
				}
			}

			$(".s_slideshow_preview").append($control);

		};

		var initPopUp = function(){
			var overlayDiv = "<div class='s_overlay'></div>";
			$body.prepend(overlayDiv);
		};

		var initSlidesControlHtml = function(){

			var $control = '';

			/* slider_holder */
			$control = '<div class="s_control_holder">';
			$control +=		'<div class="s_slider_holder">';
			$control +=			'<div class="s_slider">';
			$control +=				'<a class="s_slider_circle ui-slider-handle" href="javascript:void(0);"></a>';
			$control +=			'</div>';
			$control +=		'</div>';

			/* page_num_holder */
			$control +=		'<div class="s_page_num_holder">';
			$control +=			'<input type="current_num" value="" class="s_page_num" name="current_num"><span></span>';
			$control +=		'</div>'; /* end page_num_holder */

			/* controls */
			$control +=		'<div class="s_controls">';
			$control +=			'<a class="s_first s_disabled" href="javascript:void(0);">first</a>';
			$control +=			'<a class="s_prev s_disabled" href="javascript:void(0);">prev</a>';
			$control +=			'<a class="s_next" href="javascript:void(0);">next</a>';
			$control +=			'<a class="s_last" href="javascript:void(0);">last</a>';
			$control +=		'</div>'; /* end controls */


			if(options.hasFullScreen === true || options.hasFullScreen === 'true'){
				/* other controls */
			$control +=		'<div class="s_other_controls">';
			$control +=			'<a class="s_thumbs_small" href="javascript:void(0);">thumbs</a>';
			$control +=			'<a class="s_fullscreen" href="#close_fullscreen">fullscreen</a>';
			$control +=		'</div>'; /* end other controls */
			}

			$control += '</div>'; /* end slider_holder */

			return $control;

		};

		// bottom controls
		var initBottomControls = function(){
			var $control = '';
			$control +=	'<div class="s_bottom_controls">';
			
			$control +=		'<a href="javascript:void(0);" class="s_show_hide">show</a>';
			
			$control +=		'<ul class="s_bottom_controls_all">';
			
			$control +=			'<li class="s_controls_co">';
			$control +=				'<span class="s_title_con">Controls</span>';
			$control +=				'<div class="s_button_holder" id="s_controls_off_on">';
			$control +=					'<span class="s_on_off">Off</span>';
			$control +=					'<span class="s_on_off">On</span>';
			$control +=					'<a href="javascript:void(0);" class="s_button ui-slider-handle"></a>';
			$control +=				'</div>';
			$control +=			'</li>';
			
			$control +=			'<li class="s_thumbnails_co">';
			$control +=				'<span class="s_title_con">Thumbnails</span>';
			$control +=				'<div class="s_button_holder" id="s_thumbnails_off_on">';
			$control +=					'<span class="s_on_off">Off</span>';
			$control +=					'<span class="s_on_off">On</span>';
			$control +=					'<a href="javascript:void(0);" class="s_button ui-slider-handle"></a>';
			$control +=				'</div>';
			$control +=			'</li>';
			
			$control +=			'<li class="s_video_co">';
			$control +=			'<span class="s_title_con">Video</span>';
			$control +=				'<div class="s_button_holder" id="s_video_off_on">';
			$control +=					'<span class="s_on_off">Off</span>';
			$control +=					'<span class="s_on_off">On</span>';
			$control +=					'<a href="javascript:void(0);" class="s_button ui-slider-handle"></a>';
			$control +=				'</div>';
			$control +=			'</li>';
			
			$control +=			'<li class="s_share_co">';
			$control +=				'<span class="s_title_con">Share</span>';
			$control +=				'<div class="s_button_holder" id="s_share_off_on">';
			$control +=					'<span class="s_on_off">Off</span>';
			$control +=					'<span class="s_on_off">On</span>';
			$control +=					'<a href="javascript:void(0);" class="s_button ui-slider-handle"></a>';
			$control +=				'</div>';
			$control +=			'</li>';
			
			$control +=		'</ul>';
			
			$control += '</div> <!--/ end bottom_controls -->';

			return $control;

		};

		// keyboard controls
		var initKeyboardControls = function(){

			$control  = '';
			$control +=	'<div class="s_info_for_contols">';
			//$control +=		'<img class="s_keyboard_arrows" alt="info for contols" src="img/info_for_controls.png">';
			$control +=		'<p>';
			$control +=			'<span>Use</span> <img src="img/info_arrow_left.png">';
			$control +=			'<span>left and right</span>';
			$control +=			'<img src="img/info_arrow_right.png">';
			$control +=			'<span>keyboard arrows to navigate or you can just <span class="s_text_yellow">turn on</span> standard controls.</span>';
			$control +=		'</p>';
			$control +=	'</div>';

			return $control;
		};

		// video player 
		var initVideoPlayer = function(){

			$player	  =	'';

			$player	 += '<div class="s_slide_video">';
			$player	 +=		'<a class="s_close_slide_video" href="javascript:void(0);">X</a>';
			$player	 +=		'<iframe width="250" height="157" frameborder="0" allowfullscreen="" src="' + options.videoSrc + '"></iframe>';
			$player	 +=	'</div>';

			return $player;
		};		

		var initSocialIcons = function(){

			$icons 	 = '';
			$icons  += '<div class="s_top_share_holder"><a href="https://twitter.com/share" class="s_twitter-share-button">Tweet</a></div>';

			return $icons;
		};

		var imageTransition = function(number){
			slideShowFlag = false;
			$slidesClass.find('.s_current').fadeOut('fast', function() {
				$slidesClass.find('li').eq(number).fadeIn('fast', function() {
					$(this).removeClass('s_bigImageDisabled');
					$(this).addClass('s_current');
					slideShowFlag = true;
				});
				$(this).removeClass('s_current');
				$(this).addClass('s_bigImageDisabled');				
			});
		};

		var setCurrentClass = function(position){
			$thumbsUl.find(".s_current").removeClass("s_current").addClass('s_clickable');
			$thumbsUl.find("li").eq(position).removeClass('s_clickable').addClass("s_current");
		};
		
		var setThumbControlState = function(){

			if (currentThumb === 0) {
				$smallThumbRightClass.removeClass("s_thumb_disabled");
				$smallThumbLeftClass.addClass("s_thumb_disabled");
			}

			if (currentThumb > 0 && currentThumb < slideCount - 1) {
				$smallThumbRightClass.removeClass("s_thumb_disabled");
				$smallThumbLeftClass.removeClass("s_thumb_disabled");
			}

			if (slideCount - 1 === currentThumb) {
				$smallThumbRightClass.addClass("s_thumb_disabled");
				$smallThumbLeftClass.removeClass("s_thumb_disabled");
			}	
		};
			
		var setControlsState = function() {
			
			if (currentThumb === 0) {

				$nextClass.removeClass("s_disabled");
				$prevClass.addClass("s_disabled");
				$lastClass.removeClass("s_disabled");
				$firstClass.addClass("s_disabled");

				$smallThumbRightClass.removeClass("s_thumb_disabled");
				$smallThumbLeftClass.addClass("s_thumb_disabled");
			}

			if (currentThumb > 0 && currentThumb < slideCount - 1) {		

				$nextClass.removeClass("s_disabled");
				$prevClass.removeClass("s_disabled");
				$firstClass.removeClass("s_disabled");
				$lastClass.removeClass("s_disabled");

				$smallThumbRightClass.removeClass("s_thumb_disabled");
				$smallThumbLeftClass.removeClass("s_thumb_disabled");
			}

			if (slideCount - 1 === currentThumb) {

				$prevClass.removeClass("s_disabled");
				$firstClass.removeClass("s_disabled");
				$nextClass.addClass("s_disabled");
				$lastClass.addClass("s_disabled");

				$smallThumbRightClass.addClass("s_thumb_disabled");
				$smallThumbLeftClass.removeClass("s_thumb_disabled");
			}
		};

		var initSlideHandler = function(){

			var position;

			$(".s_slider").on('initSlider', function() {
				$(this).slider({
					range: "min",
					value: currentThumb,
					min: 0,
					max: slideCount - 1,
					step: 1,
				
					slide: function(event, ui) {
						$pageNumClass.val(ui.value + 1);

						var handle		= $(this).find('.ui-slider-handle');
						var position	= ui.value;

						if(position == (slideCount - 1)){
							handle.css('margin-left', '-10px');
						}else if(position == 0){
							handle.css('margin-left', '0px');
						}else{
							handle.css('margin-left', '0px');
						}

					},
					start: function(event, ui){
						this.position = ui.value;
					},
					stop: function(event, ui) {
						
						if(this.position == ui.value){
							return false;
						}
						
						this.position 	= ui.value;						
						currentThumbPos = -(parseInt(ui.value)  * thumbWidth);

						$thumbsUl.animate({
							left: -(parseInt(ui.value)  * thumbWidth) + "px"
						}, '600');

						imageTransition(ui.value);
						currentThumb = ui.value;
						setControlsState();
						setCurrentClass(currentThumb + options.emptyThumbs);

					},
					change: function(event, ui){
						var position	= ui.value;
						var handle		= $(this).find('.ui-slider-handle');

						if(position == (slideCount - 1)){
							handle.css('margin-left', '-10px');
						}else if(position == 0){
							handle.css('margin-left', '0px');
						}else{
							handle.css('margin-left', '0px');
						}
					}
				});
			});

			$(".s_slider").trigger('initSlider');
		};


		// set overlay
		var setOverlay = function() {
			var overlayWidth = $(document).width(),
				overlayHeight = $(document).height();

			$(".s_overlay").css({
				"width": overlayWidth,
				"height": overlayHeight
			});
		};

		// close overlay
		var closeOverlay = function() {
			var overlay = $(".s_overlay");

			$(".s_control_holder").show();
			$(".s_slideshow_small_thumbs").removeClass('s_hide_thums');
			
			$(".s_bottom_controls").hide();
			$(".s_info_for_contols").hide();
			$(".s_close_fullscreen").hide();
			$(".s_slide_video").hide();
			$(".s_top_share_holder").hide();

			return overlay.is(":visible") ? overlay.hide() && $slideshowHolder.removeClass("s_popUpOpen") : false;
		};

		// open overay
		var openOverlay = function() {
			var overlay = $(".s_overlay");			

			$body.append(initKeyboardControls());
			$body.append(initBottomControls());

			// bootom slide opcije
			$("#s_thumbnails_off_on, #s_controls_off_on, #s_video_off_on, #s_share_off_on").on('initSlider', function() {

				$(this).slider({
					value: 1,
					min: 0,
					max: 1,
					step: 1,					

					create: function(event, ui) {

						var position	= ui.value;
						var handle		= $(this).find('.ui-slider-handle');

						if(position == 1 || typeof position == 'undefined'){
							handle.css('margin-left', '-41px');
						}else{
							handle.css('margin-left', '1px');
						}
					},
					slide: function(event, ui) {
						
						var handle		= $(this).find('.ui-slider-handle');
						var position	= ui.value;
						var toggleName = $(this).attr('id');																
						
						if(toggleName === "s_controls_off_on"){

							var controlHolderClass = $(".s_control_holder");
							if(controlHolderClass.is(":visible")){							
								controlHolderClass.hide();
							}else{
								controlHolderClass.show();
							}
						}

						if(toggleName === "s_thumbnails_off_on"){

							var smallThumbsClass = $(".s_slideshow_small_thumbs");
							if(smallThumbsClass.is(":visible")){				
								smallThumbsClass.addClass('s_hide_thums');				
							}else{
								smallThumbsClass.removeClass('s_hide_thums');
							}
						}

						if(toggleName === "s_video_off_on"){

							var slideVideoClass = $(".s_slide_video");
							if(slideVideoClass.is(":visible")){							
								slideVideoClass.hide();
							}else if(slideVideoClass.length === 0){	
								$body.append(initVideoPlayer());
							}else{
								slideVideoClass.show();
							}
						}

						if(toggleName === "s_share_off_on"){

							var top_share_holder = $(".s_top_share_holder");
							if(top_share_holder.is(":visible")){							
								top_share_holder.hide();
							}else if(top_share_holder.length === 0){
								$slideshowHolder.prepend(initSocialIcons());
							}else{
								top_share_holder.show();
							}
						}				

						setCookie(toggleName, position);	


						if(position == 1){
							handle.css('margin-left', '-41px');
						}else{
							handle.css('margin-left', '1px');
						}
					}				
				});
			});

			thumbnails_off_on_cookie	= parseInt(getCookie('s_thumbnails_off_on'), 10);
			controls_off_on_cookie		= parseInt(getCookie('s_controls_off_on'), 10);
			video_off_on_cookie			= parseInt(getCookie('s_video_off_on'), 10);
			share_off_on_cookie			= parseInt(getCookie('s_share_off_on'), 10);
		

			$("#s_thumbnails_off_on, #s_controls_off_on, #s_video_off_on, #s_share_off_on").trigger('initSlider');

			// hack for bottom slider
			if(thumbnails_off_on_cookie === 0 || isNaN(thumbnails_off_on_cookie)){

				var thumbnails_off_on = $('#s_thumbnails_off_on').slider();
					thumbnails_off_on.slider('value', 0);
					thumbnails_off_on.trigger('slide',{ ui: $('#s_thumbnails_off_on .ui-slider-handle', 0), value: 0});
			}

			if(controls_off_on_cookie === 0 || isNaN(controls_off_on_cookie)){
				var controls_off_on = $('#s_controls_off_on').slider();
					controls_off_on.slider('value', 0);
					controls_off_on.trigger('slide',{ ui: $('#s_controls_off_on .ui-slider-handle', 0), value: 0});

			}

			if(video_off_on_cookie === 0 || isNaN(video_off_on_cookie)){
				var video_off_on = $('#s_video_off_on').slider();
					video_off_on.slider('value', 0);
					video_off_on.trigger('slide',{ ui: $('#s_video_off_on .ui-slider-handle', 0), value: 0});
			}
			
			if(share_off_on_cookie === 0 || isNaN(share_off_on_cookie)){
				var share_off_on = $('#s_share_off_on').slider();
				share_off_on.slider('value', 0);
				share_off_on.trigger('slide',{ ui: $('#s_share_off_on .ui-slider-handle', 0), value: 0});
			}

			// hack for slider margin
			if($("#s_thumbnails_off_on .ui-slider-handle").css("margin-left") === '-41px' && (thumbnails_off_on_cookie === 0 || isNaN(thumbnails_off_on_cookie))){
				$("#s_thumbnails_off_on .ui-slider-handle").css("margin-left",'1px');
			}
			if($("#s_controls_off_on .ui-slider-handle").css("margin-left") === '-41px' && (controls_off_on_cookie === 0 || isNaN(controls_off_on_cookie))){
				$("#s_controls_off_on .ui-slider-handle").css("margin-left",'1px');
			}
			if($("#s_video_off_on .ui-slider-handle").css("margin-left") === '-41px' && (video_off_on_cookie === 0 || isNaN(video_off_on_cookie))){
				$("#s_video_off_on .ui-slider-handle").css("margin-left",'1px');
			}
			if($("#s_share_off_on .ui-slider-handle").css("margin-left") === '-41px' && (share_off_on_cookie === 0 || isNaN(share_off_on_cookie))){
				$("#s_share_off_on .ui-slider-handle").css("margin-left",'1px');
			}

			if(options.videoSrc !== "" && video_off_on_cookie !== 0 && (!$(".s_top_share_holder").is(":visible")) && (isNaN(video_off_on_cookie) === false)){
				$body.append(initVideoPlayer());
			}

			if(share_off_on_cookie !== 0 && (!$(".s_top_share_holder").is(":visible")) && (isNaN(share_off_on_cookie) === false)){
				$slideshowHolder.prepend(initSocialIcons());
			}

			$body.append('<a class="s_close_fullscreen" id="s_close_fullscreen" href="javascript:void(0);"></a>');

			// hide info after 10 sec
			$(".s_info_for_contols").delay(10000).fadeOut('slow');

			if(thumbnails_off_on_cookie === 0 || isNaN(thumbnails_off_on_cookie)){
				$(".s_slideshow_small_thumbs").addClass('s_hide_thums');
			}

			if(controls_off_on_cookie === 0 || isNaN(controls_off_on_cookie)){
				$(".s_control_holder").hide();
			}

			return overlay.is(":visible") ? false : overlay.show() && setOverlay() || $slideshowHolder.addClass("s_popUpOpen");
		};

		// ovo cemo verovatno da obrisemo
		var doAnimate = function(id, left_position, speed) {
			$(id).animate({
				left: left_position + "px"
			}, speed);
		};

		// set cookie
		var setCookie = function(name,value,days){

			value = encodeURIComponent(value);
			if (days){
				var date = new Date();
				date.setTime(date.getTime()+(days * 24 * 60 * 60 * 1000));
				var expires = "; expires="+date.toGMTString();
			}else{
				var expires = "";
			}
			document.cookie = name + "=" + value + expires + "; path=/";
		};

		// get cookie
		var getCookie = function(name){
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');

			for(var i=0;i < ca.length;i++){
				var c = ca[i];
				while(c.charAt(0)==' '){
					c = c.substring(1,c.length);
				}
				if(c.indexOf(nameEQ) == 0){
					return decodeURIComponent(c.substring(nameEQ.length,c.length));
				}
			}
			return null;
		};

		this.each (
			function(){
				init(this);
			}
		)
	};

})(jQuery);