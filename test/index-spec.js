var assert = require('assert');
var chai = require('chai');
const logInterceptor = require('log-interceptor');
const RichEmbed = require('discord.js').RichEmbed;
var should = require('chai').should();
var hook_id, hook_secret, fullLink;
try {
  hook_id = require('./auth.json').hook_id;
  hook_secret = require('./auth.json').hook_secret;
  fullLink = require('./auth.json').fullLink;
} catch (e) {
  hook_id = process.env.HOOK_ID;
  hook_secret = process.env.HOOK_SECRET;
  fullLink = process.env.FULLLINK; // Yes, triple 'L'
}
var hookcord = require('../');

/*
 * Unit Tests for ./src/base.js
 */
describe('Base', function() {
  beforeEach(function (done) {
    setTimeout(function(){
      done();
    }, 500);
  });
  it('Should successfully send a webhook.', async function() {
    var hook = new hookcord.Base(`${hook_id}/${hook_secret}`, {}, {'content': 'Unit Test!'});

    var res = await hook.send();

  });
  it('Should successfully send a webhook passing the full link into opts.link', async function() {
    var hook = new hookcord.Base('', {'link': fullLink}, {'content': 'Unit Test!'});

    var res = await hook.send();

  });
  it('Should throw an error when no link is present when constructing base.', function() {
    chai.assert.throw(function() { new hookcord.Base(); });
  });
  it('Should throw an error when sending with an incorrect body.', async function() {
    var hook = new hookcord.Base('', {'link': fullLink}, {conrent: 576});
    try {
      await hook.send();
    } catch (e) {
      return assert.ok(true);
    }
    assert.ok(false);
  });
  it('Should return the request body if successful and using the default webhook creation option.', async function() {
    var hook = new hookcord.Base(`${hook_id}/${hook_secret}`, {}, {'content': 'Unit Test!'});

    var res = await hook.send();
    chai.expect(res).to.exist;

  });
  it('Should return the request body if successful and using the secondary webhook creation option.', async function() {
    var hook = new hookcord.Base('', {'link': fullLink}, {'content': 'Unit Test!'});
    var res = await hook.send();
    chai.expect(res).to.exist;
  });
  describe('Ratelimit', function() {
    beforeEach(function (done) {
      setTimeout(function(){
        done();
      }, 500);
    });
    it('Should correctly insert the statuscode.', function(done) {
      var statuscode = 222;
      var hook = new hookcord.Base('', {link: fullLink, _statcode: statuscode}, {content: 'Unit Test'});
      hook.send()
        .then(function(x) {
          assert.equal(statuscode, x.statusCode);
          done();
        });
    });
    it('Should execute the ratelimit handler on a 429 error.', function(done) {
      var changed = false
      var hook = new hookcord.Base('', {
        link: fullLink,
        _statcode: 429,
        handler: function() {
          changed = true;
        },
      }, {content: 'Unit Test'});
      hook.send()
        .then(function(x) {
          assert.equal(true, changed)
          done()
        })
    })
    it('RateLimit Handler Should Return Reset Time', function(done) {
      var hook = new hookcord.Base('BEEP/BOOP', {
        _statcode: 429,
        handler: function() {},
      }, {content: 'Unit Test'});
      hook.send()
        .then(function(x) {
          chai.expect(x._utiloutput).to.exist;
          done()
        })
    })
  });
});
/*
 * Unit Tests for ./src/fire.js
 */
describe('Fire', function() {
  beforeEach(function (done) {
    setTimeout(function(){
      done();
    }, 500);
  });
  it('Should return the request body on success.', function(done) {
    hookcord.Fire('', {link: fullLink}, {content: 'Unit Test'})
      .then(
        function(x) {
          x.should.be.a('object').and.not.be.a('error');
          done();
        }
      );
  });
  it('Should throw an error if payload is not provided.', function(done) {
    hookcord.Fire('', {link: fullLink})
      .catch(function(err) {
        chai.expect(err.message).to.equal('Payload has not been provided.');
        done();
      });
  });
  it('Should throw an error if link is not provided.', function(done) {
    hookcord.Fire(undefined, undefined, {content: 'Unit Test'})
      .catch(function(err) {
        chai.expect(err.message).to.equal('Link has not been provided.');
        done();
      });
  });
  it('Should autocomplete url if only ID and Secret is provided.', function(done) {
    hookcord.Fire(`${hook_id}/${hook_secret}`, undefined, {content: 'Unit Test'})
      .then(function(res) {
        link = res.linkurl.split('webhooks/')[0];
        link = link + 'webhooks/';
        chai.expect(link).to.equal('https://discordapp.com/api/webhooks/');
        done();
      });
  });
  it('Should correctly insert the statuscode.', function(done) {
    var statuscode = 222;
    hookcord.Fire('', {link: fullLink, _statcode: statuscode}, {content: 'Unit Test'})
      .then(
        function(x) {
          assert.equal(statuscode, x.statusCode);
          done();
        }
      );
  });
  it('Should output the remaining time if the ratelimit was activated.', function(done) {
    hookcord.Fire('', {
      link: fullLink,
      _statcode: 429,
      handler: function() {}
    }, {content: 'Unit Test'})
      .then(
        function(x) {
          chai.expect(x._utiloutput).to.exist
          done();
        }
      );
  })
  it('Should output the failed res on error.', function(done) {
    hookcord.Fire('BEEP/BOOP', {
      _statcode: 429,
      handler: function() {}
    }, {content: 'Unit Test'})
      .then(
        function(x) {
          chai.expect(x).to.exist.and.be.a('error')
          done();
        }
      );
  })
  it('Should throw an error on a non-ratelimit error.', function(done) {
    hookcord.Fire('BEEP/BOOP', {}, {content: 'Unit Test'})
      .catch(
        function(x) {
          chai.expect(x).to.exist.and.be.a('error')
          done();
        }
      );
  })
});

