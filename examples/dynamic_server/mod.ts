import { opine } from "https://deno.land/x/opine@1.3.3/mod.ts";
import LiveReload from '../../src/mod.ts'
const live = new LiveReload(Deno.cwd());

const app = opine();

app.get("/:filename", async (req, res) => {
  const name = new TextDecoder().decode(await Deno.readFile('name.txt'));
  const { filename } = req.params;
  res.type('text/html')
  res.send(`<script src="http://localhost:39430/livereload/client.js" defer></script>
            <h1>The filename is: ${filename} and my name is ${name}<h1>`);
});

live.watch()

app.listen(3000);