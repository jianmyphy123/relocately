'use strict';
(function() {

  function validNumber($timeout) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, elem, attr, ngModel) {
        if (!ngModel) return;

        function isValid(val) {
          if (val === '')  return true;

          var asInt = val || 0;

          val = asInt.toString();

          if (isNaN(asInt) || asInt.toString() !== val) return false;

          var min = +attr.min;
          if (!isNaN(min) && asInt < min) return false;

          var max = +attr.max;
          if (!isNaN(max) && max < asInt) return false;

          //var step = +attr.step;
          //if(!isNaN(step) && asInt % step !== 0) return false;

          return true;
        }

        var prev = scope.$eval(attr.ngModel);
        ngModel.$parsers.push(function (val) {
          // short-circuit infinite loop
          if (val === prev) return val;

          if (!isValid(val)) {
            ngModel.$setViewValue(prev);
            ngModel.$render();
            return prev;
          }
          $timeout(function() {
            if(attr.ngChange) scope.$eval(attr.ngChange);
          });

          //elem.trigger('change');

          prev = val;
          return val;
        });
      }
    };
  }

  angular.module('app.directives')
    .directive('validNumber', validNumber);
}());
