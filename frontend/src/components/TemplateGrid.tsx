import React from 'react'
import { Template } from '../../../shared/src/types'

interface Props {
  templates: Template[]
  onSelect: (template: Template) => void
  selectedTemplate: Template | null
}

const TemplateGrid: React.FC<Props> = ({ templates, onSelect, selectedTemplate }) => {
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

export default TemplateGrid
