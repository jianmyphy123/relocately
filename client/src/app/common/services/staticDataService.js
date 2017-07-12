'use strict';

(function() {

  function staticDataService() {

    var allData = {};

    return {
      init: function(data) {
        allData = data;

        allData.langList.forEach(function(i) { //add id to make the language list the same as the rest of the lists
          i.id = i.code;
        });
      },
      getItemTypes: function() {
        return allData.itemTypes;
      },
      getRoomTypes: function() {
        return allData.roomTypes;
      },
      getDismantlingList: function() {
        return allData.dismantlingList;
      },
      getLangList: function() {
        return allData.langList;
      },
      getRVCVList: function() {
        return allData.RVCVList;
      },
      getInsuranceOptionsList: function() {
        return allData.insuranceOptionList;
      },
      getInsuranceValueList: function() {
        return allData.insuranceValueList;
      },
      getYesNoList: function() {
        return allData.yesNoList || [ { id: 1, name: { en: 'Yes' } }, { id: 2, name: { en: 'No' }}];
      }
    };
  }

  angular.module('app.services')
    .factory('StaticDataService', staticDataService);
}());
