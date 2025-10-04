# hexo-cookieconsent

A hexo plugin for quickly adding the lightweight JavaScript plugin for alerting users about the use of cookies on your website.

## Installation

``` bash
$ npm i hexo-cookieconsent
```

## Usage

Inside your hexo _config.yml file.

``` yaml
cookieconsent:
  enable: true
```

The plugin has several options.

### Custom CSS and JS URLs

You can specify custom URLs for the CSS and JS files. This allows you to use local files or even other cookie consent libraries:

``` yaml
cookieconsent:
  enable: true
  jsUrl: "/js/cookieconsent.umd.js"  # Optional: custom JS file URL
  cssUrl: "/css/cookieconsent.css"   # Optional: custom CSS file URL
```

To download the files locally from one of the cookie consent library:

- JS: https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js
- CSS: https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.css

If not specified, the plugin will use the default CDN URLs.

## Options

Go to: https://playground.cookieconsent.orestbida.com/

Create your cookieconsent how you want it using the form.
Paste the configuration into your hexo _config.yml file under "options". The plugin automatically detects and supports both JSON and YAML formats.

### JSON Format

``` yaml
cookieconsent:
  enable: true
  jsUrl: "/js/cookieconsent.umd.js"  # Optional
  cssUrl: "/css/cookieconsent.css"   # Optional
  options: {
             "palette": {
               "popup": {
                 "background": "#eb6c44",
                 "text": "#ffffff"
               },
               "button": {
                 "background": "#f5d948"
               }
             },
             "theme": "classic",
             "position": "top",
             "static": true,
             "content": {
               "message": "This website uses cookies to ensure you get the best experience on our website. Who doesn't like cookies?",
               "dismiss": "Feed me",
               "link": "Cookie recipes",
               "href": "neo01.com"
             }
           }
```

### YAML Format

``` yaml
cookieconsent:
  enable: true
  jsUrl: "/js/cookieconsent.umd.js"  # Optional
  cssUrl: "/css/cookieconsent.css"   # Optional
  options:
    palette:
      popup:
        background: "#eb6c44"
        text: "#ffffff"
      button:
        background: "#f5d948"
    theme: "classic"
    position: "top"
    static: true
    content:
      message: "This website uses cookies to ensure you get the best experience on our website. Who doesn't like cookies?"
      dismiss: "Feed me"
      link: "Cookie recipes"
      href: "neo01.com"
```

The script is inserted during hexo generate so don't forget:

```
hexo generate
```