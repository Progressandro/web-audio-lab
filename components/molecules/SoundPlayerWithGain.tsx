import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef } from 'react'
import { SketchProps } from 'react-p5/@types'
import { drawPolygon } from '../../utils/graphics'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5'), {
  ssr: false,
})

interface SoundPlayerWithGainProps {
  src: string
}
function SoundPlayerWithGain({ src }: SoundPlayerWithGainProps) {
  const audioContext = useRef<AudioContext | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)
  const gainNode = useRef<GainNode | null>(null)

  const setup = useCallback<SketchProps['setup']>(
    (p5, canvasParentRef) => {
      const cnv = p5.createCanvas(500, 500).parent(canvasParentRef)
      cnv.mousePressed(() => {
        if (!audioContext.current) {
          audioContext.current = new AudioContext()

          audio.current = document.createElement('audio')
          audio.current.src = src
          audio.current.crossOrigin = 'Anonymouse'
          audio.current.loop = true
          audio.current.play()

          const source = audioContext.current.createMediaElementSource(
            audio.current
          )
          gainNode.current = audioContext.current.createGain()
          source.connect(gainNode.current)
          gainNode.current.connect(audioContext.current.destination)
        } else {
          audio.current?.pause()
          audioContext.current.close()
          audio.current = null
          audioContext.current = null
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
    if (audioContext.current && gainNode.current) {
      const volume = p5.abs(p5.mouseX - p5.width / 2) / (p5.width / 2)
      gainNode.current.gain.setTargetAtTime(
        volume,
        audioContext.current.currentTime,
        0.01
      )
      p5.rectMode(p5.CENTER)
      p5.rect(p5.width / 2, p5.height / 2, dim * volume, dim * 0.05)
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

export default SoundPlayerWithGain
