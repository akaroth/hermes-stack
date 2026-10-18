// services/hermes/task-models.ts — per-task model overrides for
// ~/.hermes/config.yaml, driven by optional .stack/.env levers. Each lever
// unset/empty = leave that key untouched (Hermes default). All routes go
// through LiteLLM with the same virtual key as the main model.
import { parseDocument } from 'yaml'

// lever -> config.yaml path of the model name it pins
export const TASK_LEVERS: Record<string, string[]> = {
  HERMES_MODEL_COMPRESSION: ['auxiliary', 'compression'],
  HERMES_MODEL_VISION: ['auxiliary', 'vision'],
  HERMES_MODEL_WEB_EXTRACT: ['auxiliary', 'web_extract'],
  HERMES_MODEL_SESSION_SEARCH: ['auxiliary', 'session_search'],
  HERMES_MODEL_TITLE: ['auxiliary', 'title_generation'],
}
export const DELEGATION_LEVER = 'HERMES_MODEL_DELEGATION'

export const applyTaskModels = (
  body: string,
  env: Record<string, string | undefined>,
  baseUrl: string,
  apiKey: string,
): string => {
  const doc = parseDocument(body || '{}')
  let changed = false
  for (const [lever, path] of Object.entries(TASK_LEVERS)) {
    const model = env[lever]?.trim()
    if (!model) continue
    doc.setIn([...path, 'provider'], 'custom')
    doc.setIn([...path, 'model'], model)
    doc.setIn([...path, 'base_url'], baseUrl)
    doc.setIn([...path, 'api_key'], apiKey)
    changed = true
  }
  const del = env[DELEGATION_LEVER]?.trim()
  if (del) {
    // Delegation resolves creds from named providers only, so pin the model
    // and inherit the parent's endpoint (provider left unset).
    doc.setIn(['delegation', 'model'], del)
    changed = true
  }
  return changed ? doc.toString() : body
}
