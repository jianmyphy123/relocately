'use strict';
(function() {

  function fakeCombo() {
    return {
      restrict: 'E',
      replace: true,
      require: '?ngModel', //ng-class="{ \'btn-primary\': hasValue, \'btn-default\': !hasValue }"
      template: '<div class="btn-group fake-combo"><button ng-keydown="comboKeyPress($event)" type="button" title="{{tooltip}}" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="margin: 0;border: none;border-radius: 0;" tabindex={{tabindex}}><span class="textValue">{{text}}</span> <span class="caret"></span></button><ul ng-if="!disabled" class="dropdown-menu"><li ng-repeat="opt in optionList"><a href="javascript:;" ng-keydown="itemKeyPress(opt, $event)" ng-click="selectAndClose(opt)">{{opt.text}}</a></li></ul></div>',
      scope: {
        disabled: '=ngDisabled',
        defaultText: '@',
        optionList: '=',
        keyPress: '&?',
        model: '=ngModel',
        tabindex: '='
      },
      link: function(scope, elem, attr, ngModel) {
        if (!ngModel) {
          return;
        }

        scope.text = scope.defaultText;

        scope.comboKeyPress = function(evt) {
          if (evt.keyCode === 13 && scope.keyPress) {
            scope.keyPress({
              evt: evt
            });
          } else if (evt.keyCode >= 65 && evt.keyCode <= 90) { //user presses a character between a - z, preselect from list
            focusItemInList(evt.keyCode);
          } else {
            return; //leave the default behaviour
          }

          evt.stopPropagation();
          evt.preventDefault();
        };

        function focusItemInList(keyCode) {
          var char = String.fromCharCode(keyCode).toLowerCase();

          for (var idx = 0; idx < scope.optionList.length; idx++) {
            if (scope.optionList[idx].text.toLowerCase().indexOf(char) === 0) {
              $(elem).find('ul > li > a').get(idx).focus();
              break;
            }
          }
        }

        scope.itemKeyPress = function(opt, evt) {

          if (evt.keyCode === 13 || evt.keyCode === 9) { //enter:
            scope.selectAndClose(opt, true, evt.keyCode === 9);

            $(elem).removeClass('open'); //close the popup after selection
            $(elem).find('.dropdown-toggle').attr('aria-expanded', false);
            //$(elem).dropdown('toggle');

            //don't allow propagation...
            evt.stopPropagation();
            evt.preventDefault();

            //if tab, move focus to next element
          } else if (evt.keyCode >= 65 && evt.keyCode <= 90) { //user presses a character between a - z, preselect from list
            focusItemInList(evt.keyCode);
          }
        };

        scope.$watch('model', modelChanged);
        scope.$watch('optionList', function() {
          modelChanged(scope.model);
        });
        scope.$watch('disabled', function(val) {
          if (val) {
            scope.text = 'N / A';
          } else modelChanged(scope.model);
        });



        function modelChanged(newVal) {
          if (!newVal) return scope.selectAndClose(null);

          if (!scope.optionList) return;

          var found = null;
          scope.optionList.forEach(function(f) {
            if (f.id === newVal) found = f;
          });
          scope.selectAndClose(found);
        }

        scope.selectAndClose = function(item, fromKB, moveNext) {
          if (item) {
            updateModelValue(item.id);
            scope.text = item.text;
            scope.tooltip = item.text + ' (' + scope.defaultText + ')';
          } else {
            updateModelValue();
            scope.text = scope.defaultText;
          }

          if (fromKB) {
            setTimeout(function() {
              $(elem).find('.dropdown-toggle').focus();

              if (moveNext) {
                //$(elem).next().focus();
                $(elem).trigger({
                  type: 'keypress',
                  which: 9
                });
              }
            });
          }
        };

        function updateModelValue(val) {

          ngModel.$setViewValue(val);
          ngModel.$render();

          scope.hasValue = val;
        }
      }
    };
  }

  angular.module('app.directives')
    .directive('fakeCombo', fakeCombo);
}());
