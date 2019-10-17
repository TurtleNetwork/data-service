const Joi = require('../../utils/validation/joi');

const inputSearch = Joi.object()
  .keys({
    ticker: Joi.string().noControlChars(),
    search: Joi.string().noControlChars(),
    after: Joi.string().base58(),
    limit: Joi.number()
      .min(0)
      .max(100),
  })
  .or('ticker', 'search')
  .required();

const result = Joi.object().keys({
  asset_id: Joi.string().assetId().required(),
  asset_name: Joi.string().noControlChars().required(),
  description: Joi.string().noControlChars().allow(''),
  sender: Joi.string()
    .base58()
    .allow('')
    .required(),
  issue_height: Joi.number().required(),
  total_quantity: Joi.object().bignumber(),
  decimals: Joi.number().required(),
  reissuable: Joi.boolean().required(),
  ticker: Joi.string()
    .noControlChars()
    .required()
    .allow(null),
  issue_timestamp: Joi.object()
    .type(Date)
    .required(),
  has_script: Joi.boolean().required(),
  min_sponsored_asset_fee: Joi.object()
    .bignumber()
    .required()
    .allow(null),
});

module.exports = { inputSearch, result };
