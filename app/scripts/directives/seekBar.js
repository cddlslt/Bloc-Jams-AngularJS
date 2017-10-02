(function() {
    function seekBar($document) {
        /**
        @func calculatePercent
        @desc calculates horizontal percent along seek bar where event occurs
        @param {function, object} seekBar, event
        */
        var calculatePercent = function(seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        }

        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: {
                onChange: '&'
              },
            link: function(scope, element, attributes) {
                //directive logic to return
                scope.value = 0;
                scope.max = 100;

                /**
                @var seekBar
                @desc holds the element that matches <seek-bar>
                */
                var seekBar = $(element);

                attributes.$observe('value', function(newValue) {
                    scope.value = newValue;
                });

                attributes.$observe('max', function(newValue) {
                  scope.max = newValue;
                });

                /**
                @func percentString
                @desc returns percentage based on value and maximum value of a seek bar
                */
                var percentString = function() {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };

                /**
                @method fillStyle
                @desc returns width of the seek bar based on calculated percent
                */
                scope.fillStyle = function() {
                    return {width: percentString()};
                };

                /**
                *@method thumbStyle
                *@desc updates the position of the seek bar thumb
                */
                scope.thumbStyle = function() {
                    return {left: percentString()};
                };

                /**
                @method onClickSeekBar
                @desc updates seek bar value based on the seek bar's width and
                      the location of the user's click on the seek bar
                @param event
                */
                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                    notifyOnChange(scope.value);
                };

                /**
                @method trackThumb
                @desc uses $apply to constantly changes value of scope.value as
                      the user drags the seek bar thumb
                */
                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                            notifyOnChange(scope.value);
                        });
                    });

                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };

                var notifyOnChange = function(newValue) {
                    if (typeof scope.onChange === 'function') {
                      scope.onChange({value: newValue});
                    }
                };
            }
        };
    }

    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();
