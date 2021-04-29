# Deno LiveReload

<a href="LICENSE">
  <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="Software License" />
</a>
<a href="https://github.com/denyncrawford/deno-livereload/issues">
  <img src="https://img.shields.io/github/issues/denyncrawford/deno-livereload.svg" alt="Issues" />
</a>
<a href="https://github.com/standard/ts-standard/">
  <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="Typescript Style Guide" />
</a>
<a href="https://deno.land/x/livereload">
  <img src="https://img.shields.io/badge/deno-^1.8.1-informational.svg?style=flat-squar" alt="Deno.land" />
</a>
<a href="https://github.com/denyncrawford/deno-livereload/releases">
  <img src="https://img.shields.io/github/release/denyncrawford/deno-livereload.svg" alt="Latest Version" />
</a>


Deno LiveReload is a development tool for watching changes at your filesystem and automatic reload your browser. It is highly configurable and is intended to work with deno but you can use it wherever you want writing a simple watcher file. The official CLI is WIP.

## Import

```typescript
import LiveReload from 'https://deno.land/x/livereload@0.1.0/mod.ts'
```

## Usage

To use LiveReload you must create a server and then inject some code in your html.

1. Create a server or handler:
  
**watcher.ts**

```typescript
const live = new LiveReload('public');
// foo code
live.watch()
```

2. Inject the script at your html files that you need to reload:

> If you're serving your files use the second option.

 **index.html**

```html
<html>
  <head>
    <!-- No served files -->
    <script src="http://localhost:39430/livereload/client.js" defer></script>
    <!-- Injecting for Served files -->
    <script defer>
      document.write(`<script src="http://'${(location.host || 'localhost').split(':')[0]}:39430/livereload/client.js></script>`)
    </script>
  </head>
  <body>
    <h1>Hello world with Deno LiveReload</h1>
  </body>
</html>
```

## Instantiating

You can use it with any configuration more than the base path like in the example above or an array of base paths:

```typescript
const live = new LiveReload(['public','assets', '.']);
```

> Relative paths will resolve into CWD.

## Config

If you pass a config object these are the options availble:

- `options` **WatchOptions**
  - `port` **number**
    - The port that livereload will use for connect to the server
    - *default*: `39430`
  - `base` **Array(string) | string**
    - Base paths(s) to watch 
    - *default*: `Deno.cwd()`
  - `recursive` **b0olean**
    - If true it Will watch the specified directory and all sub directories.
    - *default*: `true`
  - `serve` **boolean**
    - If flase it will not serve and you might want to handle the server requests by your own.
    - *default*: `true`
  - `secure` **boolean**
    - Tells client bundle to listen as http or https
    - *default*: `false`,
  - `exclude` *optional* **Array(string)**
    - List of Glob Patterns for excluding reloads of matching paths.
    *default*: `undefined`


## API

The constructed LiveReload class expose just two methods:

- `LiveReload.watch()` **void**
  - Starts watching for changes, this method prevent declaring the instance where you don't want, so calling watch will fire the changes.
  - *required*: `true`
- `LiveReload.handle(request: ServerRequest)` **void**
  - If the serve option is false you can use this method to handle each request of your own http server or http framework.
  - *required*: `flase`

  **Handling request with opine example:**
```typescript
import Livereload from '...'
import { opine } from "https://deno.land/x/opine@1.3.2/mod.ts";

const app = opine();
const port = 3000;

const live = new Livereload({
  base: 'test',
  exclude: ['*.css'],
  serve: false,
  port
});

app.all("*", live.handle)

app.listen({ port });
live.watch();
```

> If you change the default port you must use it in the injected script too.

## Building the web client

The client handles the incomming notifications from the server and you can bundle your own custon client:

1. Clone the repo
2. Edit the src/client.ts
3. Run the bundler `deno run -A --unstable bundler.ts`


## Credits

- [Miguel Rangel](https://github.com/denyncrawford)

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.


