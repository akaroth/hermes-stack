// redis/build.ts — generate REDIS_PASSWORD into .stack/redis/.generated.env.
//
// Reused on re-run so the value keeps matching whatever consumers already
// have it cached/configured with — rotating it silently would just make
// every client's existing connection start failing auth.
import { generatedGenIfMissing } from '../../scripts/lib/generated.ts'
import { log } from '../../scripts/lib/log.ts'

export default async function build(): Promise<void> {
  if (generatedGenIfMissing('redis', 'REDIS_PASSWORD', '', 16)) {
    log('redis: generated REDIS_PASSWORD')
  } else {
    log('redis: reusing existing REDIS_PASSWORD')
  }
}
