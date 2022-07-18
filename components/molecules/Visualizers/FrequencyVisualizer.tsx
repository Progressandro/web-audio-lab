import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef } from 'react'
import { SketchProps } from 'react-p5/@types'
import { audioSignal } from 'utils/audio'
import { drawPolygon } from 'utils/graphics'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5'), {
  ssr: false,
})
const FTT_SIZE = 2048 * 2

interface FrequencyData {
  name: string
  minHz: number
  maxHz: number
  color: string
}

const FREQUENCIES: FrequencyData[] = [
  {
    name: 'subBass',
    minHz: 16,
    maxHz: 60,
    color: '#9B5DE5',
  },
  {
    name: 'bass',
    minHz: 60,
    maxHz: 250,
    color: '#F15BB5',
  },
  {
    name: 'lowerMid',
    minHz: 250,
    maxHz: 500,
    color: '#FEE440',
  },
  {
    name: 'mid',
    minHz: 500,
    maxHz: 2000,
    color: '#00BBF9',
  },
  {
    name: 'upperMid',
    minHz: 2000,
    maxHz: 4000,
    color: '#00F5D4',
  },
  {
    name: 'treble',
    minHz: 4000,
    maxHz: 20000,
    color: '#F37748',
  },
]

interface FrequencyVisualizerProps {
  src: string
}
function FrequencyVisualizer({ src }: FrequencyVisualizerProps) {
  const audioContext = useRef<AudioContext | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)
  const analyserNode = useRef<AnalyserNode | null>(null)
  const frequencyData = useRef<Float32Array | null>(null)

  const setup = useCallback<SketchProps['setup']>(
    (p5, canvasParentRef) => {
      const cnv = p5.createCanvas(p5.windowWidth, 500).parent(canvasParentRef)
      cnv.mousePressed(() => {
        if (!audioContext.current) {
          audioContext.current = new AudioContext()
          audio.current = document.createElement('audio')
          audio.current.src = src
          audio.current.crossOrigin = 'Anonymous'
          audio.current.loop = true
          audio.current.play()

          const source = audioContext.current.createMediaElementSource(
            audio.current
          )

          analyserNode.current = audioContext.current.createAnalyser()
          analyserNode.current.fftSize = FTT_SIZE

          analyserNode.current.minDecibels = -100
          analyserNode.current.maxDecibels = -30

          frequencyData.current = new Float32Array(FTT_SIZE)

          frequencyData.current = new Float32Array(analyserNode.current.fftSize)
          source.connect(analyserNode.current)
          source.connect(audioContext.current.destination)
        } else if (audio.current && audioContext.current) {
          audio.current.pause()
          audioContext.current.close()
          audioContext.current = null
          audio.current = null
        }
      })
    },
    [src]
  )

  const draw = useCallback<Required<SketchProps>['draw']>((p5) => {
    // fill background
    p5.background('black')

    p5.fill('white')
    p5.noStroke()

    const dim = p5.width

    if (audioContext.current && frequencyData.current && analyserNode.current) {
      analyserNode.current.getFloatFrequencyData(frequencyData.current)

      const cx = p5.width / 2
      const cy = p5.height / 2
      const radius = dim * 0.75
      p5.strokeWeight(dim * 0.0075)

      p5.noFill()

      for (const freq of FREQUENCIES) {
        p5.fill(freq.color)
        p5.stroke(freq.color)
        const freqDrawData = audioSignal({
          p5,
          frequencies: frequencyData.current,
          analyser: analyserNode.current,
          minHz: freq.minHz,
          maxHz: freq.maxHz,
        })
        p5.circle(cx, cy, radius * freqDrawData)
      }
    } else {
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

export default FrequencyVisualizer
