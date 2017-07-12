
jQuery(document).ready(function() {

    $('li.question_details ul.q_links a').live('click', function(){
        var $top = $(this).parent().parent().parent();
        var $toptop = $(this).parent().parent().parent().parent();
        var thisClass = $(this).attr('class');

        switch (thisClass) {
            case 'show_hide_answer_list':
                /*$("." + thisClass).html('Hide Answers').addClass('sada');*/
                $toptop.find('.question_note_list, .answer_list').toggle();
                if ($(this).html() == 'Hide Answers') {
                    $(this).html('Show Answers');
                } else{
                    $(this).html('Hide Answers');
                };
                $top.find('#new_answer_form').hide();
                $top.find('#new_question_note_form').hide();
                $top.find('#new_note_answer_form').hide();
            break;

            case 'post_answer_question':
                $toptop.find('.question_note_list, .answer_list').hide();
                $top.find('#new_answer_form').toggle();
                $top.find('#new_question_note_form').hide();
            break;

            case 'post_note_question':
                $toptop.find('.question_note_list, .answer_list').hide();
                $top.find('#new_question_note_form').toggle();
                $top.find('#new_answer_form').hide();
                $top.find('#new_note_answer_form').hide();
            break;
        }
    });

    $('.answers_list ul.q_links a').live('click', function(){
        var $top = $(this).parent().parent().parent();
        var thisClass = $(this).attr('class');

        switch (thisClass) {
            case 'post_note_answer':
                $top.find('#new_note_answer_form').toggle();
            break;
        }
    });

    $('textarea.textarea_js, .new_question_textarea').live('focus', function() {
       $(this).animate({
           height:'70px',
         }, 500, function() {
       });
    });


    /* DROP DOWN MENU
     *********************************/

    $('ul.nav li.explore').live('click', function(){
        $(this).find('ul.drop_nav').slideToggle(function(){
            $('.login_form').click(function(e){
                e.stopPropagation();
            });
        });
    });


    /* DROP DOWN MENU DASHBOARD
     *********************************/

    $('ul.nav li.dash').live('click', function(){
        $(this).find('ul.drop_nav').slideToggle(function(){
            $('.login_form').click(function(e){
                e.stopPropagation();
            });
        });
    });




    /* POPUP FOR CREATE ACCOUNT
     **********************************/
    var equalH = $(document).height(); /* Equal height of the whole page */

    $('.home_steps_holder .yellow_button, #tt_create_account').click(function(){
        $('#createAccountPopup').show().fadeIn();
        $('.background_black').height(equalH).show().fadeIn();
    });

    $('.close').click(function(){
        $('#createAccountPopup').hide().fadeOut();
        $('.background_black').hide().fadeOut();
    });


    /* LOGIN FORM
     *************************************/
    $('.forgot_top').hide();

    $('.forgotPass').click(function(e){
        e.preventDefault();
        $('.forgot_top').show();
        $('.login_top').hide();
        return false;
    });

    $('#top_nav li.login_holder').live('click', function(){
        $(this).find('.login_form').slideToggle(function(){
            $('.login_form').click(function(e){
               e.stopPropagation();
            });
        });
    });




    /* SHARE BUTTONS
     **************************************/

    $('ul .share_holder_link').click(function(){
        $(this).find(".share_holder").slideToggle();
    });


    /* EXTRA INFO
     **************************************/

    var slicePoint = 170;
    var widow = 4;
    $('.description').each(function() {
    var allText = $(this).html();
    var startText = allText.slice(0,slicePoint).replace(/\w+$/,'');
    var endText = allText.slice(startText.length);
    if ( endText.replace(/\s+$/,'').split(' ').length> widow ) {
      $(this).html([
        startText,
        '<a href="#" style="float:none;" class="read-more"> read more »</a>',
        '<span class="more">',
          endText,
          '<a href="#" style="float:none;" class="read-less"> read less »</a>',
        '</span>'
        ].join('')
      );
    }
    });

    // *** hide details until read-more link is clicked;
    // then hide link and show details.
    $('span.more').hide();
    $('a.read-more').click(function() {
        $(this).hide().next('span.more').fadeIn();
        return false;
    });

    $('a.read-less').click(function() {
        $(this).parent('span.more').fadeOut(function(){
            $('a.read-more').fadeIn();
        });
        return false;
    });


    /* BROWSE SESSION
     **************************************/
    $('ul.session_list li.session_link').live('click', function(){
        $('.session_link ul').slideToggle().show();
    });


    /* TABLE OF CONTENT
     **************************************/
    $('li.vid_table_content a').live('click', function(){
        $('li.vid_table_content a').next('ul').slideToggle().show();
    });


    /* UPLOAD
     **************************************/
    $('.video_nav .upload_link').click(function(){
        $('.upload_holder').slideDown();
    });

    $('.upload_holder .watch_close').live('click', function(){
        $('.upload_holder').slideUp();
    });

    /* DOWNLOAD
     **************************************/
    $('.video_nav .download_link').click(function(){
        $('.download_holder').slideDown();
    });

    $('.download_holder .watch_close').live('click', function(){
        $('.download_holder').slideUp();
    });

    /* SHARE BUTTON WATCH PAGE
     **************************************/
    $('.video_nav .share_holder_link').click(function(){
        $(this).find(".share_holder_watch").slideToggle();
    });


    /* FEEDBACK WATCH PAGE
     **************************************/
    $('.video_nav .feedback_link').click(function(){
        $(".feedback_holder").slideDown();
    });

    $('.feedback_holder .watch_close').live('click', function(){
        $('.feedback_holder').slideUp();
    });

   $('#btnSubmit').click(function(){
    $('.please_wait').show();
   });


    /* HOVER */
    $('.forms_item').hover(function(){
        $(this).addClass('up_hov');
    }, function(){
        $(this).removeClass('up_hov');
    });

  if($("#slidetags_urls").length > 0 ){
    /** sync view talk page - if slidetags_urls field is set, only then the following code executes **/

    var urls = $("#slidetags_urls").val();
    var indices = $("#slidetags_timeindices").val();
    slidetags_urls = urls.split(',');
    slidetags_indices = indices.split(',');

    current_slide = 0;
    current_slide_t = parseInt(slidetags_indices[current_slide]);
    next_slide_t = 360000; /** some large number w.r.t. movie length in seconds */
    if(slidetags_indices.length >= (current_slide+2)) {
      next_slide_t = parseInt(slidetags_indices[current_slide+1]);
    }
    /** check soon if I need to update slide **/
    window.setTimeout("update_slide_timer_handler()", 10000);
  }

   /* Carousel gallery */
    jQuery('.home_video, #mycarousel').jcarousel();

    jQuery('#mycarousel_slidesync_page ').jcarousel({
        visible: 1
    });

  /* side-by-side view for presenter and slides video players */
    if ( $('#flowplayer_presenter').length != 0) {
	if ( $('#flowplayer_slides').length != 0) { /* side by side view */
		window.setInterval("sync_presenter_slides_video_players()",2000);
	}
    }

});

