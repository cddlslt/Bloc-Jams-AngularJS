(function() {
    function SongPlayer($rootScope, Fixtures) {
        var songPlayer = {};

        /**
        @desc object to store album info to allow us to move between songs
        @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();

        /**
        @desc Buzz object audio file
        @type {Object}
        */
        var currentBuzzObject = null;

        /**
        @function setSong
        @desc Stops currently playing song and loads new audio file as currentBuzzObject
        @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                stopSong();
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            SongPlayer.currentSong = song;
        };

        /**
        @function playSong
        @desc play currentBuzzObject & set playing property of the song to true
        @param {Object} song
        */
        var playSong = function(song) {

            currentBuzzObject.play();
            SongPlayer.currentSong.playing = true;
        }


        var pauseSong = function(song) {
            currentBuzzObject.pause();
            SongPlayer.currentSong.playing = false;
        }

        /**
        @function stopSong
        @desc stops currentBuzzObject & set playing property of the song to null
        @param {Object} song
        */
        var stopSong = function(song) {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
        }


        /**
        @function getSongIndex
        @desc find index of current song
        @param {Object} song
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };


        /**
        @desc empty song object used to store value of song currently playing
        @type {Object}
        */
        SongPlayer.currentSong = null;

        /**
        *@desc current playback time (in seconds) of currently playing song
        *@type {Number}
        */
        SongPlayer.currentTime = null;

        /**
        *@desc current playback volume of currently playing song
        *@type {Number}
        */
        SongPlayer.volume = 50;

        /**
        @method play
        @desc gives play button functionality
        @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }

        };

        /**
        @method pause
        @desc gives pause button fucntionality
        @param {Object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            pauseSong(song);
        };

        /**
        @method previous
        @desc moves to previous song on albums
        */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
                setSong(currentAlbum.songs[currentAlbum.songs.length - 1]);
                playSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        /**
        @method next
        @desc moves to next song on albums
        */
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex !== currentAlbum.songs.length) {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            } else {
                setSong(currentAlbum.songs[0]);
                playSong(currentAlbum.songs[0]);
            }
        };

        /**
        *@function setCurrentTime
        *@desc set current time (in seconds) of currntly playing song
        *@param {number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };

        /**
        *@function setVolume
        *@desc set volume of currntly playing song
        *@param {number} volume
        */
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
        };



        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);

})();
