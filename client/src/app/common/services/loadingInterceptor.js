'use strict';

(function() {

  function loadingInterceptor($q, $rootScope, $log) {
      return {
        request: function(config) {
          $rootScope.loading = true;
          $rootScope.synced = false;
          return config;
        },
        requestError: function(rejection) {
          $rootScope.loading = false;
          $rootScope.synced = false;
          $log.error('Request error:', rejection);
          return $q.reject(rejection);
        },
        response: function(response) {
          $rootScope.loading = false;
          $rootScope.synced = false;
          return response;
        },
        responseError: function(rejection) {
          $rootScope.loading = false;
          $rootScope.synced = false;
          $log.error('Response error:', rejection);
          return $q.reject(rejection);
        }
      };
  }

  angular.module('app.services')
    .factory('LoadingInterceptor', loadingInterceptor);
}());
