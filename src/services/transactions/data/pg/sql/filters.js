const { curry } = require('ramda');

const { BigNumber } = require('@waves/data-entities');

const { where, whereIn, limit } = require('../../../../../utils/db/knex');

const after = ({ timestamp, id, sortDirection }) => q => {
  const comparator = sortDirection === 'desc' ? '<' : '>';
  return q
    .clone()
    .whereRaw(`(time_stamp, id) ${comparator} (?, ?)`, [timestamp, id]);
};

const sort = curry((s, q) =>
  q
    .clone()
    .orderBy('time_stamp', s)
    .orderBy('id', s)
);

const value = type => val => {
  const v = val instanceof BigNumber ? val.toString() : val;
  return where(`data_value_${type}`, v);
};

module.exports = {
  id: where('id'),
  ids: whereIn('id'),
  after,
  sort,
  // sortByDataPosition: orderBy('position_in_tx', 'asc'),
  sender: where('sender'),
  key: where('data_key'),
  type: where('data_type'),
  value,
  timeStart: where('time_stamp', '>='),
  timeEnd: where('time_stamp', '<'),
  limit,
};
