import { object, string } from 'yup';

const cvSchema = object({
    name: string().max(100).required(),
    file: string().max(700).required()
})

export default cvSchema