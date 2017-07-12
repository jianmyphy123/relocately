'use strict';

(function() {

  function uppercase() {
    return function(text) {
      return text ? text.toUpperCase() : text;
    };
  }

  angular.module('app.filters')
    .filter('uppercase', uppercase);
}());
