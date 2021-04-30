import { rollup } from "https://deno.land/x/drollup@2.42.3+0.17.1/mod.ts";
const decoder = new TextDecoder()
const encoder = new TextEncoder();

const options = {
input: "./src/client.ts",
output: {
file: "./dist/client.temp.ts",
format: "es" as const,
};


const bundle = await rollup(options);

await bundle.write(options.output);
await bundle.close();

let temp: Uint8Array | string = await Deno.readFile(options.output.file)
temp = decoder.decode(temp);


const i1 = temp.indexOf('class PartialReadError')
const i2Arr = temp.substring(i1).split('').map((c, i) => (c === '}') ? i : -1)
.filter((c) => c !== -1);

const i2 = i1 + i2Arr[1] + 1;

temp = temp.replace(temp.substring(i1,i2), '').replace('//# sourceMappingURL=client.temp.ts.map', '')

const inject = `export default (protocol:string, port: number) => {
const decoder = new TextDecoder()
const module = new Uint8Array([${new TextEncoder().encode(temp)}]);
const result = decoder.decode(module);
return result.replace('$$PORT$$', port.toString()).replace('$$PROTOCOL$$', protocol)
}`

await Deno.remove(options.output.file);
await Deno.writeFile(options.output.file.replace('.temp', ''), encoder.encode(inject));

console.log('Bundle Done')