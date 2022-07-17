import dynamic from 'next/dynamic'
import { useCallback } from 'react'
import { SketchProps } from 'react-p5/@types'
import { drawPolygon } from '../../utils/graphics'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5'), {
  ssr: false,
})

let audioContext: AudioContext | null
let audio: HTMLAudioElement | null = null
function PlayerCanvas() {
  const setup = useCallback<SketchProps['setup']>((p5, canvasParentRef) => {
    p5.createCanvas(500, 500).parent(canvasParentRef)
  }, [])
  const draw = useCallback<Required<SketchProps>['draw']>((p5) => {
    // fill background
    p5.background('black')

    p5.fill('white')
    p5.noStroke()

    // Draw play/pause button
    const dim = p5.min(p5.width, p5.height)
    if (audioContext) {
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

  const mousePressed = useCallback<
    Required<SketchProps>['mousePressed']
  >(() => {
    if (!audioContext) {
      // setup our audio
      audioContext = new AudioContext()

      // create new <audio> tag
      audio = document.createElement('audio')

      // optional; enable audio looping
      audio.loop = true

      // set the URL of the audio asset
      audio.src = '/audio/piano.mp3'

      // trigger audio
      audio.play()

      const source = audioContext.createMediaElementSource(audio)

      // wire the source to the 'speaker'
      source.connect(audioContext.destination)
    } else {
      // stop the audio
      audio?.pause()
      audioContext.close()
      audioContext = audio = null
    }
  }, [])

  return <Sketch setup={setup} draw={draw} mousePressed={mousePressed} />
}

export default PlayerCanvas
