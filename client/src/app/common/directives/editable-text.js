'use strict';
(function() {

  function editableText() {
    return {
      restrict: 'E',
      replace: true,
      require: '?ngModel',
      template: '<div><a class="descr" href="javascript:;" ng-hide="istb" ng-click="textClick()">{{model}}</a><input ng-show="istb" type="text" ng-blur="hideText()" ng-model="innerText" /></div>',
      scope: {
        disabled: '=ngDisabled',
        model: '=ngModel'//,
        //change: '=ngChange'
      },
      link: function(scope, elem, attr, ngModel) {
        if (!ngModel) return;

        scope.istb = false;
        scope.textClick = function() {
          scope.istb=true;
          setTimeout(function() {
            elem.find('input').focus();
          }, 50);
        };

        scope.hideText = function() {
          //$timeout(function() {

          updateModelValue(scope.innerText);
          scope.istb=false;
          //});
        };

        scope.$watch('model', function(val) {
          //console.log('model changed: ', val);
          scope.innerText = val;
        });


        function updateModelValue(val) {

          ngModel.$setViewValue(val);
          ngModel.$render();

          //scope.change && scope.change();
        }
      }
    };
  }

  angular.module('app.directives')
    .directive('editableText', editableText);
}());
