/*
 * jQuery File Upload Plugin JS Example 5.0.2
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 */

/*jslint nomen: true */
/*global $ */

$(function () {
    'use strict';

    var upload_type = $('#upload_type').val();
    // Initialize the jQuery File Upload widget:
    if (upload_type == "video" )
       $('#fileupload').fileupload( {
          acceptFileTypes : /(flv|f4v|mov|m4v|mp4|wmv)$/
      });
    else
      $('#fileupload').fileupload( {
          acceptFileTypes :  /(pdf|gif|jpeg|png)$/
          //acceptFileTypes :  /^image\/(pdf|gif|jpeg|png)$/
      });

    // Load existing files:
    $.getJSON($('#fileupload form').prop('action'), function (files) {
        var fu = $('#fileupload').data('fileupload');
        fu._adjustMaxNumberOfFiles(-files.length);
        fu._renderDownload(files)
            .appendTo($('#fileupload .files'))
            .fadeIn(function () {
                // Fix for IE7 and lower:
                $(this).show();
            });
    });

    // Open download dialogs via iframes,
    // to prevent aborting current uploads:
    $('#fileupload .files a:not([target^=_blank])').live('click', function (e) {
        e.preventDefault();
        $('<iframe style="display:none;"></iframe>')
            .prop('src', this.href)
            .appendTo('body');
    });

});

$("#slidetags_edit").selectable({
    filter:'label',
    stop: function() {        
        $(".ui-selected input", this).each(function() {
            this.checked= !this.checked
          
        });
    }
});
