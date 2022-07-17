import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef } from 'react'
import { SketchProps } from 'react-p5/@types'
import { drawPolygon } from '../../utils/graphics'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5'), {
  ssr: false,
})

interface SoundPlayerProps {
  src: string
}
function SoundPlayer({ src }: SoundPlayerProps) {
  const audioContext = useRef<AudioContext | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)

  const setup = useCallback<SketchProps['setup']>(
    (p5, canvasParentRef) => {
      const cnv = p5.createCanvas(500, 500).parent(canvasParentRef)
      cnv.mousePressed(() => {
        if (!audioContext.current) {
          // setup our audio
          audioContext.current = new AudioContext()

          // create new <audio> tag
          audio.current = document.createElement('audio')

          // optional; enable audio looping
          audio.current.loop = true

          // set the URL of the audio asset
          audio.current.src = src

          // trigger audio
          audio.current.play()

          const source = audioContext.current.createMediaElementSource(
            audio.current
          )

          // wire the source to the 'speaker'
          source.connect(audioContext.current.destination)
        } else {
          // stop the audio
          audio.current?.pause()
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

    // Draw play/pause button
    const dim = p5.min(p5.width, p5.height)
    if (audioContext.current) {
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
      audio.current?.pause()
      audioContext.current?.close()
      audioContext.current = null
      audio.current = null
    }
  }, [])

  return <Sketch setup={setup} draw={draw} />
}

export default SoundPlayer
