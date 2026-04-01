import axios from 'axios'
import { clearSession, getToken } from '../storage/session'

export const apiClient = axios.create({
  baseURL: 'https://api.xn--negciodebolso-dlb.com/api/v1/admin',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
      window.location.assign('/login?reason=session-expired')
    }

    return Promise.reject(error)
  },
)
