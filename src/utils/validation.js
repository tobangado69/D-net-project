export const validateRequired = (value) => {
  return value && value.trim() !== '' ? null : 'Field ini wajib diisi'
}

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email) ? null : 'Email tidak valid'
}

export const validatePhoneNumber = (phone) => {
  const regex = /^\+?[0-9]{10,15}$/
  return regex.test(phone.replace(/[\s-]/g, '')) ? null : 'Nomor telepon tidak valid'
}

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength ? null : `Minimal ${minLength} karakter`
}

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength ? null : `Maksimal ${maxLength} karakter`
}

export const validateForm = (fields) => {
  const errors = {}
  
  Object.keys(fields).forEach(field => {
    const validators = fields[field]
    for (const validator of validators) {
      const error = validator()
      if (error) {
        errors[field] = error
        break
      }
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export default {
  validateRequired,
  validateEmail,
  validatePhoneNumber,
  validateMinLength,
  validateMaxLength,
  validateForm
}
