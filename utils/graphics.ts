import p5Types from 'p5'
interface DrawPolygonProps {
  p5: p5Types
  point: { x: number; y: number }
  radius: number
  sides?: number
  angle?: number
}
export const drawPolygon = ({
  p5,
  point,
  radius,
  sides = 3,
  angle = 0,
}: DrawPolygonProps) => {
  p5.beginShape()
  for (let i = 0; i < sides; i++) {
    const a = angle + p5.TWO_PI * (i / sides)
    const sx = point.x + p5.cos(a) * radius
    const sy = point.y + p5.sin(a) * radius
    p5.vertex(sx, sy)
  }
  p5.endShape(p5.CLOSE)
}
