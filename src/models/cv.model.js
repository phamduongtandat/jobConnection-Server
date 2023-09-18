import mongoose, { Schema } from 'mongoose';

const cvSchema = mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            require: true
        },
        CVs: [
            {
                name: String,
                file: String
            },
            {
                timestamps: true,
            }
        ]

    }
)

const CV = mongoose.model("CV", cvSchema);
export { CV }