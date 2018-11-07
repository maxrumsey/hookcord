var Docma = require('docma');
const x = {
  'src': [
    './README.md',
    './src/base.js',
    './src/fire.js',
    './src/external/discord.js',
    './src/hook.js',
  ],
  'clean': true,
  'dest': './docs/',
  'app': {
    'title': 'Hookcord Documentation',
    'base': '/hookcord',
    'entrance': 'content:readme',
    'server': Docma.ServerType.GITHUB,
    'routing': 'query',
  },

  'markdown': {
    'gfm': true,
    'tables': true,
    'breaks': false,
    'pedantic': false,
    'sanitize': false,
    'smartLists': false,
    'smartypants': false,
    'tasks': false,
    'emoji': true,
  },
  'template': {
    'path': 'zebra',
    'options': {
      'title': {
        'label': 'Hookcord',
        'href': '#',
      },
      'sidebar': {
        'enabled': true,
        'outline': 'tree',
        'collapsed': false,
        'toolbar': true,
        'itemsFolded': false,
        'itemsOverflow': 'crop',
        'badges': true,
        'search': true,
        'animations': true,
      },
      'symbols': {
        'autoLink': true,
        'params': 'list',
        'enums': 'list',
        'props': 'list',
        'meta': false,
      },
      'contentView': {
        'bookmarks': 'h1,h2,h3',
      },
      'navbar': {
        'enabled': true,
        'fixed': true,
        'dark': false,
        'animations': true,
        'menu': [
          {
            'iconClass': 'fas fa-book',
            'label': 'API Reference',
            'href': '?api',
          },
          {
            'iconClass': 'fab fa-lg fa-github',
            'label': '',
            'href': 'https://github.com/maxrumsey/hookcord',
            'target': '_blank',
            'items': [
              { 'label': 'Github', 'href': 'https://github.com/maxrumsey/hookcord' },
              { 'separator': true },
              { 'label': 'Readme', 'href': 'https://github.com/maxrumsey/hookcord/blob/master/README.md' },
              { 'label': 'License', 'href': 'https://github.com/maxrumsey/hookcord/blob/master/LICENSE.md' },
            ],
          },
        ],
      },
    },
  },
};
Docma.create()
  .build(x)
  .then(() => {
    console.log('Documentation is built successfully.');
  })
  .catch(err => {
    console.log(err);
  });
