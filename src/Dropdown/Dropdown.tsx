import React, { ReactElement } from 'react'

/**
 * Interface for dropdown options.
 *
 * {string} id - The ID of the option.
 * {string} title - The title of the option.
 */
export interface DropdownOption {
  id: string
  title: string
}

/**
 * Props for the Dropdown component.
 * @interface DropdownProps
 * @augments {React.HTMLAttributes<HTMLSelectElement>}
 * @property {string} contentType - The content type of the dropdown options.
 * @property {boolean} disabled - Flag to disable the dropdown.
 * @property {string} label - The label for the dropdown.
 * @property {string} value - The selected value.
 * @property {boolean} loading - Flag to show or hide the loading state.
 * @property {(event: React.ChangeEvent<HTMLSelectElement>) => void} onChange - The change event handler for the dropdown.
 */
interface DropdownProps {
  contentType: string
  disabled?: boolean
  label?: string
  loading: boolean
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: { id: string; title: string }[]
  value: string
}

/**
 * A reusable dropdown component for selecting an option from a list.
 * @param {DropdownProps} props - The props passed to the component.
 * @returns {ReactElement} The rendered dropdown component.
 */
const Dropdown: React.FC<DropdownProps> = ({
  contentType,
  disabled = false,
  label,
  loading,
  onChange,
  options,
  value,
}: DropdownProps): ReactElement => {
  return (
    <div className="aaaw-dropdown">
      {label && <label className="aaaw-dropdown-label">{label}</label>}

      <select
        className="aaaw-styled-select"
        disabled={disabled}
        onChange={onChange}
        value={value}
      >
        {loading ? (
          <option key="0" value="0">
            Loading {contentType}s...
          </option>
        ) : !options.length ? (
          <option key="0" value="0">
            No {contentType}s found
          </option>
        ) : (
          <>
            <option value="">Select an {contentType}</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  )
}

export default Dropdown
