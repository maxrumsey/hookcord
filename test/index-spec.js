var assert = require('assert')
var chai = require('chai')
var hook_id, hook_secret, fullLink
try {
  hook_id = require('./auth.json').hook_id;
  hook_secret = require('./auth.json').hook_secret
  fullLink = require('./auth.json').fullLink
} catch (e) {
  hook_id = process.env.HOOK_ID
  hook_secret = process.env.HOOK_SECRET
  fullLink = process.env.FULLLINK // Yes, triple 'L'
}
var hookcord = require('../')


describe('Base', function() {
  it('Should successfully send a webhook.', async function() {
    var hook = new hookcord.Base(`${hook_id}/${hook_secret}`, {}, {'content':'Unit Test!'})

    var res = await hook.send()

  })
  it('Should successfully send a webhook passing the full link into opts.link', async function() {
    var hook = new hookcord.Base('', {'link':fullLink}, {'content':'Unit Test!'})

    var res = await hook.send()

  })
  it('Should throw an error when no link is present when constructing base.', function() {
    chai.assert.throw(function() {new hookcord.Base()})
  })
  it('Should throw an error when sending with an incorrect body.', async function() {
    var hook = new hookcord.Base('', {'link':fullLink}, {conrent: 576})
    try {
      await hook.send()
    } catch (e) {
      return assert.ok(true)
    }
    assert.ok(false)
  })
  it('Should return the request body if successful and using the default webhook creation option.', async function() {
    var hook = new hookcord.Base(`${hook_id}/${hook_secret}`, {}, {'content':'Unit Test!'})

    var res = await hook.send()
    chai.expect(res).to.exist;

  })
  it('Should return the request body if successful and using the secondary webhook creation option.', async function() {
    var hook = new hookcord.Base(``, {'link':fullLink}, {'content':'Unit Test!'})

    var res = await hook.send()
    chai.expect(res).to.exist;

  })
})
