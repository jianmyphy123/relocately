const router = require('koa-router')();

const models = require('../db/models');

router.get('/itemTypes', async function(ctx) {
  ctx.body = await models.itemType.findAll();
});

router.get('/roomTypes', async function(ctx) {
  ctx.body = await models.roomType.findAll();
});

router.get('/packagingTypes', async function(ctx) {
  ctx.body = await models.packagingType.findAll();
});

router.get('/dismantlingTypes', async function(ctx) {
  ctx.body = await models.dismantlingType.findAll();
});

router.get('/languages', async function(ctx) {
  ctx.body = await models.language.findAll();
});

router.get('/insuranceOptions', async function(ctx) {
  ctx.body = await models.insuranceOption.findAll();
});

router.get('/insuranceValues', async function(ctx) {
  ctx.body = await models.insuranceValue.findAll();
});

router.get('/rvcv', async function(ctx) {
  ctx.body = await models.rvcv.findAll();
});

router.get('/packedBy', async function(ctx) {
  ctx.body = await models.packedBy.findAll();
});

router.get('/yesNo', async function(ctx) {
  ctx.body = await models.yesNo.findAll();
});

router.get('/all', async function(ctx) {
  ctx.body = await Promise.all([
    models.itemType.findAll(),
    models.packedBy.findAll(),
    models.roomType.findAll(),
    models.packagingType.findAll(),
    models.dismantlingType.findAll(),
    models.language.findAll(),
    models.rvcv.findAll(),
    models.insuranceOption.findAll(),
    models.insuranceValue.findAll(),
    models.yesNo.findAll()
  ]).then(results => {
    const [itemTypes, packedByList, roomTypes,
      packagingList, dismantlingList, langList,
      RVCVList, insuranceOptionList, insuranceValueList, yesNoList] = results;

    return { itemTypes, packedByList, roomTypes,
      packagingList, dismantlingList, langList,
      RVCVList, insuranceOptionList, insuranceValueList, yesNoList };
  });
});

module.exports = router.routes();
