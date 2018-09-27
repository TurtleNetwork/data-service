const Joi = require('../../../utils/validation/joi');

const commonFields = require('../common/commonFieldsSchemas');

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .base58()
    .required(),
  quantity: Joi.object()
    .bignumber()
    .required(),
  reissuable: Joi.boolean().required(),
});

module.exports = { result };