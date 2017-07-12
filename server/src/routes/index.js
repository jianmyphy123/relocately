const router = require('koa-router')({
  prefix: '/api'
});

const listRouter = require('./lists');
const templatesRouter = require('./templates');
const itemsRouter = require('./items');
const pdfRouter = require('./pdf');

router.use('/lists', listRouter);
router.use('/templates', templatesRouter);
router.use('/items', itemsRouter);
router.use('/pdf', pdfRouter);

module.exports = router.routes();
