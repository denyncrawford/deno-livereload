
import { ServerRequest, serve } from 'https://deno.land/std@0.83.0/http/server.ts'
import { Server as Dropper } from 'https://raw.githubusercontent.com/denyncrawford/dropper-deno/main/src/mod.ts';
import { resolve, normalize } from 'https://deno.land/std@0.92.0/path/mod.ts'
import globToRegexp from 'https://cdn.skypack.dev/glob-to-regexp'
import { WatchOptions } from './types.ts'


export default class Livereload {
  #options: WatchOptions = {
    port: 39430,
    base: Deno.cwd(),
    recursive: true,
    serve: true,
    secure: false
  }
  #dropper = new Dropper({
    serve: false
  })
  #file: null | string = null;
  #isWatching = false;
  constructor(arg: Array<string> | string | Record<string, string | number | Array<string> | boolean >) {
    if (typeof arg === 'string' || Array.isArray(arg)) {
      arg = { base: arg };
    }
    Object.assign(this.#options, arg)
    this.init()
  }

  watch() {
    this.#isWatching = true;
  }
  
  async handle(req: ServerRequest) {
    const url = req.url.split('?')[0];
    if (url === '/livereload/client.js') {
      let client: string;
      if (!this.#file) {
        const { default: imp } = await import('../dist/client.ts');
        client = imp(this.#options.secure ? 'wss' : 'ws',this.#options.port);
        this.#file = client;
      } else client = this.#file;
      const headers = new Headers({'Content-Type':'application/javascript'})
      req.respond({body: client, headers});
    }
    if (url === '/livereload') {
      this.#dropper.handle(req)
    }
  }

  private async serve() {
    const server = serve(`localhost:${this.#options.port}`);
    for await (const req of server) {
     this.handle(req)
    }
  }

  private async init () {
    if (this.#options.serve) this.serve();
    this.#dropper.on('connection', () => {
      return true;
    })
    const filePath = Array.isArray(this.#options.base) ? this.#options.base.map((e:string) => resolve(Deno.cwd(), e)) : resolve(Deno.cwd(), this.#options.base)
    const watcher = Deno.watchFs(filePath, {
      recursive: this.#options.recursive
    })
    for await (const ev of watcher) {
      if (!this.#isWatching) continue;
      if (this.#options.exclude && this.#options.exclude.some((glob: string) => globToRegexp(glob).test(normalize(ev.paths[0])))) continue;
      this.#dropper.send('update', new Date())
    }
  }

}