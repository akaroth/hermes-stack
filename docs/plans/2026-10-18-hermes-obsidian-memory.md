# Hermes memory in Obsidian — plan

Status: draft. Supersedes the earlier "Hermes/ only" version.

## Current state

- Hermes home: `.stack/hermes/.hermes`. Built-in memory is two small files
  (`memories/MEMORY.md` 573B, `memories/USER.md` 1.4K); `memory.provider: honcho`.
- Local allowlist git repo in the Hermes home (1 commit). `memories/` excluded
  on purpose (personal data).
- Obsidian MCP is live (16 tools) via the host forwarder; levers
  `HERMES_OBSIDIAN_*` in `.stack/.env`. Wiring is uncommitted in this repo
  (typecheck + 105 tests pass).
- ArunVault is already organised: `Family/ Finance/ Knowledge/ Projects/
  People/ Pantry/ Daily/ Boards/`, plus `_CLAUDE.md`, `index.md`, `log.md`
  and `Hermes/` (README, Cron, Scripts, Skills).

## Principle

- **`Hermes/`** holds everything Hermes needs to run, maintain and sustain
  itself: scripts, skills, cron, config/ops notes, `Inbox.md`, sync log,
  SOUL.md source. Hermes may rewrite freely here.
- **Domain folders** (`Family/ Finance/ Knowledge/ Projects/ People/ Pantry/
  Daily/ Boards/`) hold the user's knowledge. Hermes writes durable facts
  there, under the guardrails below.

## Guardrails (go in SOUL.md)

- Domain folders: append or patch only. Never overwrite a whole note or delete.
- Follow `_CLAUDE.md` (frontmatter, folder map) and add a `log.md` entry per write.
- Unsure where a fact belongs -> `Hermes/Inbox.md`, not a guessed folder.
- Off-limits: `Archive/`, `Finance/transactions/` (imported data).
- The MCP exposes `write_note` / `delete_note`; the rules above are
  prompt-level. **[CHECK]** whether Hermes supports a per-tool allowlist for
  MCP servers and use it to hard-block delete.

## Phases

1. **Land the wiring.** Commit the Obsidian MCP work (service.yaml levers,
   start.ts, obsidian-*.ts, tests).
2. **Map existing memory.** Read `About Me.md`, `index.md`, `Family/Inbox.md`;
   map `USER.md` / `MEMORY.md` onto them and the domain folders. Show the
   user the proposed writes before applying.
3. **Instruct Hermes.** Update SOUL.md with the principle + guardrails above;
   keep its source note in `Hermes/`.
4. **Index.** Add `Hermes/` to `index.md`.
5. **Sync job.** Nightly cron: fold `Hermes/Inbox.md` into the right notes,
   mirror curated notes to Honcho one-way (vault -> Honcho, no loops), log to
   `Hermes/Sync Log.md`.
6. **Backup scope.** **[DECIDE]** private GitHub remote for the Hermes
   backup repo, or local only.

## Risks

- Port clash: two vaults configure Local REST API on 27123; only one can be
  open at a time. Pin ArunVault's port or document it.
- Vault must be open for MCP to work; Hermes needs graceful degradation.
- Personal data in custom skills: keep any remote private.
