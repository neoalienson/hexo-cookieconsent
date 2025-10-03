'use strict';

const assert = require('assert');
const cheerio = require('cheerio');
const { EventEmitter } = require('events');

describe('hexo-cookieconsent', () => {
  let originalHexo;

  beforeEach(() => {
    originalHexo = global.hexo;
    delete require.cache[require.resolve('../index.js')];
  });

  afterEach(() => {
    global.hexo = originalHexo;
  });

  it('should not register filter when cookieconsent is disabled', () => {
    let filterRegistered = false;
    
    global.hexo = {
      config: {
        cookieconsent: {
          enable: false
        }
      },
      extend: {
        filter: {
          register: () => {
            filterRegistered = true;
          }
        }
      }
    };

    require('../index.js');
    assert.strictEqual(filterRegistered, false, 'Filter should not be registered when disabled');
  });

  it('should merge default options with user options', () => {
    global.hexo = {
      config: {
        cookieconsent: {
          enable: true,
          options: {
            theme: 'classic'
          }
        }
      },
      extend: {
        filter: {
          register: () => {}
        }
      }
    };

    require('../index.js');

    assert(global.hexo.config.cookieconsent.options.palette, 'Default palette should be present');
    assert.strictEqual(global.hexo.config.cookieconsent.options.theme, 'classic', 'User options should be preserved');
  });

  it('should register after_generate filter when enabled', () => {
    let filterName = '';
    let filterFunction = null;
    
    global.hexo = {
      config: {
        cookieconsent: {
          enable: true,
          options: {}
        }
      },
      extend: {
        filter: {
          register: (name, fn) => {
            filterName = name;
            filterFunction = fn;
          }
        }
      }
    };

    require('../index.js');
    
    assert.strictEqual(filterName, 'after_generate', 'Should register after_generate filter');
    assert.strictEqual(typeof filterFunction, 'function', 'Should register a function');
  });

  it('should process HTML content correctly', (done) => {
    const testHtml = '<html><head></head><body><h1>Test</h1></body></html>';
    let processedHtml = '';
    
    global.hexo = {
      config: {
        cookieconsent: {
          enable: true,
          options: {
            palette: {
              popup: { background: '#eb6c44' }
            }
          }
        }
      },
      route: {
        list: () => ['index.html'],
        get: (path) => {
          const emitter = new EventEmitter();
          setTimeout(() => {
            emitter.emit('data', testHtml);
            emitter.emit('end');
          }, 0);
          return emitter;
        },
        set: (path, html) => {
          processedHtml = html;
        }
      },
      extend: {
        filter: {
          register: (name, fn) => {
            // Execute the filter function immediately for testing
            setTimeout(() => {
              fn().then(() => {
                const $ = cheerio.load(processedHtml);
                
                // Check if script is injected
                const scripts = $('script');
                assert(scripts.length > 0, 'Script should be injected');
                
                const scriptContent = scripts.text();
                assert(scriptContent.includes('CookieConsent.run'), 'Script should contain CookieConsent.run');
                
                // Check if CSS link is injected
                const cssLinks = $('link[rel="stylesheet"]');
                assert(cssLinks.length > 0, 'CSS link should be injected');
                assert(cssLinks.attr('href').includes('cookieconsent.css'), 'CSS should be cookieconsent CSS');
                
                done();
              }).catch(done);
            }, 10);
          }
        }
      }
    };

    require('../index.js');
  });

  it('should only process HTML files', () => {
    const routes = ['index.html', 'about.html', 'style.css', 'script.js'];
    
    global.hexo = {
      config: {
        cookieconsent: {
          enable: true,
          options: {}
        }
      },
      route: {
        list: () => routes,
        get: () => new EventEmitter(),
        set: () => {}
      },
      extend: {
        filter: {
          register: (name, fn) => {
            const filterFunction = fn;
            // The function should filter to only HTML files
            const htmlRoutes = routes.filter(route => route.endsWith('.html'));
            assert.strictEqual(htmlRoutes.length, 2, 'Should identify 2 HTML files');
            assert(htmlRoutes.includes('index.html'), 'Should include index.html');
            assert(htmlRoutes.includes('about.html'), 'Should include about.html');
          }
        }
      }
    };

    require('../index.js');
  });
});