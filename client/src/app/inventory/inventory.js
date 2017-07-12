'use strict';

(function() {

  function config($stateProvider) {
    $stateProvider
      .state('root.inventory', {
        url: '/',
        views: {
          '@': {
            templateUrl: 'src/app/inventory/inventory.tpl.html',
            controller: 'InventoryCtrl as vm',
            resolve: {

            }
          }
        }
      });
  }

  function InventoryCtrl($state, $rootScope, $log, StaticDataService, InventoryService, $filter) {
    var vm = this;
    $log.log('loading InventoryCtrl');

    var NO_ROOM_FILTER = { id: 0, name: { en: '[ Filter by room ]', de: '[ filter by room ]' } };
    var NO_TYPE_FILTER = { id: 0, name: { en: '[ Filter by type ]', de: '[ filter by type ]' } };

    vm.hideFooter = false;

    vm.changeFilter = changeFilter;
    vm.changeLanguage = changeLanguage;
    vm.toggleSpecialItems = toggleSpecialItems;
    vm.itemSelected = itemSelected;
    vm.saveItem = saveItem;
    vm.itemKeyPress = itemKeyPress;
    vm.canSaveModel = canSaveModel;
    vm.remove = remove;
    vm.updateItemName = updateItemName;
    vm.updateItemProp = updateItemProp;
    vm.switchView = switchListView;
    vm.toggleAll = toggleAll;
    vm.updateSelectedItems = updateSelectedItems;
    vm.dismantlingTypeChanged = dismantlingTypeChanged;
    vm.syncData = syncData;
    vm.getPdf = getPdf;
    vm.dismantlingFactorChanged = dismantlingFactorChanged;

    var modelDefaults = {
      roomType: null,
      packedBy: null,
      oneManHandling: null,
      unpackedBy: null,
      assemblingType: null
    };

    init();

    vm.allInventoryTemplates = [];

    function initComboLang() {
      setComboTextFromLang(vm.roomTypeFilterList);
      setComboTextFromLang(vm.itemTypeFilterList);
      setComboTextFromLang(vm.roomTypeList);
      setComboTextFromLang(vm.itemTypeList);
      setComboTextFromLang(vm.dismantlingTypeList);
      setComboTextFromLang(vm.rvcvList);
      setComboTextFromLang(vm.insuranceOptionsList);
      setComboTextFromLang(vm.insuranceValueList);
      setComboTextFromLang(vm.yesNoList);

      if(vm.allInventoryTemplates) setComboTextFromLang(vm.allInventoryTemplates);
      if(vm.inventoryList) setComboTextFromLang(vm.inventoryList);
    }

    function setComboTextFromLang(comboItems) {
      comboItems.forEach(function(i) {
        if(i.name) {
          i.text = i.name[$rootScope.LANG] || i.name.en; //todo temp code fallback
          if(!i.text) i.text = i.name.de;
        }
      });

      return comboItems;
    }

    function init() {
      $rootScope.title = 'Customer inventory';

      modelDefaults.roomType = 13;
      modelDefaults.packedBy = 2;
      modelDefaults.oneManHandling = 1;
      modelDefaults.unpackedBy = 2;
      modelDefaults.assemblingType = 2;
      modelDefaults.dismantlingType = 2;
      modelDefaults.crate = 1;

      vm.filter = { roomType: NO_ROOM_FILTER.id, type: NO_TYPE_FILTER.id, special: false }; //reset filter
      vm.options = { specialItems: false, lang: $rootScope.LANG };
      vm.totals = {};
      vm.inventoryList = vm.filteredInventoryList = [];
      vm.model = getItemModel();
      vm.viewType = 'volume';
      vm.selectionCount = 0;
      vm.isAllChecked = false;

      InventoryService.getAll().then(function(results) {

        StaticDataService.init(results[0].data);

        initStaticData();

        vm.allInventoryTemplates = InventoryService.transformTemplates(results[1].data);
        setComboTextFromLang(vm.allInventoryTemplates);

        var itemList = InventoryService.serverToClient(results[2].data);
        itemList.forEach(function (item) {
          updateItemVolume(item);
        });

        setComboTextFromLang(itemList);

        vm.inventoryList = vm.filteredInventoryList = itemList;

        calculateTotals();

        changeFilter(); //apply filter (propably none) but also order!!!
      }, function(err) {
        $log.error('Could not load items!' + err);
      });

        function initStaticData() {
          var allRoomTypes = StaticDataService.getRoomTypes();
          var allItemTypes = StaticDataService.getItemTypes();

          vm.roomTypeFilterList = allRoomTypes.slice(0);
          vm.roomTypeFilterList.splice(0, 0, NO_ROOM_FILTER); //insert no filter option

          vm.itemTypeFilterList = allItemTypes.slice(0);
          vm.itemTypeFilterList.splice(0, 0, NO_TYPE_FILTER); //insert no filter option

          vm.roomTypeList = allRoomTypes.slice(0);
          vm.itemTypeList = allItemTypes.slice(0);
          vm.langList = StaticDataService.getLangList();
          //vm.requiresPackagingList = StaticDataService.getPackagingList();
          vm.dismantlingTypeList = StaticDataService.getDismantlingList();
          vm.rvcvList = StaticDataService.getRVCVList();
          vm.insuranceOptionsList = StaticDataService.getInsuranceOptionsList();
          vm.insuranceValueList = StaticDataService.getInsuranceValueList();
          vm.yesNoList = StaticDataService.getYesNoList();

          initComboLang();
        }

          //$log.log('got list: ', vm.inventoryList);
    }

    function switchListView(type) {
      if(vm.viewType === type) return;

      vm.viewType = type;
    }

    function toggleAll() {
      vm.filteredInventoryList.forEach(function(item) {
        item.isChecked = vm.isAllChecked;
      });
      updateSelectedItems();
    }

    function dismantlingFactorChanged() {
      if(vm.model.dismantlingFactor < 1) {//has dismantling
        vm.model.assemblingType = vm.model.dismantlingType = 2;
      }
      else {
        vm.model.assemblingType = 1;
        vm.model.dismantlingType = 1;
      }
    }

    function dismantlingTypeChanged() {
      if(vm.model.dismantlingType === 1) { //NO
        vm.model.assemblingType = 1;
        vm.model.dismantlingFactor = 1;

      }
      else {
        vm.model.assemblingType = vm.model.dismantlingType;
      }
    }

    function updateSelectedItems() {

      var firstCheckedItem = null;
      vm.selectionCount = 0;
      vm.filteredInventoryList.forEach(function(item) {
        if(item.isChecked) {
          vm.selectionCount++;
          if(!firstCheckedItem) firstCheckedItem = item;
        }
      });

      if(vm.selectionCount === 1 && firstCheckedItem) {
        vm.model = firstCheckedItem;
        vm.model.item = vm.model.text;
      }
      else if(vm.selectionCount > 1) vm.model = getItemModel();
      else vm.model = getItemModel();
    }

    function updateItemProp(item, propName, recomputeVolume) {

      if(propName === 'name') {
        item.name[$rootScope.LANG] = item.text;
      }

      InventoryService.updateProp(item, propName).then(function() {
        if(recomputeVolume) {
          updateItemVolume(item);
          calculateTotals();
        }
      }, function(err) {
        $log.error('Error updating prop!', err);
      });


    }

    function changeLanguage() {
      $rootScope.LANG = vm.options.lang;
      //$rootScope.langData = window.LANG_DATA[$rootScope.LANG] || {};

      initComboLang($rootScope.LANG);

      localStorage.LANG = vm.options.lang;
      //$state.reload();
    }

    function updateItemName() {
      if(vm.model.name[$rootScope.LANG] !== vm.model.item) {
        vm.model.name[$rootScope.LANG] = vm.model.item;
      }
    }

    function calculateTotals() {
      vm.totals = {
        volume: 0,
        volumeGross: 0,
        furnitureVolume: 0,
        packmaterialVolume: 0,
        specialItemsVolume: 0,
        inventoryValue: 0,
        totalBoxes: 0,
        totalMovingBoxes: 0,
        totalClothingBoxes: 0,
        totalBookBoxes: 0,
        totalWardrobeBox: 0,
        totalWoodCrates: 0,
        totalSpecialItems: 0,
        totalCars: 0,
        totalPianos: 0,
        totalMotorbikes: 0,
        weight: 0
      };

      for(var idx = 0; idx < vm.inventoryList.length; idx++) {
        var item = vm.inventoryList[idx];
        vm.totals.volume += item.volume;
        vm.totals.weight += (item.weight || 0) * item.amount;
        if(item.type === 1) vm.totals.furnitureVolume += item.volume; //furniture
        else if(item.type === 2) vm.totals.packmaterialVolume += item.volume; //packmaterial
        else if(item.type === 3) { //special item
          vm.totals.specialItemsVolume += item.volume;
          vm.totals.totalSpecialItems += item.amount;
        }

        if(item.replValue) {
          vm.totals.inventoryValue += item.replValue * item.amount;
        }

        //boxes
        if(InventoryService.isBox(item)) {
          vm.totals.totalBoxes += item.amount;

          if(InventoryService.isBookBox(item)) vm.totals.totalBookBoxes += item.amount;
          else if(InventoryService.isMovingBox(item)) vm.totals.totalMovingBoxes += item.amount;
          else if(InventoryService.isClothingBox(item)) vm.totals.totalClothingBoxes += item.amount;
          else if(InventoryService.isWardrobeBox(item)) vm.totals.totalWardrobeBox += item.amount;
          //else if(itemName.indexOf('wood') > -1) vm.totals.totalWoodCrates += item.amount;
        }
        if(InventoryService.hasCrate(item) && item.amount > 0) {
          vm.totals.totalBoxes += 1;
          vm.totals.totalWoodCrates += 1;
        } //count crates based on crate flag!

        //special items
        if(item.type === 3) {
          if(InventoryService.isPiano(item)) vm.totals.totalPianos += item.amount;
          else if(InventoryService.isCar(item)) vm.totals.totalCars += item.amount;
          else if(InventoryService.isMotorbike(item)) vm.totals.totalMotorbikes += item.amount;
        }
      }

      vm.totals.volumeGross = Math.round(vm.totals.volume * 1.2 * 100) / 100;
      vm.totals.volume = Math.round(vm.totals.volume * 100) / 100;
      vm.totals.furnitureVolume = Math.round(vm.totals.furnitureVolume * 100) / 100;
      vm.totals.packmaterialVolume = Math.round(vm.totals.packmaterialVolume * 100) / 100;
      vm.totals.specialItemsVolume = Math.round(vm.totals.specialItemsVolume * 100) / 100;
      vm.totals.inventoryValue = Math.round(vm.totals.inventoryValue * 100) / 100;

      $log.log(vm.totals);
    }

    function remove(item) {
      //if(!confirm('Really remove ' + item.name + ' ?')) return false;

      InventoryService.remove(item).then(function() {
        removeFromArr(vm.filteredInventoryList, item);
        removeFromArr(vm.inventoryList, item);

        calculateTotals();

        function removeFromArr(arr, itemToRem) {
          var idx = arr.indexOf(itemToRem);
          if(idx > -1) arr.splice(idx, 1);
        }
      }, function(err) {
        $log.error('could not remove item', item, err);
      });
    }

    function canSaveModel() {
      if(vm.selectionCount > 1) return true;
      return vm.model && vm.model.roomType && vm.model.name && vm.model.name[$rootScope.LANG] && vm.model.amount > 0;
    }

    function itemKeyPress(evt) {
      //$log.log(evt);
      if(evt.keyCode === 13) { //enter

        saveItem();

      }
    }

    function saveItem() {

      if(!canSaveModel()) return;

      var model = vm.model;

      if(vm.selectionCount > 1) {
        //batch update, only packaging and dismantling
        var updatedArr = [];
        vm.filteredInventoryList.forEach(function(item) {
          if(item.isChecked) {
            if(model.crate !== undefined) item.crate = model.crate;
            if(model.dismantlingType !== undefined) item.dismantlingType = model.dismantlingType;
            if(model.packedBy !== undefined) item.packedBy = model.packedBy;
            if(model.oneManHandling !== undefined) item.oneManHandling = model.oneManHandling;
            if(model.unpackedBy !== undefined) item.unpackedBy = model.unpackedBy;
            if(model.assemblingType !== undefined) item.assemblingType = model.assemblingType;

            updatedArr.push(item);
          }
        });

        //save
        InventoryService.saveMultiple(updatedArr).then(function() {
          //uncheck?!?
          updatedArr.forEach(function(upditem) {
            upditem.isChecked = false;
            updateSelectedItems();
          });
          vm.isAllChecked = false; //uncheck all
        }, function (err) {
          $log.error('error batch-updating items!', err);
        });
      }
      else {
        model.type = model.type || 1;
        model.width = model.width || 0;
        model.height = model.height || 0;
        model.depth = model.depth || 0;
        model.amount = model.amount || 1;
        model.dismantlingFactor = model.dismantlingFactor || 1;

        model.text = model.item;

        var isNew = model.id === undefined;

        if(isNew) {
          model.name = model.name || { };
          model.name[$rootScope.LANG] = model.item; //overwrite text

          //new item added, that's based on existing item in the list... just update the existing item!
          var exModel = null;
          if(model.prefillID) {
            vm.inventoryList.forEach(function(i) {
                //have an existing item of same type. check if props will match
                if (model.name[$rootScope.LANG] === i.name[$rootScope.LANG]
                  && model.roomType === i.roomType
                  && model.width === i.width
                  && model.height === i.height
                  && model.depth === i.depth
                  && model.dismantlingFactor === i.dismantlingFactor
                  && model.type === i.type
                  && (model.replValue || 0 === i.replValue || 0)
                  && model.crate === i.crate
                  && model.packedBy === i.packedBy
                  && model.dismantlingType === i.dismantlingType
                ) {

                  exModel = i;
                }
            });
          }

          if(exModel) {
            exModel.amount += model.amount;
            model = exModel; //update, no insert!!!
            isNew = false;
          }
        }

        InventoryService.save(model, model.id).then(function () {
          updateItemVolume(model);

          //reuse last selection for next items
          modelDefaults.dismantlingType = model.dismantlingType;
          modelDefaults.roomType = model.roomType;
          modelDefaults.packedBy = model.packedBy;
          modelDefaults.oneManHandling = model.oneManHandling;
          modelDefaults.unpackedBy = model.unpackedBy;
          modelDefaults.assemblingType = model.assemblingType;

          vm.model = getItemModel();

          if(isNew) {
            //model ID is set inside the save method!
            model.isChecked = false;
            vm.inventoryList.push(model);
            changeFilter(false);
          }
          else updateSelectedItems();

          calculateTotals();

          //focus #item once done.
          setTimeout(function() {
            $('#item').focus();
          },10);
        }, function (err) {
          //save failed!!!!
          $log.error('error saving item!', err);
        });
      }
    }

    function getItemModel() {
      var model = angular.copy(modelDefaults);
      model.name = { en: '', de: '' };

      if(vm.selectionCount > 1) {
        model.packedBy = null;
        model.dismantlingType = null;
        model.crate = null;
        model.oneManHandling = null;
        model.unpackedBy = null;
        model.assemblingType = null;
      }

      return model;
    }

    function updateItemVolume(item) { //returns volume in m3
      if(!item || !item.amount) {
        if(item) item.volume = 0;
        return;
      }

      item.volume = item.dismantlingFactor * item.amount * item.width * item.height * item.depth / 1000000;
      if(InventoryService.hasCrate(item)) item.volume *= 1.2; //crated items occupy 20% more volume!

      item.volume = Math.round(item.volume * 1000) / 1000 || 0;
    }

    function itemSelected(item) {
      //$log.log(item, model);
      if(item) {
        //prefill model with info..
        vm.model.prefillID = item.id;

        vm.model.height = item.height;
        vm.model.width = item.width;
        vm.model.depth = item.depth;
        vm.model.type = item.type;

        vm.model.name = angular.copy(item.name);
        vm.model.text = vm.model.name[$rootScope.LANG];

        vm.model.weight = item.weight;
        vm.model.replValue = item.replacementValue;

        updateItemName();

        // if(vm.model.type === 'Packaging') vm.model.type = 2;
        // else if(vm.model.type === 'Special item') vm.model.type = 3;
        // else vm.model.type = 1;

        vm.model.amount = 1;
        vm.model.dismantlingFactor = item.dismantlingFactor;

        vm.model.crate = item.crate;
        vm.model.dismantlingType = item.dismantling;
        vm.model.packedBy = item.packed_by;
        vm.model.unpackedBy = item.unpacked;
        vm.model.assemblingType = item.assembling;
        vm.model.oneManHandling = item.one_man_handling;


        // if(vm.model.type === 1) { //furniture?
        //   vm.model.crate = 1;
        //   vm.model.dismantlingType = 2;
        // }
        // else if(vm.model.type === 3) { //special item
        //   vm.model.crate = 1;
        //   vm.model.dismantlingType = 1;
        // }
        // else if(vm.model.type === 2 && item.cratePossible) { //packmaterial
        //   vm.model.crate = 2;
        //   vm.model.dismantlingType = 1;
        // }
        // else if(vm.model.type === 2) { //
        //   vm.model.crate = 1;
        //   vm.model.dismantlingType = 1;
        // }
      }
    }

    function toggleSpecialItems() {
      vm.options.specialItems = !vm.options.specialItems;
      changeFilter();
    }

    function changeFilter(resetCheck) {
      vm.filteredInventoryList = $filter('filter')(vm.inventoryList, function (i) {
        var passes = true;
        if (passes && vm.filter.roomType !== undefined && vm.filter.roomType !== NO_ROOM_FILTER.id) passes = i.roomType === vm.filter.roomType;
        if (passes && vm.filter.type !== undefined && vm.filter.type !== NO_TYPE_FILTER.id) passes = i.type === vm.filter.type;
        if (passes && vm.filter.special) passes = i.type === 3;

        if(resetCheck) {
          vm.inventoryList.forEach(function(item) {
            item.isChecked = false;
          });
        }
        return passes;
      });

      vm.filteredInventoryList = vm.filteredInventoryList.sort(function(a,b) {
        var aKey = padLeft(a.roomType, 3) + a.text;
        var bKey = padLeft(b.roomType, 3) + b.text;

        if(aKey === bKey) return 0;
        return aKey > bKey ? 1 : -1;
      });
    }

    function syncData() {
      InventoryService.syncData(vm.inventoryList, vm.totals);
    }

    function getPdf() {
      InventoryService.getPdf();
    }

    function padLeft(no, cnt, ch) {
      var s = '' + no;
      ch = ch || '0';
      while(cnt.length < cnt) s = ch + s;
      return s;
    }
  }

  angular.module('app')
    .config(config)
    .controller('InventoryCtrl', InventoryCtrl);
}());
