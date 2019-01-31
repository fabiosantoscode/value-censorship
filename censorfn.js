'use strict'

const isEqual = require('lodash/isEqual')
const unreachableSymbol = Symbol()

module.exports = value => {
  const Value = value
  if (typeof value === 'function') {
    if (value.name === 'require' && typeof require.resolve === 'function' && typeof require.resolve.paths === 'function') {
      throw new CensorStop('require')
    }
    if (value.name === 'Function' && new Value('a', 'return a')(unreachableSymbol) === unreachableSymbol) {
      throw new CensorStop('Function')
    }
    if (value.name === 'eval' && value('a => a')(unreachableSymbol) === unreachableSymbol) {
      throw new CensorStop('eval')
    }
  }
  return value
}

const CensorStop = module.exports.CensorStop = class CensorStop extends Error {}
