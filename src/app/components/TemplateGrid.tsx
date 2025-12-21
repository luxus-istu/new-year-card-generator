import React from 'react'
import type { Template } from '@/app/types'

interface Props {
  templates: Template[]
  onSelect: (template: Template) => void
  selectedTemplate: Template | null
}

export default function TemplateGrid({ templates, onSelect, selectedTemplate }: Props) {
  return (
    <div className="template-grid">
      {templates.map((template) => (
        <div
          key={template.name}
          className={`template-item ${selectedTemplate?.name === template.name ? 'selected' : ''}`}
          onClick={() => onSelect(template)}
        >
          <img src={template.preview} alt={template.name} />
          <div className="label">{template.name}</div>
        </div>
      ))}
    </div>
  )
}
