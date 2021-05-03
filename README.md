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
import LiveReload from 'https://deno.land/x/livereload@0.1.0/src/mod.ts'
```

## Usage

To use LiveReload you must create a WATCHER and then inject some code in your html.

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
    <!-- 1. No served files -->
    <script src="http://localhost:39430/livereload/client.js" defer></script>
    <!-- 2. Injecting for Served files -->
    <script defer>
      document.write(`<script src="http://'${(location.host || 'localhost').split(':')[0]}:39430/livereload/client.js></script>`)
    </script>
    <!-- 3. Using the same dev server (with live.handle) -->
    <script src="/livereload/client.js" defer></script>
  </head>
  <body>
    <h1>Hello world with Deno LiveReload</h1>
  </body>
</html>
```

Livereload serves the backend instance and the client so it is stand alone by default, but if you have already a development server, you might want to disable the livereload server at the config object and use your own port and protocol, then you have to handle the incomming requests from the `/livereload` and `/livereload/client.js` endpoints with `LiveReload(options).handle(req)`. Please check [this example](#handling-request-with-opine-example) to know how to use your own server.

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

 ## Handling request with opine example:
```typescript
import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts"; // Note the version
import LiveReload from '../../mod.ts'
import { ServerRequest } from 'https://deno.land/std@0.83.0/http/server.ts';
const app = opine();
const port = 3000;

const live = new LiveReload({
  base: 'test',
  exclude: ['*.css'],
  serve: false,
  port
});

app.get(['/livereload', '/livereload/client.js'],(req: ServerRequest) => {
   live.handle(req)
})

app.get("/", async (req: ServerRequest) => {
  const name = new TextDecoder().decode(await Deno.readFile('name.txt'));
  req.respond({status: 200,
    headers: new Headers({
      "content-type": "text/html",
    }),
    body:`<script src="http://localhost:${port}/livereload/client.js" defer></script>
            <h1>My name is ${name}<h1>`
    });
});

live.watch()

app.listen(port);
```

> NOTE: By now, this module is only compatible with the std@0.83.0 http ServerRequest interface, if you want to use a custom framework or dev server you must check first the http version of the module and match it with the compatible version.

## Building the web client

> The client is a ts file and you don't need to import it directly from the file system, instead livereload serves the constructed client as a js file. This is because it sets the port dynamically and builds the client in real-time every time a request is made. For normal usage you won't need to build your own client.

The client handles the inning notifications from the server and you can bundle your own custom client:

1. Clone the repo
2. Edit the src/client.ts
3. Run the bundler `deno run -A --unstable bundler.ts`


## Credits

- [Miguel Rangel](https://github.com/denyncrawford)

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.


