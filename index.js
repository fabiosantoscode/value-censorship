'use strict'

const estraverse = require('estraverse')
const acorn = require('acorn')
const escodegen = require('escodegen')
const censorFn = require('./censorfn')

class NoCatch extends Error {}

function wrap(node) {
  return  {
          type: "CallExpression",
          callee: {
            type: 'Identifier',
            name: '__censorFn'
          },
          arguments: [node]
        }
}

module.exports = function censor (code) {
  const parsed = acorn.parse(code, { allowReturnOutsideFunction: true })
  estraverse.replace(parsed, {
    leave (node) {
      if (node.type === 'CallExpression') {
        node.arguments = node.arguments.map(arg => {
          if (arg.type !== 'CallExpression') return wrap(arg)
          return arg
        })
        return {
          type: 'SequenceExpression',
          expressions: [ wrap(node.callee), node ],
        }
      }
      if (node.type === 'CatchClause') {
        throw NoCatch('Catch clause is forbidden')
      }
      return node
    }
  })
  return (0, eval)('(__censorFn => {' + escodegen.generate(parsed) + '})')(censorFn)
}
