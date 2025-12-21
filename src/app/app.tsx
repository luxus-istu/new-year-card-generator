"use client";

import { useState, useCallback, useEffect } from 'react'
import { Template } from '@/app/types'
import Header from './components/Header';
import SigmaSection from './components/SigmaSection';

export default function App() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [initials, setInitials] = useState('')
  const [recipient, setRecipient] = useState('')
  const [email, setEmail] = useState('')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [status, setStatus] = useState('')

  // Загрузка шаблонов
  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/templates')
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      setStatus('Ошибка загрузки шаблонов')
    }
  }, [])

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setPreviewVisible(true)
  }

  // const generatePreview = useCallback(() => {
  //   if (!selectedTemplate || !initials.trim()) return null

  //   // Создаем canvas для предпросмотра
  //   const canvas = document.createElement('canvas')
  //   canvas.width = 400
  //   canvas.height = 600
  //   const ctx = canvas.getContext('2d')

  //   if (!ctx) return null

  //   // Загружаем изображение шаблона
  //   const img = new Image()
  //   img.crossOrigin = 'anonymous'
  //   img.onload = () => {
  //     ctx.drawImage(img, 0, 0, 400, 600)

  //     // Инициалы
  //     ctx.font = selectedTemplate.initialsFontSize
  //     ctx.fillStyle = selectedTemplate.initialsColor
  //     ctx.textAlign = 'center'
  //     ctx.textBaseline = 'middle'
  //     ctx.shadowColor = 'rgba(0,0,0,0.5)'
  //     ctx.shadowBlur = 8
  //     ctx.fillText(initials.toUpperCase(),
  //       selectedTemplate.initialsX * 400 / 1920,
  //       selectedTemplate.initialsY * 600 / 1080
  //     )

  //     // Имя
  //     ctx.shadowBlur = 4
  //     ctx.font = selectedTemplate.recipientFontSize
  //     ctx.fillStyle = selectedTemplate.recipientColor
  //     ctx.fillText(recipient || 'Имя',
  //       selectedTemplate.recipientX * 400 / 1920,
  //       selectedTemplate.recipientY * 600 / 1080
  //     )

  //     setPreviewVisible(true)
  //   }
  //   img.src = selectedTemplate.fullImage
  // }, [selectedTemplate, initials, recipient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTemplate || !initials || !recipient || !email) {
      setStatus('Заполните все поля')
      return
    }

    setStatus('Отправка открытки...')

    try {
      // Генерируем финальное изображение
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 1800
      const ctx = canvas.getContext('2d')!

      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = async () => {
        ctx.drawImage(img, 0, 0, 1200, 1800)

        // Текст (финальный размер)
        ctx.font = selectedTemplate.initialsFontSize.replace('px', 'px')
        ctx.fillStyle = selectedTemplate.initialsColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(0,0,0,0.5)'
        ctx.shadowBlur = 15
        ctx.fillText(initials.toUpperCase(),
          selectedTemplate.initialsX * 1200 / 1920,
          selectedTemplate.initialsY * 1800 / 1080
        )

        ctx.shadowBlur = 8
        ctx.font = selectedTemplate.recipientFontSize
        ctx.fillStyle = selectedTemplate.recipientColor
        ctx.fillText(recipient,
          selectedTemplate.recipientX * 1200 / 1920,
          selectedTemplate.recipientY * 1800 / 1080
        )

        const cardImage = canvas.toDataURL('image/png')

        // Отправка
        const response = await fetch('/api/send-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: selectedTemplate.name,
            initials,
            recipient,
            email,
            cardImage
          })
        })

        if (response.ok) {
          setStatus('✅ Открытка отправлена!')
          setInitials('')
          setRecipient('')
          setEmail('')
          setSelectedTemplate(null)
          setPreviewVisible(false)
        } else {
          setStatus('❌ Ошибка отправки')
        }
      }
      img.src = selectedTemplate.fullImage
    } catch (error) {
      setStatus('❌ Ошибка отправки')
    }
  }

  return (
    <>
      <Header />
      <main className="main">
        <SigmaSection />
      </main>
    </>
  );
};
