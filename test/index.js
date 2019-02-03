'use strict'

const assert = require('assert')
const censor = require('..')
const censorFn = require('../censorfn')

const identity = 'x = x => x;'
describe('value-censorship', () => {
  it('can run code and censor eval, Function and require', async () => {
    assert.equal(await censor('return 42'), 42)
    assert.equal(await censor('function foo () { return 42 }; return foo()'), 42)
    assert.rejects(async () => await censor(identity + 'return x(eval)'))
    assert.rejects(async () => await censor(identity + 'return x(Function)'))
    assert.rejects(async () => await censor(identity + 'return x(require)'))
  })
  it('passes the things in the context as things the code can use', async () => {
    assert.equal(await censor('return foo("test")', { foo: x => x }), 'test')
  })
  it('cant use new function', async () => {
    assert.rejects(async () => await censor('new Function("a", "return a")'))
  })
  it('disallows eval', async () => {
    assert.rejects(async () => await censor('eval("666")'))
  })
  it('disallows getting eval from global', async () => {
    assert.rejects(async () => await censor('global["eva" + "l"]')('42'))
  })
  it('disallows getting Function from a function', async () => {
    assert.rejects(async () => await censor('new (function(){}.constructor)("42")'))
  })
  it('disallows using the generator constructor', async () => {
    assert.rejects(async () => await censor('new (function *(){}.constructor)("42")'))
  })
  it('disallows catch', async () => {
    assert.rejects(async () => await censor('try { } catch (e) {}'))
    await censor('try {} finally {}')
  })
})

describe('censorFn', () => {
  it('censors require, function and eval', () => {
    assert.throws(() => censorFn(Function), censor.CensorStop)
    assert.throws(() => censorFn(eval), censor.CensorStop)
    assert.throws(() => censorFn(require), censor.CensorStop)
  })
})
