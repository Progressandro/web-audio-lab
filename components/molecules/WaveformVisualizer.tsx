import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef } from 'react'
import { SketchProps } from 'react-p5/@types'
import { drawPolygon } from '../../utils/graphics'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5'), {
  ssr: false,
})

interface WaveformVisualizerProps {
  src: string
}
function WaveformVisualizer({ src }: WaveformVisualizerProps) {
  const audioContext = useRef<AudioContext | null>(null)
  const audioBuffer = useRef<AudioBuffer | null>(null)
  const analyserNode = useRef<AnalyserNode | null>(null)
  const analyserData = useRef<Float32Array | null>(null)
  const gainNode = useRef<GainNode | null>(null)

  const loadSound = useCallback(async () => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext()
    }
    if (!audioBuffer.current) {
      const response = await fetch(src)
      const buffer = await response.arrayBuffer()
      audioBuffer.current = await audioContext.current.decodeAudioData(buffer)
    }

    if (!gainNode.current) {
      gainNode.current = audioContext.current.createGain()

      analyserNode.current = audioContext.current.createAnalyser()
      analyserData.current = new Float32Array(analyserNode.current.fftSize)
      gainNode.current.connect(analyserNode.current)
      gainNode.current.connect(audioContext.current.destination)
    }
  }, [src])

  const playSound = useCallback(async () => {
    await loadSound()
    if (audioContext.current && gainNode.current) {
      await audioContext.current.resume()
      const source = audioContext.current.createBufferSource()
      source?.connect(gainNode.current)
      source.buffer = audioBuffer.current
      source.start(0)
    }
  }, [loadSound])

  const setup = useCallback<SketchProps['setup']>(
    (p5, canvasParentRef) => {
      const cnv = p5.createCanvas(p5.windowWidth, 500).parent(canvasParentRef)
      cnv.mousePressed(() => {
        playSound()
      })
    },
    [playSound]
  )
  const draw = useCallback<Required<SketchProps>['draw']>((p5) => {
    // fill background
    p5.background(0, 0, 0)

    if (analyserNode.current && analyserData.current) {
      p5.noFill()
      p5.stroke('white')

      analyserNode.current.getFloatTimeDomainData(analyserData.current)
      p5.beginShape()

      for (let i = 0; i < analyserData.current.length; i++) {
        const amplitude = analyserData.current[i]
        const y = p5.map(
          amplitude,
          -1,
          1,
          p5.height / 2 - p5.height / 4,
          p5.height / 2 + p5.height / 4
        )

        const x = p5.map(i, 0, analyserData.current.length - 1, 0, p5.width)
        p5.vertex(x, y)
      }
      p5.endShape()
    } else {
      p5.fill('white')
      p5.noStroke()
      const dim = p5.min(p5.width, p5.height)
      drawPolygon({
        p5,
        point: {
          x: p5.width / 2,
          y: p5.height / 2,
        },
        radius: dim * 0.1,
        sides: 3,
      })
    }
  }, [])

  const resizeCanvas = useCallback<Required<SketchProps>['windowResized']>(
    (p5) => {
      p5.resizeCanvas(p5.windowWidth, 500)
    },
    []
  )

  useEffect(() => {
    return () => {
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [])

  return <Sketch setup={setup} draw={draw} windowResized={resizeCanvas} />
}

export default WaveformVisualizer
