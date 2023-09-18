import { Field } from "../models/field.model.js";

//       _____ GET BY ID _____

const getFieldById = async (id) => {
    const result = await Field.findById(id);

    if (!result) {
        return {
            code: 404,
            status: 'fail',
            message: 'Can not find field with provided id'
        }
    }

    return {
        code: 200,
        status: 'success',
        data: result,
    }
}

//       _____ GET FIELDS _____

const getFields = async (page, pageSize, skip = 0, limit = 10, filter = {}) => {
    const matchingResults = await Field.countDocuments(filter);
    const totalPages = Math.ceil(matchingResults / limit);


    const result = await Field.find(filter)
        .skip(skip)
        .limit(limit);
    return {
        code: 200,
        status: 'success',
        pagination: {
            matchingResults,
            totalPages,
            currentPage: page,
            pageSize: limit,
            returnedResults: result.length,
        },
        data: result,
    }
}


//       _____ GET ALL _____ 

const getAllFields = async () => {

    const result = await Field.find().select('_id name')

    return {
        code: 200,
        status: 'success',
        data: result,
    }
}

//       _____ CREATE A NEW _____

const createField = async (username, email, name) => {
    const creator = username ? `${username} - ${email}` : email
    const result = await Field.create({
        name,
        creator
    });

    return {
        code: 201,
        status: 'success',
        message: 'A new field has been created',
        data: result,
    }
}


//       _____ UPDATE _____ 

const updateField = async (_id, reqBody, email, username) => {
    const creator = username ? `${username} - ${email}` : email
    const result = await Field.findByIdAndUpdate(_id, { ...reqBody, creator }, {
        new: true,
    });

    if (!result) {
        return {
            code: 400,
            status: 'fail',
            message: 'Can not find field with provided id'
        }
    }

    return {
        code: 200,
        status: 'success',
        data: result,
    }
}

const fieldService = { getFields, getAllFields, createField, updateField, getFieldById }
export default fieldService