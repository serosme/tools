export default defineEventHandler(async (event) => {
  const audio = await readRawBody(event, false)
  return { text: await requestAsr(pcmToWav(audio!), conf.asr.key) }
})
