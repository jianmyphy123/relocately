'use strict';

const RVCV = require('../models/rvcv');
const InsuranceOption = require('../models/insurance_option');
const InsuranceValue = require('../models/insurance_value');
const PackedBy = require('../models/packed_by');

const RVCVData = [
  { id: 1, name: { en: 'RV', de: '' } },
  { id: 2, name: { en: 'CV', de: '' } }
];

const insuranceOptionsData = [
  { id: 1, name: { en: 'Limited coverage', de: '' } },
  { id: 2, name: { en: 'Supreme coverage', de: '' } }
];

const insuranceValueData = [
  { id: 1, name: { en: 'Replacement value', de: 'Neuwert' } },
  { id: 2, name: { en: 'Book value', de: 'Zeitwert' } }
];

const packedByData =  [
  { id: 1, name: { en: 'Relocately', de: 'Relocately' } },
  { id: 2, name: { en: 'Customer', de: 'Kunde' } }
];

module.exports = {
  up: function(queryInterface) {
    return queryInterface.sequelize.transaction(function(t) {
      const data = [];

      data.push.apply(data, RVCVData.map(typeData => {
        return RVCV.create(typeData, {transaction: t})
      }));
      data.push.apply(data, insuranceOptionsData.map(typeData => {
        return InsuranceOption.create(typeData, {transaction: t})
      }));
      data.push.apply(data, insuranceValueData.map(typeData => {
        return InsuranceValue.create(typeData, {transaction: t})
      }));
      data.push.apply(data, packedByData.map(typeData => {
        return PackedBy.create(typeData, {transaction: t})
      }));

      return queryInterface.sequelize.transaction(function(t) {
        return Promise.all(data);
      });
    });
  },

  down: function() {
    return Promise.all(
      RVCV.destroy({truncate: true}),
      InsuranceOption.destroy({truncate: true}),
      InsuranceValue.destroy({truncate: true}),
      PackedBy.destroy({truncate: true})
    );
  }
};
