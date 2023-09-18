import { object, string } from 'yup';

const createMessageSchema = object({
  content: string().trim().required('Content is required'),
  to: string().trim().length(24),
  messageType: string().when('to', {
    is: (to) => !!to,
    // receiver is defined
    then: (schema) => schema.default('business'),
    // receiver is not defined
    otherwise: (schema) => schema.default('support'),
  }),
});

export { createMessageSchema };
