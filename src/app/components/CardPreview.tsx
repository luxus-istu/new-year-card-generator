import { useEffect, useRef } from 'react'
import type { Template } from '@/app/types'

type Props = {
  template: Template
  initials: string
  recipient: string
}

export default function CardPreview({ template, initials, recipient }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Инициалы
      ctx.font = template.initialsFontSize
      ctx.fillStyle = template.initialsColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 8
      ctx.fillText(initials || 'А.Б.',
        template.initialsX * 400 / 1920,
        template.initialsY * 600 / 1080
      )

      // Имя
      ctx.shadowBlur = 4
      ctx.font = template.recipientFontSize
      ctx.fillStyle = template.recipientColor
      ctx.fillText(recipient || 'Имя',
        template.recipientX * 400 / 1920,
        template.recipientY * 600 / 1080
      )
    }
    img.src = template.fullImage
  }, [template, initials, recipient])

  return (
    <div className="preview">
      <h3>Предпросмотр:</h3>
      <canvas ref={canvasRef} width={400} height={600} />
    </div>
  )
}
