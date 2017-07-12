function VideoTaggingCtrl($scope, $timeout, $rootScope ) {
  
  $scope.current_video_timeindex = 0;
  
  $scope.counter = 0;
    
  $scope.onTimeout = function(){
      $scope.counter++;
      $rootScope.$apply($scope.current_video_timeindex=presenter_playhead_time());
      mytimeout = $timeout($scope.onTimeout,1000);
     
  }
  var mytimeout = $timeout($scope.onTimeout,1000);
   
}


function VideoTranscriptionCtrl($scope, $timeout, $window, $rootScope, Subtitle, $http) {
  $scope.Math  = window.Math;
  $scope.talkID = 0;
  $scope.current_video_timeindex = 0;
  $scope.offset = 0;
  
  $scope.current_clip_start = 0; // beginnig of the current clip that is being subtitled
  $scope.current_clip_end = 0;   // end of the current clip that is being subtitled
  
  $scope.subtitles = [];
  $scope.subtitles_loaded==0
  
  // functionality for showing transcript on the talk page
  $scope.show_live = 'No';
  $scope.show_all  = 'No';
  $scope.current_subtitle = 'Transcription to appear here.'
  
  $scope.init = function(talkID, transcription_start_time) {
    $scope.talkID = talkID;
    $scope.loadSubtitles(talkID);
    $scope.offset = transcription_start_time;
  }
  
  $scope.initLive = function(talkID) {
    $scope.talkID = talkID;
    $scope.loadSubtitles(talkID);
	  $scope.show_live = 'Yes';
	  $scope.show_all  = 'Yes';
  }
  
  $scope.loadSubtitles = function( talkID ) {
    //$scope.subtitles = Subtitle.getAll(talkID);
    
    $http({method:'GET', url:'/subtitles/talk/'+$scope.talkID+'/'}).success(function(data, status, headers, config) { 
     	$scope.subtitles = data;
    	$scope.subtitles_loaded==1;
    }); 
    
  }

  // keep current_video_timeindex up to date  
  $scope.onTimeout = function(){
      $rootScope.$apply($scope.current_video_timeindex=presenter_playhead_time());
      mytimeout = $timeout($scope.onTimeout,1000);
      if ($scope.show_live=='Yes') {
      	$scope.update_live_subtitle();
      }
  }
  var mytimeout = $timeout($scope.onTimeout,1000);
  
  // manage replay clip functionality
  $scope.onReplayTimeOut = function() {
    if ($scope.current_video_timeindex >= $scope.current_clip_end) {
      $rootScope.$apply(presenter_video_pause());
    } else {
      $timeout($scope.onReplayTimeOut, 1000);
    }
  }  
  $scope.replay = function() {
    $timeout($scope.onReplayTimeOut, 1000);
    $rootScope.$apply(seek($scope.current_clip_start));
    $rootScope.$apply(presenter_video_resume());
  }
  
  // takes an integer and returns a string of "hh:mm:ss" format
  $scope.time_string = function(timeindex) {
    var hh = Math.floor(timeindex/3600);
    var mm = Math.floor( (timeindex-hh*3600)/60 );
    var ss = timeindex - hh*3600 - mm*60;
    return hh+":"+mm+":"+ss;
    
  }
  
  // initial state, can be playing, paused, saving_init, etc
  $scope.state = 'initial';
  
  // subtitle control functions
  $scope.play = function() {
    $scope.state = 'playing';
    $rootScope.$apply($scope.current_clip_start = presenter_video_play());    
  }
  $scope.resume = function() {
    $scope.state = 'playing';
    $rootScope.$apply($scope.current_clip_start = presenter_video_resume());    
  }
  $scope.pause = function() {
    $scope.state = 'paused';
    $rootScope.$apply($scope.current_clip_end = presenter_video_pause());
  }
  $scope.saving_done = function() {
    $scope.state = 'saving_done';
    $scope.subtitle_text = "";
  }
  $scope.save_subtitle = function() {
    $scope.state = 'saving_init';
    var newSubtitle = new Subtitle();
    newSubtitle.talk = $scope.talkID;
    newSubtitle.text = $scope.subtitle_text;
    newSubtitle.start_time  = $scope.current_clip_start+$scope.offset;
    newSubtitle.end_time = $scope.current_clip_end+$scope.offset;
    ns = newSubtitle.create() ;     
    $scope.saving_done();
    $scope.loadSubtitles($scope.talkID);
  }
  // hot key handler - currently only enter key is being used
  $scope.transcription_enter_key_handler = function() {
    if($scope.state == 'initial') {
      $scope.play();
    } else if ($scope.state == 'playing') {
      $scope.pause();
    } else if ($scope.state == 'paused') {
      $scope.save_subtitle();
    } else if ($scope.state == 'saving_done') {
      $scope.play();
    }
  }
  
  // functionality to show current subtitle
  $scope.current_start = 0;
  $scope.current_end = 0;
  $scope.refresh_lock = 0;
  // check if subtitles need an update, if yes, then refresh the subtitle
  $scope.update_live_subtitle = function() {
  	 if( $scope.subtitles_loaded==0) return;
  	 //$scope.current_subtitle = 'updating...'+$scope.current_video_timeindex;
  	 if ( ($scope.current_video_timeindex >= $scope.current_end) || ($scope.current_video_timeindex < $scope.current_start)) {
  	 	//$scope.current_subtitle = 'updating...'+$scope.current_video_timeindex+'.. lock: '+$scope.refresh_lock;
  	 	if($scope.refresh_lock==1) 
  	 		// busy, no need to refresh again
  	 		return;
  	 	$scope.refresh_live_subtitle();  	 	
  	 }  	 
  }
  // go through the subtitles sequentially until the current timing is found. TODO: make this more efficient
  $scope.refresh_live_subtitle = function() {
  	$scope.refresh_lock = 1;
  	for(var index=0, max=$scope.subtitles.length; index < max; ++ index) {
  		var s = $scope.subtitles[index];
  		if(s.start_time >= $scope.current_video_timeindex) {
  			$scope.current_start  = s.start_time;
  			$scope.current_end = s.end_time;
  			//$scope.current_subtitle = s.start_time+'-'+s.end_time+ ':  '+s.text;
  			$scope.current_subtitle = s.text;
  			break;
  		}
  	}
  	$scope.refresh_lock = 0;
  }
  
}

angular.module('transcribe', ['ngResource']).directive('onEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.onEnter);
                    });

                    event.preventDefault();
                }
            });
        };
});

//VideoTranscriptionCtrl.$inject = ['$scope', '$timeout', '$window', '$rootScope', '$resource'];

angular.module('transcribe').factory('Subtitle', function($http) {
  // updating data on the server
  var Subtitle = function(data) {
    angular.extend(this, data);
  };

  Subtitle.get = function(id) {
    return $http.get('/subtitles/' + id).then(function(response) {
      return new Subtitle(response.data);
    });
  };

  Subtitle.prototype.create = function() {
    var subtitle = this;
    return $http.post('/subtitles/', subtitle).then(function(response) {
      subtitle.id = response.data.id;
      return subtitle;
    });
  };

  Subtitle.getAll = function(tID) { 
    return $http.get('/subtitles/talk/'+tID+'/').then(function(response) { 
      var subtitles = []; 
      for(var i = 0; i < response.data.length; i++){
        subtitles.push(new Subtitle(response.data[i]));
      } 
      return subtitles; 
    }); 
   };

  return Subtitle;
});
angular.module('transcribe').config(function($httpProvider) {
    $httpProvider.defaults.headers.post['X-CSRFToken'] = $('input[name=csrfmiddlewaretoken]').val();
});