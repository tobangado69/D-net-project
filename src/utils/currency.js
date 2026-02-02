export const formatIDR = (amount) => {
  return `Rp ${amount.toLocaleString('de-DE')}`
}

export const parseIDR = (str) => {
  return parseInt(str.replace(/[Rp\s.]/g, ''), 10)
}

export default { formatIDR, parseIDR }
