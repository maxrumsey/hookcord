var assert = require('assert')
var chai = require('chai')
var should = require('chai').should()
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

describe('Fire', function() {
  it('Should return the request body on success.', function(done) {
    hookcord.Fire("", {link: fullLink}, {content: 'Unit Test'})
      .then(
        function(x) {
          x.should.be.a('object').and.not.be.a('error')
          done()
        }
      )
  })
  it('Should throw an error if payload is not provided.', function(done) {
    hookcord.Fire("", {link: fullLink})
      .catch(function(err) {
        chai.expect(err.message).to.equal('Payload has not been provided.')
        done()
      })
  })
  it('Should throw an error if link is not provided.', function(done) {
    hookcord.Fire(undefined, undefined, {content:"Unit Test"})
      .catch(function(err) {
        chai.expect(err.message).to.equal('Link has not been provided.')
        done()
      })
  })
  it('Should autocomplete url if only ID and Secret is provided.', function(done) {
    hookcord.Fire(`${hook_id}/${hook_secret}`, undefined, {content:"Unit Test"})
      .then(function(res) {
        link = res.linkurl.split('webhooks/')[0]
        link = link + 'webhooks/'
        chai.expect(link).to.equal('https://discordapp.com/api/webhooks/')
        done()
      })
  })
})
