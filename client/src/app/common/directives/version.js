'use strict';
(function() {

  function versionDirective(version) {
    return {
      restrict: 'A',
      link: function(scope, elm) {
        elm.text(version);
      }
    };
  }

  angular.module('app.directives')
    .directive('appVersion', versionDirective);
}());
