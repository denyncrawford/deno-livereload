import { opine } from "https://deno.land/x/opine@1.3.3/mod.ts";
import LiveReload from '../../mod.ts'
import { ServerRequest } from 'https://deno.land/std@0.83.0/http/server.ts';
const app = opine();
const port = 3000;

const live = new LiveReload({
  serve: false,
  port
});

/* @ts-ignore */
app.get('/livereload',(req: ServerRequest) => {
   live.handle(req)
})

app.get('/livereload/client.js', (req: ServerRequest) => {
  live.handle(req)
})

app.get("/", async (req) => {
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