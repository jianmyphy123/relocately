const router = require('koa-router')();
const pdf = require('html-pdf');

const superagent = require("superagent");
const _ = require('lodash')
const parse = require('co-body');
var http = require('http');
var https = require('https');

const template = require('../templates/pdf');
const models = require('../db/models');
const findOrCreateConcierge = require('../helpers').findOrCreateConcierge;

const pdfOptions = {
  "border": {
    "top": "0.3in",
    "right": "0.0in",
    "left": "0.0in",
    "bottom": "0in"
  },
  "format": "A4",
  "orientation": "portrait",
  // "height": "1200px",        // allowed units: mm, cm, in, px
  // "width": "1400px",
  "zoomFactor":1,

  "type": "pdf",
  // "type": "png"
};

router.get('/:id/:language/inline', async function(ctx) {
  const language = ctx.params.language;
  const data = await models.items.findAll({
    where: {
      api_id: ctx.params.id
    }
  });

  if (data.length === 0 || ['en', 'de'].indexOf(language) < 0) {
    ctx.throw(404);
  }


  const concierge = await findOrCreateConcierge(ctx.params.id,ctx.query.concierge);
  const reference = ctx.query.referenzId ? ctx.query.referenzId : null;

  const pdfHTML = await template(language, data, concierge, reference);

  // ctx.set('Content-Type', 'html');
  // ctx.body=pdfHTML;
  // return;
  // ctx.set('Content-Type', 'image/png');
  ctx.set('Content-Type', 'application/pdf');
  ctx.body = await new Promise(resolve => {


    pdf.create(pdfHTML, pdfOptions).toBuffer(function(err, buffer) {
      resolve(buffer);
    });
  })
});

router.get('/:id/:language', async function(ctx) {
  const language = ctx.params.language;

  const data = await models.items.findAll({
    where: {
      api_id: ctx.params.id
    }
  });

  if (data.length === 0 || ['en', 'de'].indexOf(language) < 0) {
    ctx.throw(404);
  }

  const concierge = await findOrCreateConcierge(ctx.params.id,ctx.query.concierge);
  const reference = ctx.query.referenzId ? ctx.query.referenzId : null;

  const pdfHTML = await template(language, data, concierge, reference);

  ctx.body = await new Promise(resolve => {
    pdf.create(pdfHTML, pdfOptions).toBuffer(function(err, buffer) {
      resolve({
        pdf: buffer.toString('base64')
      });
    });
  })
});

router.post('/sync/:id/:secret/:language', async function(ctx) {
  const language = ctx.params.language;

  const payload = await parse(ctx);

  const data = await models.items.findAll({
    where: {
      api_id: ctx.params.id
    }
  });

  if (data.length === 0 || ['en', 'de'].indexOf(language) < 0) {
    ctx.throw(404);
  }


  const concierge = await findOrCreateConcierge(ctx.params.id,ctx.query.concierge);
  const reference = ctx.query.referenzId ? ctx.query.referenzId : null;

  const pdfHTML = await template(language, data, concierge, reference);

  payload.ioi = await new Promise(resolve => {
    pdf.create(pdfHTML, pdfOptions).toBuffer(function(err, buffer) {
      resolve(buffer.toString('base64'));
    });
  });

  ctx.body = await new Promise(resolve => {

    var req=superagent
      .post(`${process.env.CRM_API_URL || 'https://crm-api.relocate.ly'}/ioi/${ctx.params.id}/`)
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', 'relocately-auth ' + ctx.params.secret);

    _.forEach(payload, function(value, key){

      //adding form data fields to request
      req.field(key, value != null?value:'')
    });


    req.end(function(err, res) {

      if (err || !res.ok) {
        console.log('Api communication error',err);
        resolve( JSON.stringify({msg: 'Api communication error:' + res.status + 'API error:' + JSON.stringify(res.body)}));
      } else {
        if(res.status == 201){
          resolve(JSON.stringify({msg: 'Request sync-ed successfully!'}));
        } else {
          console.log(res.status);
          console.log(res.body);

        }

      }

    });



  })



});


module.exports = router.routes();
