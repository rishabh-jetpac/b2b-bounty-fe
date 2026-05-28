import * as yup from 'yup'
import type { AssignmentFormValues } from '../types'

const recipientSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email('Enter a valid email address.')
      .required('Email address is required.'),
    quantity: yup
      .number()
      .typeError('Quantity is required.')
      .integer('Quantity must be a whole number.')
      .min(1, 'Quantity must be at least 1.')
      .required('Quantity is required.'),
  })
  .required()

export function createAssignmentSchema(totalQuantity: number) {
  return yup
    .object({
      assignments: yup
        .array()
        .of(recipientSchema)
        .min(1, 'Add at least one recipient.')
        .required()
        .test(
          'within-total-quantity',
          'Assigned quantity cannot exceed the purchased total.',
          (assignments) => {
            const assignedQuantity =
              assignments?.reduce(
                (sum, assignment) => sum + (assignment?.quantity ?? 0),
                0,
              ) ?? 0

            return assignedQuantity <= totalQuantity
          },
        ),
    })
    .required()
}

export const assignmentDefaultValues: AssignmentFormValues = {
  assignments: [
    {
      email: '',
      quantity: 1,
    },
  ],
}
