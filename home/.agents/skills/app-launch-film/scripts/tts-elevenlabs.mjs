// Record one act as a continuous ElevenLabs take, with word timings.
// Usage: node tts-elevenlabs.mjs --act hook --text "..." [--voice <id>] [--take 1]
//        [--stability 0.45] [--style 0.3] [--model eleven_multilingual_v2] [--out vo]
//        node tts-elevenlabs.mjs --voices   (list available voices)
// Needs ELEVENLABS_API_KEY.
import { mkdirSync, writeFileSync } from 'node:fs'

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : a), []))
if (args.help) { console.log(import.meta.url.replace('file://', '') + '\n' + 'See the usage comment at the top of this file.'); process.exit(0) }
const key = process.env.ELEVENLABS_API_KEY
if (!key) { console.error('ELEVENLABS_API_KEY is not set'); process.exit(1) }
const api = 'https://api.elevenlabs.io/v1'

if (args.voices) {
  const r = await fetch(`${api}/voices`, { headers: { 'xi-api-key': key } })
  const j = await r.json()
  for (const v of j.voices ?? []) console.log(v.voice_id, '|', v.name, '|', v.labels?.accent ?? '', v.labels?.gender ?? '')
  process.exit(0)
}

const { act, text } = args
if (!act || !text) { console.error('--act and --text are required'); process.exit(1) }
const voice = args.voice ?? process.env.ELEVENLABS_VOICE_ID
if (!voice) { console.error('pass --voice or set ELEVENLABS_VOICE_ID (list with --voices)'); process.exit(1) }
const out = args.out ?? 'vo', take = args.take ?? 1
mkdirSync(out, { recursive: true })

const r = await fetch(`${api}/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_192`, {
  method: 'POST',
  headers: { 'xi-api-key': key, 'content-type': 'application/json' },
  body: JSON.stringify({
    text,
    model_id: args.model ?? 'eleven_multilingual_v2',
    voice_settings: { stability: +(args.stability ?? 0.45), similarity_boost: 0.8, style: +(args.style ?? 0.3), use_speaker_boost: true },
  }),
})
if (!r.ok) { console.error(r.status, await r.text()); process.exit(1) }
const j = await r.json()
writeFileSync(`${out}/${act}-${take}.mp3`, Buffer.from(j.audio_base64, 'base64'))

// characters to words: a word spans from its first to its last non-space character
const al = j.alignment, words = []
let cur = null
al.characters.forEach((c, i) => {
  if (/\s/.test(c)) { if (cur) { words.push(cur); cur = null } return }
  if (!cur) cur = { w: '', t0: al.character_start_times_seconds[i], t1: 0 }
  cur.w += c; cur.t1 = al.character_end_times_seconds[i]
})
if (cur) words.push(cur)
writeFileSync(`${out}/${act}-${take}.json`, JSON.stringify({ act, take, text, voice, words }, null, 1))
console.log(`${out}/${act}-${take}.mp3`, words.length, 'words', (words.at(-1)?.t1 ?? 0).toFixed(2) + 's')
