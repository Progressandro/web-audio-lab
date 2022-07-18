import p5Types from 'p5'

export function rootMeanSquaredSignal(data: Float32Array): number {
  let rms = 0
  for (let i = 0; i < data.length; i++) {
    rms += data[i] * data[i]
  }
  return Math.sqrt(rms / data.length)
}

export function frequencyToIndex(
  frequencyHz: number,
  sampleRate: number,
  frequencyBinCount: number
): number {
  const nyquist = sampleRate / 2
  const index = Math.round((frequencyHz / nyquist) * frequencyBinCount)
  return Math.min(frequencyBinCount, Math.max(0, index))
}

export function indexToFrequency(
  index: number,
  sampleRate: number,
  frequencyBinCount: number
) {
  return (index * sampleRate) / (frequencyBinCount * 2)
}

interface AudioSignalProps {
  analyser: AnalyserNode
  frequencies: Float32Array
  minHz: number
  maxHz: number
  p5: p5Types
}
export function audioSignal({
  p5,
  analyser,
  frequencies,
  minHz,
  maxHz,
}: AudioSignalProps) {
  if (!analyser) return 0
  const sampleRate = analyser.context.sampleRate
  const binCount = analyser.frequencyBinCount
  let start = frequencyToIndex(minHz, sampleRate, binCount)
  const end = frequencyToIndex(maxHz, sampleRate, binCount)
  const count = end - start
  let sum = 0
  for (; start < end; start++) {
    sum += frequencies[start]
  }

  const minDb = analyser.minDecibels
  const maxDb = analyser.maxDecibels
  const valueDb = count === 0 || !isFinite(sum) ? minDb : sum / count
  return p5.map(valueDb, minDb, maxDb, 0, 1, true)
}
