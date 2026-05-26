import axiosInstance from '../lib/axiosInstance'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token: string
  admin: AdminUser
}

// ── Login ──
export const loginAdmin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<LoginResponse>('/auth/login', credentials)

  // Persist token and user info
  localStorage.setItem('admin_token', data.token)
  localStorage.setItem('admin_user', JSON.stringify(data.admin))

  return data
}

// ── Get current admin ──
export const getMe = async (): Promise<AdminUser> => {
  const { data } = await axiosInstance.get<{ success: boolean; admin: AdminUser }>('/auth/me')
  return data.admin
}

// ── Logout ──
export const logoutAdmin = (): void => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
}

// ── Check if logged in ──
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('admin_token')
}

// ── Get stored user ──
export const getStoredUser = (): AdminUser | null => {
  const raw = localStorage.getItem('admin_user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}
