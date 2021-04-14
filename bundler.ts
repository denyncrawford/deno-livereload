import { rollup } from "https://deno.land/x/drollup@2.42.3+0.17.1/mod.ts";
const decoder = new TextDecoder()
const encoder = new TextEncoder();

const options = {
  input: "./src/client.ts",
  output: {
    file: "./dist/client.temp.ts",
    format: "es" as const,
    sourcemap: true,
  },
};


const bundle = await rollup(options);

await bundle.write(options.output);
await bundle.close();

let temp: Uint8Array | string = await Deno.readFile(options.output.file) 
temp = decoder.decode(temp);

const i1 = temp.indexOf('class PartialReadError')
const i2 = i1 + 186;

// temp = temp.split('').splice(i1, i2 - i1).join('')

temp = temp.replace(temp.substring(i1,i2), '')

const inject = `export default (protocol:string, port: number) => {
  const decoder = new TextDecoder()
  const module = new Uint8Array([${new TextEncoder().encode(temp)}]);
  const result = decoder.decode(module);
  return result.replace('$$PORT$$', port.toString()).replace('$$PROTOCOL$$', protocol)
}`

await Deno.remove(options.output.file);
await Deno.writeFile(options.output.file.replace('.temp', ''), encoder.encode(inject));

console.log('Bundle Done')
