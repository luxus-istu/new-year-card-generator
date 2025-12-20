import React from 'react'
import { Template } from '../../types'

type Props = {
  templates: Template[]
  onSelect: (template: Template) => Promise<void>
  selectedTemplate: Template | null
}

const TemplateGrid: React.FC<Props> = ({ templates, onSelect, selectedTemplate }) => {
  return (
    <div className="template-grid">
      {templates.map((template) => (
        <div
          key={template.name}
          className={`template-item ${selectedTemplate?.name === template.name ? 'selected' : ''}`}
          onClick={async () => await onSelect(template)}
        >
          <img src={template.preview} alt={template.name} />
          <div className="label">{template.name}</div>
        </div>
      ))}
    </div>
  )
}

export default TemplateGrid
