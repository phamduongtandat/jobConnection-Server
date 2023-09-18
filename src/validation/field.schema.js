import { object, string } from 'yup';


const fieldSchema = object({
    name: string().max(100).required(),
    //creator:string().max(100).required()
})

export default fieldSchema