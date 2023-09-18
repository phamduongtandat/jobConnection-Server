import mongoose, { Schema } from 'mongoose';

const schema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    profileImage: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/552/552721.png',
    },
    name: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    account_type: {
      type: String,
      enum: ['personal', 'business', 'admin'],
      default: 'personal',
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    phone: {
      type: String,
    },
    fields: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'field',
    },
    address: {
      type: String,
    },
    overview: {
      type: String,
    },
    passwordChangedAt: Date,
    supportId: {
      type: Schema.Types.ObjectId,
    },

  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.password;
      },
    },
    timestamps: true,
  },
);

const User = mongoose.model('user', schema);

export { User };
