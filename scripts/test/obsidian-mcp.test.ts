import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'
import { applyObsidianMcp, obsidianLevers } from '../../services/hermes/obsidian-mcp.ts'

describe('obsidian-mcp', () => {
  it('is a no-op without a token', () => {
    expect(obsidianLevers({})).toBeNull()
    expect(obsidianLevers({ HERMES_OBSIDIAN_TOKEN: '  ' })).toBeNull()
    expect(applyObsidianMcp('a: 1\n', null)).toBe('a: 1\n')
  })

  it('applies defaults and keeps other mcp servers', () => {
    const lv = obsidianLevers({ HERMES_OBSIDIAN_TOKEN: 'tok' })
    expect(lv).toEqual({ token: 'tok', host: '192.168.139.3', port: 27123 })
    const out = parse(applyObsidianMcp('mcp_servers:\n  motra:\n    url: x\n', lv))
    expect(out.mcp_servers.motra.url).toBe('x')
    expect(out.mcp_servers.obsidian.url).toBe('http://192.168.139.3:27123/mcp/')
    expect(out.mcp_servers.obsidian.headers.Authorization).toBe('Bearer tok')
  })

  it('honours host/port overrides and is idempotent', () => {
    const lv = obsidianLevers({
      HERMES_OBSIDIAN_TOKEN: 't',
      HERMES_OBSIDIAN_BRIDGE_HOST: '10.0.0.2',
      HERMES_OBSIDIAN_PORT: '28000',
    })
    const once = applyObsidianMcp('', lv)
    expect(applyObsidianMcp(once, lv)).toBe(once)
    expect(parse(once).mcp_servers.obsidian.url).toBe('http://10.0.0.2:28000/mcp/')
  })
})
