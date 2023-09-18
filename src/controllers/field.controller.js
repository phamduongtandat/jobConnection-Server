import fieldService from "../services/field.service.js";
//       _____ GET BY ID _____

const getFieldById = async (req, res) => {
    const { id } = req.params

    const { code, ...data } = await fieldService.getFieldById(id)

    res.status(code).json(data);
};

//       _____ GET FIELDS _____

const getFields = async (req, res) => {
    const {
        page,
        pageSize,
        skip = 0,
        limit = 10,
        filter = {},
    } = req.query;

    const { code, ...data } = await fieldService.getFields(page, pageSize, skip, limit, filter)

    res.status(code).json(data);
};

//       _____ GET ALL _____ 

const getAllFields = async (req, res) => {

    const { code, ...data } = await fieldService.getAllFields()

    res.status(code).json(data);
};


//       _____ CREATE A NEW _____ 

const createField = async (req, res) => {
    const { name } = req.body;
    //const { email, username = name } = req.user

    const { code, ...data } = await fieldService.createField(req.user.name, req.user.email, name)

    res.status(code).json(data);
};


//       _____ UPDATE _____ 

const updateField = async (req, res) => {
    const reqBody = req.body
    //const { email } = req.user
    const { id } = req.params

    const { code, ...data } = await fieldService.updateField(id, reqBody, req.user.email, req.user.name)

    res.status(code).json(data);
};


const fieldController = { getFields, getAllFields, createField, updateField, getFieldById }
export default fieldController