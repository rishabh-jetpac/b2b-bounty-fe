import * as yup from 'yup'

const emailField = yup
  .string()
  .trim()
  .email('Enter a valid email address.')
  .required('Email address is required.')

const passwordField = yup.string().required('Password is required.')
const passwordConfirmationSchemaFields = {
  password: passwordField,
  confirmPassword: yup
    .string()
    .required('Confirm your password.')
    .oneOf([yup.ref('password')], 'Passwords must match.'),
}

const accountCredentialsSchemaFields = {
  email: emailField,
  ...passwordConfirmationSchemaFields,
}

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
    ...accountCredentialsSchemaFields,
  })
  .required()

export const createSubadminSchema = yup
  .object(accountCredentialsSchemaFields)
  .required()

export const changePasswordSchema = yup
  .object(passwordConfirmationSchemaFields)
  .required()

export const forgotPasswordSchema = yup
  .object({
    email: emailField,
  })
  .required()

export type LoginFormValues = yup.InferType<typeof loginSchema>
export type CreateAccountFormValues = yup.InferType<typeof createAccountSchema>
export type CreateSubadminFormValues = yup.InferType<typeof createSubadminSchema>
export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>
export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>

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

export const createSubadminDefaultValues: CreateSubadminFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
}

export const changePasswordDefaultValues: ChangePasswordFormValues = {
  password: '',
  confirmPassword: '',
}

export const forgotPasswordDefaultValues: ForgotPasswordFormValues = {
  email: '',
}
