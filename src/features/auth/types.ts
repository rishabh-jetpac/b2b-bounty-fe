export type AuthUser = {
  email: string
  exp: number
  orgId: string
  orgName: string
  role: string
  userId: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  data: {
    token: string
  }
}

export type RegisterRequest = {
  email: string
  org_name: string
  password: string
}

export type CreateSubadminRequest = {
  email: string
  password: string
}

export type RegisterResponse = {
  data?: {
    message?: string
    token?: string
  }
}
