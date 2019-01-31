'use strict'

const assert = require('assert')
const censor = require('..')
const censorFn = require('../censorfn')

const identity = 'x = x => x;'
describe('value-censorship', () => {
  it('can run code and censor eval, Function and require', () => {
    assert.equal(censor('return 42'), 42)
    assert.equal(censor('function foo () { return 42 }; return foo()'), 42)
    assert.throws(() => censor(identity + 'return x(eval)'))
    assert.throws(() => censor(identity + 'return x(Function)'))
    assert.throws(() => censor(identity + 'return x(require)'))
  })
  it.only('disallows eval', () => {
    assert.throws(() => censor('eval("666")'))
  })
  it('disallows catch', () => {
    assert.throws(() => censor('try { } catch (e) {}'))
    censor('try {} finally {}')
  })
})

describe('censorFn', () => {
  it('censors require, function and eval', () => {
    assert.throws(() => censorFn(Function), censor.CensorStop)
    assert.throws(() => censorFn(eval), censor.CensorStop)
    assert.throws(() => censorFn(require), censor.CensorStop)
  })
})
