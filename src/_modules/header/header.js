'use strict';

// Constructor
var Header = function() {
    var apiKey = 'AIzaSyBu7PFXb5dJvaPQPxhYM3xrbuMM7nvz37o';
    var urlPLaylistId = getUrlParameter('playlistID');
    var urlChannelId = getUrlParameter('channelID');
    var channelID = urlChannelId ? urlChannelId : 'UCQBxF-4duQ8B_wwbQy43SPA';
    var playlistID = urlPLaylistId ? urlPLaylistId : 'PLnxORRo5gOwqt7utM1HCS1695AfUC7t5x';
    var listMode = urlPLaylistId ? 'playlist' : 'channel';
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
            var videoId;

            if (video.snippet.resourceId) {
                videoId = video.snippet.resourceId.videoId;
            } else {
                videoId = video.id.videoId;
            }            

            return {
                image: video.snippet.thumbnails.high.url,
                id: videoId
            }
        });
    }

    function appendVideos(videos, container) {
        videos.forEach(function(video){
            if (video.id) {
                $(
                    '<div class="home__video" data-video="'+ video.id +'">' +
                        '<div class="home__video__contents">' +
                            '<img src="'+ video.image +'" />' +
                            '<iframe class="home__video__iframe" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" src="" allowfullscreen />' + 
                        '</div>' +
                    '</div>'
                ).appendTo(container);
            }            
        });
    }
    
    function getVideosList(key, mode) {
        var url;

        if (mode !== 'channel') {
            url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,id&maxResults=12&playlistId=' + playlistID + '&key=' + key + '&callback=?';
        } else {
            url = 'https://www.googleapis.com/youtube/v3/search?part=snippet,id&maxResults=12&channelId=' + channelID + '&key=' + key + '&callback=?';
        }
        
        $.getJSON(url)
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

    getVideosList(apiKey, listMode);

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


