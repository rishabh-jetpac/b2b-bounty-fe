import * as yup from 'yup'

const emailField = yup
  .string()
  .trim()
  .email('Enter a valid email address.')
  .required('Email address is required.')

const passwordField = yup.string().required('Password is required.')

export const loginSchema = yup
  .object({
    email: emailField,
    password: passwordField,
  })
  .required()

export const createAccountSchema = yup
  .object({
    organizationName: yup
      .string()
      .trim()
      .required('Organization name is required.'),
    email: emailField,
    password: passwordField,
    confirmPassword: yup
      .string()
      .required('Confirm your password.')
      .oneOf([yup.ref('password')], 'Passwords must match.'),
  })
  .required()

export type LoginFormValues = yup.InferType<typeof loginSchema>
export type CreateAccountFormValues = yup.InferType<typeof createAccountSchema>

export const loginDefaultValues: LoginFormValues = {
  email: '',
  password: '',
}

export const createAccountDefaultValues: CreateAccountFormValues = {
  organizationName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

