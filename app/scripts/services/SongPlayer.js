(function () {
  function SongPlayer(Fixtures) {
    var SongPlayer = {};

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
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      SongPlayer.currentSong = song;
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
    @method play
    @desc gives play button functionality
    @param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        currentBuzzObject.play();
        song.playing = true;
      } else if (SongPlayer.currentSong === song) {
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
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
    @method previous
    @desc moves to previous song on albums
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      } else {
          var song = currentAlbum.songs[currentSongIndex];
          setSong(song);
          playSong(song);
      }
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', ['Fixtures', SongPlayer]);

})();
