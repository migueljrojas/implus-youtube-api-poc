'use strict';

// Constructor
var Header = function() {
    var apiKey = 'AIzaSyBu7PFXb5dJvaPQPxhYM3xrbuMM7nvz37o';
    var urlPLaylistId = getUrlParameter('playlistID');
    var playlistID = urlPLaylistId ? urlPLaylistId : 'PLCsLkknsxL7ky_nf10MQVJVKPs9YtfCSC';
    var videoContainer = $('.home__videos-wrapper');
    var tabSelectors = $('[data-target]');
    var tabs = $('.home__tab');
    var modal = $('.home__modal');

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    function stopAllPlayingVideos() {
        $('.home__video__iframe').attr('src', '');
    }

    function getVideoData(videos) {
        return videos.map(function(video){
            return {
                image: video.snippet.thumbnails.high.url,
                id: video.snippet.resourceId.videoId
            }
        });
    }

    function appendVideos(videos, container) {
        videos.forEach(function(video){
            $(
                '<div class="home__video" data-video="'+ video.id +'">' +
                    '<div class="home__video__contents">' +
                        '<img src="'+ video.image +'" />' +
                        '<iframe class="home__video__iframe" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" src="" allowfullscreen />' + 
                    '</div>' +
                '</div>'
            ).appendTo(container);
        });
    }
    
    function getVideosList(key, playlist) {
        $.getJSON('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=12&playlistId=' + playlist + '&key=' + key + '&callback=?')
        .done(function(data) {
            console.log( "success", data );
            var videos = getVideoData(data.items);
            appendVideos(videos, videoContainer);
        })
        .fail(function() {
            console.log( "error" );
        })
        .always(function() {
            console.log( "complete" );
        });
    }

    getVideosList(apiKey, playlistID);

    tabSelectors.on('click', function() {
        var $this = $(this);
        var index = $this.data('target');
        var allVideos = $('.home__video');

        tabSelectors.removeClass('-active');
        tabs.removeClass('-active');
        allVideos.removeClass('-showvideoinplace');
        stopAllPlayingVideos();

        tabs.filter(function(){
            return $(this).data('tab') === index;
        }).addClass('-active');

        $this.addClass('-active');
    });

    tabs.on('click', '.home__video', function(){
        var allVideos = $('.home__video__iframe');
        var video = $(this);
        var videoOpensInPlace = video.parents('.js-inplace').length > 0;
        var videoId = video.data('video');
        var videoFrame;

        stopAllPlayingVideos();
        $('.home__video').removeClass('-showvideoinplace');

        if (videoOpensInPlace) {
            videoFrame = video.find('iframe');
            video.addClass('-showvideoinplace');
        } else {
            allVideos.removeClass('-showvideoinplace');
            videoFrame = $('.home__modal__iframe');
            modal.addClass('-open');
        }

        videoFrame.attr('src', '//www.youtube.com/embed/' + videoId + '?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1&origin=' + window.location.origin);
    });

    $('.home__modal__backdrop').on('click', function() {
        stopAllPlayingVideos();
        modal.removeClass('-open');
    });
};

module.exports = Header;