/* TOOLTIP FOR HOME PAGE */
$(function() {
    $('.smallipopBlack').smallipop({
        theme: 'black'
    });
});

// syncview functionality
$.ajaxSetup ({
  cache: false
});
$("#sync_slide_button").click(function(){
    var url = document.getElementById("sync_slide_url").value;
    var url_parts = url.split("/");
    var new_url = "";

    for (var i=0; i<url_parts.length-3; ++i)
    {
      new_url = new_url + url_parts[i] + "/";
    }
    current_tag_position = jQuery('#mycarousel_slidesync_page').data('jcarousel').first;
    current_tag_id = jQuery('#mycarousel_slidesync_page').data('jcarousel').get(current_tag_position)[0].getElementsByTagName("img")[0].id;
    current_playhead_time = presenter_playhead_time();
    new_url = new_url + current_tag_id + "/" + current_playhead_time + "/";


    $("#sync_post_message").html("<h3>Adding this slidetag...</h3>");

    $.post(
      new_url,
      {},
      function(responseText){
        $("#sync_post_message").html("Should be done")
      },
      "html"
    );

  });
var slidetags_urls;
var slidetags_indices;
var current_slide = 0;
var current_slide_t = -1;
var next_slide_t = 360000;

//var test_index = 0;
//var test_time_indices = [300,600,1000,2000,0,2312321];

