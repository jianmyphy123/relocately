'use strict';

(function() {

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
 });

  function config($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $logProvider.debugEnabled(true);

    $httpProvider.interceptors.push('LoadingInterceptor');

    $stateProvider
      .state('root', {
        resolve: {
          // langs: function($http ,$log) {
          //   return $http.get('translation.json').then(function(resp) {
          //     window.LANG_DATA = resp.data;
          //   }, function(err) {
          //     window.LANG_DATA = [];
          //     $log.error('cannot download language!', err);
          //   });
          // }
        }
      });
  }

  function MainCtrl($log) {
    $log.debug('MainCtrl loaded!');
  }

  function run($log, $rootScope) {
    $log.debug('App is running!');
    $rootScope.LANG = 'en';

    if(localStorage.LANG && localStorage.LANG === 'de') $rootScope.LANG = 'de';

    //get the inventory id from URL;
    var apiID = getParameterByName('id');

    $rootScope.inventoryID = apiID.substr(0,apiID.lastIndexOf('-'));
    $rootScope.secret = apiID.substr(apiID.lastIndexOf('-')+1);
    $rootScope.conciergeName = getParameterByName('concierge_name');
    $rootScope.reference = getParameterByName('referenzId');

    $log.log('inventory id: ', $rootScope.inventoryID, '; secret: ', $rootScope.secret);
    if(!$rootScope.inventoryID) alert('To continue, please specify an inventory ID and secret in the URL (ex: ?id=23-1)'); // eslint-disable-line no-alert

    $rootScope.isLoading = true;


    function getParameterByName(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
  }

  angular.module('app.directives', []);
  angular.module('app.filters', []);
  angular.module('app.services', []);
  angular.module('templates', []); //declare templates here, to work in both debug and release...

  angular.module('app', [
      'ui.router',
      'app.services',
      'app.directives',
      'app.filters',
      'ngAnimate',
      'ui.bootstrap',
      'templates'
    ])
    .config(config)
    .run(run)
    .controller('MainCtrl', MainCtrl)
    .value('version', '1.1.0');
}());
