import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/api`
const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export interface CycleData {
  startDate: string
  cycleLength: number
  flow: 'None' | 'Light' | 'Medium' | 'Heavy'
  symptoms: string[]
  pain: number
}

export const createCycle = async (cycleData: CycleData) => {
  const response = await api.post('/cycles', cycleData)
  return response.data
}

export const getCycles = async () => {
  const response = await api.get('/cycles')
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const updateCycle = async (id: string, cycleData: CycleData) => {
  const response = await api.put(`/cycles/${id}`, cycleData)
  return response.data
}

export const deleteCycle = async (id: string) => {
  const response = await api.delete(`/cycles/${id}`)
  return response.data
}

export const getPrediction = async () => {
  const response = await api.get('/cycles/prediction')
  return response.data
}

export const getCycleAIInsight = async () => {
  const response = await api.get('/cycles/ai-insight')
  return response.data
}

export const getWellnessRecommendations = async () => {
  const response = await api.get('/wellness/recommendations')
  return response.data
}

export default api