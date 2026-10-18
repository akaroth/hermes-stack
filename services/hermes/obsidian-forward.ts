// services/hermes/obsidian-forward.ts — relay the Obsidian Local REST API
// (loopback-only on the Mac) onto the OrbStack bridge so the Hermes VM can
// reach it. Binds ONLY the bridge address, never 0.0.0.0, so the LAN can't.
//   bun services/hermes/obsidian-forward.ts [bindHost] [port]
import { connect, createServer } from 'node:net'

const bindHost = process.argv[2] || '192.168.139.3'
const port = Number(process.argv[3] || 27123)

createServer((client) => {
  const upstream = connect({ host: '127.0.0.1', port })
  client.pipe(upstream).pipe(client)
  const close = () => {
    client.destroy()
    upstream.destroy()
  }
  client.on('error', close)
  upstream.on('error', close)
}).listen(port, bindHost, () => {
  console.log(`obsidian-forward: ${bindHost}:${port} -> 127.0.0.1:${port}`)
})
