export function Badge({ children, variant = 'primary', size = 'md' }) {
  const variantClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm'
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  )
}

export function CategoryBadge({ category }) {
  const categoryColors = {
    starter: 'primary',
    regular: 'accent',
    premium: 'warning',
    unlimited: 'success',
    special: 'error'
  }

  const categoryLabels = {
    starter: 'Starter',
    regular: 'Regular',
    premium: 'Premium',
    unlimited: 'Unlimited',
    special: 'Special'
  }

  return (
    <Badge variant={categoryColors[category] || 'gray'}>
      {categoryLabels[category] || category}
    </Badge>
  )
}

export function StatusBadge({ status }) {
  const statusColors = {
    active: 'success',
    inactive: 'gray',
    completed: 'success',
    pending: 'warning',
    failed: 'error'
  }

  const statusLabels = {
    active: 'Aktif',
    inactive: 'Tidak Aktif',
    completed: 'Berhasil',
    pending: 'Menunggu',
    failed: 'Gagal'
  }

  return (
    <Badge variant={statusColors[status] || 'gray'}>
      {statusLabels[status] || status}
    </Badge>
  )
}

export default Badge
