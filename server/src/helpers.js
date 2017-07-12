const uuid = require('uuid');

const models = require('./db/models');

async function findOrCreateConcierge(apiId, conciergeName) {
  conciergeName = conciergeName || null;
  return await models.conciergeItems.findOrCreate({
    where: { api_id: apiId },
    defaults: {
      concierge_name: conciergeName,
      secret: uuid()
    }
  }).spread((concierge, created) => {
    if (created == false && conciergeName !== null) {
      return concierge.update({
        concierge_name: conciergeName
      }).get('concierge_name');
    }
    return concierge.get('concierge_name');
  });
}

module.exports = {
  findOrCreateConcierge
};
