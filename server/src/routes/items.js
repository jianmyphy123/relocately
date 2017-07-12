const router = require('koa-router')();
const parse = require('co-body');

const models = require('../db/models');
const db = require('../db');

const findOrCreateConcierge = require('../helpers').findOrCreateConcierge;
const ItemSerializer = require('./serializers').item;

router.get('/:api_id', async function(ctx) {
  const items = await models.items.findAll({
    where: {
      api_id: ctx.params.api_id
    }
  });
  await findOrCreateConcierge(ctx.params.api_id);
  ctx.body = ItemSerializer.serializeArray(items)
});

router.post('/:api_id', async function(ctx) {
  const payload = await parse(ctx);
  payload.api_id = ctx.params.api_id;

  const item = await models.items.create(payload);

  await findOrCreateConcierge(ctx.params.api_id, payload.concierge_name);

  ctx.body = ItemSerializer.serializeItem(item)
});

router.get('/:api_id/:id', async function(ctx) {
  const item = await models.items.findOne({
    where: {
      api_id: ctx.params.api_id,
      id: ctx.params.id
    }
  });

  if (!item) {
    ctx.throw(404, "Not Found");
  }

  await findOrCreateConcierge(ctx.params.api_id);

  ctx.body = ItemSerializer.templateItems(item);
});

router.patch('/batch/:api_id', async function(ctx) {
  const payload = await parse(ctx);
  const itemIds = payload.item_ids;

  delete payload.api_id;
  delete payload.item_ids;
  delete payload.id;

  const itemsUpdated = await db.transaction(function(t) {
    return models.items.update(payload, {
      where: {
        api_id: ctx.params.api_id,
        id: itemIds
      }
    }, { transaction: t });
  });

  await findOrCreateConcierge(ctx.params.api_id, payload.concierge_name);

  if (itemsUpdated) {
    const items = await models.items.findAll({
      where: {
        api_id: ctx.params.api_id,
        id: itemIds
      }
    });
    ctx.body = ItemSerializer.serializeArray(items);
  } else {
    ctx.body = [];
  }
});

router.patch('/:api_id/:id', async function(ctx) {
  const payload = await parse(ctx);
  delete payload.api_id;

  const item = await models.items.findOne({
    where: {
      api_id: ctx.params.api_id,
      id: ctx.params.id
    }
  });

  await findOrCreateConcierge(ctx.params.api_id, payload.concierge_name);

  if (!item) {
    ctx.throw(404, "Not Found");
  }

  const result = await item.update(payload);

  ctx.body = ItemSerializer.serializeItem(result);
});

router.delete('/:api_id/:id', async function(ctx) {
  const item = await models.items.findOne({
    where: {
      api_id: ctx.params.api_id,
      id: ctx.params.id
    }
  });

  if (!item) {
    ctx.throw(404, "Not Found");
  }

  const concierge = await models.conciergeItems.findOne({
    where: {
      api_id: ctx.params.api_id
    }
  });

  if (concierge) {
    await concierge.destroy();
  }

  ctx.body = await item.destroy();
});

module.exports = router.routes();
