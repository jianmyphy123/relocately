'use strict';
(function() {

  function toggleValue() {
    return {
      restrict: 'E',
      replace: true,
      require: '?ngModel',
      template: '<a class="img-check" href="javascript:;" ng-hide="istb" ng-click="changeImage()" title="{{currTitle}}"><img ng-src="{{currImage}}" /></a>',
      scope: {
        disabled: '=ngDisabled',
        model: '=ngModel',
        valueList: '='
        //change: '=ngChange'
      },
      link: function(scope, elem, attr, ngModel) {
        if (!ngModel) return;

        var imgUrls = ['assets/images/check_yes_relocately.png', 'assets/images/check_yes_customer.png', 'assets/images/check_no.png'];
        var imgIdx = findItemIndex(scope.model);


        scope.currImage = '';
        scope.currTitle = '';

        scope.$watch('model', function(val) {
          imgIdx = findItemIndex(val);
          scope.changeImage(true);
        });

        function findItemIndex(itemId) {
          var i = 0;
          scope.valueList.forEach(function(item, idx) {
            if(item.id === itemId) i = idx;
          });

          return i;
        }

        scope.changeImage = function(noChange) {
          if(!noChange) imgIdx++;
          imgIdx %= scope.valueList.length;

          var item = scope.valueList[imgIdx];

          scope.currTitle = item.text;
          var itemText = item.name.en.toLowerCase();
          if(itemText.indexOf('yes') > -1 && itemText.indexOf('customer') === -1 || itemText === 'relocately') scope.currImage = imgUrls[0];
          else if(itemText.indexOf('yes') > -1 || itemText.indexOf('customer') > -1) scope.currImage = imgUrls[1];
          else scope.currImage = imgUrls[2];

          if(!noChange) updateModelValue(item.id);
        };

        scope.changeImage(true);

        function updateModelValue(val) {
          ngModel.$setViewValue(val);
          ngModel.$render();
        }
      }
    };
  }

  angular.module('app.directives')
    .directive('toggleValue', toggleValue);
}());
