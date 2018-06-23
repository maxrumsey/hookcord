[![Dependencies](https://img.shields.io/david/maxrumsey/hookcord.svg)](https://david-dm.org/maxrumsey/hookcord)
[![Coverage Status](https://coveralls.io/repos/github/maxrumsey/hookcord/badge.svg?branch=master)](https://coveralls.io/github/maxrumsey/hookcord?branch=master)
[![Build Status](https://travis-ci.org/maxrumsey/hookcord.svg?branch=master)](https://travis-ci.org/maxrumsey/hookcord)
[![npm](https://img.shields.io/npm/v/hookcord.svg)](https://npmjs.org/package/hookcord)
[![npm](https://img.shields.io/npm/l/hookcord.svg)](https://npmjs.org/package/hookcord)
[![npm](https://img.shields.io/github/issues/maxrumsey/hookcord.svg)](https://github.com/maxrumsey/hookcord)
<br><br>
[![npm](https://nodei.co/npm/hookcord.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/hookcord/)
<br><br>
# Hookcord
A user-friendly, sleek and fast client used to create and send Discord Webhooks.
## Features
* Object-oriented
* Complete coverage of the Discord Webhook API
* Lightweight but powerful

API Documentation available at [maxrumsey.xyz/hookcord/](https://maxrumsey.xyz/hookcord)
# Usage
## Installation
```
$ npm i hookcord
```
## Initialisation
```javascript
var hookcord = require('hookcord');
var Base = hookcord.Base;
var hook = new Base("HOOK_ID/HOOK_SECRET");
```
Or:
```javascript
var hookcord = require('hookcord');
var Base = hookcord.Base;
var hook = new Base("", {'link':'https://custom.link/to/webhook'});
```
## Messages
```javascript
var hookcord = require('hookcord');
var Base = hookcord.Base;

var hook = new Base("HOOK_ID/HOOK_SECRET", {}, {'content':"Hello World!"});
hook.send().then(function(request) {
  console.log(request);
});
```
More information is available at the [documentation](https://maxrumsey.xyz/hookcord/?api).
## Embeds
```javascript
var hookcord = require('hookcord');

var Base = hookcord.Base;

var hook = new Base("HOOK_ID/HOOK_SECRET", {}, {
  'embeds': [{
    'title': 'Hookcord',
    'description': '',
    'fields': [{
      'name': 'Version',
      'value': '1.0.0',
      'inline': true
    }],
    'timestamp': new Date();
  }]
});
hook.send().then(function(request) {
  console.log(request);
});
```
Embed documentation is available at [Dicord's Documentation](https://discordapp.com/developers/docs/resources/channel#embed-object).
More information is available at the [documentation](https://maxrumsey.xyz/hookcord/?api).

# License
MIT
