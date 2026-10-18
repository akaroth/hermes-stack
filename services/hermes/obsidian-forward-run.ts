// services/hermes/obsidian-forward-run.ts — ensure the Obsidian bridge
// forwarder (obsidian-forward.ts) is running; idempotent across `start`s.
import { spawn } from 'node:child_process'
import { closeSync, openSync } from 'node:fs'
import { connect } from 'node:net'
import { resolve } from 'node:path'
import { STACK_ROOT } from '../../scripts/lib/paths.ts'
import { log } from '../../scripts/lib/log.ts'
import type { ObsidianLevers } from './obsidian-mcp.ts'

const listening = (host: string, port: number): Promise<boolean> =>
  new Promise((done) => {
    const s = connect({ host, port })
    s.once('connect', () => (s.destroy(), done(true)))
    s.once('error', () => done(false))
  })

export const startObsidianForward = async (lv: ObsidianLevers): Promise<void> => {
  if (await listening(lv.host, lv.port)) {
    log(`hermes/start: obsidian forwarder already up on ${lv.host}:${lv.port}`)
    return
  }
  const logFile = resolve(STACK_ROOT, '.stack/hermes/obsidian-forward.log')
  const fd = openSync(logFile, 'a')
  const child = spawn(
    process.execPath,
    [resolve(STACK_ROOT, 'services/hermes/obsidian-forward.ts'), lv.host, String(lv.port)],
    { detached: true, stdio: ['ignore', fd, fd] },
  )
  child.unref()
  closeSync(fd)
  log(`hermes/start: started obsidian forwarder on ${lv.host}:${lv.port} (log: ${logFile})`)
}
