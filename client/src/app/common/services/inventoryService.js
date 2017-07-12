'use strict';

(function() {

  function inventoryService($q, $log, $http, $rootScope) {

    // var API_URL = 'http://relocately-api.mvpfactory.co';
    //var API_URL = 'http://10.67.142.71:3002';
    //var API_URL = 'http://localhost:3002';
    var API_URL = 'https://ioi-backend.relocate.ly';
    //var REMOTE_SYNC_URL = 'https://crm-api.relocate.ly';

    function round(val, dec) {
      if(!dec) dec = 2;

      var factor = Math.pow(10, dec);

      return Math.round(+(val || 0) * factor) / factor;
    }

    return {
      getAll: function() {
        var apiList = ['/api/lists/all', '/api/templates', '/api/items/' + $rootScope.inventoryID ];

        return $q.all(apiList.map(function (apiItem) {
          return $http({
            method: 'GET',
            url: API_URL + apiItem
          });
        }));
      },
      serverToClient: function(itemList) {
        var outList = [];

        itemList.forEach(function(i) {
          outList.push({
            id: i.id,
            type: i.type,
            amount: i.amount,
            name: i.name,
            height: round(i.length, 0),
            width: round(i.width),
            depth: round(i.depth),
            dismantlingFactor: round(i.dismantling_factor),
            replValue: round(i.replacement_value),
            descr: i.description,
            crate: i.crate,
            packedBy: i.packed_by,
            dismantlingType: i.dismantling,
            roomType: i.room_type,
            insurance_option: i.insurance_option,
            insurance_value: i.insurance_value,
            RV_CV: i.RV_CV,
            unpackedBy: i.unpacking,
            assemblingType: i.assembling,
            oneManHandling: i.one_man_handling,
            weight: round(i.weight, 2)
          });
        });

        return outList;
      },
      clientToServer: function(itemList) {
        var outList = [];

        itemList.forEach(function(i) {
          outList.push({
            id: i.id,
            api_id: $rootScope.inventoryID,
            amount: i.amount,
            type: i.type,
            name: i.name,
            length: i.height,
            width: i.width,
            depth: i.depth,
            dismantling_factor: i.dismantlingFactor,
            replacement_value: i.replValue || 0,
            description: i.descr,
            crate: i.crate,
            packed_by: i.packedBy,
            dismantling: i.dismantlingType,
            room_type: i.roomType,
            insurance_option: i.insurance_option,
            insurance_value: i.insurance_value,
            RV_CV: i.RV_CV,
            unpacking: i.unpackedBy,
            assembling: i.assemblingType,
            one_man_handling: i.oneManHandling,
            weight: i.weight
          });
        });

        return outList;
      },
      transformTemplates: function(tplList) {
        var transfList = [];

        tplList.forEach(function(t) {

          t.width = t.width || 0;
          t.length = t.length || 0;
          t.depth = t.depth || 0;
          t.dismantling_factor = round(t.dismantling_factor); // eslint-disable-line camelcase
          //t.depth = t.depth || 0;

          transfList.push({
            id: t.id,
            width: +t.width.toString(),
            height: +t.length.toString(),
            depth: +t.depth.toString(),
            amount: t.amount || 1,
            dismantlingFactor: t.dismantling_factor || 1,
            type: t.type,
            name: t.name,
            weight: t.weight,
            replacementValue: t.replacement_value,
            crate: t.crate,
            dismantling: t.dismantling,
            packed_by: t.packed_by,
            unpacked: t.unpacked,
            assembling: t.assembling,
            one_man_handling: t.one_man_handling === true ? 1 : 2
          });
        });

        return transfList;
      },
      save: function(item, id) {
        var sitem = this.clientToServer([item])[0];
          if(id) return $http.patch(API_URL + '/api/items/' + $rootScope.inventoryID + '/' + id, sitem);
          return $http.post(API_URL + '/api/items/' + $rootScope.inventoryID, sitem).then(function(res) {
            item.id = res.data.id;
          });
      },
      remove: function(item) {
          return $http['delete'](API_URL + '/api/items/' + $rootScope.inventoryID + '/' + item.id);
      },
      saveMultiple: function(itemArr) {

        var dataToSend = {item_ids: [], crate: itemArr[0].crate, packed_by: itemArr[0].packedBy, dismantling: itemArr[0].dismantlingType, one_man_handling: itemArr[0].oneManHandling, unpacked: itemArr[0].unpackedBy, assembling: itemArr[0].assemblingType }; // eslint-disable-line camelcase

        itemArr.forEach(function(i) {
          dataToSend.item_ids.push(i.id); // eslint-disable-line camelcase
        });

        return $http.patch(API_URL + '/api/items/batch/' + $rootScope.inventoryID, dataToSend);

      },
      updateProp: function(item) {
        var sitem = this.clientToServer([item])[0];
        return $http.patch(API_URL + '/api/items/' + $rootScope.inventoryID + '/' + item.id, sitem);
      },
      isBox: function(item) {
        var itemName = (item.name.en || '').toLowerCase();
        return itemName.indexOf('box, ') === 0 || itemName.indexOf(' box') > -1;
      },
      isBookBox: function(item) {
        var itemName = (item.name.en || '').toLowerCase();
        return itemName.indexOf('book') > -1;
      },
      isMovingBox: function(item) {
        var itemName = (item.name.en || '').toLowerCase();
        return itemName.indexOf('moving box') > -1;
      },
      isClothingBox: function(item) {
        var itemName = (item.name.en || '').toLowerCase();
        return itemName.indexOf('clothing box') > -1;
      },
      isWardrobeBox: function(item) {
        var itemName = (item.name.en || '').toLowerCase();
        return itemName.indexOf('wardrobe') > -1;
      },
      isPiano: function(item) {
        var itemName = (item.name.en || '').toLowerCase();
        return itemName.indexOf('piano') > -1;
      },
      isMotorbike: function(item) {
        var itemName = (item.name.en || '').toLowerCase();
        return itemName.indexOf('motorbike') > -1 || itemName.indexOf('scooter') > -1 || itemName.indexOf('motorcycle') > -1;
      },
      isCar: function(item) {
        var itemName = (item.name.en || '').toLowerCase();
        return itemName.indexOf('car') > -1;
      },
      hasCrate: function(item) {
        return item.crate === 2;
      },

      syncData: function(inventoryList) {


        var dataStats = {};
        dataStats.ioi = null;
        dataStats.insurance = null;
        dataStats.weight = 0;
        dataStats.volume_total = 0;
        dataStats.volume_furniture = 0;
        dataStats.volume_moving_boxes = 0;
        dataStats.volume_special_items_total = 0;
        dataStats.volume_special_items_cars = 0;
        dataStats.volume_special_items_motorbikes = 0;
        dataStats.volume_special_items_pianos = 0;
        dataStats.volume_dismantling = 0;
        dataStats.volume_packaging = 0;
        dataStats.volume_wrapping = 0;
        dataStats.volume_unpacking = 0;
        dataStats.volume_unwrapping = 0;
        dataStats.volume_assembly = 0;
        dataStats.package_material_moving_boxes_total = 0;
        dataStats.package_material_moving_boxes_send_before = 0;
        dataStats.package_material_moving_boxes_on_day = 0;
        dataStats.package_material_book_boxes_total = 0;
        dataStats.package_material_book_boxes_send_before = 0;
        dataStats.package_material_book_boxes_on_day = 0;
        dataStats.package_material_wardrobe_boxes_total = 0;
        dataStats.package_material_wardrobe_boxes_send_before = 0;
        dataStats.package_material_wardrobe_boxes_on_day = 0;
        dataStats.package_material_wooden_crates_count = 0;
        dataStats.package_material_wooden_crates_volume = 0;
        dataStats.inventory_value = 0;
        dataStats.one_man_handling = true;

        inventoryList.forEach(function(i) {
          if(!i|| !i.amount) return 0;
          var itemVol = 0;

          itemVol = i.dismantlingFactor * i.amount * i.width * i.height * i.depth / 1000000;
          if(this.hasCrate(i)) itemVol *= 1.2; //crated items occupy 20% more volume!
          dataStats.weight += i.weight * i.amount;
          dataStats.volume_total += itemVol;

          if(i.type === 1) dataStats.volume_furniture += itemVol;
          else if(i.type === 2) dataStats.volume_moving_boxes += itemVol;

          //boxes
          if(this.isBox(i)) {

            if(this.isBookBox(i)) {
              dataStats.package_material_book_boxes_total += i.amount;

              if(i.packedBy === 2) dataStats.package_material_book_boxes_send_before += i.amount;
              else if(i.packedBy === 3) dataStats.package_material_book_boxes_on_day += i.amount;
            }
            else if(this.isMovingBox(i)) {
              dataStats.package_material_moving_boxes_total += i.amount;

              if(i.packedBy === 2) dataStats.package_material_moving_boxes_send_before += i.amount;
              else if(i.packedBy === 3) dataStats.package_material_moving_boxes_on_day += i.amount;
            }
            else if(this.isWardrobeBox(i)) {
              dataStats.package_material_wardrobe_boxes_total += i.amount;

              if(i.packedBy === 2) dataStats.package_material_wardrobe_boxes_send_before += i.amount;
              else if(i.packedBy === 3) dataStats.Package_material_wardrobe_boxes_on_day += i.amount;
            }
          }

          //crates
          if(this.hasCrate(i)) {
            dataStats.package_material_wooden_crates_count += 1;
            dataStats.package_material_wooden_crates_volume += itemVol;
          }

          //special items
          if(i.type === 3) {
            dataStats.volume_special_items_total += itemVol;

            if(this.isPiano(i)) dataStats.volume_special_items_pianos += itemVol;
            else if(this.isCar(i)) dataStats.volume_special_items_cars += itemVol;
            else if(this.isMotorbike(i)) dataStats.volume_special_items_motorbikes += itemVol;
          }

          if(i.dismantlingType === 2) dataStats.volume_dismantling += itemVol;
          if(i.packedBy === 2) {
            dataStats.volume_packaging += itemVol;
            dataStats.volume_wrapping += itemVol;
          }

          if(i.unpackedBy === 2) {
            dataStats.volume_unpacking += itemVol;
            dataStats.volume_unwrapping += itemVol;
          }

          if(i.assemblingType === 2) dataStats.volume_assembly += itemVol; //assembly == yes -> by relocately?!


          dataStats.inventory_value += i.replValue * i.amount || 0;

          dataStats.volume_total_gross = dataStats.volume_total * 1.2;

          // One man handling
          if (dataStats.one_man_handling) {
            dataStats.one_man_handling = (i.oneManHandling || 2) === 1;
          }

        }.bind(this));

        //todo: call API to get pdf file for inventory + insurance
        //$http.get(API_URL + '/api/pdf/' + $rootScope.inventoryID + '/en?concierge=' + $rootScope.conciergeName).then(function(res) {
          //dataStats.ioi = res.data.pdf;
          //dataStats.Insurance = ''; //todo: this will contain the new PDF, from V2

          $log.log('data to send to relocately: ', dataStats);
          $rootScope.startedsave = true;
          $http.post(API_URL + '/api/pdf/sync/' + $rootScope.inventoryID + '/' + $rootScope.secret + '/en?concierge=' + $rootScope.conciergeName+ '&referenzId=' + $rootScope.reference, dataStats).then(function(res) {
            //nothing to do on OK!
            $log.log('Response got from sync! all good!', res);
            $rootScope.synced = true;
            $rootScope.startedsave = false;
          }, function(err) {
            $log.error('Error sync-ing data!', err);
          });

          // var config = {
          //   method: 'POST',
          //   url: REMOTE_SYNC_URL + '/ioi/' + $rootScope.inventoryID,
          //   headers: {
          //     'Content-Type': 'multipart/form-data',
          //     'Authentication': 'relocately-auth ' + $rootScope.secret
          //   },
          //   data: dataStats
          // };

          //$http(config);
        // }, function(err) {
        //   $log.error('Error getting the PDF!', err);
        // });




        // $http.post('https://crm-api.relocate.ly/ioi/' + $rootScope.inventoryID, postData).then(function() {
		//
        // }, function() {
		//
        // });
      },
    getPdf:function(){
      window.open(API_URL + '/api/pdf/' + $rootScope.inventoryID + '/en/inline?concierge=' + $rootScope.conciergeName + '&referenzId=' + $rootScope.reference, '_blank');

    }
    };
  }

  angular.module('app.services')
    .factory('InventoryService', inventoryService);
}());
