'use strict'

const estraverse = require('estraverse')
const acorn = require('acorn')
const escodegen = require('escodegen')
const censorFn = require('./censorfn')

class NoCatch extends Error {}

function wrap (node) {
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: '__censorFn'
    },
    arguments: [node]
  }
}

function run (parsed) {
  return (0, eval)('(__censorFn => {' + escodegen.generate(parsed) + '})')(censorFn)
}

function transform (code) {
  const parsed = acorn.parse(code, { allowReturnOutsideFunction: true })
  return estraverse.replace(parsed, {
    leave (node) {
      if (node.type === 'CallExpression' || node.type === 'NewExpression') {
        node.arguments = node.arguments.map(arg => {
          if (arg.type !== 'CallExpression') return wrap(arg)
          return arg
        })
        return {
          type: 'SequenceExpression',
          expressions: [ wrap(node.callee), node ]
        }
      }
      if (node.type === 'CatchClause') {
        throw NoCatch('Catch clause is forbidden')
      }
      return node
    }
  })
}

module.exports = function censor (code) {
  const transformed = transform(code)
  return run(transformed)
}

module.exports.CensorStop = censorFn.CensorStop
