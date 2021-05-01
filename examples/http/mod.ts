import { serve } from "https://deno.land/std@0.83.0/http/server.ts";
import LiveReload from '../../mod.ts'

const port = 3000;

const live = new LiveReload({
  base: './public',
  serve: false,
  port
});

const server = serve(`localhost:${port}`);
live.watch()

for await (const req of server) {
  if (req.url !== '/') { live.handle(req); continue }
  const body = new TextDecoder().decode(await Deno.readFile('./public/index.html'));
  req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "text/html",
    }),
    body
  });
}