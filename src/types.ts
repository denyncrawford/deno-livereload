export type WatchOptions = {
  port: number,
  base: (Array<string> | string),
  recursive: boolean ,
  serve: boolean,
  secure: boolean, 
  exclude?: Array<string>
}