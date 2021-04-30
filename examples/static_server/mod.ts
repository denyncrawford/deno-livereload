import { createApp, serveStatic } from "https://deno.land/x/servest@v1.3.1/mod.ts";
import LiveReload from '../../src/mod.ts'
const live = new LiveReload('./public');
// foo code
const app = createApp();
// All requests will be processed and matched files in "public" directory
// are served automatically
// Otherwise, request will be passed to next handler
app.use(serveStatic("./public"));

live.watch()
app.listen({ port: 8899 });