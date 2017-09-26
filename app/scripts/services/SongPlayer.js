(function () {
  function SongPlayer() {
    var SongPlayer = {};

    /**
    @desc empty song object used to store value of song currently playing
    @type {Object}
    */
    var currentSong = null;
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
        currentBuzzObject.stop();
        currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentSong = song;
    };

    /**
    @function playSong
    @desc play currentBuzzObject & set playing property of the song to true
    @param {Object} song
    */
    var playSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.play();
        song.playing = true;
      }
    };

    /**
    @method play
    @desc gives play button functionality
    @param {Object} song
    */
    SongPlayer.play = function(song) {
      if (currentSong !== song) {
        setSong(song);
        currentBuzzObject.play();
        song.playing = true;
      } else if (currentSong === song) {
          if (currentBuzzObject.isPaused()) {
            currentBuzzObject.play();

          }
      }

    };

    /**
    @method pause
    @desc gives pause button fucntionality
    @param {Object} song
    */
    SongPlayer.pause = function(song) {
      currentBuzzObject.pause();
      song.playing = false;
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', SongPlayer);

})();
