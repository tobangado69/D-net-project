import { request } from './api'

export const getAllPackages = async () => {
  return request('GET', '/packages')
}

export const getPackageById = async (packageId) => {
  return request('GET', `/packages/${packageId}`)
}

export const getPackagesByCategory = async (category) => {
  return request('GET', `/packages?category=${category}`)
}

export default { getAllPackages, getPackageById, getPackagesByCategory }
