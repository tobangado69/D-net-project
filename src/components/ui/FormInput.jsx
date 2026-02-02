export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = null,
  required = false,
  disabled = false,
  className = ''
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
          error ? 'border-error focus:border-error focus:ring-error' : ''
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} px-4 py-2.5`}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Pilih...',
  error = null,
  required = false,
  disabled = false,
  className = ''
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
          error ? 'border-error focus:border-error focus:ring-error' : ''
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} px-4 py-2.5`}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
}

export default FormInput