describe('Ratelimit Handler', function() {
  it('Should throw an error when handler is not defined.', function(done) {
    var changed = false
    var hook = new hookcord.Base('', {
      link: fullLink,
      _statcode: 429,
    }, {content: 'Unit Test'});
    hook.send()
      .catch(function(x) {
        chai.expect(x).to.exist.and.be.a('error')
        done()
      })
  })
})

describe('Discord.JS Embed Parser', function() {
  describe('embed.file', function() {
    it('Should console.log if a embed.file is present.', function() {
      var e = new RichEmbed()
      e.setAuthor('Unit Test')
      e.setTitle('Unit Test')
      e.setColor(84328)
      e.addField('Unit Test', 'true')
      e.file = true;
      logInterceptor();
      hookcord.DiscordJS(e)
      const logs = logInterceptor.end();
      assert.equal(logs[0], 'Files in embeds will not be sent.\n')
    })
    it('Should cancel out any files.', function() {
      var e = new RichEmbed()
      e.setAuthor('Unit Test')
      e.setTitle('Unit Test')
      e.setColor(84328)
      e.addField('Unit Test', 'true')
      e.file = true;
      var finalEmbed = hookcord.DiscordJS(e)
      assert.equal(finalEmbed.file, undefined)
    })
    it('Should not console.log if no embed.file is present.', function() {
      var e = new RichEmbed()
      e.setAuthor('Unit Test')
      e.setTitle('Unit Test')
      e.setColor(84328)
      e.addField('Unit Test', 'true')
      logInterceptor();
      hookcord.DiscordJS(e)
      const logs = logInterceptor.end();
      assert.equal(logs[0], undefined)
    })
  })
})

describe('Hook Class', function() {
  describe('Sending WebHooks', function() {
    it('Should set the status code in a non-error.', function(done) {
      let hook = new hookcord.Hook();
      hook.setOptions({
        _statcode: 299
      })
      hook.login(hook_id, hook_secret);
      hook.setPayload({
        content: ':)'
      })
      hook.fire()
        .then(function(res) {
          chai.expect(res.statusCode).to.equal(299);
          return done();
        })
        .catch(function(e) {
          console.log(e);
          throw e;
        })
    })
    it('Should set the status code in a non-error a.', function(done) {
      let hook = new hookcord.Hook();
      hook.setOptions({
        _statcode: 429,
        handler: function() {}
      })
      hook.login(hook_id, hook_secret);
      hook.setPayload({
        contebnt: ':)'
      })
      hook.fire()
        .then(function(res) {
          chai.expect(res.statusCode).to.equal(429);
          return done();
        })
        .catch(function(e) {
          console.log(e);
          throw e;
        })
    })
    it('Should activate the ratelimit handler.', function(done) {
      let hook = new hookcord.Hook();
      hook.setOptions({
        _statcode: 429,
        handler: function() {}
      })
      hook.login(hook_id, hook_secret);
      hook.setPayload({
        content: ':)'
      })
      hook.fire()
        .then(function(res) {
          chai.expect(res._utiloutput).to.exist;
          return done();
        })
        .catch(function(e) {
          console.log(e);
          throw e;
        })
    })
    it('Should throw a non-ratelimit error.', function(done) {
      let hook = new hookcord.Hook();
      hook.login(hook_id, hook_secret);
      hook.setPayload({
        ben: 'shapiro'
      })
      hook.setOptions({
        _statcode: 444,
      })
      hook.fire()
        .catch(function(e) {
          chai.expect(e).to.be.an('error');
          return done();
        })
    })
  })
  describe('Initialisation', function() {
    it('Should correctly set the link if set via opts', function() {
      let hook = new hookcord.Hook();
      let link = 'https://whats.updog.com'
      hook.setOptions({
        link: link
      })
      chai.expect(hook.link).to.equal(link);
      chai.expect(hook.endpoint).to.equal(hook.link);
    })
    it('Should correctly set the link if set via setLink()', function() {
      let hook = new hookcord.Hook();
      let link = 'https://whats.updog.com'
      hook.setLink(link)
      chai.expect(hook.endpoint).to.equal(link);
    })
    it('Should throw an error if no endpoint was provided', function() {
      let hook = new hookcord.Hook();
      hook.endpoint = undefined;
      hook.payload = {content: 12};
      hook.fire()
        .catch(function(e) {
          chai.expect(e).to.an('error');
          chai.expect(e.message).to.equal('Endpoint has not been provided.')
        })
    })
    it('Should throw an error if no payload was provided.', function() {
      let hook = new hookcord.Hook();
      hook.endpoint = 'link';
      hook.payload = undefined;
      hook.fire()
        .catch(function(e) {
          chai.expect(e).to.an('error');
          chai.expect(e.message).to.equal('Payload has not been provided.')
        })
    })
    it('Should set res.statusCode', function(done) {
      let hook = new hookcord.Hook();
      hook.login(hook_id, hook_secret);
      hook.setPayload({contwent: 'w'})
      hook.setOptions({
        _statcode: 429,
        handler: function() {}
      })
      hook.opts._statcode = 429;
      hook.fire()
        .then(function(res) {
          chai.expect(res.statusCode).to.equal(429);
          done()
        })
    })

  })
})
