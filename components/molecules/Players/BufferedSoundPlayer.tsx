import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef } from 'react'
import { SketchProps } from 'react-p5/@types'
import { drawPolygon } from '../../../utils/graphics'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5'), {
  ssr: false,
})

interface BufferedSoundPlayerProps {
  src: string
}
function BufferedSoundPlayer({ src }: BufferedSoundPlayerProps) {
  const audioContext = useRef<AudioContext | null>(null)
  const audioBuffer = useRef<AudioBuffer | null>(null)

  const loadSound = useCallback(async () => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext()
    }
    if (!audioBuffer.current) {
      const response = await fetch(src)
      const buffer = await response.arrayBuffer()
      audioBuffer.current = await audioContext.current.decodeAudioData(buffer)
    }
  }, [src])

  const playSound = useCallback(async () => {
    await loadSound()
    if (audioContext.current) {
      await audioContext.current.resume()
      const source = audioContext.current.createBufferSource()
      source?.connect(audioContext.current.destination)
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
    p5.background('black')

    p5.fill('white')
    p5.noStroke()

    // Draw play/pause button
    const dim = p5.min(p5.width, p5.height)
    if (p5.mouseIsPressed) {
      drawPolygon({
        p5,
        point: { x: p5.width / 2, y: p5.height / 2 },
        radius: dim * 0.1,
        sides: 4,
        angle: p5.PI / 4,
      })
    } else {
      drawPolygon({
        p5,
        point: { x: p5.width / 2, y: p5.height / 2 },
        radius: dim * 0.1,
        sides: 3,
      })
    }
  }, [])

  useEffect(() => {
    return () => {
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [])

  return <Sketch setup={setup} draw={draw} />
}

export default BufferedSoundPlayer