function get_slide(time_index) {
  if(time_index >= slidetags_indices[slidetags_indices.length-1]) return slidetags_indices.length-1;
  if(time_index <= 0) return 0;
  var next = 0;
  /** start checking from current_slide+1 until end, still if not found, start from 0 to current_slide */
  for(next=current_slide; (next+1) < slidetags_indices.length; ++next) {
    var begin = slidetags_indices[next]
    var end = slidetags_indices[next+1]
    if (time_index < begin) break;
    if (time_index >= begin && time_index < end ) return next;
  }
  for(next=0; (next+1) < slidetags_indices.length; ++next) {
    var begin = slidetags_indices[next]
    var end = slidetags_indices[next+1]
    if (time_index < begin) break;
    if (time_index >= begin && time_index < end ) return next;
  }
  return next;
}


function update_slide_timer_handler() {
  var current_playhead_t = presenter_playhead_time();
  //var current_playhead_t = test_time_indices[(test_index++)%5];
  //alert("timer fired");
  if ( current_playhead_t >= next_slide_t || current_playhead_t < current_slide_t) {
    /** needs slide change **/
    var new_slide = get_slide(current_playhead_t);
    current_slide = new_slide;
    current_slide_t = parseInt(slidetags_indices[current_slide]);
    if(slidetags_indices.length >= (current_slide+2)) {
      next_slide_t = parseInt(slidetags_indices[current_slide+1]);
    } else {
      next_slide_t = 360000; /** some large number w.r.t. movie length in seconds */
    }
    /** display the new slide **/
    $("#current_slidetag_div").html("<img src="+slidetags_urls[current_slide]+" />");
  }

  /** check again for slide update **/
  window.setTimeout("update_slide_timer_handler()", 1000);

}

// making CSRF verification work for AJAX post calls
$(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});
// seek control for video player
function seek(timeindex) {
	if (document.getElementById("flowplayer_presenter")) {
		var presenter_video_player = $f("flowplayer_presenter");
        	if (presenter_video_player) {
 			presenter_video_player.seek(timeindex);
		}
	}
	if (document.getElementById("swfContent")) {
        	document.getElementById("swfContent").seek(timeindex);
	}
}

function presenter_playhead_time() {
	if (document.getElementById("flowplayer_presenter")) {
		var presenter_video_player = $f("flowplayer_presenter");
    if (presenter_video_player) {
 			return parseInt(presenter_video_player.getTime());
		}
	}
	if (document.getElementById("swfContent")) {
		return parseInt(document.getElementById("swfContent").playheadtime());
	}
	return 0;
}
function presenter_video_play() {
  if (document.getElementById("flowplayer_presenter")) {
    var presenter_video_player = $f("flowplayer_presenter");
    if (presenter_video_player) {
      presenter_video_player.play();
      return parseInt(presenter_video_player.getTime());
    }
  }
  if (document.getElementById("swfContent")) {
    var presenter_video_player = document.getElementById("swfContent");
    presenter_video_player.play();
    return parseInt(presenter_video_player.playheadtime());
  }
  return 0;
}
function presenter_video_resume() {
  if (document.getElementById("flowplayer_presenter")) {
    var presenter_video_player = $f("flowplayer_presenter");
    if (presenter_video_player) {
      presenter_video_player.resume();
      return parseInt(presenter_video_player.getTime());
    }
  }
  if (document.getElementById("swfContent")) {
    var presenter_video_player = document.getElementById("swfContent");
    presenter_video_player.resume();
    return parseInt(presenter_video_player.playheadtime());
  }
  return 0;
}
function presenter_video_pause() {
  if (document.getElementById("flowplayer_presenter")) {
    var presenter_video_player = $f("flowplayer_presenter");
    if (presenter_video_player) {
      presenter_video_player.pause();
      return parseInt(presenter_video_player.getTime());
    }
  }
  if (document.getElementById("swfContent")) {
    var presenter_video_player = document.getElementById("swfContent");
    presenter_video_player.pause();
    return parseInt(presenter_video_player.playheadtime());
  }
  return 0;
}

function sync_presenter_slides_video_players() {
	presenter = $f("flowplayer_presenter");
	slides = $f("flowplayer_slides");
	if (slides) {
	  if(presenter) {
		presenter_time = parseInt(presenter.getTime());
		slides_time = parseInt(slides.getTime());
		//alert("presenter slides difference: "+Math.abs(presenter_time - slides_time) );
		if (Math.abs(presenter_time-slides_time) > 1)
			slides.seek( parseInt(presenter.getTime() ));
	  }
	}
}