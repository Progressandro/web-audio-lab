import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef } from 'react'
import { SketchProps } from 'react-p5/@types'
import { rootMeanSquaredSignal } from 'utils/audio'
import { drawPolygon } from 'utils/graphics'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5'), {
  ssr: false,
})

interface MeterVisualizerProps {
  src: string
}
function MeterVisualizer({ src }: MeterVisualizerProps) {
  const audioContext = useRef<AudioContext | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)
  const analyserNode = useRef<AnalyserNode | null>(null)
  const signalData = useRef<Float32Array | null>(null)

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
          analyserNode.current.smoothingTimeConstant = 1

          signalData.current = new Float32Array(analyserNode.current.fftSize)
          source.connect(audioContext.current.destination)
          source.connect(analyserNode.current)
        } else if (audio.current) {
          if (audio.current.paused) audio.current.play()
          else audio.current.pause()
        }
      })
    },
    [src]
  )
  const draw = useCallback<Required<SketchProps>['draw']>((p5) => {
    // fill background
    p5.background('black')

    const dim = p5.width

    if (audioContext.current && signalData.current) {
      analyserNode.current?.getFloatTimeDomainData(signalData.current)

      const signal = rootMeanSquaredSignal(signalData.current)
      const scale = 10
      const size = dim * scale * signal

      p5.stroke('white')
      p5.noFill()
      p5.strokeWeight(dim * 0.0075)
      p5.circle(p5.width / 2, p5.height / 2, size)
    } else {
      p5.fill('white')
      p5.noStroke()
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

export default MeterVisualizer
