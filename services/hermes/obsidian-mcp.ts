// services/hermes/obsidian-mcp.ts — optional Obsidian MCP wiring for
// ~/.hermes/config.yaml, driven by .stack/.env levers. Obsidian's Local REST
// API is loopback-only on the Mac, so services/hermes/obsidian-forward.ts
// relays it onto the OrbStack bridge and Hermes points at the bridge address.
// Empty HERMES_OBSIDIAN_TOKEN = leave config untouched.
import { parseDocument } from 'yaml'

export const OBSIDIAN_DEFAULT_HOST = '192.168.139.3'
export const OBSIDIAN_DEFAULT_PORT = 27123

export type ObsidianLevers = { token: string; host: string; port: number }

export const obsidianLevers = (env: Record<string, string | undefined>): ObsidianLevers | null => {
  const token = env.HERMES_OBSIDIAN_TOKEN?.trim()
  if (!token) return null
  return {
    token,
    host: env.HERMES_OBSIDIAN_BRIDGE_HOST?.trim() || OBSIDIAN_DEFAULT_HOST,
    port: Number(env.HERMES_OBSIDIAN_PORT?.trim() || OBSIDIAN_DEFAULT_PORT),
  }
}

export const applyObsidianMcp = (body: string, lv: ObsidianLevers | null): string => {
  if (!lv) return body
  const doc = parseDocument(body || '{}')
  doc.setIn(['mcp_servers', 'obsidian'], {
    url: `http://${lv.host}:${lv.port}/mcp/`,
    headers: { Authorization: `Bearer ${lv.token}` },
    timeout: 60,
    connect_timeout: 20,
  })
  return doc.toString()
}
