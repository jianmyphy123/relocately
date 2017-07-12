const router = require('koa-router')();

const models = require('../db/models');
const TemplateItemSerializer = require('./serializers').templateItem;

router.get('/', async function(ctx) {
  const templateItems = await models.templateItems.findAll();
  ctx.body = TemplateItemSerializer.serializeArray(templateItems);
});

router.get('/:id', async function(ctx) {
  const item = await models.templateItems.findById(ctx.params.id);

  if (!item) {
    ctx.throw(404, "Not Found");
  }

  ctx.body = TemplateItemSerializer.serializeItem(item);
});

module.exports = router.routes();
