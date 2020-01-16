import React, { MouseEvent } from 'react'
import './index.scss'

interface CheckboxProps {
  checked: boolean
  toggle: () => void
  label?: string | undefined
  labelKey?: string | undefined
  value?: string | undefined
  disabled?: boolean | undefined
}

const Checkbox = (props: CheckboxProps) => {
  const checkboxClassName = ['custom-checkbox', props.disabled ? 'custom-checkbox__disabled' : ''].join(' ')
  const iconClassName = ['fas', 'fa-check', props.checked ? 'icon-checked' : 'icon-unchecked'].join(' ')

  const handleClick = (event: React.MouseEvent<Element>) => {
    if (!props.disabled) {
      props.toggle()
    }
  }

  return (
    <span onClick={handleClick} className={checkboxClassName}>
      <input type="checkbox" checked={props.checked} value={props.value} disabled={props.disabled} readOnly />
      <span>
        <i className={iconClassName} />
      </span>
      {props.label && (
        <label htmlFor={props.labelKey} className="ml-2">
          {props.label}
        </label>
      )}
    </span>
  )
}

export default Checkbox
